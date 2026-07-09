// Modelos (interfaces) espelhando as entidades e DTOs da API

export interface Campus {
  id?: number;
  nome: string;
  cidade: string;
  estado: string;
  ativo?: boolean;
}

export interface Localizacao {
  id?: number;
  campus?: Campus | { id: number };
  tipo: string;
  nome: string;
  descricao?: string | null;
  ativo?: boolean;
}

export type Selo = 'TRONO_DE_OURO' | 'ZONA_DE_RISCO' | null;

export interface Banheiro {
  id?: number;
  localizacao?: Localizacao | { id: number };
  identificador: string;
  andar?: number | null;
  tipo: string;
  descricao?: string | null;
  foto?: string | null;
  qtdCabines?: number | null;
  acessivel?: boolean;
  notaMedia?: number;
  totalAvaliacoes?: number;
  ativo?: boolean;
  selo?: Selo;
}

export interface Usuario {
  id?: number;
  nome: string;
  email: string;
  senha?: string;
  role?: string;
  avatar?: string | null;
  ativo?: boolean;
  dataCriacao?: string;
}

export interface Avaliacao {
  id?: number;
  usuario?: Usuario;
  banheiro?: Banheiro | { id: number };
  limpeza: number;
  cheiro: number;
  papelHigienico: number;
  estadoPortas: number;
  iluminacao: number;
  silencio: number;
  movimentacao: number;
  notaGeral?: number;
  comentario?: string | null;
  foto?: string | null;
  dataAvaliacao?: string;
  horarioAvaliacao?: string;
}

export interface Comentario {
  id?: number;
  usuario?: Usuario;
  banheiro?: { id: number };
  texto: string;
  dataCriacao?: string;
}

export interface Insight {
  id: number;
  tipo: 'MELHOR_HORARIO' | 'PICO_MOVIMENTO' | 'TENDENCIA' | 'ALERTA' | 'DESTAQUE';
  titulo: string;
  descricao: string;
  dados?: string | null;
  geradoEm?: string;
}

export interface FaixaHorariaStats {
  faixa: string;
  periodo: string;
  totalAvaliacoes: number;
  mediaMovimentacao?: number | null;
  mediaSilencio?: number | null;
  indiceTranquilidade?: number | null;
}

export interface CampusPanorama {
  campusId: number;
  campus: string;
  totalBanheiros: number;
  totalAvaliacoes: number;
  notaMediaGeral?: number | null;
  melhorBanheiro?: { id: number; identificador: string; notaMedia: number } | null;
  piorBanheiro?: { id: number; identificador: string; notaMedia: number } | null;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}

export interface TokenResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
}
