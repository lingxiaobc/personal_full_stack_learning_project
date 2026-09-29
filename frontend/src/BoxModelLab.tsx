import { useLayoutEffect, useRef, useState } from "react";
import NestedBoxLab from "./NestedBoxLab";

type Layer = "margin" | "border" | "padding";

const CONTENT_WIDTH = 220;

const layerDetails: Record<Layer, { title: string; description: string }> = {
  margin: {
    title: "外边距 margin",
    description: "盒子外面的透明距离。增加它，盒子会离周围的元素更远；橙色是周围容器透出来的颜色。"
  },
  border: {
    title: "边框 border",
    description: "紧贴盒子内边距外侧的线。增加它，绿色边框会变厚，盒子占的空间也会变大。"
  },
  padding: {
    title: "内边距 padding",
    description: "内容与边框之间的空间。增加它，文字所在的黄色区域会离绿色边框更远。"
  }
};

function Control({
  layer,
  value,
  onChange,
  onFocus
}: {
  layer: Layer;
  value: number;
  onChange: (value: number) => void;
  onFocus: () => void;
}) {
  return (
    <label className={`box-lab-control box-lab-control-${layer}`}>
      <span>{layerDetails[layer].title}</span>
      <input
        type="range"
        min="0"
        max="48"
        step="4"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        onFocus={onFocus}
        aria-label={`${layerDetails[layer].title}，当前 ${value} 像素`}
      />
      <output>{value}px</output>
    </label>
  );
}

function MarginCollapseDemo() {
  const [bottomMargin, setBottomMargin] = useState(40);
  const [topMargin, setTopMargin] = useState(24);
  const [layout, setLayout] = useState<"block" | "flex">("block");
  const [measuredGap, setMeasuredGap] = useState(0);
  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (firstRef.current && secondRef.current) {
      const firstBottom = firstRef.current.getBoundingClientRect().bottom;
      const secondTop = secondRef.current.getBoundingClientRect().top;
      setMeasuredGap(Math.round(secondTop - firstBottom));
    }
  }, [bottomMargin, topMargin, layout]);

  const expectedGap = layout === "block"
    ? Math.max(bottomMargin, topMargin)
    : bottomMargin + topMargin;

  return (
    <section className="box-lab-card box-lab-collapse" aria-labelledby="box-lab-collapse-title">
      <h2 id="box-lab-collapse-title">两个相邻 margin 会怎样？</h2>
      <p>下面是两个同级盒子。A 有下外边距，B 有上外边距。两条 CSS 声明都会保留，但它们之间的实际距离取决于布局方式。</p>

      <div className="box-lab-layout-choice" role="group" aria-label="选择布局方式">
        <button type="button" aria-pressed={layout === "block"} onClick={() => setLayout("block")}>普通块布局：外边距可能折叠</button>
        <button type="button" aria-pressed={layout === "flex"} onClick={() => setLayout("flex")}>Flex 纵向布局：外边距相加</button>
      </div>

      <div className="box-lab-collapse-layout">
        <div className={`box-lab-collapse-stage ${layout === "flex" ? "is-flex" : ""}`}>
          <div ref={firstRef} className="box-lab-collapse-first" style={{ marginBottom: bottomMargin }}>盒子 A · 下外边距 {bottomMargin}px</div>
          <div ref={secondRef} className="box-lab-collapse-second" style={{ marginTop: topMargin }}>盒子 B · 上外边距 {topMargin}px</div>
        </div>
        <div className="box-lab-collapse-controls">
          <label>
            A 的下外边距 <output>{bottomMargin}px</output>
            <input type="range" min="0" max="64" step="4" value={bottomMargin} onChange={(event) => setBottomMargin(Number(event.target.value))} />
          </label>
          <label>
            B 的上外边距 <output>{topMargin}px</output>
            <input type="range" min="0" max="64" step="4" value={topMargin} onChange={(event) => setTopMargin(Number(event.target.value))} />
          </label>
          <div className="box-lab-collapse-result" aria-live="polite">
            <span>两个盒子之间实测距离</span>
            <strong>{measuredGap}px</strong>
            <small>{layout === "block" ? `普通块布局：取较大的值 max(${bottomMargin}, ${topMargin}) = ${expectedGap}` : `Flex 布局：${bottomMargin} + ${topMargin} = ${expectedGap}`}</small>
          </div>
        </div>
      </div>
      <p className="box-lab-collapse-footnote">这里演示的是两个同级块元素相邻的<strong>竖直正外边距</strong>。水平方向不会这样折叠；Flex 和 Grid 项目之间也不会发生这种折叠。</p>
    </section>
  );
}

export default function BoxModelLab() {
  const [margin, setMargin] = useState(24);
  const [border, setBorder] = useState(12);
  const [padding, setPadding] = useState(24);
  const [focus, setFocus] = useState<Layer>("padding");
  const [stripedBackground, setStripedBackground] = useState(true);

  const total = CONTENT_WIDTH + 2 * (padding + border + margin);

  return (
    <main className="box-lab">
      <header className="box-lab-header">
        <a href="/">← 返回 HTTP 实验</a>
        <p className="box-lab-eyebrow">L11 · HTML / CSS / 浏览器呈现</p>
        <h1>把盒模型“拆开”看</h1>
        <p>一次只拖动一个滑块，观察彩色区域、盒子的总宽度和下方元素的位置。</p>
      </header>

      <NestedBoxLab />

      <div className="box-lab-layout">
        <section className="box-lab-card box-lab-demo" aria-labelledby="box-lab-demo-title">
          <h2 id="box-lab-demo-title">真实元素的四层空间</h2>
          <p className="box-lab-hint">这不是一张示意图。彩色方框就是一个真正的网页元素，可以在 Elements 中选中。</p>

          <div className="box-lab-viewport">
            <div className={`box-lab-surroundings ${stripedBackground ? "" : "box-lab-surroundings-plain"}`}>
              <div className="box-lab-sample" style={{ margin, borderWidth: border, padding }}>
                这里是内容区域：文字在里面
              </div>
            </div>
            <div className="box-lab-neighbor">我是下面的相邻元素。外边距增大时，我会向下移动。</div>
          </div>

          <button className="box-lab-background-toggle" type="button" aria-pressed={!stripedBackground} onClick={() => setStripedBackground((value) => !value)}>
            切换父容器背景：{stripedBackground ? "橙色条纹" : "深蓝纯色"}
          </button>
          <p className="box-lab-background-note">切换后 margin 仍是 {margin}px；变化的是透过透明 margin 看到的父容器背景。</p>

          <div className="box-lab-legend" aria-label="颜色说明">
            <span><i className={`box-lab-key ${stripedBackground ? "box-lab-key-margin" : "box-lab-key-margin-plain"}`} />{stripedBackground ? "橙色条纹" : "深蓝纯色"}：父容器背景（从透明 margin 处透出）</span>
            <span><i className="box-lab-key box-lab-key-border" />绿色：border</span>
            <span><i className="box-lab-key box-lab-key-padding" />紫色：padding</span>
            <span><i className="box-lab-key box-lab-key-content" />黄色：content</span>
          </div>
        </section>

        <section className="box-lab-card box-lab-controls" aria-labelledby="box-lab-controls-title">
          <h2 id="box-lab-controls-title">亲手改变一层</h2>
          <p className="box-lab-hint">内容宽度固定为 {CONTENT_WIDTH}px；每个滑块同时改变左、右两侧。</p>
          <div>
            <Control layer="margin" value={margin} onChange={setMargin} onFocus={() => setFocus("margin")} />
            <Control layer="border" value={border} onChange={setBorder} onFocus={() => setFocus("border")} />
            <Control layer="padding" value={padding} onChange={setPadding} onFocus={() => setFocus("padding")} />
          </div>
          <div className="box-lab-explanation" aria-live="polite">
            <strong>{layerDetails[focus].title}</strong>
            <p>{layerDetails[focus].description}</p>
          </div>
          <div className="box-lab-math">
            <span>横向总占用</span>
            <strong>{total}px</strong>
            <small>{CONTENT_WIDTH} 内容 + 2 × {padding} 内边距 + 2 × {border} 边框 + 2 × {margin} 外边距</small>
          </div>
          <button className="box-lab-reset" type="button" onClick={() => { setMargin(24); setBorder(12); setPadding(24); setFocus("padding"); }}>
            恢复初始数值
          </button>
        </section>
      </div>

      <MarginCollapseDemo />

      <section className="box-lab-card box-lab-note">
        <h2>在 Elements 中对照</h2>
        <p>选中 <code>div.box-lab-sample</code>，看右侧盒模型中的 margin、border、padding 和中央的 content。黄色区域只是这个元素的内容区域着色；文字是它的内容。选中相邻元素后，右侧会切换成相邻元素自己的盒模型。</p>
        <p>观察顺序：先把 padding 从 24 调到 0，再把 border 调到 0，最后改变 margin。每次只动一个滑块，更容易看清它负责哪一段空间。</p>
      </section>
    </main>
  );
}
