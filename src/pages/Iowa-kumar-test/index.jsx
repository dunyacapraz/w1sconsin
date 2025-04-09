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
  const [borrowAmount, setBorrowAmount] = useState(2000);
  const startTimeRef = useRef(Date.now());
  const [lossQueues, setLossQueues] = useState({
    deck1: [], deck2: [], deck3: [], deck4: []
  });

  // DESTE YAPILARI (ORİJİNAL)
  const decks = {
    deck1: { 
      gain: 100, 
      possibleLosses: [0,0,0,0,0,150,200,250,300,350],
      image: '/images/deck.jpg',
      imageActive: '/images/decon.jpg'
    },
    deck2: { 
      gain: 100, 
      possibleLosses: [0,0,0,0,0,0,0,0,0,1250],
      image: '/images/deck.jpg',
      imageActive: '/images/decon.jpg'
    },
    deck3: { 
      gain: 50, 
      possibleLosses: [0,0,0,0,0,50,50,50,50,50],
      image: '/images/deck.jpg',
      imageActive: '/images/decon.jpg'
    },
    deck4: { 
      gain: 50, 
      possibleLosses: [0,0,0,0,0,0,0,0,0,250],
      image: '/images/deck.jpg',
      imageActive: '/images/decon.jpg'
    }
  };

  // KARIŞTIRMA ALGORİTMASI
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // İLK KURULUM
  useEffect(() => {
    setLossQueues({
      deck1: shuffleArray([...decks.deck1.possibleLosses]),
      deck2: shuffleArray([...decks.deck2.possibleLosses]),
      deck3: shuffleArray([...decks.deck3.possibleLosses]),
      deck4: shuffleArray([...decks.deck4.possibleLosses])
    });
  }, []);

  // KAYIP DEĞERİ AL
  const getLoss = (deckId) => {
    const queue = [...lossQueues[deckId]];
    if (queue.length === 0) {
      const reshuffled = shuffleArray(decks[deckId].possibleLosses);
      setLossQueues(prev => ({...prev, [deckId]: reshuffled}));
      return reshuffled[0];
    }
    const loss = queue[0];
    setLossQueues(prev => ({...prev, [deckId]: queue.slice(1)}));
    return loss;
  };

  // DESTE SEÇİMİ
  const handleDeckClick = (deckId) => {
    if (gameOver || showFeedback) return;

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
      lose: lossAmount > 0 ? lossAmount : 0,
      score: currentTotal + net, // Borç öncesi skor
      borrow: borrowAmount,
      time: Date.now() - startTimeRef.current
    };

    setRawData([...rawData, trialData]);
    setCurrentTotal(newTotal);
    setBorrowAmount(newBorrow);
    setSelectedDeck(deckId);
    setGain(deck.gain);
    setLoss(lossAmount);
    setCardsSelected(cardsSelected + 1);
    setShowFeedback(true);

    if (cardsSelected + 1 >= 3) setGameOver(true);
  };

  // VERİ İNDİRME
  const downloadData = () => {
    const header = "Trial   Deck   Win   Lose   Score    Borrow    Time(ms)\n";
    const rows = rawData.map(item => 
      `${item.trial.toString().padStart(3)}      ${item.deck.padStart(2)}     ` +
      `${item.win.toString().padStart(5)}    ${item.lose.toString().padStart(5)}    ` +
      `${item.score.toString().padStart(7)}    ${item.borrow.toString().padStart(6)}    ` +
      `${item.time.toString().padStart(9)}`
    ).join('\n');
    
    const blob = new Blob([header + rows], {type: 'text/plain'});
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `IGT_${participantInfo.id}_${new Date().toISOString().slice(0,10)}.txt`;
    link.click();
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
          <form onSubmit={(e) => {
            e.preventDefault();
            if (!participantInfo.id.trim()) {
              alert('Lütfen hasta adı soyadı giriniz');
              return;
            }
            setFormSubmitted(true);
          }}>
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
        {['deck1', 'deck2', 'deck3', 'deck4'].map((deck) => (
          <div
            key={deck}
            className={`deck ${selectedDeck === deck ? 'active' : ''}`}
            onClick={() => handleDeckClick(deck)}
          >
            <img
              src={selectedDeck === deck ? decks[deck].imageActive : decks[deck].image}
              alt={deck}
              className="deck-image"
            />
            <p>{deck.replace('deck', 'Deste ')}</p>
          </div>
        ))}
      </div>

      {showFeedback && (
        <div className="feedback">
          <p style={{ color: 'green' }}>${gain} kazandınız!</p>
          {loss > 0 && <p style={{ color: 'red' }}>${loss} kaybettiniz.</p>}
          <p>Yeni Toplam: ${currentTotal}</p>
          <button onClick={() => setShowFeedback(false)}>Devam Et</button>
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

export default IowaGamblingTask;