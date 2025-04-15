// src/App.jsx
import React from "react"; // React importunu ekleyin (genellikle zaten vardır)
import Sidebar from "./layouts/sidebar-layout";
import ContentArea from "./layouts/content-area-layout";
import { WcstProvider } from "./components/context";
import { AuthProvider } from "./contexts/AuthContext"; // <-- AuthProvider'ı buraya import edin
import { Helmet, HelmetProvider } from "react-helmet-async";
// Eğer ContentArea Outlet kullanmıyorsa ve rotalarınız App'in children'ı ise Outlet'i import edin
// import { Outlet } from "react-router-dom";

// operationalMode'u AuthProvider ile sarın
const operationalMode = (
  <AuthProvider> {/* <-- AuthProvider'ı en dışa veya WcstProvider'ın hemen dışına ekleyin */}
    <WcstProvider>
      <HelmetProvider>
        <Helmet>
          <title>Cognitive Check</title>
          {/* Diğer meta etiketleri */}
        </Helmet>
        <Sidebar />
        <ContentArea /> {/* Veya <Outlet /> */}
      </HelmetProvider>
    </WcstProvider>
  </AuthProvider>
);

function App() {
  return operationalMode;
}

export default App;