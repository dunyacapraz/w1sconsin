// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
// import { AuthProvider } from "./contexts/AuthContext"; // <-- BU SATIRI SİLİN veya YORUM YAPIN

// Mevcut stil importları...
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* AuthProvider sarmalayıcısını buradan kaldırın */}
    <RouterProvider router={router} />
  </React.StrictMode>
);