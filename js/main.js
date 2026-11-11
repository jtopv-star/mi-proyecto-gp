import { AREAS, WORLDS, DIFFICULTY } from './worlds.js';
import { loadAll as loadExercises } from './exercises/index.js';
import * as store from './store.js';
import { gradeSql, runSql } from './sql-core.js';

const $app = document.getElementById('app');
const $hud = document.getElementById('hud');
const $nav = document.getElementById('nav');
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

let EX = [], BYID = {};
let S = { player: null, progress: {} };
let editor = null, draftTimer = null, currentEx = null, hintsShown = 0;

/* ---------- utilidades de juego ---------- */
const XP_PER_LEVEL = 150;
const levelOf = xp => 1 + Math.floor(xp / XP_PER_LEVEL);
const doneSet = () => new Set(Object.values(S.progress).filter(p => p.completed).map(p => p.exercise_id));
const exOfWorld = w => EX.filter(e => e.world === w.id);
const worldsOf = a => WORLDS.filter(w => w.area === a);

function worldStats(w) {
  const list = exOfWorld(w), d = doneSet();
  const done = list.filter(e => d.has(e.id)).length;
  return { total: list.length, done, pct: list.length ? Math.round(100 * done / list.length) : 0 };
}
function isUnlocked(w) {
  if (w.optional) return true;                       // los mundos opcionales (calentamiento) nunca bloquean
  const ws = worldsOf(w.area).filter(x => exOfWorld(x).length && !x.optional);
  const idx = ws.findIndex(x => x.id === w.id);
  if (idx <= 0) return true;
  if (S.player.unlocked_worlds?.includes(w.id)) return true;
  return worldStats(ws[idx - 1]).pct >= 70;
}
function toast(msg) {
  const t = document.getElementById('toast'); t.innerHTML = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 3500);
}

function renderHud() {
  if (!S.player) { $hud.innerHTML = ''; $nav.innerHTML = ''; return; }
  const xp = S.player.xp, lv = levelOf(xp), into = xp - (lv - 1) * XP_PER_LEVEL;
  $hud.innerHTML = `<span class="pill">Nivel ${lv}</span><div class="xpbar" title="${into}/${XP_PER_LEVEL} XP"><i style="width:${100 * into / XP_PER_LEVEL}%"></i></div><span class="pill">${xp} XP</span>
    <button class="btn sec" id="logout">${store.demo ? 'Salir del demo' : 'Cerrar sesión'}</button>`;
  document.getElementById('logout').onclick = async () => { await store.signOut(); S = { player: null, progress: {} }; renderHud(); location.hash = '#/login'; route(); };
  const h = location.hash;
  $nav.innerHTML = [['#/', 'Menú'], ['#/area/java', '☕ Java'], ['#/area/sql', '🔎 SQL'], ['#/area/db', '🗄️ BD'], ['#/progress', '📈 Progreso']]
    .map(([href, t]) => `<a href="${href}" class="${h === href || (href !== '#/' && h.startsWith(href)) ? 'on' : ''}">${t}</a>`).join('');
}

/* ---------- motores (carga perezosa) ---------- */
let pg = null;
async function sqlDb(setStatus) {
  if (pg) return pg;
  setStatus?.('Cargando el motor SQL (PostgreSQL en tu navegador)…');
  const { PGlite } = await import('../vendor/pglite/index.js');
  pg = new PGlite(); await pg.waitReady;
  return pg;
}
let javaEng = null;
const javaEngine = async () => javaEng || (javaEng = await import('./java-engine.js'));

/* ---------- vistas ---------- */
function viewSetup() {
  $app.innerHTML = `<div class="card" style="max-width:720px;margin:30px auto">
    <h1>⚙️ Falta conectar Supabase</h1>
    <p>Abre <code>js/config.js</code> y pega la <b>URL</b> y la <b>anon key</b> de tu proyecto de Supabase (sigue el README, paso 1). Luego recarga esta página.</p>
    <p class="muted">Mientras tanto puedes probar los motores de Java y SQL en <b>modo demo</b>: funciona igual, pero <b>no guarda nada</b>.</p>
    <button class="btn" id="demo">Probar en modo demo</button></div>`;
  document.getElementById('demo').onclick = async () => { store.enableDemo(); S = await store.loadAll(); renderHud(); location.hash = '#/'; route(); };
}

function viewLogin(err = '') {
  $app.innerHTML = `<form class="card login" id="lf"><h1>🎮 Game Programming</h1><p class="muted">Acceso privado.</p>
    <label>Correo</label><input type="email" id="em" required autocomplete="username">
    <label>Contraseña</label><input type="password" id="pw" required autocomplete="current-password">
    <p style="color:var(--bad)">${esc(err)}</p><button class="btn" style="width:100%">Entrar</button></form>`;
  document.getElementById('lf').onsubmit = async e => {
    e.preventDefault();
    try { await store.signIn(em.value, pw.value); S = await store.loadAll(); renderHud(); location.hash = '#/'; route(); }
    catch (x) { viewLogin('No se pudo entrar: ' + (x.message || x)); }
  };
}

function viewHome() {
  const d = doneSet(), totalDone = d.size;
  $app.innerHTML = `<h1>Menú principal</h1><p class="muted">Elige un área. Ya completaste <b>${totalDone}</b> ejercicio(s). Tu progreso se guarda solo, en la nube.</p>
  <div class="grid">${Object.entries(AREAS).map(([k, a]) => {
    const list = EX.filter(e => e.area === k), done = list.filter(e => d.has(e.id)).length, pct = list.length ? Math.round(100 * done / list.length) : 0;
    return `<a class="card area-card" href="#/area/${k}" style="--c:${a.color}"><div class="ic">${a.icon}</div><h3>${a.name}</h3><p class="muted">${a.desc}</p>
      <div class="bar" style="--c:${a.color}"><i style="width:${pct}%"></i></div><small class="muted">${done} / ${list.length} ejercicios disponibles (${pct} %)</small></a>`;
  }).join('')}
  <a class="card area-card" href="#/progress" style="--c:#22c55e"><div class="ic">📈</div><h3>Mi progreso</h3><p class="muted">XP, nivel, intentos recientes.</p></a>
  <a class="card area-card" href="#/diag" style="--c:#64748b"><div class="ic">🛠️</div><h3>Diagnóstico Java</h3><p class="muted">Comprueba que el motor Java funciona en este navegador.</p></a></div>`;
}

function viewArea(key) {
  const a = AREAS[key]; if (!a) return viewHome();
  const d = doneSet();
  $app.innerHTML = `<div class="nav2"><a href="#/">← Menú</a></div><h1>${a.icon} ${a.name}</h1><p class="muted">${a.desc}</p>` +
    worldsOf(key).map(w => {
      const list = exOfWorld(w), st = worldStats(w);
      if (!list.length) return `<div class="card world locked"><h3>🔒 ${w.name}</h3><p class="muted">${w.desc}</p><small class="muted">Próximamente (Etapa ${w.stage || '—'}). Temas: ${w.topics.join(', ')}.</small></div>`;
      const open = isUnlocked(w);
      return `<div class="card world ${open ? '' : 'locked'}"><h3>${open ? '' : '🔒 '}${w.name} <small class="muted">· ${st.done}/${st.total}</small></h3><p class="muted">${w.desc}</p>
        <div class="bar" style="--c:${a.color}"><i style="width:${st.pct}%"></i></div>
        ${open ? '' : '<small class="muted">Completa el 70 % del mundo anterior para desbloquear.</small>'}
        <div class="tiles">${list.map((e, i) => open
          ? `<a class="tile ${d.has(e.id) ? 'done' : ''}" style="--d:${DIFFICULTY[e.level].color}" href="#/ex/${e.id}" title="${esc(e.title)} · ${DIFFICULTY[e.level].label}">${d.has(e.id) ? '✔' : i + 1}</a>`
          : `<span class="tile"><span class="lk">🔒</span></span>`).join('')}</div></div>`;
    }).join('') +
    `<p class="muted" style="margin-top:20px">Borde del cuadro: <span style="color:#22c55e">fácil</span> · <span style="color:#f59e0b">medio</span> · <span style="color:#ef4444">difícil</span></p>`;
}

async function viewProgress() {
  const d = doneSet(), xp = S.player.xp;
  const byA = Object.entries(AREAS).map(([k, a]) => `<div class="card"><div class="muted">${a.icon} ${a.name}</div><div class="stat">${EX.filter(e => e.area === k && d.has(e.id)).length}<small class="muted"> / ${EX.filter(e => e.area === k).length}</small></div></div>`).join('');
  $app.innerHTML = `<h1>📈 Mi progreso</h1><div class="row"><div class="card"><div class="muted">Nivel</div><div class="stat">${levelOf(xp)}</div></div><div class="card"><div class="muted">XP total</div><div class="stat">${xp}</div></div>
    <div class="card"><div class="muted">Pistas usadas</div><div class="stat">${Object.values(S.progress).reduce((n, p) => n + (p.hints_used || 0), 0)}</div></div>${byA}</div>
    <h2>Intentos recientes</h2><div class="card" id="rec"><span class="muted">Cargando…</span></div>`;
  try {
    const rec = await store.recentAttempts(15);
    document.getElementById('rec').innerHTML = rec.length ? `<table style="width:100%;border-collapse:collapse">${rec.map(r => `<tr><td style="padding:4px 8px">${r.passed ? '✅' : '❌'}</td><td><a href="#/ex/${r.exercise_id}">${esc(BYID[r.exercise_id]?.title || r.exercise_id)}</a></td><td>${r.score} pts</td><td class="muted">${new Date(r.created_at).toLocaleString()}</td></tr>`).join('')}</table>` : '<span class="muted">Aún no hay intentos.</span>';
  } catch (e) { document.getElementById('rec').textContent = 'No se pudo cargar: ' + e.message; }
}

async function viewDiag() {
  $app.innerHTML = `<div class="nav2"><a href="#/">← Menú</a></div><h1>🛠️ Diagnóstico del motor Java</h1><p class="muted">Prueba cada paso y te dice qué falta.</p><button class="btn" id="go">Ejecutar diagnóstico</button><pre id="dlog" style="margin-top:14px">(sin ejecutar)</pre>`;
  document.getElementById('go').onclick = async () => {
    const el = document.getElementById('dlog'); el.textContent = '';
    const log = m => { el.textContent += m + '\n'; };
    (await javaEngine()).diagnose(log);
  };
}

/* ---------- pantalla de ejercicio ---------- */
function setSaved(txt) { const s = document.getElementById('saved'); if (s) s.textContent = txt; }

async function viewExercise(id) {
  const ex = BYID[id]; if (!ex) return viewHome();
  const w = WORLDS.find(x => x.id === ex.world);
  if (!isUnlocked(w)) { toast('🔒 Ese mundo aún está bloqueado.'); location.hash = '#/area/' + ex.area; return; }
  currentEx = ex;
  const pr = S.progress[ex.id] || {};
  hintsShown = pr.hints_used || 0;
  const lv = DIFFICULTY[ex.level], idx = exOfWorld(w).findIndex(e => e.id === ex.id), next = exOfWorld(w)[idx + 1];

  if (ex.type === 'quiz') return viewQuiz(ex, w, lv, pr, next);

  const isSql = ex.area !== 'java';
  $app.innerHTML = `<div class="nav2"><a href="#/area/${ex.area}">← ${esc(w.name)}</a></div>
  <div class="ex"><section class="card stmt">
    <span class="badge" style="background:${lv.color}">${lv.label}</span> <span class="pill">${esc(ex.topic)}</span> <span class="pill">+${lv.xp} XP</span> ${pr.completed ? '<span class="pill" style="color:var(--ok)">✔ completado</span>' : ''}
    <h1>${esc(ex.title)}</h1><div>${ex.statement}</div>
    ${isSql && ex.setup ? `<details style="margin-top:12px"><summary>Ver estructura de las tablas (script de creación)</summary><pre>${esc(ex.setup.trim())}</pre></details>` : ''}
    <h2>Pistas</h2><div id="hints"></div>
    <button class="btn sec" id="hintbtn"></button>
    <p class="muted" style="font-size:13px">Cada pista usada reduce 20 % la experiencia (mínimo 40 %).</p>
    ${pr.completed ? `<details style="margin-top:10px"><summary>Ver una solución de referencia</summary><pre>${esc(ex.solution)}</pre></details>` : ''}
  </section>
  <section><textarea id="code"></textarea>
    <div class="toolbar"><button class="btn sec" id="run">▶ Ejecutar</button><button class="btn" id="check">✔ Comprobar</button><button class="btn sec" id="reset">↺ Restablecer</button><span class="saved" id="saved">Guardado automático activado</span></div>
    ${isSql ? '' : `<details><summary>Entrada para “Ejecutar” (lo que escribirías en el teclado)</summary><textarea id="stdin" rows="3" placeholder="Una entrada por línea"></textarea></details>`}
    <div class="out" id="out"><span class="muted">El resultado aparecerá aquí.</span></div>
    ${next ? `<div style="margin-top:12px;display:none" id="nextwrap"><a class="btn ok" style="text-decoration:none;display:inline-block" href="#/ex/${next.id}">Siguiente ejercicio →</a></div>` : `<div id="nextwrap" style="display:none;margin-top:12px"><a class="btn ok" style="text-decoration:none" href="#/area/${ex.area}">Volver al mapa →</a></div>`}
  </section></div>`;

  editor = CodeMirror.fromTextArea(document.getElementById('code'), { mode: isSql ? 'text/x-pgsql' : 'text/x-java', lineNumbers: true, matchBrackets: true, autoCloseBrackets: true, indentUnit: 4, tabSize: 4, indentWithTabs: false, extraKeys: { Tab: cm => cm.execCommand('insertSoftTab') } });
  editor.setValue(pr.last_code ?? ex.starter ?? '');
  editor.on('change', scheduleDraft);
  if (pr.completed) document.getElementById('nextwrap').style.display = 'block';
  renderHints(ex);
  document.getElementById('hintbtn').onclick = () => showHint(ex);
  document.getElementById('reset').onclick = () => { if (confirm('¿Volver al código inicial?')) editor.setValue(ex.starter || ''); };
  document.getElementById('run').onclick = () => doRun(ex);
  document.getElementById('check').onclick = () => doCheck(ex);
}

function scheduleDraft() {
  setSaved('Guardando…'); clearTimeout(draftTimer);
  draftTimer = setTimeout(flushDraft, 1500);
}
async function flushDraft() {
  clearTimeout(draftTimer); draftTimer = null;
  if (!editor || !currentEx) return;
  const ex = currentEx, code = editor.getValue();
  try {
    await store.saveDraft(ex.id, ex.area, code);
    S.progress[ex.id] = { ...(S.progress[ex.id] || { exercise_id: ex.id }), exercise_id: ex.id, area: ex.area, last_code: code };
    setSaved('✓ Guardado en la nube ' + new Date().toLocaleTimeString());
  } catch (e) { setSaved('⚠ No se pudo guardar: ' + (e.message || e)); }
}
window.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden' && draftTimer) flushDraft(); });
window.addEventListener('beforeunload', () => { if (draftTimer) flushDraft(); });

function renderHints(ex) {
  const h = document.getElementById('hints'), b = document.getElementById('hintbtn');
  h.innerHTML = (ex.hints || []).slice(0, hintsShown).map((t, i) => `<div class="hint">💡 <b>Pista ${i + 1}:</b> ${t}</div>`).join('') || '<span class="muted">Aún no has usado pistas.</span>';
  const left = (ex.hints || []).length - hintsShown;
  b.textContent = left > 0 ? `💡 Pedir pista (${left} disponible${left > 1 ? 's' : ''})` : 'Sin más pistas'; b.disabled = left <= 0;
}
async function showHint(ex) {
  if (hintsShown >= (ex.hints || []).length) return;
  hintsShown++; renderHints(ex);
  try { await store.logHint(ex.id, ex.area, hintsShown - 1, hintsShown); S.progress[ex.id] = { ...(S.progress[ex.id] || { exercise_id: ex.id, area: ex.area }), hints_used: hintsShown }; }
  catch (e) { toast('⚠ No se pudo guardar la pista: ' + e.message); }
}

const setOut = (html, cls = '') => { const o = document.getElementById('out'); o.className = 'out ' + cls; o.innerHTML = html; };
const table = (fields, rows) => `<div style="overflow:auto"><table><tr>${fields.map(f => `<th>${esc(f)}</th>`).join('')}</tr>${rows.slice(0, 200).map(r => `<tr>${fields.map(f => `<td>${esc(r[f] === null ? 'NULL' : typeof r[f] === 'bigint' ? Number(r[f]) : r[f])}</td>`).join('')}</tr>`).join('')}</table></div>${rows.length > 200 ? '<small class="muted">Mostrando 200 filas.</small>' : ''}<small class="muted">${rows.length} fila(s)</small>`;

async function doRun(ex) {
  const btn = document.getElementById('run'); btn.disabled = true;
  const code = editor.getValue();
  try {
    if (ex.area !== 'java') {
      const db = await sqlDb(m => setOut(esc(m))); setOut('Ejecutando…');
      const r = await runSql(db, ex, code);
      if (r.error) setOut(`<b style="color:var(--bad)">Error:</b> ${esc(r.error)}`, 'bad');
      else if (r.info) setOut(esc(r.info));
      else setOut(table(r.fields, r.rows));
    } else {
      const eng = await javaEngine();
      const r = await eng.run(code, document.getElementById('stdin').value, m => setOut(esc(m)));
      if (r.compileError) setOut(`<b style="color:var(--bad)">Error de compilación:</b><pre>${esc(r.compileError)}</pre>`, 'bad');
      else setOut(`<b>Salida del programa:</b><pre>${esc(r.output) || '(el programa no imprimió nada)'}</pre>`);
    }
  } catch (e) { setOut(`<b style="color:var(--bad)">Error:</b> ${esc(e.message || e)}`, 'bad'); }
  btn.disabled = false;
}

async function doCheck(ex) {
  const btn = document.getElementById('check'); btn.disabled = true;
  const code = editor.getValue();
  try {
    if (draftTimer) await flushDraft();
    let res;
    if (ex.area !== 'java') {
      const db = await sqlDb(m => setOut(esc(m))); setOut('Comprobando…');
      res = await gradeSql(db, ex, code);
      var detail = res.result && res.result.fields?.length ? table(res.result.fields, res.result.rows) : '';
    } else {
      const eng = await javaEngine();
      res = await eng.grade(ex, code, m => setOut(esc(m)));
      var detail = res.detail ? `<pre>${esc(res.detail)}</pre>` : res.rows ? `<table class="tests"><tr><th></th><th>Entrada</th><th>Esperado</th><th>Tu salida</th></tr>${res.rows.map(r => `<tr><td>${r.ok ? '✅' : '❌'}</td><td><pre>${esc(r.input) || '—'}</pre></td><td><pre>${esc(r.expected)}</pre></td><td><pre>${esc(r.actual)}</pre></td></tr>`).join('')}</table>` : '';
    }
    await afterAttempt(ex, code, res, detail);
  } catch (e) { setOut(`<b style="color:var(--bad)">Error:</b> ${esc(e.message || e)}`, 'bad'); }
  btn.disabled = false;
}

async function afterAttempt(ex, code, res, detail) {
  const prev = S.progress[ex.id] || { exercise_id: ex.id, area: ex.area };
  const factor = Math.max(0.4, 1 - 0.2 * hintsShown);
  const score = res.passed ? Math.round(100 * factor) : (res.total ? Math.round(60 * res.okCount / res.total) : 0);
  const firstTime = res.passed && !prev.completed;
  const xpGain = firstTime ? Math.round(DIFFICULTY[ex.level].xp * factor) : 0;
  const row = { exercise_id: ex.id, area: ex.area, completed: !!(prev.completed || res.passed), best_score: Math.max(prev.best_score || 0, score), xp_awarded: (prev.xp_awarded || 0) + xpGain,
    hints_used: hintsShown, attempts: (prev.attempts || 0) + 1, last_code: code, last_attempt_at: new Date().toISOString(), first_completed_at: prev.first_completed_at || (firstTime ? new Date().toISOString() : null) };
  try {
    await store.recordAttempt({ ex, code, passed: res.passed, score, message: res.message, hintsUsed: hintsShown, progressRow: row });
    S.progress[ex.id] = { ...prev, ...row };
    if (xpGain) {
      const oldLv = levelOf(S.player.xp);
      S.player.xp += xpGain; S.player.level = levelOf(S.player.xp);
      S.player.unlocked_worlds = WORLDS.filter(w => exOfWorld(w).length && isUnlocked(w)).map(w => w.id);
      await store.savePlayer(S.player);
      toast(`🎉 +${xpGain} XP${S.player.level > oldLv ? ` · ¡Subiste al nivel ${S.player.level}!` : ''}`);
      renderHud();
    }
    setSaved('✓ Intento guardado');
  } catch (e) { toast('⚠ No se pudo guardar el intento: ' + (e.message || e)); }
  setOut(`<b style="color:${res.passed ? 'var(--ok)' : 'var(--bad)'}">${res.passed ? '✅' : '❌'} ${esc(res.message)}</b>${res.passed && xpGain ? ` <span class="pill">+${xpGain} XP</span>` : ''}${detail ? '<div style="margin-top:8px">' + detail + '</div>' : ''}`, res.passed ? 'ok' : 'bad');
  if (res.passed) document.getElementById('nextwrap').style.display = 'block';
}

/* ---------- quiz de lógica ---------- */
function viewQuiz(ex, w, lv, pr, next) {
  $app.innerHTML = `<div class="nav2"><a href="#/area/${ex.area}">← ${esc(w.name)}</a></div><section class="card" style="max-width:760px">
    <span class="badge" style="background:${lv.color}">${lv.label}</span> <span class="pill">${esc(ex.topic)}</span> <span class="pill">+${lv.xp} XP</span> ${pr.completed ? '<span class="pill" style="color:var(--ok)">✔ completado</span>' : ''}
    <h1>${esc(ex.title)}</h1><div>${ex.statement}</div><div id="opts">${ex.options.map((o, i) => `<button class="quiz-opt" data-i="${i}">${esc(o)}</button>`).join('')}</div><div id="qres"></div></section>`;
  const tries = { n: 0 };
  document.querySelectorAll('.quiz-opt').forEach(b => b.onclick = async () => {
    const i = +b.dataset.i, ok = i === ex.answer; tries.n++;
    if (!ok) { b.classList.add('wrong'); document.getElementById('qres').innerHTML = '<p style="color:var(--bad)">❌ No es esa. Piénsalo otra vez y prueba otra opción.</p>'; await quizSave(ex, false, 0); return; }
    document.querySelectorAll('.quiz-opt').forEach(x => x.disabled = true); b.classList.add('right');
    const prev = S.progress[ex.id] || {}; const gain = prev.completed ? 0 : Math.round(DIFFICULTY[ex.level].xp * Math.max(0.4, 1 - 0.2 * (tries.n - 1)));
    document.getElementById('qres').innerHTML = `<div class="out ok"><b style="color:var(--ok)">✅ ¡Correcto!${gain ? ` +${gain} XP` : ''}</b><p>${ex.explanation}</p></div>
      <p><a class="btn ok" style="text-decoration:none;display:inline-block" href="${next ? '#/ex/' + next.id : '#/area/' + ex.area}">${next ? 'Siguiente →' : 'Volver al mapa →'}</a></p>`;
    await quizSave(ex, true, gain);
  });
}
async function quizSave(ex, passed, gain) {
  const prev = S.progress[ex.id] || { exercise_id: ex.id, area: ex.area };
  const row = { exercise_id: ex.id, area: ex.area, completed: !!(prev.completed || passed), best_score: passed ? Math.max(prev.best_score || 0, gain ? Math.round(100 * gain / DIFFICULTY[ex.level].xp) : 100) : (prev.best_score || 0), xp_awarded: (prev.xp_awarded || 0) + gain, hints_used: 0, attempts: (prev.attempts || 0) + 1, last_attempt_at: new Date().toISOString(), first_completed_at: prev.first_completed_at || (passed && gain ? new Date().toISOString() : null) };
  try {
    await store.recordAttempt({ ex, code: '', passed, score: row.best_score, message: passed ? 'Correcto' : 'Incorrecto', hintsUsed: 0, progressRow: row });
    S.progress[ex.id] = { ...prev, ...row };
    if (gain) { S.player.xp += gain; S.player.level = levelOf(S.player.xp); S.player.unlocked_worlds = WORLDS.filter(w => exOfWorld(w).length && isUnlocked(w)).map(w => w.id); await store.savePlayer(S.player); renderHud(); toast(`🎉 +${gain} XP`); }
  } catch (e) { toast('⚠ No se pudo guardar: ' + e.message); }
}

/* ---------- router ---------- */
async function route() {
  if (draftTimer) await flushDraft();
  editor = null; currentEx = null;
  const h = location.hash || '#/';
  if (!store.configured && !store.demo) { renderHud(); return viewSetup(); }
  if (!store.isLogged()) { if (h !== '#/login') location.hash = '#/login'; renderHud(); return viewLogin(); }
  if (!S.player) S = await store.loadAll();
  renderHud();
  const [, page, arg] = h.split('/');
  if (page === 'area') return viewArea(arg);
  if (page === 'ex') return viewExercise(arg);
  if (page === 'progress') return viewProgress();
  if (page === 'diag') return viewDiag();
  if (page === 'login') { location.hash = '#/'; return; }
  viewHome();
}

(async function boot() {
  try {
    EX = await loadExercises(); BYID = Object.fromEntries(EX.map(e => [e.id, e]));
    await store.init();
    if (store.isLogged()) S = await store.loadAll();
  } catch (e) { $app.innerHTML = `<div class="card"><h1>Error al iniciar</h1><pre>${esc(e.stack || e)}</pre></div>`; return; }
  window.addEventListener('hashchange', route);
  route();
})();
