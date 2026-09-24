const list = await fetch("http://127.0.0.1:9224/json/list").then((r) => r.json());
const page = list.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const errors = [];
ws.addEventListener("message", (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    pending.get(msg.id)(msg);
    pending.delete(msg.id);
  } else if (msg.method === "Runtime.exceptionThrown") {
    const d = msg.params.exceptionDetails;
    errors.push({
      text: d.exception?.description || d.text,
      url: d.url,
      line: d.lineNumber,
      stack: d.stackTrace?.callFrames?.slice(0, 8),
    });
  }
});
await new Promise((res) => ws.addEventListener("open", res));
function send(method, params = {}) {
  const msgId = ++id;
  return new Promise((resolve, reject) => {
    pending.set(msgId, (msg) =>
      msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result),
    );
    ws.send(JSON.stringify({ id: msgId, method, params }));
  });
}
await send("Runtime.enable");
await send("Page.enable");
await send("Page.navigate", { url: "http://localhost:3000/" });
await new Promise((r) => setTimeout(r, 4000));
console.log(JSON.stringify(errors, null, 2));
ws.close();
