/* global browser */

const manifest = browser.runtime.getManifest();
const extname = manifest.name;

async function onBAClicked(tab) {

    const origin = (() => {
            try {
                const url = new URL(tab.url);
                if( typeof url.origin === 'string' &&
                    url.origin !== 'null'
                ){
                    return url.origin;
                }
            }catch(e){
                console.error(e);
            }
            return null;
    })();

    if(origin === null){
        return;
    }

    const tabIdxs = [];

    tabIdxs.push(tab.index); // front

    (await browser.tabs.query({
        url: origin + "/*",
        hidden: false,
        currentWindow: true
    })).map( t => {
        if(t.index !== tab.index){
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

