import { useState } from "react";

// 普通函数：返回一段文字，不负责生成自己的页面区域。
function buildGreeting(name: string) {
  return name.trim() ? "你好，" + name + "！" : "先在左边输入姓名。";
}

type NameEditorProps = {
  name: string;
  onNameChange: (nextName: string) => void;
};

// React 组件：由父组件以 <NameEditor /> 使用，返回 JSX。
function NameEditor({ name, onNameChange }: NameEditorProps) {
  return (
    <section className="component-lab-child component-lab-input">
      <div className="component-lab-child-heading">
        <span className="component-lab-badge">React 子组件 A</span>
        <code>&lt;NameEditor /&gt;</code>
      </div>
      <label htmlFor="component-lab-name">输入姓名</label>
      <input
        id="component-lab-name"
        value={name}
        onChange={(event) => onNameChange(event.target.value)}
        placeholder="例如：小林"
      />
      <div className="component-lab-trace">
        <strong>子组件 A：源码与此刻的值</strong>
        <p>左边是不会被输入改写的源码；右边是这次运行时读到的值。</p>
        <div className="component-lab-trace-row">
          <code>function NameEditor({"{"} name, onNameChange {"}"}: NameEditorProps)</code>
          <output>收到的 name = {JSON.stringify(name)}</output>
        </div>
        <div className="component-lab-trace-row">
          <code>value={"{"}name{"}"}</code>
          <output>输入框显示 {JSON.stringify(name)}</output>
        </div>
        <div className="component-lab-trace-row">
          <code>onChange=&#123;(event) =&gt; onNameChange(event.target.value)&#125;</code>
          <output>输入时把新文字报告给父组件；onNameChange 指向 setName 函数</output>
        </div>
      </div>
      <p>内部有 <code>&lt;section&gt;</code>、<code>&lt;label&gt;</code> 和 <code>&lt;input&gt;</code>；它们是 DOM 元素，不是三个 React 组件。</p>
    </section>
  );
}

type GreetingViewProps = {
  name: string;
};

// React 组件：没有自己的 State，也没有点击事件，仍然是组件。
function GreetingView({ name }: GreetingViewProps) {
  const greeting = buildGreeting(name);
  return (
    <section className="component-lab-child component-lab-output">
      <div className="component-lab-child-heading">
        <span className="component-lab-badge">React 子组件 B</span>
        <code>&lt;GreetingView /&gt;</code>
      </div>
      <span className="component-lab-small-label">从父组件收到 name，交给普通函数处理</span>
      <p className="component-lab-greeting">{greeting}</p>
      <div className="component-lab-trace">
        <strong>子组件 B：源码与此刻的值</strong>
        <p>B 没有自己保存第二份姓名；它读取父组件传来的 prop。</p>
        <div className="component-lab-trace-row">
          <code>function GreetingView({"{"} name {"}"}: GreetingViewProps)</code>
          <output>收到的 name = {JSON.stringify(name)}</output>
        </div>
        <div className="component-lab-trace-row">
          <code>const greeting = buildGreeting(name)</code>
          <output>计算得到 {JSON.stringify(greeting)}</output>
        </div>
        <div className="component-lab-trace-row">
          <code>&lt;p&gt;{"{"}greeting{"}"}&lt;/p&gt;</code>
          <output>页面文字 {JSON.stringify(greeting)}</output>
        </div>
      </div>
      <p>这段文字会变化，但 <code>GreetingView</code> 不是因为“会变化”才成为组件。</p>
    </section>
  );
}

// React 组件：没有 State、props、事件或响应数据，仍然是组件。
function StaticNote() {
  return (
    <section className="component-lab-child component-lab-static">
      <div className="component-lab-child-heading">
        <span className="component-lab-badge">React 子组件 C</span>
        <code>&lt;StaticNote /&gt;</code>
      </div>
      <p className="component-lab-greeting">我是一张不会变化的说明卡。</p>
      <p>没有交互、没有响应数据，依然是组件。</p>
    </section>
  );
}

// React 组件：可以拥有自己的 State，也可以定义事件处理函数。
function ClickCounter() {
  const [count, setCount] = useState(0);

  function increase() {
    setCount((previousCount) => previousCount + 1);
  }

  return (
    <section className="component-lab-child component-lab-counter">
      <div className="component-lab-child-heading">
        <span className="component-lab-badge">React 子组件 D</span>
        <code>&lt;ClickCounter /&gt;</code>
      </div>
      <p className="component-lab-greeting">已点击 {count} 次</p>
      <button type="button" onClick={increase}>点我增加计数</button>
      <p><code>increase</code> 是组件内部的普通函数；它本身不是组件。</p>
    </section>
  );
}

// 顶层 React 组件：保存姓名，组合四个子组件。
export default function ComponentLab() {
  const [name, setName] = useState("小林");

  return (
    <main className="component-lab">
      <header className="component-lab-header">
        <a href="/">← 返回 HTTP 实验</a>
        <p className="component-lab-eyebrow">L12 · REACT COMPONENT LAB</p>
        <h1>一个组件，还是一个 div？</h1>
        <p>先看彩色边框标出的 React 组件，再看每个组件里面的小写 HTML 标签。输入姓名和点击按钮，比较谁在变化。</p>
      </header>

      <section className="component-lab-parent" aria-labelledby="component-lab-parent-title">
        <div className="component-lab-parent-heading">
          <span className="component-lab-badge">React 父组件</span>
          <h2 id="component-lab-parent-title"><code>&lt;ComponentLab /&gt;</code> 组合下面四个子组件</h2>
          <p>父组件只保存一份当前姓名：<code>name = {JSON.stringify(name)}</code>。A 报告输入变化，B 收到更新后的姓名；C 和 D 不依赖这份姓名。</p>
          <div className="component-lab-trace component-lab-parent-trace">
            <strong>父组件：源码与此刻的值</strong>
            <div className="component-lab-trace-row">
              <code>const [name, setName] = useState("小林")</code>
              <output>"小林" 是初始值；此刻 name = {JSON.stringify(name)}</output>
            </div>
            <div className="component-lab-trace-row">
              <code>&lt;NameEditor name={"{"}name{"}"} onNameChange={"{"}setName{"}"} /&gt;</code>
              <output>传给 A：name = {JSON.stringify(name)}；函数 = setName</output>
            </div>
            <div className="component-lab-trace-row">
              <code>&lt;GreetingView name={"{"}name{"}"} /&gt;</code>
              <output>传给 B：name = {JSON.stringify(name)}</output>
            </div>
          </div>
        </div>

        <div className="component-lab-flow" aria-label="姓名数据流">
          <span>A 输入</span><b>→ 回调 onNameChange →</b><span>父组件 name</span><b>→ prop name →</b><span>B 显示</span>
        </div>

        <div className="component-lab-children">
          <NameEditor name={name} onNameChange={setName} />
          <GreetingView name={name} />
          <StaticNote />
          <ClickCounter />
        </div>
      </section>

      <section className="component-lab-explanation" aria-labelledby="component-lab-code-title">
        <h2 id="component-lab-code-title">三种“看起来像代码块的东西”，身份不同</h2>
        <div className="component-lab-definitions">
          <article>
            <span className="component-lab-type">① React 组件</span>
            <pre>{`function GreetingView({ name }) {
  return <section>{buildGreeting(name)}</section>;
}

<GreetingView name={name} />`}</pre>
            <p>由 React 以大写的 <code>&lt;GreetingView /&gt;</code> 使用；返回描述界面的 JSX。没有事件或自己的 State 也可以是组件。</p>
          </article>
          <article>
            <span className="component-lab-type">② 普通函数</span>
            <pre>{`function buildGreeting(name) {
  return name.trim()
    ? "你好，" + name + "！"
    : "先在左边输入姓名。";
}`}</pre>
            <p>被普通函数调用，返回文字。上面 D 中的 <code>increase</code> 负责点击行为；它同样不是组件。</p>
          </article>
          <article>
            <span className="component-lab-type">③ DOM 元素</span>
            <pre>{`<section>
  <p>你好，小林！</p>
</section>`}</pre>
            <p><code>&lt;section&gt;</code>、<code>&lt;p&gt;</code>、<code>&lt;div&gt;</code> 是组件返回的页面元素。在 Elements 面板中看到它们，不等于那里各有一个 React 组件。</p>
          </article>
        </div>
      </section>

      <section className="component-lab-inspect" aria-labelledby="component-lab-inspect-title">
        <h2 id="component-lab-inspect-title">自己验证</h2>
        <ol>
          <li>在 A 改姓名：B 的文字和父组件的 <code>name</code> 会变化；D 的计数不会归零。</li>
          <li>点击 D：只有 D 的计数变化；C 没有任何交互，但仍是组件。</li>
          <li>在浏览器 Elements 中选中 A 的 <code>&lt;input&gt;</code>：那里显示的是 DOM。再到 Sources 查看 <code>ComponentLab.tsx</code> 中的 <code>function NameEditor</code> 和 <code>&lt;NameEditor /&gt;</code>，辨认组件定义和使用位置。</li>
        </ol>
        <p>对照现有 HTTP 页：<code>App</code> 是 React 组件，<code>sendName</code> 是其中的事件处理函数；目前表单和结果框都还只是 <code>App</code> 返回的 DOM 区域。</p>
      </section>
    </main>
  );
}
