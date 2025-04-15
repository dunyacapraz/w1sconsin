// src/router/index.jsx
import React from "react";
import { createBrowserRouter } from "react-router-dom";
import NotFound from "../pages/not-found-page";
import HomePage from "../pages/home-page";
import WcstWindow from "../pages/wcst-test-page";
import ResultPage from "../pages/result-page";
import D2PuanHesaplama from "../pages/D2-puan-hesaplama";
import DebugResults from "../pages/debugresults";
import App from "../App";
import IowaGamblingTask from "../pages/Iowa-kumar-test";
import WcstPage from "../pages/wcst-page";
import Anasayfa from "../pages/anasayfa";

// Yeni eklenenler
import LoginPage from "../pages/LoginPage"; // Giriş sayfasını import et
import ProtectedRoute from "../components/ProtectedRoute"; // Korumalı rota bileşenini import et

export const router = createBrowserRouter([
  {
    element: <App />, // Ana layout
    children: [
      // Herkesin erişebileceği rotalar
      {
        index: true, // Ana sayfa (muhtemelen /)
        element: <Anasayfa />, // Veya HomePage hangisi ana sayfanızsa
      },
       {
        path: "/anasayfa",
        element: <Anasayfa />,
      },
      {
        path: "/login", // Giriş sayfası rotası
        element: <LoginPage />,
      },
      {
        path: "/wcst-test", // Wisconsin test bilgi sayfası (korumalı değilse)
        element: <WcstPage />,
      },

      // --- KORUMALI ROTALAR ---
      // ProtectedRoute bileşeni ile sarmalanan rotalar
      {
        path: "/wcst-test-page", // Wisconsin test uygulama sayfası
        element: (
          <ProtectedRoute>
            <WcstWindow />
          </ProtectedRoute>
        ),
      },
      {
        path: "/wcst-test-result", // Wisconsin test sonuç sayfası (korunmalı mı?)
         element: (
           <ProtectedRoute>
             <ResultPage />
             {/* DebugResults belki ayrı bir korumalı rota olabilir? */}
           </ProtectedRoute>
         ),
        // Alternatif: Sadece DebugResults korunacaksa:
        // element: <ResultPage />, // Herkes görebilir
      },
       {
         path: "/wcst-debug-results", // Debug sonuçları kesinlikle korunmalı
         element: (
           <ProtectedRoute>
             <DebugResults />
           </ProtectedRoute>
         ),
       },
      {
        path: "/iowa-kumar-test", // Iowa kumar testi
        element: (
          <ProtectedRoute>
            <IowaGamblingTask />
          </ProtectedRoute>
        ),
      },
       {
         path: "/d2-test-result", // D2 Puan Hesaplama sayfası (Testin kendisi mi, sonuç mu?)
         element: (
           <ProtectedRoute>
             <D2PuanHesaplama />
           </ProtectedRoute>
         ),
       },
      // --- KORUMALI ROTALAR SONU ---

      // Hata Sayfası
      {
        path: "/*",
        element: <NotFound />,
      },
    ],
  },
]);