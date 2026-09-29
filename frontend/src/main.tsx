import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import BoxModelLab from "./BoxModelLab";
import "./index.css";
import "./box-model.css";
import "./nested-box.css";

const isBoxModelLab = new URLSearchParams(window.location.search).get("lab") === "box-model";
if (isBoxModelLab) document.title = "盒模型观察页";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {isBoxModelLab ? <BoxModelLab /> : <App />}
  </StrictMode>
);
