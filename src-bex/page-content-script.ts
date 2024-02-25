// Hooks added here have a bridge allowing communication between the BEX Content Script and the Quasar Application.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/content-hooks

import { bexContent } from 'quasar/wrappers';
// import { loadPyodide } from 'pyodide';
import {
  UUID,
  START_URL,
  EVENT_SET_SIZE,
  EVENT_CLOSE_WINDOW,
  EVENT_ROUTE_RESET,
  EVENT_SELECTED_TEXT,
  EVENT_WRITE_CLIPBOARD_SUCCESSED,
  EVENT_COPY_TO_CLIPBOARD,
} from '../src/services/constants';

interface FrameSize {
  height: string;
  width: string;
}

let iFrame: HTMLIFrameElement;
let selectedText: string | undefined;

const isSelectedNotChange = function (
  oldSelected: string | undefined,
  newSelected: string | undefined
): boolean {
  return oldSelected?.trim() == newSelected?.trim();
};
const createiFrame = function (url: string) {
  if (!iFrame) {
    iFrame = document.createElement('iframe');
    iFrame.id = UUID;
    iFrame.src = chrome.runtime.getURL(url);
    iFrame.hidden = true;
    iFrame.style.display = 'none';
    document.body.prepend(iFrame);
  }
};
const hideIFrame = () => {
  if (iFrame) {
    iFrame.hidden = true;
  } else {
    createiFrame(START_URL);
  }
  Object.assign(iFrame.style, { display: 'none' });
};

const showIFrame = () => {
  if (iFrame) {
    iFrame.hidden = false;
  } else {
    createiFrame(START_URL);
  }
  Object.assign(iFrame.style, { display: 'block' });
};
const setFrameSize = function (frame: HTMLIFrameElement, size: FrameSize) {
  frame.style.height =
    size.height || frame.contentWindow?.document.body.clientHeight + 'px';
  frame.style.width =
    size.width || frame.contentWindow?.document.body.clientWidth + 'px';
};

createiFrame(START_URL);

export default bexContent((bridge) => {
  bridge.on(EVENT_SET_SIZE, ({ data, respond }) => {
    setFrameSize(iFrame, data);
    // console.log(EVENT_SET_SIZE, data);
    respond();
  });

  bridge.on(EVENT_CLOSE_WINDOW, async ({ respond }) => {
    hideIFrame();
    await bridge.send(EVENT_ROUTE_RESET);
    respond();
  });

  bridge.on(EVENT_COPY_TO_CLIPBOARD, ({ data, respond }) => {
    navigator.clipboard.writeText(data?.translated).then(
      async (data) => {
        //clipboard successfully set
        await bridge.send(EVENT_WRITE_CLIPBOARD_SUCCESSED, data);
      },
      (err) => {
        console.log(err);
        //clipboard write failed, use fallback
      }
    );
    respond(data);
  });

  window.addEventListener('mouseup', async (event) => {
    //'selectionchange'
    const currentSelected = window.getSelection()?.toString();
    if (
      isSelectedNotChange(selectedText, currentSelected) ||
      currentSelected?.trim() == '' ||
      selectedText?.trim() == ''
    ) {
      hideIFrame();
      await bridge.send(EVENT_ROUTE_RESET, event);
      // selectedText = '';
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
    if (selectedText) {
      Object.assign(iFrame.style, opts);
      // console.log(`${EVENT_SELECTED_TEXT}`);
      await bridge.send(EVENT_SELECTED_TEXT, {
        source: selectedText,
      });
      showIFrame();
      // console.log(selectedText, document.body);
    } else {
      hideIFrame();
      await bridge.send(EVENT_ROUTE_RESET, event);
    }
  });
});
