// Carga todos los archivos de ejercicios. Para agregar más en etapas futuras, añádelos a "files".
import EXPECTED from './expected.js';

export async function loadAll() {
  const files = ['logic-1', 'java-1', 'java-2', 'java-3', 'sql-1', 'sql-2', 'db-1'];
  const out = [];
  for (const f of files) out.push(...(await import('./' + f + '.js')).default);
  // Salidas esperadas generadas con tools/gen-expected.mjs
  for (const ex of out) {
    if (!ex.tests) continue;
    ex.tests.forEach((t, i) => { if (t.expected === undefined && EXPECTED[ex.id]) t.expected = EXPECTED[ex.id][i]; });
  }
  return out;
}
