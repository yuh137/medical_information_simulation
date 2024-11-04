import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import initIDB from "./util/indexedDB/initIDB.ts";

initIDB().then((success) => {
  if (success) {
    console.log("IndexedDB initialized successfully.");
  } else {
    console.error("Failed to initialize IndexedDB.");
  }
});

// @ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
