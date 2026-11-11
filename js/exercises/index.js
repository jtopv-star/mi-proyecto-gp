// Carga todos los archivos de ejercicios. Para agregar más en etapas futuras, impórtalos aquí.
export async function loadAll() {
  const files = ['logic-1', 'java-1', 'sql-1', 'db-1'];
  const out = [];
  for (const f of files) out.push(...(await import('./' + f + '.js')).default);
  return out;
}
