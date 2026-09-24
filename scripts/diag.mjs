import fs from "fs";

const list = await fetch("http://127.0.0.1:9223/json/list").then((r) => r.json());
const page = list.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  } else if (msg.method === "Runtime.exceptionThrown" || msg.method === "Runtime.consoleAPICalled") {
    console.log("EVT", msg.method, JSON.stringify(msg.params).slice(0, 800));
  }
});
await new Promise((res) => ws.addEventListener("open", res));
function send(method, params = {}) {
  const msgId = ++id;
  return new Promise((resolve, reject) => {
    pending.set(msgId, (msg) => (msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result)));
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}
await send("Runtime.enable");
await send("Page.enable");
await send("Page.reload");
await new Promise((r) => setTimeout(r, 4000));
const state = await send("Runtime.evaluate", {
  expression: `({
    cls: document.documentElement.className,
    loader: getComputedStyle(document.getElementById('site-loader')).opacity + ' ' + getComputedStyle(document.getElementById('site-loader')).visibility,
    portal: document.querySelector('nextjs-portal')?.shadowRoot?.textContent?.slice(0, 500) || document.querySelector('nextjs-portal')?.textContent?.slice(0, 300) || 'no portal text',
    flag: sessionStorage.getItem('neuroad-loader')
  })`,
  returnByValue: true,
});
console.log(JSON.stringify(state.result.value, null, 2));
ws.close();
