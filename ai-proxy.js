/**
 * Cloudflare Worker — AI content proxy for the trip app.
 * Holds the Anthropic API key server-side and generates attraction content.
 *
 * Deploy (one time):
 *   1. https://dash.cloudflare.com → Workers & Pages → Create → Worker
 *   2. Paste this file, Deploy.
 *   3. Settings → Variables → add a Secret:  ANTHROPIC_API_KEY = sk-ant-...
 *   4. Copy the Worker URL (https://<name>.<you>.workers.dev) and paste it
 *      into the app: Settings (⚙️) → "AI" → כתובת שרת ה-AI.
 *
 * The app calls:  POST <worker-url>  { name, location, country }
 * It returns:     { desc, activities[], tips[], duration, forKids }
 */
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(obj, status) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', ...CORS },
  });
}

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') return new Response(null, { headers: CORS });
    if (request.method !== 'POST') return json({ error: 'POST only' }, 405);
    if (!env.ANTHROPIC_API_KEY) return json({ error: 'server missing ANTHROPIC_API_KEY' }, 500);

    let body;
    try { body = await request.json(); } catch { return json({ error: 'bad json' }, 400); }
    const name = (body && body.name || '').trim();
    if (!name) return json({ error: 'name required' }, 400);
    const where = [body.location, body.country].filter(Boolean).join(', ');

    const prompt =
      `אתה עוזר לבנות מתכנן טיול משפחתי. עבור האטרקציה "${name}"` +
      (where ? ` (${where})` : '') +
      `, החזר אובייקט JSON בלבד (ללא markdown) בעברית עם השדות:\n` +
      `- desc: תיאור קצר של 1–2 משפטים.\n` +
      `- activities: מערך של 3–5 פעילויות קצרות ("מה עושים שם"), כל אחת מתחילה באימוג'י מתאים.\n` +
      `- tips: מערך של 2–4 טיפים פרקטיים קצרים.\n` +
      `- duration: משך זמן מומלץ, למשל "2–3 שעות".\n` +
      `- forKids: דירוג התאמה לילדים באמצעות כוכבים, אחד מ: ★☆☆☆☆ / ★★☆☆☆ / ★★★☆☆ / ★★★★☆ / ★★★★★.\n` +
      `אם אינך מכיר את המקום, השתמש בידע כללי על מקומות דומים באזור. החזר אך ורק את ה-JSON.`;

    try {
      const r = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 800,
          messages: [{ role: 'user', content: prompt }],
        }),
      });
      const d = await r.json();
      if (d.error) return json({ error: d.error.message || 'api error' }, 502);
      const text = (d.content && d.content[0] && d.content[0].text) || '';
      const m = text.match(/\{[\s\S]*\}/);
      if (!m) return json({ error: 'no json', raw: text }, 502);
      return json(JSON.parse(m[0]), 200);
    } catch (e) {
      return json({ error: String(e) }, 500);
    }
  },
};
