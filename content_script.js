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