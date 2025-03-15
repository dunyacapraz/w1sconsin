import Sidebar from "./layouts/sidebar-layout";
import ContentArea from "./layouts/content-area-layout";
import { WcstProvider } from "./components/context";
import { Helmet, HelmetProvider } from "react-helmet-async";

const operationalMode = (
  <WcstProvider>
    <HelmetProvider>
      <Helmet>
        <title>Wisconsin Kart Eşleme Testi</title>
        <meta name="description" content="Wisconsin Kart Eşleme Testi (WCST) ile bilişsel esnekliğinizi değerlendirin. Kural değişimlerine nasıl uyum sağladığınızı ölçün." />
        <meta property="og:title" content="Wisconsin Kart Eşleme Testi (WCST)" />
        <meta property="og:description" content="Wisconsin Kart Eşleme Testi ile zihinsel esnekliğinizi test edin ve bilişsel yeteneklerinizi keşfedin." />
        <meta property="og:image" content="https://w1sconsin.netlify.app/wcst-preview.jpg" />
        <meta property="og:url" content="https://w1sconsin.netlify.app/" />
      </Helmet>
      <Sidebar />
      <ContentArea />
    </HelmetProvider>
  </WcstProvider>
);

function App() {
  return operationalMode;
}

export default App;
