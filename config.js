window.CONFIG = {
  // 1) Cloudflare Worker proxy URL (recommended). The Gemini key lives only on
  //    the Worker as a secret, so it never appears in this repo or the page.
  //    Example: "https://ironforge-gemini.YOUR_ACCOUNT.workers.dev"
  //    Leave empty ("") to call Gemini directly with API_KEY below (local dev only).
  PROXY_URL: "",

  // 2) Direct Gemini API key. Only used if PROXY_URL is empty. Keep it out of
  //    the public repo - Google disables keys it finds publicly (leak detection).
  API_KEY: "",

  // 3) Model: current free-tier model that supports tool calling.
  MODEL: "gemini-3.5-flash",

  // 4) Your assigned Google Sheet (IronForge Components) - do not change.
  SHEET_ID: "1q24pjpbT-C6EhVXO2U-Ugjf9rEYyBtIaLXLNMeNYYM4",

  // 5) Business identity shown in the UI.
  BUSINESS: "IronForge Components",
  BOT_NAME: "Forge"
};
