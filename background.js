chrome.runtime.onInstalled.addListener((_reason) => {
  chrome.tabs.query({ url: "*://*.netflix.com/" }).then((tabs) => {
    for (const tab of tabs) {
      chrome.tabs.reload(tab.id);
    }
  });
});
