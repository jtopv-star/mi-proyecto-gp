// Genera js/exercises/expected.js: ejecuta la solución de cada ejercicio Java (con tests sin "expected")
// en un JDK real y guarda la salida. Después revisa la salida impresa antes de aceptarla.
import { RUNNER_SRC, normOut, b64 } from '../js/java-core.js';
import fs from 'node:fs'; import os from 'node:os'; import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const files = ['java-1', 'java-2', 'java-3'];
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gen-'));
const out = {};
for (const f of files) {
  const mod = (await import(pathToFileURL(path.resolve('js/exercises', f + '.js')))).default;
  for (const ex of mod) {
    if (!ex.tests || ex.tests.every(t => t.expected !== undefined)) continue;
    const d = fs.mkdtempSync(path.join(tmp, 'j'));
    fs.writeFileSync(path.join(d, 'Main.java'), ex.solution); fs.writeFileSync(path.join(d, 'Runner.java'), RUNNER_SRC);
    execFileSync('javac', ['--release', '17', '-nowarn', '-d', d, 'Main.java', 'Runner.java'], { cwd: d, stdio: 'pipe' });
    out[ex.id] = ex.tests.map((t, i) => {
      if (t.expected !== undefined) return t.expected;
      const of = path.join(d, `o${i}.txt`);
      execFileSync('java', ['-cp', d, 'Runner', of, b64(t.input)], { stdio: 'pipe', timeout: 20000 });
      return normOut(fs.readFileSync(of, 'utf8'));
    });
    if (process.env.SHOW) { console.log(`\n== ${ex.id} ${ex.title}`); ex.tests.forEach((t, i) => console.log(`  in ${JSON.stringify(t.input)} -> ${JSON.stringify(out[ex.id][i])}`)); }
  }
}
fs.writeFileSync('js/exercises/expected.js', '// GENERADO por tools/gen-expected.mjs — no editar a mano\nexport default ' + JSON.stringify(out, null, 1) + ';\n');
console.log('expected.js escrito con', Object.keys(out).length, 'ejercicios');
