import { pacienteRepositorySupabase } from "./supabase/paciente.repository";
import { consultaRepositorySupabase } from "./supabase/consulta.repository";
import { exameRepositorySupabase } from "./supabase/exame.repository";
import { unidadeRepositorySupabase } from "./supabase/unidade.repository";
import { medicoRepositorySupabase } from "./supabase/medico.repository";

/**
 * Fonte de dados ativa do sistema.
 *
 * Filosofia "Real Data First": desde o Módulo 6, pacientes, consultas,
 * exames e unidades usam o Supabase real — nenhuma dessas entidades usa
 * mais dados mock. Médicos já eram reais desde o Módulo 1.
 *
 * A interface (lib/data/types.ts) continua sendo o contrato que a UI
 * conhece; trocar a implementação aqui embaixo (por exemplo, para um
 * cache, uma otimização de query, ou uma fonte diferente em testes)
 * continua não exigindo nenhuma mudança nas telas.
 */
export const pacienteRepository = pacienteRepositorySupabase;
export const consultaRepository = consultaRepositorySupabase;
export const exameRepository = exameRepositorySupabase;
export const unidadeRepository = unidadeRepositorySupabase;
export const medicoRepository = medicoRepositorySupabase;
