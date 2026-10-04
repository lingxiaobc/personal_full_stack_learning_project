export default function GridTrackLab() {
  return (
    <main className="grid-lab">
      <header className="grid-lab-header">
        <a href="/">← 返回 HTTP 实验</a>
        <p className="grid-lab-eyebrow">L11 · CSS Grid 列宽对照</p>
        <h1>一条共享列，还是两条独立的列？</h1>
        <p>两个虚线框的可用宽度都是 420px。观察哪个面板被撑宽，再在 Elements 中选中它们的父容器。</p>
      </header>

      <div className="grid-lab-examples">
        <section className="grid-lab-card" aria-labelledby="grid-lab-shared-title">
          <h2 id="grid-lab-shared-title">A · 同一个 Grid 父容器</h2>
          <p>把最小宽度反过来设给 01：01 至少 520px，02 没有设置最小宽度。它们处在同一列的不同行。</p>
          <div className="grid-lab-scroll">
            <div className="grid-lab-frame grid-lab-shared">
              <div className="grid-lab-panel grid-lab-panel-first">01 · 最小宽度 520px</div>
              <div className="grid-lab-panel grid-lab-panel-second">02 · 没有最小宽度</div>
            </div>
          </div>
          <p className="grid-lab-caption">在 Elements 中比较两个面板的盒模型宽度：02 为什么也变宽？</p>
        </section>

        <section className="grid-lab-card" aria-labelledby="grid-lab-split-title">
          <h2 id="grid-lab-split-title">B · 各自一个 Grid 父容器</h2>
          <p>两个父容器都宽 420px；01 的列宽是 <code>1fr</code>，02 的列宽单独设为 520px。</p>
          <div className="grid-lab-scroll">
            <div className="grid-lab-frame grid-lab-split">
              <div className="grid-lab-row grid-lab-row-first">
                <div className="grid-lab-panel grid-lab-panel-first">01 · 自己的 1fr 列</div>
              </div>
              <div className="grid-lab-row grid-lab-row-second">
                <div className="grid-lab-panel grid-lab-panel-second">02 · 自己的 520px 列</div>
              </div>
            </div>
          </div>
          <p className="grid-lab-caption">两行看起来在一起，但不共享列轨道；分别选中两个 <code>grid-lab-row</code> 看规则。</p>
        </section>
      </div>

      <p className="grid-lab-footnote">虚线框标记父容器的 420px 边界。面板越过虚线是溢出，不代表父容器本身变成了 520px。窄屏时可在演示区域横向滚动观察右边缘。</p>
    </main>
  );
}
