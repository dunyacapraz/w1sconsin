import React, { useRef, useState, useEffect } from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <IowaGamblingTask />
    </div>
  );
}

function IowaGamblingTask() {
  // STATE'LER
  const [currentTotal, setCurrentTotal] = useState(2000);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [gain, setGain] = useState(0);
  const [loss, setLoss] = useState(0);
  const [cardsSelected, setCardsSelected] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [participantInfo, setParticipantInfo] = useState({
    id: '',
    age: '',
    gender: ''
  });
  
  // YENİ EKLENEN VERİ KAYIT STATE'LERİ
  const [rawData, setRawData] = useState([]);
  const [borrowAmount, setBorrowAmount] = useState(2000); // Başlangıçta 2000 borç/limit var gibi
  const startTimeRef = useRef(null); // Başlangıç zamanını form gönderildiğinde ayarla
  const [lossQueues, setLossQueues] = useState({
    deck1: [], deck2: [], deck3: [], deck4: []
  });

  // DESTE YAPILARI (ORİJİNAL)
  const decks = {
    deck1: { 
      gain: 100, 
      possibleLosses: [0,0,0,0,0,150,200,250,300,350],
      image: '/images/deck.jpg', // Gerçek resim yollarınızı kullanın
      imageActive: '/images/decon.jpg' // Gerçek resim yollarınızı kullanın
    },
    deck2: { 
      gain: 100, 
      possibleLosses: [0,0,0,0,0,0,0,0,0,1250],
      image: '/images/deck.jpg', // Gerçek resim yollarınızı kullanın
      imageActive: '/images/decon.jpg' // Gerçek resim yollarınızı kullanın
    },
    deck3: { 
      gain: 50, 
      possibleLosses: [0,0,0,0,0,50,50,50,50,50],
      image: '/images/deck.jpg', // Gerçek resim yollarınızı kullanın
      imageActive: '/images/decon.jpg' // Gerçek resim yollarınızı kullanın
    },
    deck4: { 
      gain: 50, 
      possibleLosses: [0,0,0,0,0,0,0,0,0,250],
      image: '/images/deck.jpg', // Gerçek resim yollarınızı kullanın
      imageActive: '/images/decon.jpg' // Gerçek resim yollarınızı kullanın
    }
  };

  // KARIŞTIRMA ALGORİTMASI
  const shuffleArray = (array) => {
    let shuffledArray = [...array]; // Orijinal diziyi değiştirmemek için kopyala
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  // İLK KURULUM (Desteleri karıştır)
  useEffect(() => {
    setLossQueues({
      deck1: shuffleArray(decks.deck1.possibleLosses),
      deck2: shuffleArray(decks.deck2.possibleLosses),
      deck3: shuffleArray(decks.deck3.possibleLosses),
      deck4: shuffleArray(decks.deck4.possibleLosses)
    });
  }, []); // Sadece component mount olduğunda çalışır

  // KAYIP DEĞERİ AL
  const getLoss = (deckId) => {
    // Güncel kuyruğu state'ten al ve kopyasını oluştur
    const currentQueue = [...lossQueues[deckId]]; 

    if (currentQueue.length === 0) {
      // Kuyruk boşsa, orijinal kayıp listesini tekrar karıştır
      const reshuffled = shuffleArray(decks[deckId].possibleLosses);
      // Yeni karıştırılmış listeyi state'e kaydet
      setLossQueues(prev => ({...prev, [deckId]: reshuffled.slice(1)})); // İlk elemanı hemen kullanacağımız için kalanını kaydet
      // Yeni karıştırılmış listenin ilk elemanını döndür
      return reshuffled[0]; 
    } else {
      // Kuyruk boş değilse, ilk elemanı al
      const loss = currentQueue[0];
      // Kuyruğun geri kalanını state'e kaydet
      setLossQueues(prev => ({...prev, [deckId]: currentQueue.slice(1)}));
      // Alınan kayıp değerini döndür
      return loss;
    }
  };

  // DESTE SEÇİMİ
  const handleDeckClick = (deckId) => {
    if (gameOver || showFeedback) return; // Oyun bittiyse veya geri bildirim gösteriliyorsa işlem yapma

    // Başlangıç zamanı kaydedilmemişse kaydet (ilk tıklamada)
    if (startTimeRef.current === null) {
        startTimeRef.current = Date.now();
    }
    const clickTime = Date.now(); // Tıklama anı

    const deck = decks[deckId];
    const lossAmount = getLoss(deckId);
    const net = deck.gain - lossAmount;
    
    // BORÇ HESAPLAMA
    let newTotal = currentTotal + net;
    let newBorrow = borrowAmount;
    if (newTotal < 0) {
      newTotal += 2000;
      newBorrow += 2000;
    }

    // VERİ KAYDI
    const trialData = {
      trial: cardsSelected + 1,
      deck: String.fromCharCode(64 + parseInt(deckId.replace('deck',''))) + "'",
      win: deck.gain,
      lose: lossAmount > 0 ? lossAmount : 0, // Kayıp 0'dan büyükse göster, değilse 0 göster
      score: newTotal, // Hesaplama sonrası güncel toplam
      borrow: newBorrow, // Hesaplama sonrası güncel borç
      time: clickTime - startTimeRef.current // Geçen süre
    };

    setRawData(prevData => [...prevData, trialData]); // Önceki verilere ekle
    setCurrentTotal(newTotal);
    setBorrowAmount(newBorrow);
    setSelectedDeck(deckId);
    setGain(deck.gain);
    setLoss(lossAmount);
    setCardsSelected(prevSelected => prevSelected + 1); // Önceki değere göre artır
    setShowFeedback(true);

    // Bir sonraki deneme için başlangıç zamanını güncelle (opsiyonel, her deneme için süre isterseniz)
    // startTimeRef.current = Date.now(); 

    if (cardsSelected + 1 >= 100) {
      setGameOver(true);
    }
  };

  // VERİ İNDİRME (GÜNCELLENDİ)
  const downloadData = () => {
    // Sütun genişliklerini tanımla (ihtiyaca göre ayarlanabilir)
    const colWidths = {
        trial: 7,
        deck: 6,
        win: 7,
        lose: 7,
        score: 9,
        borrow: 10,
        time: 11 
    };

    // Başlığı genişliklere göre formatla
    const header = 
        "Trial".padEnd(colWidths.trial) + 
        "Deck".padEnd(colWidths.deck) + 
        "Win".padEnd(colWidths.win) + 
        "Lose".padEnd(colWidths.lose) + 
        "Score".padEnd(colWidths.score) + 
        "Borrow".padEnd(colWidths.borrow) + 
        "Time(ms)".padEnd(colWidths.time) + "\n";

    // Satırları genişliklere göre formatla
    const rows = rawData.map(item => {
        const trialStr = item.trial.toString().padEnd(colWidths.trial);
        const deckStr = item.deck.padEnd(colWidths.deck); 
        const winStr = item.win.toString().padEnd(colWidths.win);
        const loseStr = item.lose.toString().padEnd(colWidths.lose);
        const scoreStr = item.score.toString().padEnd(colWidths.score);
        const borrowStr = item.borrow.toString().padEnd(colWidths.borrow);
        const timeStr = item.time.toString().padEnd(colWidths.time); 

        return trialStr + deckStr + winStr + loseStr + scoreStr + borrowStr + timeStr;
    }).join('\n');
    
    // UTF-8 karakter kodlaması ile Blob oluştur (Türkçe karakterler için önemli olabilir)
    const blob = new Blob([header + rows], { type: 'text/plain;charset=utf-8' }); 
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob); // URL oluştur
    link.href = url;
    link.download = `IGT_${participantInfo.id}_${new Date().toISOString().slice(0,10)}.txt`;
    document.body.appendChild(link); // Linki DOM'a ekle (Firefox için gerekli olabilir)
    link.click();
    document.body.removeChild(link); // Linki DOM'dan kaldır
    URL.revokeObjectURL(url); // Oluşturulan URL'yi temizle
  };

  // Form gönderildiğinde test başlangıç zamanını kaydet
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!participantInfo.id.trim()) {
      alert('Lütfen hasta adı soyadı giriniz');
      return;
    }
    startTimeRef.current = Date.now(); // Test başlangıç zamanı burada ayarlanır
    setFormSubmitted(true);
  };


  // HASTA BİLGİ FORMÜ
  if (!formSubmitted) {
    return (
      <div className="participant-form">
        {/* BİLGİLENDİRME KISMI */}
        <div className="info-container">
          <h2>Iowa Kumar Testi (IGT) Nedir?</h2>
          <p>
            Iowa Gambling Task, karar verme ve risk değerlendirme becerilerini ölçen 
            <strong> nöropsikolojik bir testtir</strong>. Frontal lob fonksiyonlarını 
            değerlendirmek için kliniklerde yaygın kullanılır.
          </p>

          <h3>Test Nasıl Yapılır?</h3>
          <ul className="modern-list">
            <li>4 farklı desteden (A', B', C', D') kart seçeceksiniz</li>
            <li>Her seçimde <strong>kazanç</strong> ve bazen <strong>kayıp</strong> yaşayacaksınız</li>
            <li>Toplam <strong>100 seçim</strong> yapacaksınız</li>
            <li>Amacınız mümkün olduğunca fazla sanal para kazanmak</li>
          </ul>

          <div className="deck-info">
            <h4>Desteler Hakkında:</h4>
            <p>
              <strong>Avantajlı Desteler (C' ve D'):</strong> Küçük kazançlar ama daha küçük kayıplar<br/>
              <strong>Dezavantajlı Desteler (A' ve B'):</strong> Büyük kazançlar ama çok daha büyük kayıplar
            </p>
          </div>
        </div>
        <div className="form-container">
          <h2>Hasta Bilgileri</h2>
          {/* Form gönderildiğinde handleFormSubmit çağrılır */}
          <form onSubmit={handleFormSubmit}> 
            <div className="form-group">
              <input
                type="text"
                placeholder="Hasta Adı Soyadı *"
                required
                value={participantInfo.id}
                onChange={(e) => setParticipantInfo({...participantInfo, id: e.target.value})}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                placeholder="Yaş"
                min="18"
                max="99"
                value={participantInfo.age}
                onChange={(e) => setParticipantInfo({...participantInfo, age: e.target.value})}
              />
            </div>
            <div className="form-group">
              <select
                value={participantInfo.gender}
                onChange={(e) => setParticipantInfo({...participantInfo, gender: e.target.value})}
              >
                <option value="">Cinsiyet seçiniz</option>
                <option value="male">Erkek</option>
                <option value="female">Kadın</option>
              </select>
            </div>
            <div className="form-group">
              <button type="submit">Testi Başlat</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // OYUN ARAYÜZÜ
  return (
    <div className="game-container">
      <h1>Iowa Kumar Testi</h1>
      <div className="info-panel">
        <p>Toplam: ${currentTotal}</p>
        <p>Seçilen Kart: {cardsSelected}/100</p>
        <p>Hasta İsmi: {participantInfo.id}</p>
      </div>

      <div className="decks">
        {['deck1', 'deck2', 'deck3', 'deck4'].map((deckId) => ( // deckId olarak değiştirdim
          <div
            key={deckId} // key olarak deckId kullandım
            className={`deck ${selectedDeck === deckId ? 'active' : ''}`}
            onClick={() => handleDeckClick(deckId)} // onClick'e deckId gönderdim
          >
            <img
              // Resim yollarını doğru ayarladığınızdan emin olun
              src={selectedDeck === deckId ? decks[deckId].imageActive : decks[deckId].image} 
              alt={`Deste ${deckId.replace('deck','')}`} // Alt text daha açıklayıcı olabilir
              className="deck-image"
            />
            {/* Deste adını dinamik olarak göster */}
            <p>{`Deste ${String.fromCharCode(64 + parseInt(deckId.replace('deck','')))}'`}</p> 
          </div>
        ))}
      </div>

      {showFeedback && (
        <div className="feedback">
          <p style={{ color: 'green' }}>${gain} kazandınız!</p>
          {loss > 0 && <p style={{ color: 'red' }}>${loss} kaybettiniz.</p>}
          <p>Yeni Toplam: ${currentTotal}</p>
          <button onClick={() => {
            setShowFeedback(false);
            // İsteğe bağlı: Her devam edişte zamanı sıfırla/yeni başlangıç yap
            // startTimeRef.current = Date.now(); 
          }}>Devam Et</button>
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <h2>Oyun Bitti!</h2>
          <p>Son skor: ${currentTotal}</p>
          <button onClick={downloadData}>Verileri İndir</button>
        </div>
      )}
    </div>
  );
}

export default IowaGamblingTask; // App yerine IowaGamblingTask export edilebilir veya App içinde kalabilir