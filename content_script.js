function chromeStorageGet(opts) {
  return new Promise((resolve) => {
    chrome.storage.sync.get(opts, resolve);
  });
}

function addSettingsToHtml(settings) {
  const mainScript = document.createElement("script");
  mainScript.type = "application/json";
  mainScript.text = JSON.stringify(settings);
  mainScript.id = "netflix-5_1-settings";
  document.documentElement.appendChild(mainScript);
}

/* -------------------- LOGGING -------------------- */

const LOG_PREFIX = "[NF-5.1][CS]";

function log(level, ...args) {
  const time = new Date().toLocaleTimeString();
  console.log(`${LOG_PREFIX} ${time} ${level}`, ...args);
}

/* -------------------- SETTINGS -------------------- */

chromeStorageGet({ use6Channels: true }).then((items) => {
  log("INFO", "Loaded settings:", items);
  addSettingsToHtml(items);
});

/* -------------------- WATCH FIX -------------------- */

(() => {
  log("INFO", "Content script loaded at", location.href);
  const RELOAD_KEY = "nf_subtitle_fix_reloaded";
  let lastUrl = location.href;
  function handleWatchNavigation(reason) {
    log("NAV", `Entered /watch (${reason})`);
    if (sessionStorage.getItem(RELOAD_KEY) === "1") {
      log("SKIP", "Reload already performed, skipping");
      sessionStorage.removeItem(RELOAD_KEY);
      return;
    }
    setTimeout(() => {
      log("RELOAD", "Triggering one-time reload for subtitle sizing fix");
      sessionStorage.setItem(RELOAD_KEY, "1");
      location.reload();
    }, 300);
  }
  const observer = new MutationObserver(() => {
    if (location.href !== lastUrl) {
      const oldUrl = lastUrl;
      lastUrl = location.href;
      log("NAV", "URL changed");
      log("NAV", "From:", oldUrl);
      log("NAV", "To  :", lastUrl);
      if (lastUrl.includes("/watch")) {
        handleWatchNavigation("SPA navigation");
      }
    }
  });
  observer.observe(document, { childList: true, subtree: true });
  // Direct load / refresh on watch page
  if (location.href.includes("/watch")) {
    handleWatchNavigation("direct load");
  }
})();
