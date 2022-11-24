// Hooks added here have a bridge allowing communication between the Web Page and the BEX Content Script.
// More info: https://quasar.dev/quasar-cli/developing-browser-extensions/dom-hooks
import { bexDom } from 'quasar/wrappers';

const ACTION_SUCCESSFUL = 'action.was.successful';
export default bexDom(async (bridge) => {
  await bridge.send('show.translate.result', {
    // selector: '.color-fg-muted',
    worked: true,
  });
  //此注入辅助脚本的功能是在网页中注入脚本，注入后在网页中的脚本能出发（send）事件，并不能监听事件（on）
  bridge.on(ACTION_SUCCESSFUL, ({ data, respond }) => {
    console.log(ACTION_SUCCESSFUL, data);
    respond();
  });
});

export { ACTION_SUCCESSFUL };
