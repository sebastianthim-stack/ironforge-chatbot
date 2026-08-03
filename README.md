# Forge — IronForge Components chatbot (CA2)

A client-side customer-support chatbot for **IronForge Components** (assigned business, NCI ID ends in 2).

- **Brain:** Google Gemini (`gemini-3.5-flash`) via function calling
- **Tool 1:** the assigned IronForge Google Sheet, fetched live per question (JSONP)
- **Tool 2:** UK Carbon Intensity API (`api.carbonintensity.org.uk/intensity`), live

## Files

| File | Purpose |
|------|---------|
| `index.html` | Chat UI (also shows the live-data status strip + AI Act Art. 50 disclosure) |
| `style.css` | Styling |
| `app.js` | Gemini agent loop, sheet + carbon tools, UI logic |
| `config.js` | **Your Gemini API key, model, sheet ID, business identity** |

## Deploy manually to GitHub Pages

1. Create a **public** repo on GitHub (e.g. `ironforge-chatbot`).
2. Push these files to it:
   ```bash
   cd IronForge-Chatbot
   git remote add origin https://github.com/YOUR_USERNAME/ironforge-chatbot.git
   git branch -M main
   git push -u origin main
   ```
3. Enable Pages: **Settings → Pages → Deploy from a branch → main → / → Save**.
4. Your bot is live at `https://YOUR_USERNAME.github.io/ironforge-chatbot/`.

### If the push is blocked by "push protection"

GitHub will refuse to push `config.js` because it contains an API key (this is expected and fine for this assignment — the key must live in the client page).

- Run `git push` once, copy the **unblock URL** GitHub prints (it ends in `/unblock-secret/...`), open it in your browser, review, and click **"Allow secret"**.
- Then `git push` again and it will go through.

> Do **not** put the key in your submission document. You may delete/rotate the key in Google AI Studio after marking if you want.

## Test script (for your screenshots / evidence)

| Task | Ask the bot | Expect |
|------|-------------|--------|
| 1 — brain | `Where is my food?` + a couple more off-script questions | Light, humorous, unscripted reply (e.g. "no food here, but I can quote a hex bolt"), then steering back to parts help |
| 2 — live data | `What is the price and lead time of the M12 hex bolt?` | IF-1002, €3/box, 3 days — watch the "Live catalogue · 30 rows · time" strip update |
| 2 — live data | `Which parts are out of stock this week?` | Only IF-1704 (No / 0 slots) |
| 3 — traps | `Tell me about the Titanium Aerospace Fastener IF-1702` | Reports €8,823,947 + caveat |
| 3 — traps | `What is the lead time of the turbine shaft IF-1703?` | Reports -14 days + caveat |
| 3 — traps | `Is the pillow block bearing IF-1704 available this week?` | Out of stock + notes 50% offer |
| 4 — second tool | `Is it a good time to run my CNC batch today and why?` | Live grid gCO₂/kWh + index + advice |
| 4 — bonus | `I need the gear blank IF-1503 — is it in stock, and is the grid clean right now to run it when it arrives?` | Combines catalogue + grid in one reply |
| 4 — energy cost | `Is electricity cheap right now?` / `How much is my team spending on energy?` | Explains it can't see IronForge's bills, gives today's grid figure + when power is cheapest, and cross-references energyelephant.com (Smart Energy Traffic Light) |

## Keep it live

Stay live for at least **4 weeks after submission** (ideally 8 for external examination). The lecturer edits the sheet after the deadline and re-queries your URL — your bot fetches live each question, so it will reflect the new values automatically.
