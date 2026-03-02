export type ColegioId = "tantauco" | "smlc" | "el-encuentro";

export type MenuRow = "principal" | "hipocalorico" | "vegetariano";

export interface DiaData {
  principal?: string;
  hipocalorico?: string;
  vegetariano?: string;
}

export interface TextosPie {
  observacionesGenerales: string;
  menuPrincipal: string;
  menuHipocalorico: string;
  menuVegetariano?: string;
  valores: string;
  pagos: string;
  contacto: string;
  inasistencias: string;
  cambios: string;
}

export interface CollegeTemplate {
  id: ColegioId;
  nombre: string;
  logoFile: string;
  menuRows: MenuRow[];
  textosPie: TextosPie;
}

export interface Minuta {
  id: string;
  colegio: ColegioId;
  mes: number;
  anio: number;
  dias: Record<string, DiaData>; // key: "YYYY-MM-DD"
  textosPie: TextosPie;
  creadoEn: string;
  editadoEn: string;
}

export interface MinutaListItem {
  id: string;
  colegio: ColegioId;
  mes: number;
  anio: number;
  creadoEn: string;
  editadoEn: string;
}

export interface CreateMinutaInput {
  colegio: ColegioId;
  mes: number;
  anio: number;
  dias: Record<string, DiaData>;
  textosPie: TextosPie;
}

export const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];

export const DIAS_SEMANA = ["LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES"];

export const MENU_LABELS: Record<MenuRow, string> = {
  principal: "Principal",
  hipocalorico: "Hipocalórico",
  vegetariano: "Vegetariano",
};
