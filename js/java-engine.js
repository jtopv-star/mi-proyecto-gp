// Motor Java en el navegador: CheerpJ 5 (JVM en WebAssembly con el JDK completo, incluido javac).
// Todo corre dentro del navegador, aislado; no se ejecuta nada en ningún servidor.
import { RUNNER_SRC, normOut, b64, testsOf } from './java-core.js';

const JAVA_VERSION = 21;   // CheerpJ 5 admite 8, 11, 17, 21 y 25
const CHEERPJ_LOADER = 'https://cjrtnc.leaningtech.com/5.0/loader.js';
const base = location.pathname.replace(/[^/]*$/, '');
const LAUNCHER_JAR = '/app' + base + 'lib/launcher.jar';   // /app/ = raíz del sitio web para CheerpJ
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
    await cheerpjInit({ version: JAVA_VERSION || 21 });
    onStatus('Java listo.');
  })().catch(e => { ready = null; throw e; });
  return ready;
}

async function compile(code, onStatus) {
  await init(onStatus);
  const id = ++runId;
  cheerpOSAddStringFile('/str/Main.java', code);
  cheerpOSAddStringFile('/str/Runner.java', RUNNER_SRC);
  const log = `/files/javac${id}.log`;
  onStatus('Compilando…');
  // Launcher (lib/launcher.jar) llama a javac y deja en un archivo el código de salida y los mensajes
  await cheerpjRunMain('Launcher', LAUNCHER_JAR, log, '-proc:none', '-nowarn', '-d', `/files/cls${id}`, '/str/Main.java', '/str/Runner.java');
  const msg = (await readText(log)).replace(/\r/g, '');
  if (!msg) return { id, error: 'No se obtuvo respuesta del compilador (¿falta lib/launcher.jar?).' };
  const rc = (msg.match(/^RC=(\d+)/) || [])[1];
  if (rc !== '0') return { id, error: msg.replace(/^RC=\d+\n/, '').replace(/\/str\//g, '') };
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
  try { log('1/5 Cargando CheerpJ 5 (Java ' + (JAVA_VERSION || 21) + ')…'); await init(log); log('   ✔ CheerpJ cargó'); } catch (e) { log('   ✘ ' + (e.message || e)); return; }
  log('2/5 Funciones necesarias: cheerpOSAddStringFile=' + typeof cheerpOSAddStringFile + ', cjFileBlob=' + typeof cjFileBlob + ', cheerpjRunMain=' + typeof cheerpjRunMain);
  try {
    log('3/5 Buscando lib/launcher.jar…'); const r = await fetch(base + 'lib/launcher.jar', { method: 'HEAD' });
    if (!r.ok) { log('   ✘ No existe lib/launcher.jar en el sitio (HTTP ' + r.status + '). Súbelo junto con el resto de archivos.'); return; }
    log('   ✔ Se encontró');
  } catch (e) { log('   ✘ ' + e.message); return; }
  try {
    log('4/5 Compilando y ejecutando un programa de prueba…');
    const res = await run('public class Main { public static void main(String[] a){ System.out.println("OK-JAVA " + (2+3)); } }', '', log);
    if (res.compileError) { log('   ✘ Error de compilación:\n' + res.compileError); return; }
    log('   Salida: ' + JSON.stringify(res.output));
    log(/OK-JAVA 5/.test(res.output) ? '5/5 ✔ Todo funciona.' : '5/5 ✘ La salida no es la esperada.');
  } catch (e) { log('   ✘ ' + (e.message || e)); }
}
