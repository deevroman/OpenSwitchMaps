import {isMatchingAMap} from './maps';

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    //https://github.com/tankaru/OpenSwitchMaps/issues/125
    // if url is not http, skip
    if (!tab.url.startsWith('http')) {
        if (chrome.pageAction) {
            chrome.pageAction.hide(tabId);
        } else {
            chrome.action.disable(tabId);
        }
        return;
    }

    if (isMatchingAMap(tab.url)) {
        if (chrome.pageAction) {
            chrome.pageAction.show(tabId);
        } else {
            chrome.action.enable(tabId);
        }
    } else {
        if (chrome.pageAction) {
            chrome.pageAction.hide(tabId);
        } else {
            chrome.action.disable(tabId);
        }
    }
});
