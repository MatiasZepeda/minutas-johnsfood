/**
 * TEST AGENT: PDF Layout Validator
 * Verifies that the data structure fed to the PDF renderer is correct
 * for any combination of college + month.
 */

import { getBusinessWeeks, getMesLabel, countBusinessDays } from "../lib/calendar";
import { COLLEGES } from "../lib/colleges";
import { Minuta, DiaData, TextosPie } from "../lib/types";

let passed = 0;
let failed = 0;

function assert(condition: boolean, msg: string) {
  if (condition) {
    console.log(`  ✅ ${msg}`);
    passed++;
  } else {
    console.error(`  ❌ FAIL: ${msg}`);
    failed++;
  }
}

console.log("\n=== TEST AGENT: PDF Layout Validator ===\n");

// Helper to build a mock Minuta
function buildMockMinuta(
  colegioId: string,
  mes: number,
  anio: number,
  textosPie: TextosPie
): Minuta {
  const weeks = getBusinessWeeks(anio, mes);
  const dias: Record<string, DiaData> = {};
  for (const week of weeks) {
    for (const day of week.days) {
      dias[day.isoDate] = {
        principal: `Plato principal ${day.label}`,
        hipocalorico: `Hipocalórico ${day.label}`,
        vegetariano: colegioId === "smlc" ? `Vegetariano ${day.label}` : undefined,
      };
    }
  }
  return {
    id: "test-id",
    colegio: colegioId as never,
    mes,
    anio,
    dias,
    textosPie,
    creadoEn: new Date().toISOString(),
    editadoEn: new Date().toISOString(),
  };
}

// Test 1: Weeks structure for March 2026
console.log("Test 1: Estructura de semanas para Marzo 2026");
const mar2026Weeks = getBusinessWeeks(2026, 3);
assert(mar2026Weeks.length === 5, `Marzo 2026 tiene 5 semanas (got ${mar2026Weeks.length})`);
assert(mar2026Weeks[0].days.length === 5, `Semana 1 tiene 5 días`);
assert(mar2026Weeks[4].days.length === 2, `Semana 5 tiene 2 días (lunes 30 y martes 31)`);

// Test 2: All colleges generate valid dias structure
console.log("\nTest 2: Estructura de datos por colegio");
for (const college of COLLEGES) {
  const minuta = buildMockMinuta(college.id, 3, 2026, college.textosPie);
  const dayCount = Object.keys(minuta.dias).length;
  assert(dayCount === 22, `${college.nombre}: 22 entradas en dias (got ${dayCount})`);

  for (const [isoDate, data] of Object.entries(minuta.dias)) {
    assert(/^\d{4}-\d{2}-\d{2}$/.test(isoDate), `${college.id}: isoDate "${isoDate}" válido`);
    assert(!!data.principal, `${college.id}: ${isoDate} tiene principal`);
    assert(!!data.hipocalorico, `${college.id}: ${isoDate} tiene hipocalorico`);
    if (college.id === "smlc") {
      assert(!!data.vegetariano, `${college.id}: ${isoDate} tiene vegetariano`);
    }
  }
}

// Test 3: getMesLabel returns correct Spanish month names
console.log("\nTest 3: getMesLabel retorna nombres correctos");
const monthNames = [
  "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
  "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
];
for (let i = 1; i <= 12; i++) {
  assert(getMesLabel(i) === monthNames[i - 1], `getMesLabel(${i}) = "${monthNames[i - 1]}"`);
}

// Test 4: Validate days distribution across a full year
console.log("\nTest 4: Distribución de días hábiles por mes (2026)");
const businessDaysByMonth: Record<number, number> = {};
for (let m = 1; m <= 12; m++) {
  const count = countBusinessDays(2026, m);
  businessDaysByMonth[m] = count;
  assert(count >= 20 && count <= 23, `${monthNames[m-1]} 2026: ${count} días hábiles (debe ser 20-23)`);
}
console.log(`  📊 Días hábiles 2026:`, businessDaysByMonth);

// Test 5: Edge month - February 2028 (leap year)
console.log("\nTest 5: Febrero 2028 (año bisiesto)");
const feb2028 = getBusinessWeeks(2028, 2);
const feb2028Days = feb2028.flatMap((w) => w.days);
assert(feb2028Days.length >= 20 && feb2028Days.length <= 21, `Febrero 2028 tiene 20-21 días hábiles (got ${feb2028Days.length})`);
for (const d of feb2028Days) {
  assert(d.date.getMonth() === 1, `${d.label} es de Febrero`);
}

// Test 6: Header data structure for PDF
console.log("\nTest 6: Datos del header del PDF");
for (const college of COLLEGES) {
  assert(college.logoFile.endsWith(".png"), `${college.id}: logoFile es PNG`);
  assert(college.nombre.length > 0, `${college.id}: nombre no vacío`);
}

// Test 7: Footer texts are safe for PDF rendering (no null/undefined)
console.log("\nTest 7: Textos del footer seguros para PDF");
for (const college of COLLEGES) {
  const tp = college.textosPie;
  const fields = Object.values(tp);
  for (const val of fields) {
    if (val !== undefined) {
      assert(typeof val === "string", `${college.id}: todos los campos de textosPie son strings`);
    }
  }
}

console.log(`\n=== RESULTADO: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) process.exit(1);
