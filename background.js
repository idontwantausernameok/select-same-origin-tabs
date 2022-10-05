/* global browser */

const manifest = browser.runtime.getManifest();
const extname = manifest.name;

async function onBAClicked(tab) {

    const url = new URL(tab.url);
    const tabIdxs = [];

    tabIdxs.push(tab.index);

    (await browser.tabs.query({
        highlighted: true,
        currentWindow: true
    })).map( t => {
        if(!tabIdxs.includes(t.index)){
            tabIdxs.push(t.index)
        }
    });

    (await browser.tabs.query({
        url: url.origin + "/*",
        hidden: false,
        currentWindow: true
    })).map( t => {
        if(!tabIdxs.includes(t.index)){
            tabIdxs.push(t.index)
        }
    });

    browser.tabs.highlight({
        windowId: tab.windowId,
        tabs: tabIdxs,
        populate: false
    });
}

browser.menus.create({
    title: extname,
	contexts: ["tab"],
	onclick: (info, tab) => {
        onBAClicked(tab);
    }
});

browser.browserAction.onClicked.addListener(onBAClicked);

