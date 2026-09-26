// Desenvolvimento (`ng serve`): substitui environment.ts via fileReplacements.
// `mockAuth: true` liga o login local sem back-end (admin@autopecas.com / admin123);
// use `false` para falar com a API real em `apiUrl`.
export const environment = {
  apiUrl: 'http://localhost:3000',
  mockAuth: true,
};
