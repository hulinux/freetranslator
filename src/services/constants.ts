//以唯一id来锚定
export const UUID = 'bex-iframe'; //-${Date.now()}
export const START_URL = `www/index.html#/popup?id=${UUID}`;

export const EVENT_SET_SIZE = `${UUID}.set.iframe.window.size`;
export const EVENT_CLOSE_WINDOW = `${UUID}.close.iframe.window`;
export const EVENT_ROUTE_RESET = `${UUID}.translate.page.route.reset`;
export const EVENT_SELECTED_TEXT = `${UUID}.pick.tab.page.selected.text`;
export const EVENT_WRITE_CLIPBOARD_SUCCESSED = `${UUID}.write.data.to.clipboard.successed`;
export const EVENT_COPY_TO_CLIPBOARD = `${UUID}.copy.result.to.clipboard`;
export const EVENT_STORAGE_SET = 'storage.set';
export const EVENT_STORAGE_GET = 'storage.get';
export const EVENT_STORAGE_REMOVE = 'storage.remove';
export const EVENT_MESSAGE_TO_LOG = 'log';
export const EVENT_GET_TIME = 'get.time';
export const EVENT_STORAGE_CLEAR = 'storage.clear';
