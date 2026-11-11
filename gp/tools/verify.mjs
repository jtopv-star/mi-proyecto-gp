// Verifica TODOS los ejercicios: las soluciones deben pasar y los códigos iniciales NO deben pasar.
// Uso: node tools/verify.mjs   (requiere JDK para los ejercicios Java)
import { PGlite } from '../vendor/pglite/index.js';
import { gradeSql } from '../js/sql-core.js';
import { RUNNER_SRC, normOut, b64, testsOf } from '../js/java-core.js';
import { loadAll } from '../js/exercises/index.js';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';

const all = await loadAll();
let bad = 0; const fail = (m) => { bad++; console.log('  ✗ ' + m); };
const db = new PGlite();
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gp-'));

function javaRun(code, tests) {
  const d = fs.mkdtempSync(path.join(tmp, 'j'));
  fs.writeFileSync(path.join(d, 'Main.java'), code);
  fs.writeFileSync(path.join(d, 'Runner.java'), RUNNER_SRC);
  try { execFileSync('javac', ['--release', '8', '-nowarn', '-d', d, 'Main.java', 'Runner.java'], { cwd: d, stdio: 'pipe' }); }
  catch (e) { return { compileError: String(e.stderr || e.message).replace(/Picked up.*\n/g, '') }; }
  const outs = tests.map((t, i) => {
    const of = path.join(d, `out${i}.txt`);
    execFileSync('java', ['-cp', d, 'Runner', of, b64(t.input)], { stdio: 'pipe', timeout: 20000 });
    return normOut(fs.readFileSync(of, 'utf8'));
  });
  return { outs };
}

for (const ex of all) {
  process.stdout.write(`${ex.id} [${ex.level}] ${ex.title}\n`);
  if (ex.type === 'quiz') {
    if (!(ex.answer >= 0 && ex.answer < ex.options.length)) fail('respuesta fuera de rango');
    continue;
  }
  if (ex.area === 'java') {
    const tests = testsOf(ex);
    const r = javaRun(ex.solution, tests);
    if (r.compileError) { fail('la solución no compila:\n' + r.compileError); continue; }
    tests.forEach((t, i) => { if (r.outs[i] !== normOut(t.expected)) fail(`test ${i}: esperado ${JSON.stringify(normOut(t.expected))} y salió ${JSON.stringify(r.outs[i])}`); });
    const s = javaRun(ex.starter, tests);
    if (!s.compileError && tests.every((t, i) => s.outs[i] === normOut(t.expected))) fail('el código inicial ya pasa los tests');
    // un programa que solo imprime la salida del primer test no debe pasar si hay >1 test distinto
    const exp = new Set(tests.map(t => normOut(t.expected)));
    if (ex.tests && tests.length > 1 && exp.size === 1) console.log('  · aviso: todos los tests esperan lo mismo');
  } else {
    const g = await gradeSql(db, ex, ex.solution);
    if (!g.passed) fail('la solución no pasa: ' + g.message);
    const g2 = await gradeSql(db, ex, ex.starter || '');
    if (g2.passed) fail('el código inicial ya pasa');
    const { evaluate } = await import('../js/sql-core.js');
    const e = await evaluate(db, ex, ex.solution);
    if (e.error) fail('error: ' + e.error);
    else if (!e.rows.length && !ex.allowEmpty) fail('el resultado esperado está vacío');
    else if (process.env.SHOW) console.log('  →', JSON.stringify(e.rows, (k, v) => typeof v === 'bigint' ? Number(v) : v));
  }
}

// Resumen vs objetivo
const cnt = (a, l) => all.filter(e => e.area === a && e.type !== 'quiz' && e.level === l).length;
console.log('\nResumen (Java / SQL / BD): fácil ' + ['java', 'sql', 'db'].map(a => cnt(a, 'facil')).join('/') + ', medio ' + ['java', 'sql', 'db'].map(a => cnt(a, 'medio')).join('/') + ', difícil ' + ['java', 'sql', 'db'].map(a => cnt(a, 'dificil')).join('/'));
console.log('Meta Java y SQL: 30 fáciles · 200 medios · 80 difíciles = 310 c/u');
console.log(bad ? `\n❌ ${bad} problema(s)` : `\n✅ ${all.length} ejercicios verificados`);
process.exit(bad ? 1 : 0);
