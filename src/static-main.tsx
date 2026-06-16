import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";

import { getRouter } from "./router";
import { withBase } from "./lib/siteBase";
import "./styles.css";

const root = document.getElementById("root");

const modelViewerScript = document.createElement("script");
modelViewerScript.type = "module";
modelViewerScript.src = withBase("/vendor/model-viewer.min.js");
document.head.appendChild(modelViewerScript);

if (root) {
  createRoot(root).render(
    <StrictMode>
      <RouterProvider router={getRouter()} />
    </StrictMode>,
  );
}
