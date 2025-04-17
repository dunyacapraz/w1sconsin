// src/App.jsx
import React from "react";
import Sidebar from "./layouts/sidebar-layout";
import ContentArea from "./layouts/content-area-layout";
import { WcstProvider } from "./components/context";
import { AuthProvider, useAuth } from "./contexts/AuthContext"; // useAuth da import edildi
import { Helmet, HelmetProvider } from "react-helmet-async";
import LoginModal from "./components/LoginModal"; // LoginModal import edildi

// App içeriğini ayrı bir bileşene taşıyalım ki useAuth kullanabilelim
function AppContent() {
  const { isLoginModalOpen, closeLoginModal } = useAuth(); // Modal state'ini ve kapatma fonksiyonunu al

  return (
    <>
      <Helmet>
        <title>BetBah</title>
        {/* Diğer meta etiketleri */}
      </Helmet>
      <Sidebar />
      <ContentArea />
      {/* Modal'ı burada koşullu olarak render et */}
      <LoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
    </>
  );
}


// operationalMode'u AuthProvider ile sarın
const operationalMode = (
  <AuthProvider> {/* AuthProvider en dışta */}
    <WcstProvider>
      <HelmetProvider>
         {/* AppContent useAuth kullanabilsin diye Provider'ların içinde */}
         <AppContent />
      </HelmetProvider>
    </WcstProvider>
  </AuthProvider>
);

function App() {
  return operationalMode;
}

export default App;