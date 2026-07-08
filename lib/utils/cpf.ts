/**
 * Valida um CPF usando o algoritmo oficial de dígitos verificadores.
 * Aceita o valor com ou sem máscara (pontos/traço).
 */
export function validarCPF(cpf: string): boolean {
  const digits = cpf.replace(/\D/g, "");

  if (digits.length !== 11) return false;

  // CPFs com todos os dígitos iguais (ex: 111.111.111-11) passam no cálculo
  // mas são inválidos na prática.
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const calcularDigito = (base: string, pesoInicial: number) => {
    let soma = 0;
    for (let i = 0; i < base.length; i++) {
      soma += Number(base[i]) * (pesoInicial - i);
    }
    const resto = (soma * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const primeiroDigito = calcularDigito(digits.slice(0, 9), 10);
  const segundoDigito = calcularDigito(digits.slice(0, 10), 11);

  return primeiroDigito === Number(digits[9]) && segundoDigito === Number(digits[10]);
}
