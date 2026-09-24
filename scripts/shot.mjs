import fs from "fs";
import path from "path";

const outDir = path.join(process.env.LOCALAPPDATA, "Temp", "neuroad-shots");
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const list = await fetch("http://127.0.0.1:9223/json/list").then((r) => r.json());
  let page = list.find((t) => t.type === "page");
  if (!page) {
    page = await fetch("http://127.0.0.1:9223/json/new?about:blank", {
      method: "PUT",
    }).then((r) => r.json());
  }
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 0;
  const pending = new Map();
  const events = [];
  ws.addEventListener("message", (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg);
      pending.delete(msg.id);
    } else if (msg.method) {
      events.push(msg);
    }
  });
  await new Promise((res, rej) => {
    ws.addEventListener("open", res);
    ws.addEventListener("error", rej);
  });

  function send(method, params = {}) {
    const msgId = ++id;
    return new Promise((resolve, reject) => {
      pending.set(msgId, (msg) => {
        if (msg.error) reject(new Error(JSON.stringify(msg.error)));
        else resolve(msg.result);
      });
      ws.send(JSON.stringify({ id: msgId, method, params }));
      setTimeout(() => reject(new Error("timeout " + method)), 20000);
    });
  }

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width: 1440,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  });
  await send("Page.navigate", { url: "http://127.0.0.1:3000/" });
  await new Promise((r) => setTimeout(r, 3500));
  const state = await send("Runtime.evaluate", {
    expression: `({
      title: document.title,
      h1: document.querySelector('h1')?.innerText || '',
      loaderClass: document.documentElement.className,
      overlay: !!document.querySelector('nextjs-portal'),
      bodyText: document.body.innerText.slice(0, 400)
    })`,
    returnByValue: true,
  });
  console.log(JSON.stringify(state.result.value, null, 2));
  const shot = await send("Page.captureScreenshot", { format: "png" });
  const file = path.join(outDir, "after-loader-1440.png");
  fs.writeFileSync(file, Buffer.from(shot.data, "base64"));
  console.log("wrote", file);

  await send("Runtime.evaluate", {
    expression: "document.querySelector('#how-it-works')?.scrollIntoView()",
  });
  await new Promise((r) => setTimeout(r, 400));
  const shot2 = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(
    path.join(outDir, "how-1440.png"),
    Buffer.from(shot2.data, "base64"),
  );

  await send("Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true,
  });
  await send("Runtime.evaluate", {
    expression: "window.scrollTo({top:0,left:0,behavior:'instant'})",
  });
  await new Promise((r) => setTimeout(r, 800));
  const shot3 = await send("Page.captureScreenshot", { format: "png" });
  fs.writeFileSync(
    path.join(outDir, "after-loader-390.png"),
    Buffer.from(shot3.data, "base64"),
  );
  ws.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
