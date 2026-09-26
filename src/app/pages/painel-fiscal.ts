import { Component } from '@angular/core';
import {
  Archive,
  CheckCircle,
  Clock,
  Download,
  FileText,
  Filter,
  LucideAngularModule,
  XCircle,
} from 'lucide-angular';

@Component({
  selector: 'app-painel-fiscal',
  imports: [LucideAngularModule],
  templateUrl: './painel-fiscal.html',
})
export class PainelFiscal {
  protected readonly ArchiveIcon = Archive;
  protected readonly CheckCircleIcon = CheckCircle;
  protected readonly ClockIcon = Clock;
  protected readonly DownloadIcon = Download;
  protected readonly FileTextIcon = FileText;
  protected readonly FilterIcon = Filter;
  protected readonly XCircleIcon = XCircle;

  protected readonly notasFiscais = [
    { id: 1, numero: '000126', serie: '1', cliente: 'Transportadora Rápida Ltda', cnpj: '12.345.678/0001-90', valor: 3450.00, data: '23/04/2026', hora: '14:20', status: 'autorizada' },
    { id: 2, numero: '000125', serie: '1', cliente: 'Posto Central', cnpj: '98.765.432/0001-11', valor: 780.00, data: '23/04/2026', hora: '11:45', status: 'autorizada' },
    { id: 3, numero: '000124', serie: '1', cliente: 'Retífica Souza Ltda', cnpj: '45.678.901/0001-23', valor: 2890.00, data: '23/04/2026', hora: '10:32', status: 'autorizada' },
    { id: 4, numero: '000123', serie: '1', cliente: 'Auto Mecânica Silva', cnpj: '23.456.789/0001-45', valor: 1250.00, data: '23/04/2026', hora: '09:15', status: 'autorizada' },
    { id: 5, numero: '000122', serie: '1', cliente: 'Oficina do João', cnpj: '34.567.890/0001-67', valor: 567.50, data: '22/04/2026', hora: '16:38', status: 'autorizada' },
    { id: 6, numero: '000121', serie: '1', cliente: 'Caminhões e CIA', cnpj: '56.789.012/0001-89', valor: 4120.00, data: '22/04/2026', hora: '15:12', status: 'cancelada' },
    { id: 7, numero: '000120', serie: '1', cliente: 'Auto Peças Express', cnpj: '67.890.123/0001-01', valor: 923.00, data: '22/04/2026', hora: '13:45', status: 'processando' },
    { id: 8, numero: '000119', serie: '1', cliente: 'Mecânica Roda Viva', cnpj: '78.901.234/0001-12', valor: 1567.80, data: '22/04/2026', hora: '11:20', status: 'autorizada' },
  ];

  protected readonly estatisticas = [
    { label: 'Emitidas Hoje', valor: '4', cor: 'blue' },
    { label: 'Total do Dia', valor: 'R$ 8.370', cor: 'green' },
    { label: 'Autorizadas', valor: '6', cor: 'green' },
    { label: 'Canceladas', valor: '1', cor: 'red' },
  ];

  private readonly corClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
  };

  protected classeCor(cor: string): string {
    return this.corClasses[cor as keyof typeof this.corClasses].replace('bg-', 'text-').replace('-100', '-700');
  }
}
