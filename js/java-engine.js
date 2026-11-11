// Motor Java en el navegador: CheerpJ (JVM en WebAssembly) + compilador ECJ.
// Todo corre dentro del navegador, aislado; no se ejecuta nada en ningún servidor.
import { RUNNER_SRC, normOut, b64, testsOf } from './java-core.js';

const CHEERPJ_LOADER = 'https://cjrtnc.leaningtech.com/3.0/cj3loader.js';
const base = location.pathname.replace(/[^/]*$/, '');
const ECJ_JAR = '/app' + base + 'lib/ecj.jar';   // /app/ = raíz del sitio web para CheerpJ
let ready = null, runId = 0;

function loadScript(src) {
  return new Promise((res, rej) => { const s = document.createElement('script'); s.src = src; s.onload = res; s.onerror = () => rej(new Error('No se pudo cargar CheerpJ (¿sin internet?)')); document.head.appendChild(s); });
}
async function readText(path) {
  try { const b = await cjFileBlob(path); return b ? await b.text() : ''; } catch (e) { return ''; }
}

export function init(onStatus = () => {}) {
  if (ready) return ready;
  ready = (async () => {
    onStatus('Cargando máquina virtual Java (solo la primera vez, puede tardar)…');
    await loadScript(CHEERPJ_LOADER);
    await cheerpjInit({ version: 8 });
    onStatus('Java listo.');
  })().catch(e => { ready = null; throw e; });
  return ready;
}

async function compile(code, onStatus) {
  await init(onStatus);
  const id = ++runId;
  cheerpOSAddStringFile('/str/Main.java', code);
  cheerpOSAddStringFile('/str/Runner.java', RUNNER_SRC);
  const log = `/files/ecj${id}.log`;
  onStatus('Compilando…');
  const code0 = await cheerpjRunMain('org.eclipse.jdt.internal.compiler.batch.Main', ECJ_JAR,
    '-8', '-nowarn', '-proc:none', '-d', `/files/cls${id}`, '-log', log, '/str/Main.java', '/str/Runner.java');
  const msg = (await readText(log)).trim();
  if (code0 !== 0 || /ERROR in/.test(msg)) return { id, error: msg || 'Error de compilación desconocido (¿falta lib/ecj.jar?).' };
  return { id };
}

async function runOne(id, input, n) {
  const out = `/files/out${id}_${n}.txt`;
  await cheerpjRunMain('Runner', `/files/cls${id}`, out, b64(input));
  return await readText(out);
}

// Ejecución libre con entrada manual
export async function run(code, input, onStatus = () => {}) {
  const c = await compile(code, onStatus);
  if (c.error) return { compileError: c.error };
  onStatus('Ejecutando…');
  return { output: await runOne(c.id, input || '', 0) };
}

// Calificación: corre todos los tests del ejercicio
export async function grade(ex, code, onStatus = () => {}) {
  const c = await compile(code, onStatus);
  if (c.error) return { passed: false, message: 'Error de compilación', detail: c.error };
  const tests = testsOf(ex);
  const rows = [];
  for (let i = 0; i < tests.length; i++) {
    onStatus(`Probando caso ${i + 1} de ${tests.length}…`);
    const actual = await runOne(c.id, tests[i].input, i);
    rows.push({ input: tests[i].input, expected: normOut(tests[i].expected), actual: normOut(actual), ok: normOut(actual) === normOut(tests[i].expected) });
  }
  const okCount = rows.filter(r => r.ok).length;
  return { passed: okCount === rows.length, okCount, total: rows.length, rows,
    message: okCount === rows.length ? '¡Todos los casos correctos!' : `Pasaron ${okCount} de ${rows.length} casos.` };
}

// Diagnóstico paso a paso para detectar problemas de configuración
export async function diagnose(log) {
  try { log('1/4 Cargando CheerpJ…'); await init(log); log('   ✔ CheerpJ cargó'); } catch (e) { log('   ✘ ' + e.message); return; }
  try {
    log('2/4 Buscando lib/ecj.jar…'); const r = await fetch(base + 'lib/ecj.jar', { method: 'HEAD' });
    if (!r.ok) { log('   ✘ No existe lib/ecj.jar en el sitio (HTTP ' + r.status + '). Revisa el README, paso del compilador.'); return; }
    log('   ✔ Se encontró (' + Math.round((r.headers.get('content-length') || 0) / 1024) + ' KB)');
  } catch (e) { log('   ✘ ' + e.message); return; }
  try {
    log('3/4 Compilando y ejecutando un programa de prueba…');
    const res = await run('public class Main { public static void main(String[] a){ System.out.println("OK-JAVA " + (2+3)); } }', '', log);
    if (res.compileError) { log('   ✘ Error de compilación:\n' + res.compileError); return; }
    log('   Salida: ' + JSON.stringify(res.output));
    log(/OK-JAVA 5/.test(res.output) ? '4/4 ✔ Todo funciona.' : '4/4 ✘ La salida no es la esperada.');
  } catch (e) { log('   ✘ ' + (e.message || e)); }
}
