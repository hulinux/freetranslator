// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks

import { bexContent } from 'quasar/wrappers';
// import { loadPyodide } from 'pyodide';

interface FrameSize {
  height: string;
  width: string;
}

let iFrame: HTMLIFrameElement;
let selectedText: string | undefined;
const startURL = 'www/index.html#/popup';

export default bexContent((bridge) => {
  bridge.on('set.iframe.window.size', ({ data, respond }) => {
    setFrameSize(iFrame, data);
    console.log('set.iframe.window.size occurred', data);
    respond();
  });

  bridge.on('close.iframe.window', () => {
    hideIFrame();
    bridge.send('translate.page.route.reset');
    // respond(data);
  });

  bridge.on('copy.result.to.clipboard', ({ data, respond }) => {
    navigator.clipboard.writeText(data.text).then(
      (data) => {
        //clipboard successfully set
        bridge.send('write.data.to.clipboard.successed', data);
        // respond(data);
      },
      (err) => {
        console.log(err);
        //clipboard write failed, use fallback
      }
    );
    respond();
  });

  window.addEventListener('mouseup', (event) => {
    //'selectionchange'
    const currentSelected = window.getSelection()?.toString();
    if (isSelectedNotChange(selectedText, currentSelected)) {
      hideIFrame();
      bridge.send('translate.page.route.reset', event);
      selectedText = '';
      return false;
    } else {
      selectedText = currentSelected;
    }

    const { clientX, clientY } = event;
    const opts = {
      position: 'absolute',
      top: `${document.documentElement.scrollTop + clientY}px`,
      left: `${clientX + 10}px`,
      border: '0',
      zIndex: '9999999', // Make sure it's on top
      'border-radius': '4px',
      'box-shadow': 'grey 1px 1px 4px',
    };
    if (selectedText?.trim()) {
      Object.assign(iFrame.style, opts);
      bridge.send('pick.tab.page.selected.text', { source: selectedText });
      showIFrame();
      // console.log(selectedText, document.body);
    } else {
      hideIFrame();
      bridge.send('translate.page.route.reset', event);
    }
  });
});

const isSelectedNotChange = function (
  oldSelected: string | undefined,
  newSelected: string | undefined
): boolean {
  return oldSelected == newSelected;
};
const createiFrame = function (url: string) {
  if (!iFrame) {
    iFrame = document.createElement('iframe');
    iFrame.id = `bex-iframe-${Date.now()}`;
    iFrame.src = chrome.runtime.getURL(url);
    iFrame.hidden = true;
    iFrame.style.display = 'none';
    document.body.prepend(iFrame);
  }
};
const hideIFrame = () => {
  if (iFrame) {
    iFrame.hidden = true;
    Object.assign(iFrame.style, { display: 'none' });
  } else {
    createiFrame(startURL);
  }
};

const showIFrame = () => {
  if (iFrame) {
    iFrame.hidden = false;
    Object.assign(iFrame.style, { display: 'block' });
  } else {
    createiFrame(startURL);
  }
};
const setFrameSize = function (frame: HTMLIFrameElement, size: FrameSize) {
  frame.style.height =
    size.height || frame.contentWindow?.document.body.clientHeight + 'px';
  frame.style.width =
    size.width || frame.contentWindow?.document.body.clientWidth + 'px';
};

createiFrame(startURL);
/*
async function main() {
  const pyodide = await loadPyodide({
    indexURL:
      'chrome-extension://efhjomkfoienioiddbnmpfbajgajhkml/www/pyodide/', //'https://cdn.jsdelivr.net/npm/pyodide@0.21.3/',
  });
  await pyodide.loadPackage(
    'chrome-extension://efhjomkfoienioiddbnmpfbajgajhkml/www/micropip-0.1.0-py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'chrome-extension://efhjomkfoienioiddbnmpfbajgajhkml/www/pyparsing-3.0.9-py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'chrome-extension://efhjomkfoienioiddbnmpfbajgajhkml/www/packaging-21.3-py3-none-any.whl'
  );
  // await pyodide.loadPackage(
  //   'chrome-extension://efhjomkfoienioiddbnmpfbajgajhkml/www/lxml-4.9.1-cp310-cp310-macosx_12_0_x86_64.whl'
  // );
  await pyodide.loadPackage(
    'chrome-extension://efhjomkfoienioiddbnmpfbajgajhkml/www/PyExecJS-1.5.1-py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'chrome-extension://efhjomkfoienioiddbnmpfbajgajhkml/www/cryptography-38.0.3-pp39-pypy39_pp73-macosx_10_10_x86_64.whl'
  );
  await pyodide.loadPackage(
    'chrome-extension://efhjomkfoienioiddbnmpfbajgajhkml/www/six-1.16.0-py2.py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'chrome-extension://efhjomkfoienioiddbnmpfbajgajhkml/www/translators-5.4.8-py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'chrome-extension://efhjomkfoienioiddbnmpfbajgajhkml/www/requests-2.28.1-py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'chrome-extension://efhjomkfoienioiddbnmpfbajgajhkml/www/pyodide/certifi-2022.6.15-py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'chrome-extension://efhjomkfoienioiddbnmpfbajgajhkml/www/lxml-4.9.1-cp310-cp310-macosx_12_0_x86_64.whl'
  );
  await pyodide.loadPackage(
    'https://files.pythonhosted.org/packages/f4/ad/9a94f4a5faf4aa8098ac0efee65dd269a028c894f6e0277a6d81e61c8f74/PyExecJS2-1.6.1-py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'https://files.pythonhosted.org/packages/22/74/07679c5b9f98a7cb0fc147b1ef1cc1853bc07a4eb9cb5731e24732c5f773/asyncio-3.4.3-py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'https://files.pythonhosted.org/packages/d9/5a/e7c31adbe875f2abbb91bd84cf2dc52d792b5a01506781dbcf25c91daf11/six-1.16.0-py2.py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'https://files.pythonhosted.org/packages/ca/91/6d9b8ccacd0412c08820f72cebaa4f0c0441b5cda699c90f618b6f8a1b42/requests-2.28.1-py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'https://files.pythonhosted.org/packages/6f/de/5be2e3eed8426f871b170663333a0f627fc2924cc386cd41be065e7ea870/urllib3-1.26.12-py2.py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'https://files.pythonhosted.org/packages/ff/57/478cbcaf37e1b5f558014734da6921390ba40491d904006289ca49191861/charset_normalizer-3.0.0-py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'https://files.pythonhosted.org/packages/fc/34/3030de6f1370931b9dbb4dad48f6ab1015ab1d32447850b9fc94e60097be/idna-3.4-py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'https://files.pythonhosted.org/packages/1d/38/fa96a426e0c0e68aabc68e896584b83ad1eec779265a028e156ce509630e/certifi-2022.9.24-py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'https://files.pythonhosted.org/packages/9c/d8/909c4089dbe4ade9f9705f143c9f13f065049a9d5e7d34c828aefdd0a97c/beautifulsoup4-4.11.1-py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'https://files.pythonhosted.org/packages/16/e3/4ad79882b92617e3a4a0df1960d6bce08edfb637737ac5c3f3ba29022e25/soupsieve-2.3.2.post1-py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'https://files.pythonhosted.org/packages/06/a9/2da08717a6862c48f1d61ef957a7bba171e7eefa6c0aa0ceb96a140c2a6b/cssselect-1.2.0-py2.py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'https://files.pythonhosted.org/packages/6c/dd/a834df6482147d48e225a49515aabc28974ad5a4ca3215c18a882565b028/html5lib-1.1-py2.py3-none-any.whl'
  );
  await pyodide.loadPackage(
    'https://files.pythonhosted.org/packages/f4/24/2a3e3df732393fed8b3ebf2ec078f05546de641fe1b667ee316ec1dcf3b7/webencodings-0.5.1-py2.py3-none-any.whl'
  );
  await pyodide.runPythonAsync(`
  import micropip
  await micropip.install(['translators','urllib3','requests'])
  `);

  pyodide.runPython(`
  from translators import *
  trans = alibaba("Hello, world!","zh-CN")
  `);
  console.log(
    pyodide.runPython("print('Hello, world from the browser!')"),
    pyodide.runPython(`
    import sys
    sys.version
`),
    pyodide.globals.get('trans').toJs()
  );

  const python_code = `
  import numpy as np
  np.ones((3,3))
  `;
  (async () => {
    // enable await
    await pyodide.loadPackagesFromImports(python_code);
    const result = await pyodide.runPythonAsync(python_code);
    console.log(result.toJs());
  })();
}
main();
*/
