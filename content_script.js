function chromeStorageGet(opts) {
    return new Promise(resolve => {
        chrome.storage.sync.get(opts, resolve);
    });
}

function addSettingsToHtml(settings) {
    const mainScript = document.createElement('script');
    mainScript.type = 'application/json';
    mainScript.text = JSON.stringify(settings);
    mainScript.id = "netflix-5_1-settings";
    document.documentElement.appendChild(mainScript);
}

chromeStorageGet({
    use6Channels: true,
}).then(items => {
    addSettingsToHtml(items);
});

// Variable to store the interval ID so we can stop it if needed
let fixInterval = null;

const applyConditionalFix = () => {
    // 1. Check if the extension context is still valid
    // This prevents the "Extension context invalidated" error
    if (!chrome.runtime?.id) {
        console.log("Netflix Fix: Context invalidated. Stopping script.");
        if (fixInterval) clearInterval(fixInterval);
        return;
    }

    // Safety check: ensure head is available
    if (!document.head) return;

    // Retrieve settings from local storage
    chrome.storage.local.get(['app_size', 'app_bottom', 'edge_size', 'edge_bottom'], (prefs) => {
        // Double check for runtime error during retrieval
        if (chrome.runtime.lastError) return;

        // Detect if running in Standalone (App) mode or Browser mode
        const isApp = window.matchMedia('(display-mode: standalone)').matches;
        const styleId = 'netflix-universal-fix';
        
        let style = document.getElementById(styleId);
        if (!style) {
            style = document.createElement('style');
            style.id = styleId;
            document.head.appendChild(style);
        }

        // Apply fallback values if storage is empty
        const appSize = (prefs.app_size || 100) / 100;
        const appBottom = prefs.app_bottom || "20%";
        const edgeSize = (prefs.edge_size || 100) / 100;
        const edgeBottom = prefs.edge_bottom || "20%";

        if (isApp) {
            // --- SETTINGS FOR WINDOWS APP (PWA) ---
            style.innerHTML = `
                .player-timedtext-text-container span {
                    font-size: ${appSize}em !important; 
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.8) !important;
                }
                .player-timedtext-text-container {
                    bottom: ${appBottom} !important;
                }
            `;
        } else {
            // --- SETTINGS FOR EDGE BROWSER ---
            style.innerHTML = `
                .player-timedtext-text-container {
                    transform: scale(${edgeSize}) !important;
                    transform-origin: bottom center !important;
                    bottom: ${edgeBottom} !important;
                }
                .player-timedtext-text-container span {
                    text-shadow: 2px 2px 4px rgba(0,0,0,0.8) !important;
                }
            `;
        }
    });
};

// Initial execution
applyConditionalFix();

// Set interval and store its ID to allow stopping it if the extension reloads
fixInterval = setInterval(applyConditionalFix, 2500);