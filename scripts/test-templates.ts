/**
 * TEST AGENT: Templates Validator
 * Verifies that all college templates have complete and valid data.
 */

import { COLLEGES, getCollege } from "../lib/colleges";
import { CollegeTemplate, MenuRow } from "../lib/types";
import { existsSync } from "fs";
import { join } from "path";

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

console.log("\n=== TEST AGENT: Templates Validator ===\n");

const REQUIRED_MENU_ROWS: MenuRow[] = ["principal", "hipocalorico"];
const REQUIRED_FOOTER_KEYS = [
  "observacionesGenerales",
  "menuPrincipal",
  "menuHipocalorico",
  "valores",
  "pagos",
  "contacto",
  "inasistencias",
  "cambios",
] as const;

const EXPECTED_COLLEGES = ["tantauco", "smlc", "el-encuentro"];

// Test 1: All 3 colleges exist
console.log("Test 1: Los 3 colegios están definidos");
assert(COLLEGES.length === 3, `Hay exactamente 3 colegios (got ${COLLEGES.length})`);
for (const id of EXPECTED_COLLEGES) {
  const c = getCollege(id);
  assert(!!c, `Colegio "${id}" existe`);
}

// Test 2: Each college has required fields
console.log("\nTest 2: Cada colegio tiene los campos requeridos");
for (const college of COLLEGES) {
  assert(!!college.id, `${college.nombre}: tiene id`);
  assert(!!college.nombre, `${college.id}: tiene nombre`);
  assert(!!college.logoFile, `${college.id}: tiene logoFile`);
  assert(college.logoFile.startsWith("/logos/"), `${college.id}: logoFile empieza con /logos/`);
  assert(Array.isArray(college.menuRows), `${college.id}: menuRows es array`);
  assert(college.menuRows.length >= 2, `${college.id}: tiene al menos 2 menuRows (got ${college.menuRows.length})`);
}

// Test 3: Menu rows validation
console.log("\nTest 3: Menú rows son válidos");
for (const college of COLLEGES) {
  for (const row of REQUIRED_MENU_ROWS) {
    assert(
      college.menuRows.includes(row),
      `${college.id}: tiene fila "${row}"`
    );
  }
}

// Test 4: SMLC has vegetariano
console.log("\nTest 4: SMLC tiene fila vegetariano");
const smlc = getCollege("smlc")!;
assert(smlc.menuRows.includes("vegetariano"), "SMLC tiene vegetariano");

// Test 5: Tantauco and El Encuentro don't have vegetariano
console.log("\nTest 5: Tantauco y El Encuentro NO tienen vegetariano");
const tantauco = getCollege("tantauco")!;
const encuentro = getCollege("el-encuentro")!;
assert(!tantauco.menuRows.includes("vegetariano"), "Tantauco no tiene vegetariano");
assert(!encuentro.menuRows.includes("vegetariano"), "El Encuentro no tiene vegetariano");

// Test 6: Footer texts are complete and non-empty
console.log("\nTest 6: Todos los textos del footer son no-vacíos");
for (const college of COLLEGES) {
  for (const key of REQUIRED_FOOTER_KEYS) {
    const val = college.textosPie[key];
    assert(
      typeof val === "string" && val.trim().length > 20,
      `${college.id}: textosPie.${key} tiene contenido suficiente`
    );
  }
}

// Test 7: Contact info is in the right place
console.log("\nTest 7: Información de contacto por colegio");
assert(
  tantauco.textosPie.contacto.includes("Tantauco"),
  "Tantauco contacto menciona 'Tantauco'"
);
assert(
  smlc.textosPie.contacto.includes("SMLC") || smlc.textosPie.contacto.includes("50494171"),
  "SMLC contacto menciona SMLC o el teléfono"
);
assert(
  encuentro.textosPie.contacto.includes("81219132"),
  "El Encuentro contacto menciona el teléfono"
);

// Test 8: Logo files exist in public/logos/
console.log("\nTest 8: Archivos de logo existen en public/logos/");
const publicDir = join(process.cwd(), "public");
for (const college of COLLEGES) {
  const filePath = join(publicDir, college.logoFile);
  assert(existsSync(filePath), `Logo existe: ${college.logoFile}`);
}

// Also check John's Food logo
const jfLogo = join(publicDir, "/logos/johns-food.png");
assert(existsSync(jfLogo), "Logo John's Food existe: /logos/johns-food.png");

// Test 9: getCollege returns undefined for invalid id
console.log("\nTest 9: getCollege con id inválido");
assert(getCollege("nonexistent") === undefined, "getCollege('nonexistent') devuelve undefined");
assert(getCollege("") === undefined, "getCollege('') devuelve undefined");

console.log(`\n=== RESULTADO: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) process.exit(1);
