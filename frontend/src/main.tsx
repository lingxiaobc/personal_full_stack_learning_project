import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import BoxModelLab from "./BoxModelLab";
import GridTrackLab from "./GridTrackLab";
import ComponentLab from "./ComponentLab";
import "./index.css";
import "./box-model.css";
import "./nested-box.css";
import "./grid-track.css";
import "./component-lab.css";

const lab = new URLSearchParams(window.location.search).get("lab");
const isBoxModelLab = lab === "box-model";
const isGridTrackLab = lab === "grid-track";
const isComponentLab = lab === "components";
if (isBoxModelLab) document.title = "盒模型观察页";
if (isGridTrackLab) document.title = "Grid 列宽对照页";
if (isComponentLab) document.title = "React 组件观察页";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isBoxModelLab ? <BoxModelLab /> : isGridTrackLab ? <GridTrackLab /> : isComponentLab ? <ComponentLab /> : <App />}
  </StrictMode>
);
