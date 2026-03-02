/**
 * TEST AGENT: Calendar Validator
 * Verifies that getBusinessWeeks() returns only Mon-Fri days, correct counts,
 * and handles edge cases like months starting on weekends.
 */

import { getBusinessWeeks, countBusinessDays, getMesLabel } from "../lib/calendar";

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

console.log("\n=== TEST AGENT: Calendar Validator ===\n");

// Test 1: March 2026 (starts Sunday, has 31 days)
console.log("Test 1: Marzo 2026");
const mar2026 = getBusinessWeeks(2026, 3);
const mar2026Days = mar2026.flatMap((w) => w.days);
assert(mar2026Days.length === 22, `22 días hábiles en Marzo 2026 (got ${mar2026Days.length})`);
for (const d of mar2026Days) {
  const dow = d.date.getDay();
  assert(dow >= 1 && dow <= 5, `${d.label} es día hábil (dow=${dow})`);
}
assert(mar2026[0].days[0].label === "LUNES 2", `Primera día es LUNES 2 (got ${mar2026[0].days[0].label})`);

// Test 2: February 2026 (non-leap)
console.log("\nTest 2: Febrero 2026");
const feb2026 = getBusinessWeeks(2026, 2);
const feb2026Days = feb2026.flatMap((w) => w.days);
assert(feb2026Days.length >= 20 && feb2026Days.length <= 21, `Febrero 2026 tiene 20-21 días hábiles (got ${feb2026Days.length})`);
for (const d of feb2026Days) {
  const dow = d.date.getDay();
  assert(dow >= 1 && dow <= 5, `${d.label} es día hábil (dow=${dow})`);
}

// Test 3: January 2026 (starts Thursday)
console.log("\nTest 3: Enero 2026");
const jan2026 = getBusinessWeeks(2026, 1);
const jan2026Days = jan2026.flatMap((w) => w.days);
assert(jan2026Days.length === 22, `Enero 2026 tiene 22 días hábiles (got ${jan2026Days.length})`);

// Test 4: No Saturday or Sunday in any month
console.log("\nTest 4: Ningún sábado o domingo en todo 2026");
for (let m = 1; m <= 12; m++) {
  const weeks = getBusinessWeeks(2026, m);
  for (const week of weeks) {
    for (const day of week.days) {
      const dow = day.date.getDay();
      assert(dow !== 0 && dow !== 6, `${getMesLabel(m)}: ${day.label} no es fin de semana`);
    }
  }
}

// Test 5: countBusinessDays matches flatMap length
console.log("\nTest 5: countBusinessDays es consistente");
for (let m = 1; m <= 12; m++) {
  const count = countBusinessDays(2026, m);
  const weeks = getBusinessWeeks(2026, m);
  const actual = weeks.flatMap((w) => w.days).length;
  assert(count === actual, `${getMesLabel(m)} 2026: countBusinessDays=${count} === flatMap=${actual}`);
}

// Test 6: isoDate format YYYY-MM-DD
console.log("\nTest 6: Formato isoDate es YYYY-MM-DD");
const isoRegex = /^\d{4}-\d{2}-\d{2}$/;
for (const day of mar2026Days) {
  assert(isoRegex.test(day.isoDate), `${day.label} isoDate="${day.isoDate}" es formato correcto`);
}

// Test 7: Weeks have at most 5 days
console.log("\nTest 7: Cada semana tiene máximo 5 días");
for (let m = 1; m <= 12; m++) {
  const weeks = getBusinessWeeks(2026, m);
  for (const week of weeks) {
    assert(week.days.length <= 5, `${getMesLabel(m)} semana ${week.weekIndex} tiene ≤5 días (got ${week.days.length})`);
    assert(week.days.length >= 1, `${getMesLabel(m)} semana ${week.weekIndex} tiene ≥1 día`);
  }
}

console.log(`\n=== RESULTADO: ${passed} passed, ${failed} failed ===\n`);
if (failed > 0) process.exit(1);
