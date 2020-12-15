(() => {
    "use strict";

    const prevRedirections = {};

    chrome.webRequest.onBeforeRequest.addListener(
        (details) => {
            const {tabId, method, url, timeStamp} = details;

            const prev = prevRedirections[tabId] || {};
            delete prevRedirections[tabId];

            if (method !== "GET") {
                return {};
            }
            if (url === prev.url && timeStamp - prev.timeStamp < 4000) {
                // A redirect loop occurs (same redirect occurs within 4000 milliseconds)
                return {};
            }

            prevRedirections[tabId] = {url, timeStamp};
            return {redirectUrl: url.replace(/\.s\./, ".")};
        },
        {urls: ["<all_urls>"], types: ["main_frame"]},
        ["blocking"]
    );
})();
