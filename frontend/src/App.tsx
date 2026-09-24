import { FormEvent, useState } from "react";

const API_URL = "http://localhost:3000/api/hello";

type RequestPayload = {
  name: string;
};

type ResponseData = {
  message?: string;
  receivedName?: string;
  error?: string;
  received?: unknown;
};

type RequestStatus = "idle" | "loading" | "success" | "error";

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<RequestStatus>("idle");
  const [requestPayload, setRequestPayload] = useState<RequestPayload | null>(null);
  const [responseData, setResponseData] = useState<ResponseData | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  async function sendName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!name.trim()) {
      console.log("[前端校验] 阻止请求：姓名不能为空");
      setRequestPayload(null);
      setResponseData(null);
      setResponseStatus(null);
      setStatus("error");
      setMessage("前端校验：姓名不能为空");
      return;
    }

    const payload = { name };
    console.log("[前端 2] 准备发送 Request：", {
      method: "POST",
      url: API_URL,
      payload
    });

    setRequestPayload(payload);
    setResponseData(null);
    setResponseStatus(null);
    setMessage("");
    setStatus("loading");

    let response: Response;
    try {
      response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      console.log("[前端 3] 收到 HTTP Response：", {
        status: response.status,
        ok: response.ok
      });

      setResponseStatus(response.status);

      let data: ResponseData;
      try {
        data = await response.json();
      } catch (error) {
        setStatus("error");
        console.error("[前端错误] 已收到 HTTP Response，但 JSON 解析失败：", error);
        const contentType = response.headers.get("content-type") ?? "未知";
        setMessage(
          `已收到 HTTP ${response.status} 响应，但响应体无法解析为 JSON（Content-Type: ${contentType}）。`
        );
        setResponseData({
          error: error instanceof Error ? error.message : "Invalid JSON response"
        });
        return;
      }

      console.log("[前端 4] 解析后的 Response Body：", data);
      setResponseData(data);

      if (!response.ok) {
        setStatus("error");
        console.log("[前端 5] 根据错误响应更新页面：", data.error ?? "请求失败");
        setMessage(data.error ?? "请求失败");
        return;
      }

      setStatus("success");
      console.log("[前端 5] 根据成功响应更新页面：", data.message);
      setMessage(data.message ?? "后端没有返回 message");
    } catch (error) {
      setStatus("error");
      console.error("[前端错误] 没有收到 HTTP Response，fetch 请求失败：", error);
      setMessage("请求失败：没有收到 HTTP 响应，请检查接口地址、端口或请求配置。");
      setResponseData({
        error: error instanceof Error ? error.message : "Unknown network error"
      });
    }
  }

  const isLoading = status === "loading";

  return (
    <main className="page-shell">
      <section className="hero">
        <p className="eyebrow">STAGE 1 · DATA FLOW LAB</p>
        <h1>HTTP 数据流实验</h1>
        <p className="hero-copy">
          输入一个名字，观察它如何从浏览器进入后端，又如何变成页面上的结果。
        </p>
      </section>

      <section className="flow-strip" aria-label="数据流步骤">
        <span>用户输入</span>
        <b>→</b>
        <span>React state</span>
        <b>→</b>
        <span>POST Request</span>
        <b>→</b>
        <span>Express</span>
        <b>→</b>
        <span>JSON Response</span>
        <b>→</b>
        <span>页面更新</span>
      </section>

      <section className="workspace-grid">
        <div className="panel form-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">01 · FRONTEND</p>
              <h2>把数据发送给后端</h2>
            </div>
            <span className={`status-dot ${status}`} aria-label={`请求状态：${status}`} />
          </div>

          <form onSubmit={sendName}>
            <label htmlFor="name">姓名</label>
            <input
              id="name"
              value={name}
              onChange={(event) => {
                const nextName = event.target.value;
                console.log("[前端 1] 输入框内容变化：", nextName);
                setName(nextName);
              }}
              placeholder="例如：张三"
            />
            <button type="submit" disabled={isLoading}>
              {isLoading ? "发送中…" : "发送给后端"}
            </button>
          </form>

          <div className={`result ${status}`} aria-live="polite">
            <span className="result-label">页面当前结果</span>
            <strong>{message || "等待后端返回…"}</strong>
          </div>
        </div>

        <div className="panel inspect-panel">
          <div className="panel-heading">
            <div>
              <p className="panel-kicker">02 · INSPECT</p>
              <h2>观察 Request / Response</h2>
            </div>
          </div>

          <div className="code-block">
            <div className="code-heading">
              <span>Request Payload</span>
              <code>POST /api/hello</code>
            </div>
            <pre>
              {requestPayload ? JSON.stringify(requestPayload, null, 2) : "尚未发送请求"}
            </pre>
          </div>

          <div className="code-block">
            <div className="code-heading">
              <span>Response</span>
              {responseStatus !== null && <code>HTTP {responseStatus}</code>}
            </div>
            <pre>
              {responseData ? JSON.stringify(responseData, null, 2) : "尚未收到响应"}
            </pre>
          </div>
        </div>
      </section>

      <section className="tip-card">
        <p className="panel-kicker">03 · YOUR OBSERVATION</p>
        <p>
          打开浏览器开发者工具 → <strong>Network</strong> → 找到 <code>hello</code> 请求，
          对照这里的 Request Payload 和 Response。后端终端还会打印它收到的
          <code> req.body</code>。
        </p>
      </section>
    </main>
  );
}

export default App;
