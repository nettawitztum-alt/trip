# AI content proxy — setup (≈5 minutes)

The app can auto-write a description + "what to do" + tips + duration + kids
rating for any attraction. To keep your Anthropic API key private, the request
goes through a tiny Cloudflare Worker (free tier is plenty).

## 1. Create the Worker
1. Go to <https://dash.cloudflare.com> → **Workers & Pages** → **Create** → **Worker**.
2. Give it a name (e.g. `trip-ai`), click **Deploy** (the default code is fine for now).
3. Click **Edit code**, delete everything, paste the contents of **`ai-proxy.js`**
   from this repo, and **Deploy**.

## 2. Add your API key (as a secret)
1. In the Worker → **Settings** → **Variables and Secrets**.
2. **Add** → Type **Secret** → Name `ANTHROPIC_API_KEY` → Value your key
   (`sk-ant-...` from <https://console.anthropic.com>). Save & deploy.

## 3. Connect the app
1. Copy the Worker URL (looks like `https://trip-ai.<you>.workers.dev`).
2. In the app: **Settings (⚙️)** → **AI** → paste the URL into *כתובת שרת ה-AI* → **שמור**.

## Use it
Add or edit an attraction → tap **✨ מלא פרטים עם AI**. It fills the form
fields; review and **שמור**.

Cost is tiny (Claude Haiku, a few hundred tokens per attraction). The key is
only ever on Cloudflare — never in the app or the repo.
