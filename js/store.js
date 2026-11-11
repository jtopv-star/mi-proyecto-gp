// Capa de guardado. Con Supabase configurado, TODO el progreso vive en la nube (no en localStorage).
// Sin configurar, funciona un modo demo en memoria (no guarda nada) para probar los motores.
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './config.js';

export const configured = !!(SUPABASE_URL && SUPABASE_ANON_KEY);
let sb = null, userId = null;
export let demo = false;
const mem = { player: null, progress: {} };

export function enableDemo() { demo = true; userId = 'demo'; mem.player = { xp: 0, level: 1, unlocked_worlds: [], display_name: 'Demo' }; }

export async function init() {
  if (!configured) return null;
  sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, { auth: { persistSession: true, autoRefreshToken: true } });
  const { data } = await sb.auth.getSession();
  userId = data.session?.user?.id || null;
  return data.session?.user || null;
}
export async function signIn(email, password) {
  const { data, error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
  userId = data.user.id; return data.user;
}
export async function signOut() { if (sb) await sb.auth.signOut(); userId = null; demo = false; }
export const isLogged = () => !!userId;

export async function loadAll() {
  if (demo) return { player: mem.player, progress: mem.progress };
  const [p, pr] = await Promise.all([
    sb.from('player').select('*').eq('user_id', userId).maybeSingle(),
    sb.from('progress').select('*').eq('user_id', userId)
  ]);
  if (p.error) throw p.error; if (pr.error) throw pr.error;
  let player = p.data;
  if (!player) {
    const ins = await sb.from('player').insert({ user_id: userId, display_name: 'Jugador' }).select().single();
    if (ins.error) throw ins.error; player = ins.data;
  }
  const progress = {}; for (const r of pr.data) progress[r.exercise_id] = r;
  return { player, progress };
}

async function upsertProgress(row) {
  if (demo) { mem.progress[row.exercise_id] = { ...(mem.progress[row.exercise_id] || {}), ...row }; return; }
  const { error } = await sb.from('progress').upsert({ ...row, user_id: userId, updated_at: new Date().toISOString() }, { onConflict: 'user_id,exercise_id' });
  if (error) throw error;
}

// Autoguardado del borrador de código
export const saveDraft = (exercise_id, area, last_code) => upsertProgress({ exercise_id, area, last_code });

export async function logHint(exercise_id, area, hint_index, hints_used) {
  if (!demo) {
    const { error } = await sb.from('hint_uses').upsert({ user_id: userId, exercise_id, hint_index }, { onConflict: 'user_id,exercise_id,hint_index', ignoreDuplicates: true });
    if (error) throw error;
  }
  await upsertProgress({ exercise_id, area, hints_used });
}

export async function recordAttempt({ ex, code, passed, score, message, hintsUsed, progressRow }) {
  if (!demo) {
    const { error } = await sb.from('attempts').insert({ user_id: userId, exercise_id: ex.id, area: ex.area, code, passed, score, result_message: (message || '').slice(0, 500), hints_used: hintsUsed });
    if (error) throw error;
  }
  await upsertProgress(progressRow);
}

export async function savePlayer(player) {
  if (demo) { mem.player = { ...mem.player, ...player }; return; }
  const { error } = await sb.from('player').update({ xp: player.xp, level: player.level, unlocked_worlds: player.unlocked_worlds, updated_at: new Date().toISOString() }).eq('user_id', userId);
  if (error) throw error;
}

export async function recentAttempts(limit = 15) {
  if (demo) return [];
  const { data, error } = await sb.from('attempts').select('exercise_id,passed,score,created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit);
  if (error) throw error; return data;
}
