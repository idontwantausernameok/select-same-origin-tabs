/* global browser */

const manifest = browser.runtime.getManifest();
const extname = manifest.name;

browser.menus.create({
	id: extname,
	title: extname,
	contexts: ["tab"],
	onclick: async (info, tab) => {

        const url = new URL(tab.url);

        const tabs = await browser.tabs.query({
            url: url.origin + "/*",
            hidden: false
        });

        const winId2tabsIdx = new Map();

        tabs.forEach( (t) => {
            if(t.id !== tab.id) {
                if(!winId2tabsIdx.has(t.windowId)){
                    winId2tabsIdx.set(t.windowId, []);
                }
                winId2tabsIdx.get(t.windowId).push(t.index);

            }
        });

        winId2tabsIdx.forEach( (tabsIdx, winId /*,map*/) => {
            browser.tabs.highlight({
                windowId: winId,
                tabs: tabsIdx,
                populate: false
            });
        });
	}
});

