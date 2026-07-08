import { format, formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export function formatarData(data: string | Date, pattern = "dd/MM/yyyy") {
  return format(new Date(data), pattern, { locale: ptBR });
}

export function formatarDataHora(data: string | Date) {
  return format(new Date(data), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
}

export function formatarTempoRelativo(data: string | Date) {
  return formatDistanceToNow(new Date(data), { addSuffix: true, locale: ptBR });
}

export function calcularIdade(dataNascimento: string | Date) {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const m = hoje.getMonth() - nascimento.getMonth();
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  return idade;
}
