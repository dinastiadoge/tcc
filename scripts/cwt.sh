#!/usr/bin/env bash
# cwt (clean worktree): rebase da branch atual em origin/dev, validação, envio para dev e limpeza.
#
# Uso (a partir da branch/worktree de trabalho):  pnpm cwt [opções]
#   -n, --dry-run   só mostra o que faria (não rebaseia, não envia, não apaga)
#       --keep      mantém a branch e o worktree atuais depois de enviar
#       --no-build  não roda o build de validação
#   -h, --help      esta ajuda
#
# Passos:
#   1. valida: branch de trabalho (nunca main/dev), árvore limpa, sem rebase em andamento
#   2. git fetch --prune e rebase em origin/dev (aborta e desfaz se houver conflito)
#   3. valida o resultado: commits à frente da dev e build (se houver node_modules)
#   4. envia para dev sem force (fast-forward) e atualiza a dev local
#   5. limpa: worktree e branch atuais, branches locais/remotas já dentro da dev, worktrees órfãos
set -euo pipefail

BASE=dev
PROTEGIDAS=" main dev HEAD "
DRY=0
KEEP=0
BUILD=1

uso() { sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//'; }
say() { echo "==> $*"; }
warn() { echo "    aviso: $*" >&2; }
die() { echo "cwt: $*" >&2; exit 1; }
run() {
  if ((DRY)); then echo "    [dry-run] $*"; else "$@"; fi
}

for arg in "$@"; do
  case $arg in
    -n | --dry-run) DRY=1 ;;
    --keep) KEEP=1 ;;
    --no-build) BUILD=0 ;;
    -h | --help) uso; exit 0 ;;
    *) uso >&2; die "opção desconhecida: $arg" ;;
  esac
done

git rev-parse --git-dir >/dev/null 2>&1 || die "isto não é um repositório git"
top=$(git rev-parse --show-toplevel)
cd "$top"
principal=$(git worktree list --porcelain | sed -n '1s/^worktree //p')
branch=$(git symbolic-ref --quiet --short HEAD) || die "HEAD solto (detached); entre numa branch"

# ---------- 1. validação inicial ----------
say "Validando '$branch'"
[[ "$PROTEGIDAS" == *" $branch "* ]] && die "rode de uma branch de trabalho, não de '$branch'"
[ -d "$(git rev-parse --git-path rebase-merge)" ] || [ -d "$(git rev-parse --git-path rebase-apply)" ] \
  && die "há um rebase em andamento; conclua ou rode 'git rebase --abort'"
[ -z "$(git status --porcelain)" ] || die "há alterações não commitadas; faça commit ou descarte antes"

# ---------- 2. fetch + rebase ----------
say "Atualizando origin"
git fetch --prune origin
git rev-parse --verify -q "origin/$BASE" >/dev/null || die "origin/$BASE não existe"

read -r atras adiante < <(git rev-list --left-right --count "origin/$BASE...HEAD")
echo "    $branch: $adiante à frente, $atras atrás de origin/$BASE"

if ((atras > 0)); then
  say "Rebase em origin/$BASE"
  if ((DRY)); then
    echo "    [dry-run] git rebase origin/$BASE"
  elif ! git rebase "origin/$BASE"; then
    git rebase --abort || true
    die "conflito no rebase; nada foi alterado. Resolva manualmente: git rebase origin/$BASE"
  fi
fi

# ---------- 3. validação do resultado ----------
if ((adiante == 0)); then
  say "Nada novo para enviar (a branch não tem commits além da $BASE)"
else
  say "Validando o resultado"
  if ((BUILD)) && [ -d node_modules ]; then
    saida=$(mktemp -d)
    trap 'rm -rf "$saida"' EXIT
    npx --no-install vite build --outDir "$saida" --emptyOutDir >/dev/null 2>&1 \
      || die "o build falhou; corrija antes de enviar (rode 'pnpm build' para ver o erro)"
    echo "    build ok"
  elif ((BUILD)); then
    warn "sem node_modules neste diretório: build não executado (use --no-build para ocultar)"
  fi

  # ---------- 4. envio para a dev ----------
  say "Enviando $branch -> $BASE (sem force)"
  run git push origin "HEAD:refs/heads/$BASE"
fi

# Atualiza a dev local, sem mexer em ninguém que esteja com ela em uso sujo.
if ! ((DRY)); then
  git fetch --quiet origin
  dev_wt=$(git worktree list --porcelain | awk -v b="refs/heads/$BASE" '/^worktree /{p=$2} $1=="branch" && $2==b{print p}')
  if [ -z "$dev_wt" ]; then
    git branch -f "$BASE" "origin/$BASE"
  elif [ -z "$(git -C "$dev_wt" status --porcelain)" ]; then
    git -C "$dev_wt" merge --ff-only --quiet "origin/$BASE"
  else
    warn "'$BASE' está em $dev_wt com alterações locais; atualize-a com 'git merge --ff-only origin/$BASE'"
  fi
fi

# ---------- 5. limpeza ----------
say "Limpando o que sobrou"
git rev-parse --verify -q "origin/$BASE" >/dev/null
sobrou_atual=0
if ((! KEEP)); then
  if ((DRY)) || git merge-base --is-ancestor "$branch" "origin/$BASE"; then
    sobrou_atual=1
  else
    warn "'$branch' ainda tem commits fora da $BASE; mantida"
  fi
fi

if ((sobrou_atual)); then
  if [ "$top" != "$principal" ]; then
    echo "    remove worktree $top"
    if ! ((DRY)); then
      cd "$principal"
      # node_modules pode ser um junction para outro projeto: remover o link sem seguir.
      rmdir "$top/node_modules" 2>/dev/null || true
      git worktree remove --force "$top"
    fi
  else
    echo "    volta a checkout para $BASE"
    ((DRY)) || git checkout --quiet "$BASE"
  fi
  echo "    apaga a branch local $branch"
  run git branch -D "$branch"
fi

run git worktree prune

# Branches locais já dentro da dev (exceto protegidas, a atual e as abertas em outro worktree).
em_uso=$(git worktree list --porcelain | sed -n 's|^branch refs/heads/||p')
while read -r b; do
  [ -z "$b" ] && continue
  [[ "$PROTEGIDAS" == *" $b "* ]] && continue
  [ "$b" = "$branch" ] && continue
  grep -qxF "$b" <<<"$em_uso" && continue
  echo "    apaga a branch local $b (já está na $BASE)"
  run git branch -d "$b"
done < <(git for-each-ref --format='%(refname:short)' refs/heads --merged "origin/$BASE")

# Branches remotas já dentro da dev (exceto protegidas).
while read -r r; do
  b=${r#origin/}
  [ -z "$b" ] && continue
  [[ "$PROTEGIDAS" == *" $b "* ]] && continue
  echo "    apaga a branch remota $b (já está na $BASE)"
  run git push --quiet origin --delete "$b"
done < <(git for-each-ref --format='%(refname:short)' refs/remotes/origin --merged "origin/$BASE")

# ---------- resumo ----------
say "Branches restantes (à frente/atrás de origin/$BASE)"
git for-each-ref --format='%(refname:short)' refs/heads | while read -r b; do
  read -r a d < <(git rev-list --left-right --count "origin/$BASE...$b" 2>/dev/null || echo "? ?")
  printf '    %-32s +%s -%s\n' "$b" "$d" "$a"
done

if ((sobrou_atual)) && [ "$top" != "$principal" ] && ! ((DRY)); then
  echo
  echo "O worktree atual foi removido. Rode:  cd \"$principal\""
fi
