chrome.runtime.onInstalled.addListener((reason) => {
    chrome.tabs.query({ url: "*://*.netflix.com/" }).then(tabs => {
        for (tab of tabs) {
            chrome.tabs.reload(tab.id);
        }
    })
});
