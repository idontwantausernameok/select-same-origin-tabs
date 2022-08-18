/* global browser */

const manifest = browser.runtime.getManifest();
const extname = manifest.name;

browser.menus.create({
	id: extname,
	title: extname,
	contexts: ["tab"],
	onclick: async (info, tab) => {

        const url = new URL(tab.url);

        const tabIdxs = (await browser.tabs.query({
            url: url.origin + "/*",
            hidden: false,
            currentWindow: true
        })).map( t => t.index );

        browser.tabs.highlight({
            windowId: tab.windowId,
            tabs: tabIdxs,
            populate: false
        });
    }
});

