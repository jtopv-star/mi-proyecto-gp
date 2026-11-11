// Núcleo de calificación SQL. Se usa igual en el navegador (PGlite) y en las pruebas de Node.
// Recibe una instancia de PGlite ya creada; nunca ejecuta nada fuera de ese motor aislado (WebAssembly).

export async function resetDb(db) {
  await db.exec('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public;');
}

function norm(v) {
  if (v === null || v === undefined) return 'NULL';
  if (typeof v === 'bigint') return String(Number(v));
  if (v instanceof Date) return v.toISOString();
  if (typeof v === 'number') return String(Math.round(v * 10000) / 10000);
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (typeof v === 'object') return JSON.stringify(v);
  const s = String(v).trim();
  if (/^-?\d+(\.\d+)?$/.test(s)) return String(Math.round(Number(s) * 10000) / 10000);
  return s;
}

function toMatrix(res, ordered) {
  const rows = (res.rows || []).map(r => Object.values(r).map(norm));
  if (!ordered) rows.sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)));
  return rows;
}

// Ejecuta setup + código y devuelve el resultado relevante (último SELECT o la consulta de verificación).
export async function evaluate(db, ex, code) {
  await resetDb(db);
  if (ex.setup) await db.exec(ex.setup);
  try {
    const res = await db.exec(code);
    let last = [...res].reverse().find(r => r.fields && r.fields.length) || { rows: [], fields: [] };
    if (ex.check) {
      const c = await db.exec(ex.check);
      last = [...c].reverse().find(r => r.fields && r.fields.length) || { rows: [], fields: [] };
    }
    return { rows: last.rows || [], fields: (last.fields || []).map(f => f.name) };
  } catch (e) {
    return { error: String(e.message || e) };
  }
}

export async function gradeSql(db, ex, userSql) {
  if (!userSql || !userSql.replace(/--.*$/gm, '').trim()) {
    return { passed: false, message: 'Escribe tu consulta antes de comprobar.' };
  }
  const exp = await evaluate(db, ex, ex.solution);
  if (exp.error) return { passed: false, message: 'Error interno del ejercicio: ' + exp.error };
  const act = await evaluate(db, ex, userSql);
  if (act.error) return { passed: false, message: 'Tu código tiene un error: ' + act.error };

  const e = toMatrix(exp, !!ex.ordered);
  const a = toMatrix(act, !!ex.ordered);
  if (!ex.check && exp.fields.length !== act.fields.length) {
    return { passed: false, message: `Se esperaban ${exp.fields.length} columna(s) y tu consulta devuelve ${act.fields.length}.`, result: act };
  }
  if (e.length !== a.length) {
    return { passed: false, message: `Se esperaban ${e.length} fila(s) y tu resultado tiene ${a.length}.`, result: act };
  }
  for (let i = 0; i < e.length; i++) {
    if (JSON.stringify(e[i]) !== JSON.stringify(a[i])) {
      return { passed: false, message: ex.ordered
        ? 'Las filas tienen datos distintos o están en otro orden. Revisa el ORDER BY y los valores.'
        : 'Los datos no coinciden con lo esperado. Revisa tu condición.', result: act };
    }
  }
  return { passed: true, message: '¡Resultado correcto!', result: act };
}

// Ejecuta libremente (botón "Ejecutar"): muestra lo que devuelve el código sin calificar.
export async function runSql(db, ex, userSql) {
  await resetDb(db);
  if (ex.setup) await db.exec(ex.setup);
  try {
    const res = await db.exec(userSql);
    const last = [...res].reverse().find(r => r.fields && r.fields.length);
    if (last) return { rows: last.rows, fields: last.fields.map(f => f.name) };
    const aff = res.reduce((n, r) => n + (r.affectedRows || 0), 0);
    return { info: `Ejecutado correctamente. Filas afectadas: ${aff}.` };
  } catch (e) {
    return { error: String(e.message || e) };
  }
}

export { norm };
