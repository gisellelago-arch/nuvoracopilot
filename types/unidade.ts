export type TipoUnidade = "ubs" | "hospital" | "clinica" | "consultorio_particular" | "outro";

export interface Unidade {
  id: string;
  nome: string;
  tipo: TipoUnidade;
  criadaEm: string;
}

export const rotuloTipoUnidade: Record<TipoUnidade, string> = {
  ubs: "UBS",
  hospital: "Hospital",
  clinica: "Clínica",
  consultorio_particular: "Consultório particular",
  outro: "Outro",
};
