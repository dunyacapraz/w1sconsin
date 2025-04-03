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
import Anasayfa from "../pages/anasayfa"; // Eğer dosya ismi büyük harfle başlıyorsa bu doğru

export const router = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/*",
        element: <NotFound />,
      },
      {
        path: "/wcst-test-result",
        element: <ResultPage />,
      },
      {
        path: "/d2-test-result",
        element: <D2PuanHesaplama />,
      },
      {
        path: "/wcst-test",
        element: <WcstPage />,
      },
      {
        path: "/wcst-test-page",
        element: <WcstWindow />,
      },
      {
        path: "/wcst-debug-results",
        element: <DebugResults />,
      },
      {
        path: "/anasayfa", // Küçük harfle yazılmalı
        element: <Anasayfa />,
      },
      {
        path: "/Iowa-kumar-test",
        element: <IowaGamblingTask />,
      },
    ],
  },
]);
