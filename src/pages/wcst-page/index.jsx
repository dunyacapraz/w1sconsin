import React from "react";
import * as S from "./styles";
import { NavLink } from "react-router-dom"; // Bu satırı ekleyin

function WcstPage() {
  return (
    <S.Div>
      <h1>Wisconsin Card Sorting Test</h1>

      <p>
        Wisconsin Card Sorting Test (WCST), 1948 yılında David A. Grant ve Esta
        A. Berg tarafından geliştirilen ve frontal lob ile ilgili ölçümlerde
        kullanılan nöropsikolojik bir testtir.
      </p>

      <p>
        WCST, yönetici/yürütücü işlevleri (Executive Functions) ölçmeye
        yönelik bir testtir. Yönetici işlevler, belirli bir amacı/görevi
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
        <S.RunLink to="/wcst-test-window">
          <S.Button>Başlamak İçin Tıklayınız</S.Button>
        </S.RunLink>
        
        {/* Yeni eklenen debug butonu */}
        <S.RunLink to="/wcst-debug-results" style={{marginTop: '10px'}}>
          <S.Button style={{backgroundColor: '#6a5acd'}}>
            Detaylı Hata Ayıklama Modu
          </S.Button>
        </S.RunLink>
      </S.RunBox>
    </S.Div>
  );
}

export default WcstPage;