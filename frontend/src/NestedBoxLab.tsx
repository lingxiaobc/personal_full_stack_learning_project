import { useState } from "react";

type BoxValues = {
  margin: number;
  border: number;
  padding: number;
  width: number;
  height: number;
};

type BoxField = keyof BoxValues;

const initialParent: BoxValues = { margin: 16, border: 10, padding: 16, width: 260, height: 260 };
const initialChild: BoxValues = { margin: 12, border: 8, padding: 16, width: 120, height: 90 };

const fields: { key: BoxField; name: string; parentMin: number; parentMax: number; childMin: number; childMax: number; step: number }[] = [
  { key: "margin", name: "margin 外边距", parentMin: 0, parentMax: 40, childMin: 0, childMax: 32, step: 4 },
  { key: "border", name: "border 边框", parentMin: 0, parentMax: 24, childMin: 0, childMax: 16, step: 2 },
  { key: "padding", name: "padding 内边距", parentMin: 0, parentMax: 40, childMin: 0, childMax: 32, step: 4 },
  { key: "width", name: "content 内容宽", parentMin: 260, parentMax: 520, childMin: 100, childMax: 220, step: 20 },
  { key: "height", name: "content 内容高", parentMin: 240, parentMax: 420, childMin: 70, childMax: 150, step: 10 }
];

function BoxControls({
  title,
  kind,
  values,
  onChange
}: {
  title: string;
  kind: "parent" | "child";
  values: BoxValues;
  onChange: (field: BoxField, value: number) => void;
}) {
  const outerWidth = values.width + 2 * (values.padding + values.border + values.margin);

  return (
    <section className={`nested-controls nested-controls-${kind}`} aria-label={`${title}的盒模型控制`}>
      <h3>{title} <code>{kind === "parent" ? ".nested-parent" : ".nested-child"}</code></h3>
      {fields.map(({ key, name, parentMin, parentMax, childMin, childMax, step }) => (
        <label className="nested-slider" key={key}>
          <span>{name}</span>
          <output>{values[key]}px</output>
          <input
            type="range"
            min={kind === "parent" ? parentMin : childMin}
            max={kind === "parent" ? parentMax : childMax}
            step={step}
            value={values[key]}
            onChange={(event) => onChange(key, Number(event.target.value))}
            aria-label={`${title}的${name}`}
          />
        </label>
      ))}
      <p className="nested-size">{title}横向占用：<strong>{outerWidth}px</strong><small>内容 {values.width} + 两侧各 {values.padding} padding、{values.border} border、{values.margin} margin</small></p>
    </section>
  );
}

export default function NestedBoxLab() {
  const [parent, setParent] = useState(initialParent);
  const [child, setChild] = useState(initialChild);

  return (
    <section className="box-lab-card nested-lab" aria-labelledby="nested-lab-title">
      <div className="nested-intro">
        <p className="box-lab-eyebrow">先观察这里 · 父元素 + 子元素</p>
        <h2 id="nested-lab-title">两个元素，各有自己的盒模型</h2>
        <p>下面只有一层父元素包着一层子元素。父、子各有一组滑块；每次只动一个，对照颜色和尺寸变化。</p>
        <code className="nested-dom">{"<div class=\"nested-parent\">\n  <div class=\"nested-child\">文字</div>\n</div>"}</code>
      </div>

      <div className="nested-preview-scroll">
        <div className="nested-stage">
          <div className="nested-parent" style={{ margin: parent.margin, borderWidth: parent.border, padding: parent.padding, width: parent.width, height: parent.height }}>
            <div className="nested-child" style={{ margin: child.margin, borderWidth: child.border, padding: child.padding, width: child.width, height: child.height, outlineOffset: child.margin }}>
              子元素的内容：文字
            </div>
          </div>
        </div>
      </div>
      <p className="nested-scroll-tip">窄屏时可横向滚动上面的观察区；显示的 px 数值不变。</p>
      <p className="nested-inspector-tip">在 Elements 中先选 <code>div.nested-parent</code>：右侧盒模型显示父元素的数值。再选它里面的 <code>div.nested-child</code>：右侧就切换为子元素的数值。橙色舞台是另一个元素的背景。</p>

      <div className="nested-legend">
        <div><strong>父元素 .nested-parent</strong><span><i className="nested-key nested-key-parent-margin" />橙条纹：透明 margin 处透出的舞台背景</span><span><i className="nested-key nested-key-parent-border" />粉色：父 border</span><span><i className="nested-key nested-key-parent-padding" />蓝色：父 padding</span><span><i className="nested-key nested-key-parent-content" />青绿：父 content；子元素在这片区域中</span></div>
        <div><strong>子元素 .nested-child</strong><span><i className="nested-key nested-key-child-margin" />青绿：透明 margin 处透出的父 content 背景；白虚线标出外缘</span><span><i className="nested-key nested-key-child-border" />亮绿：子 border</span><span><i className="nested-key nested-key-child-padding" />紫色：子 padding</span><span><i className="nested-key nested-key-child-content" />黄色：子 content，文字在这里</span></div>
      </div>

      <div className="nested-control-grid">
        <BoxControls title="父元素" kind="parent" values={parent} onChange={(field, value) => setParent((current) => ({ ...current, [field]: value }))} />
        <BoxControls title="子元素" kind="child" values={child} onChange={(field, value) => setChild((current) => ({ ...current, [field]: value }))} />
      </div>

      <p className="nested-takeaway">先把<strong>父 padding</strong> 调到 0：观察粉色边框与青绿内容区之间的蓝色消失。再把<strong>子 margin</strong> 调到 0：观察白色辅助虚线向子元素的亮绿边框靠近。虚线不占布局空间；两次改变的是不同元素的属性。</p>
      <button className="nested-reset" type="button" onClick={() => { setParent(initialParent); setChild(initialChild); }}>恢复父子初始数值</button>
    </section>
  );
}
