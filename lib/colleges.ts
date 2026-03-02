import { CollegeTemplate } from "./types";

export const COLLEGES: CollegeTemplate[] = [
  {
    id: "tantauco",
    nombre: "Colegio Tantauco",
    logoFile: "/logos/tantauco.png",
    menuRows: ["principal", "hipocalorico"],
    textosPie: {
      observacionesGenerales:
        "El servicio de almuerzo se compone de lo siguiente:",
      menuPrincipal:
        "Menú Principal incluye: Sopa o crema del día, Salad bar (Ensalada a elección), Buffet de Postre (2 tipos de Postre o Fruta) Pan Amasado, Refresco light, Aderezos",
      menuHipocalorico:
        "Menú Hipocalórico incluye: Sopa o crema del día, Buffet de postre (2 tipos de postres o fruta), Pan de colación, Refresco ligth, Aliños y aderezos para ensaladas.",
      valores:
        "Valores almuerzos: Precio unitario x día $ 4.900 - Alumnos pre-básica a 1° básico con menú adaptado por etapas tendrá un valor de $4.000. Alumnos de 2° básico a 4° básico menú integral con buffet tendrá un valor de $4.700. - Profesores y funcionarios de menú ejecutivo completo tendrá un valor de $4.500.",
      pagos:
        "Los Pagos son en efectivo o Transferencia bancaria a Gastronomia y eventos johnsfood Cta cte 6501127-1 Rut 76.133.424-7 Banco Santander e mail colegiotantauco@johnsfood.cl",
      contacto:
        "Contacto WSP Casino Colegio Tantauco +569 Instagram @casinosjohnfood Pagina web johnsfood.cl",
      inasistencias:
        "Para abonar almuerzos por inasistencia y envío de comprobante de pago debe avisar al +569 antes de las 8 am del mismo día.",
      cambios:
        "Las minutas podrian sufrir cambios por alzas de precios en las materias primas o de fuerza mayor. Esperamos su comprención.!",
    },
  },
  {
    id: "smlc",
    nombre: "Colegio Santa María de Lo Cañas",
    logoFile: "/logos/smlc.png",
    menuRows: ["principal", "hipocalorico", "vegetariano"],
    textosPie: {
      observacionesGenerales:
        "El servicio de almuerzo se compone de lo siguiente:",
      menuPrincipal:
        "Menú Principal y Vegetariano incluyen: Sopa o crema del día, Salad bar (Ensalada a elección), Buffet de Postre (2 tipos de Postre o Fruta) Pan Amasado, Refresco light, Aderezos",
      menuHipocalorico:
        "Menú Hipocalórico incluye: Sopa o crema del día, Buffet de postre (2 tipos de postres o fruta), Pan de colación, Refresco ligth, Aliños y aderezos para ensaladas.",
      valores:
        "Valor almuerzos compra por día $ 5.000 Promociones. Valor pre básica a 3ro básico $4.700, valor de 4to básico a 4to medio $5.000 por compra de almuerzos mensual. Precio especial a familias con más de dos niños que contraten casino por el mes.",
      pagos:
        "Pagos en efectivo o Transferencia bancaria a Gastronomia y eventos johnsfood Cta cte 6501127-1 Rut 76.133.424-7 Banco Santander e mail ventadealmuerzos@johnsfood.cl",
      contacto:
        "Contacto WSP Casino Colegio SMLC +569 50494171 Instagram @casinosjohnfood Pagina web johnsfood.cl",
      inasistencias:
        "Para los avisos de inasistencias y envío de comprobante de pago debe avisar al +569 50494171 antes de las 8 am del mismo día.",
      cambios:
        "Las minutas podrían sufrir cambios por fuerza mayor. Esperamos su comprención.!",
    },
  },
  {
    id: "el-encuentro",
    nombre: "Colegio El Encuentro",
    logoFile: "/logos/el-encuentro.png",
    menuRows: ["principal", "hipocalorico"],
    textosPie: {
      observacionesGenerales:
        "El servicio de almuerzo se compone de lo siguiente:",
      menuPrincipal:
        "Menú Principal incluye: Sopa o crema del día, Ensaladas, Buffet de Postre (1 postre elaborado o jalea o fruta) Pan Amasado, Refresco light.",
      menuHipocalorico:
        "Menú Hipocalórico incluye: Sopa o crema del día, Postre, Jalea o fruta, Pan de colación, Refresco ligth, Aliños y aderezos para ensaladas.",
      valores:
        "Valores para almuerzos por mes completo: pre básica $4.700, de 1ero a 4to medio $5.000. Venta por día $5.500 pesos. Precio especial a familias con más de dos niños que contraten casino por el mes. CONSULTE!!",
      pagos:
        "Pagos en efectivo o Transferencia bancaria a: Gastronomia y eventos johnsfood Cta cte 6501127-1 Rut 76.133.424-7 Banco Santander e mail ventadealmuerzos@johnsfood.cl",
      contacto:
        "Contacto WSP Casino Colegio CEE +569 81219132 Instagram @casinosjohnfood Pagina web johnsfood.cl",
      inasistencias:
        "Para abonar almuerzos por inasistencia y envío de comprobante de pago debe avisar al +569 81219132 antes de las 8 am del mismo día.",
      cambios:
        "OBSERVACIONES: Las minutas podrian sufrir cambios por fuerza mayor. Esperamos su comprención.!",
    },
  },
];

export function getCollege(id: string): CollegeTemplate | undefined {
  return COLLEGES.find((c) => c.id === id);
}
