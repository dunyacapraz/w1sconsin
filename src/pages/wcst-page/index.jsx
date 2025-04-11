import React, { useRef, useContext } from "react"; // useRef ve useContext eklendi
import * as S from "./styles";
import { NavLink, useNavigate } from "react-router-dom"; // useNavigate eklendi
import { WcstContext } from "../../components/context"; // WcstContext import edildi

function WcstPage() {
  // Context ve Navigate hook'larını kullan
  const { setResult } = useContext(WcstContext);
  const navigate = useNavigate();

  // Gizli dosya input'u için ref oluştur
  const fileInputRef = useRef(null);

  // "Data Kullan" butonuna tıklandığında gizli input'u tetikle
  const handleUseDataClick = () => {
    fileInputRef.current.click();
  };

  // Dosya seçildiğinde çalışacak fonksiyon
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/json") {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const fileContent = e.target.result;
          const jsonData = JSON.parse(fileContent);
          // Context'teki result state'ini güncelle
          setResult(jsonData);
          // Sonuç sayfasına yönlendir
          navigate("/wcst-test-result");
        } catch (error) {
          console.error("JSON parse hatası:", error);
          alert("Hata: Seçilen dosya geçerli bir JSON formatında değil.");
        }
      };

      reader.onerror = (error) => {
        console.error("Dosya okuma hatası:", error);
        alert("Hata: Dosya okunurken bir sorun oluştu.");
      };

      reader.readAsText(file);
    } else if (file) {
      alert("Lütfen sadece JSON formatındaki dosyaları seçin (.json).");
    }
    // Input değerini sıfırla ki aynı dosya tekrar seçilebilsin
    event.target.value = null;
  };

  return (
    <S.Div>
      <h1>Wisconsin Card Sorting Test</h1>

      <p>
        Wisconsin Card Sorting Test (WCST), 1948 yılında David A. Grant ve Esta
        A. Berg tarafından geliştirilen ve frontal lob ile ilgili ölçümlerde
        kullanılan nöropsikolojik bir testtir.
      </p>

      <p>
        WCST, yönetici/yürütücü işlevleri (Executive Functions) ölçmeye yönelik
        bir testtir. Yönetici işlevler, belirli bir amacı/görevi
        gerçekleştirmeye yönelik bilişsel beceriler olarak tanımlanabilir. Bu
        beceriler: Dikkati odaklama, görevin çalışma belleğinde kodlanması,
        bozucu etkiye (Interference) direnç, art arda gelen durumlarda bir
        sonraki adımın belirlenmesi, planlama yapma ve karar verme gibi bir dizi
        karmaşık süreçlerden oluşmaktadır.
      </p>

      <h2>Materyaller ve Uygulama</h2>

      <p>
        Test; farklı şekillerden, renklerden ve şekil sayısından oluşan 4 adet{" "}
        <b>uyarıcı</b> karttan ve her destede 64 kartın olduğu 2 destelik{" "}
        <b>tepki</b> kartlarından oluşmaktadır. Hem uyarıcı kartlar hem de tepki
        kartları standart bir sıraya göre dizilmektedir.
      </p>

      <p>
        Katılımcıdan her bir tepki kartını uyarıcı kartlardan biriyle
        eşleştirmesi beklenmektedir. Katılımcı yaptığı eşleştirmelerde gözlemci
        tarafından doğru veya yanlış şeklinde uyarılmaktadır ve eşleştirmeler
        bir form ile kayıt altına alınmaktadır.
      </p>

      <S.Image src="../../../images/2.png" alt="" />

      <S.RunBox>
        {/* Testi Başlat Butonu */}
        <S.RunLink to="/wcst-test-page">
          <S.Button>Teste Başla</S.Button>
        </S.RunLink>

        {/* Gizli Dosya Input'u */}
        <input
          type="file"
          accept=".json" // Sadece JSON dosyalarını kabul et
          ref={fileInputRef}
          style={{ display: "none" }} // Görünmez yap
          onChange={handleFileChange} // Dosya seçildiğinde handleFileChange'i çağır
        />

        {/* Data Kullan Butonu */}
        <S.Button onClick={handleUseDataClick} style={{ marginTop: '10px' }}>Data Kullan</S.Button>
      </S.RunBox>
    </S.Div>
  );
}

export default WcstPage;