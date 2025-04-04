import React, { useRef, useState, useEffect } from 'react';
import './App.css'; //
function App() {
    return (
      <div className="App">
        <IowaGamblingTask />
      </div>
    );
}

function IowaGamblingTask() {
    // Temel state'ler
    const [currentTotal, setCurrentTotal] = useState(2000);
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [gain, setGain] = useState(0);
    const [loss, setLoss] = useState(0);
    const [cardsSelected, setCardsSelected] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [summaryData, setSummaryData] = useState(null);


    // Detaylı veri toplama state'leri
    const [rawData, setRawData] = useState([]);
    const [systemInfo, setSystemInfo] = useState({});
    const [participantInfo, setParticipantInfo] = useState({
      id: '',
      group: '',
      session: '1',
      age: '',
      gender: ''
    });

    // Zamanlama ve loss mekanizmaları
    const startTimeRef = useRef(Date.now());
    const trialStartTimeRef = useRef(0);
    // const [usedLosses, setUsedLosses] = useState({ // Eski loss mekanizması
    //   deck1: [], deck2: [], deck3: [], deck4: []
    // });

    // Yeni loss state'leri
    const [lossQueues, setLossQueues] = useState({
        deck1: [],
        deck2: [],
        deck3: [],
        deck4: []
    });

    // Fisher-Yates shuffle algoritması
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    };

    // Deck'leri ilk yüklemede hazırla
    useEffect(() => {
        const initialLossQueues = {
            deck1: shuffleArray([0, 0, 0, 0, 0, 150, 200, 250, 300, 350]),
            deck2: shuffleArray([0, 0, 0, 0, 0, 0, 0, 0, 0, 1250]),
            deck3: shuffleArray([0, 0, 0, 0, 0, 50, 50, 50, 50, 50]),
            deck4: shuffleArray([0, 0, 0, 0, 0, 0, 0, 0, 0, 250])
        };
        setLossQueues(initialLossQueues);
    }, []);


    // Inquisit'teki 4 grup düzeni
    const deckGroups = [
      {
        id: 1,
        description: "deck1(D), deck2(D), deck3(A), deck4(A)",
        mapping: {
          deck1: { actual: 'deck1', category: 'disadvantageous' },
          deck2: { actual: 'deck2', category: 'disadvantageous' },
          deck3: { actual: 'deck3', category: 'advantageous' },
          deck4: { actual: 'deck4', category: 'advantageous' }
        }
      },
      {
        id: 2,
        description: "deck3(A), deck1(D), deck4(A), deck2(D)",
        mapping: {
          deck1: { actual: 'deck3', category: 'advantageous' },
          deck2: { actual: 'deck1', category: 'disadvantageous' },
          deck3: { actual: 'deck4', category: 'advantageous' },
          deck4: { actual: 'deck2', category: 'disadvantageous' }
        }
      },
      {
        id: 3,
        description: "deck4(A), deck3(A), deck2(D), deck1(D)",
        mapping: {
          deck1: { actual: 'deck4', category: 'advantageous' },
          deck2: { actual: 'deck3', category: 'advantageous' },
          deck3: { actual: 'deck2', category: 'disadvantageous' },
          deck4: { actual: 'deck1', category: 'disadvantageous' }
        }
      },
      {
        id: 4,
        description: "deck2(D), deck4(A), deck1(D), deck3(A)",
        mapping: {
          deck1: { actual: 'deck2', category: 'disadvantageous' },
          deck2: { actual: 'deck4', category: 'advantageous' },
          deck3: { actual: 'deck1', category: 'disadvantageous' },
          deck4: { actual: 'deck3', category: 'advantageous' }
        }
      }
    ];

    // Destelerin özellikleri (Inquisit'le birebir aynı)
    const decks = {
      deck1: {
        gain: 100,
        possibleLosses: [0, 0, 0, 0, 0, 150, 200, 250, 300, 350],
        image: '/images/deck.jpg',
        imageActive: '/images/decon.jpg'
      },
      deck2: {
        gain: 100,
        possibleLosses: [0, 0, 0, 0, 0, 0, 0, 0, 0, 1250],
        image: '/images/deck.jpg',
        imageActive: '/images/decon.jpg'
      },
      deck3: {
        gain: 50,
        possibleLosses: [0, 0, 0, 0, 0, 50, 50, 50, 50, 50],
        image: '/images/deck.jpg',
        imageActive: '/images/decon.jpg'
      },
      deck4: {
        gain: 50,
        possibleLosses: [0, 0, 0, 0, 0, 0, 0, 0, 0, 250],
        image: '/images/deck.jpg',
        imageActive: '/images/decon.jpg'
      }
    };

    // Güncellenmiş loss seçim mekanizması
    const getLoss = (actualDeck) => {
        const currentQueue = [...lossQueues[actualDeck]];
        if (currentQueue.length === 0) {
            // Eğer queue boşsa yeniden shuffle et
            const reshuffled = shuffleArray(decks[actualDeck].possibleLosses);
            setLossQueues(prev => ({
                ...prev,
                [actualDeck]: reshuffled
            }));
            return reshuffled[0];
        }

        const loss = currentQueue[0];
        const newQueue = currentQueue.slice(1);

        setLossQueues(prev => ({
            ...prev,
            [actualDeck]: newQueue
        }));

        return loss;
    };

    // Sistem bilgilerini topla
    useEffect(() => {
      setSystemInfo({
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        screenResolution: `${window.screen.width}x${window.screen.height}`,
        colorDepth: window.screen.colorDepth,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        language: navigator.language,
        browser: detectBrowser()
      });
    }, []);

    const detectBrowser = () => {
      const ua = navigator.userAgent;
      if (ua.includes("Firefox")) return "Firefox";
      if (ua.includes("Chrome")) return "Chrome";
      if (ua.includes("Safari")) return "Safari";
      if (ua.includes("Edg")) return "Edge";
      return "Unknown";
    };

    // Katılımcıyı rastgele bir gruba ata
    useEffect(() => {
      if (participantInfo.id && !participantInfo.group) {
        const randomGroup = deckGroups[Math.floor(Math.random() * deckGroups.length)];
        setParticipantInfo(prev => ({
          ...prev,
          group: randomGroup.id
        }));
      }
    }, [participantInfo]);

    // Oyun bitiş kontrolü
    useEffect(() => {
      if (cardsSelected === 100) {
        const summary = calculateSummary();
        setSummaryData(summary);
        downloadData();
        setGameOver(true);
      }
    }, [cardsSelected]);

    // Deste seçim işlemi
    const handleDeckClick = (displayedDeck) => {
      if (gameOver || showFeedback || !participantInfo.group) return;

      trialStartTimeRef.current = Date.now();

      const groupConfig = deckGroups.find(g => g.id === participantInfo.group);
      const actualDeck = groupConfig.mapping[displayedDeck].actual;
      const category = groupConfig.mapping[displayedDeck].category;
      const deck = decks[actualDeck];

      const lossAmount = getLoss(actualDeck); // Değişen kısım
      const latency = Date.now() - trialStartTimeRef.current;
      const block = Math.ceil((cardsSelected + 1) / 20);

      const trialData = {
        // Inquisit standart verileri
        trialNumber: cardsSelected + 1,
        trialCode: `trial_${cardsSelected + 1}`,
        blockNumber: 1,
        blockCode: 'igt_block',

        // Katılımcı bilgileri
        subjectId: participantInfo.id,
        groupId: participantInfo.group,
        sessionId: participantInfo.session,

        // Deste bilgileri
        displayedDeck: displayedDeck,
        actualDeck: actualDeck,
        deckPosition: parseInt(displayedDeck.replace('deck', '')),
        responseCategory: category,

        // Performans verileri
        responseLatency: latency,
        gain: deck.gain,
        loss: lossAmount,
        net: deck.gain - lossAmount,
        currentTotal: currentTotal + deck.gain - lossAmount,


      };

      setRawData(prev => [...prev, trialData]);
      setSelectedDeck(displayedDeck);
      setGain(deck.gain);
      setLoss(lossAmount);
      setCurrentTotal(prev => prev + deck.gain - lossAmount);
      setCardsSelected(prev => prev + 1);
      setShowFeedback(true);
    };

    // Inquisit'teki gibi özet hesaplama
    const calculateSummary = () => {
      const elapsedTime = Date.now() - startTimeRef.current;

      return {
        metadata: {
          task: "Iowa Gambling Task",
          version: "1.0",
          startDate: rawData[0]?.date || new Date().toLocaleDateString(),
          startTime: rawData[0]?.time || new Date().toLocaleTimeString(),
          endDate: new Date().toLocaleDateString(),
          endTime: new Date().toLocaleTimeString(),
          elapsedTime: elapsedTime,
          completed: cardsSelected >= 3 ? 1 : 0,
          
          screenResolution: systemInfo.screenResolution,
          deckOrderGroup: participantInfo.group,
          groupDescription: deckGroups.find(g => g.id === participantInfo.group)?.description || ""
        },
        performance: {
          totalAdvantage: rawData.filter(t => t.responseCategory === 'advantageous').length,
          totalDisadvantage: rawData.filter(t => t.responseCategory === 'disadvantageous').length,
          netScore: rawData.filter(t => t.responseCategory === 'advantageous').length -
                   rawData.filter(t => t.responseCategory === 'disadvantageous').length,
          finalAmount: currentTotal,
          countDeck1: rawData.filter(t => t.actualDeck === 'deck1').length,
          countDeck2: rawData.filter(t => t.actualDeck === 'deck2').length,
          countDeck3: rawData.filter(t => t.actualDeck === 'deck3').length,
          countDeck4: rawData.filter(t => t.actualDeck === 'deck4').length
        },
        blockAnalyses: calculateBlockAnalyses()
      };
    };

    // 20'li blok analizleri
    const calculateBlockAnalyses = () => {
      const results = {};

      for (let block = 1; block <= 5; block++) {
        const startTrial = (block - 1) * 20 + 1;
        const endTrial = block * 20;

        const blockData = rawData.filter(
          trial => trial.trialNumber >= startTrial && trial.trialNumber <= endTrial
        );

        results[`block${block}`] = {
          countAdvantage: blockData.filter(t => t.responseCategory === 'advantageous').length,
          countDisadvantage: blockData.filter(t => t.responseCategory === 'disadvantageous').length,
          net: blockData.filter(t => t.responseCategory === 'advantageous').length -
               blockData.filter(t => t.responseCategory === 'disadvantageous').length,
          decks: {
            deck1: blockData.filter(t => t.actualDeck === 'deck1').length,
            deck2: blockData.filter(t => t.actualDeck === 'deck2').length,
            deck3: blockData.filter(t => t.actualDeck === 'deck3').length,
            deck4: blockData.filter(t => t.actualDeck === 'deck4').length
          }
        };
      }

      return results;
    };

    // Verileri Inquisit formatında indirme
    const downloadData = () => {
      const summaryData = calculateSummary();

      // Ham veri (Inquisit'teki .iqdat karşılığı)
      const rawBlob = new Blob([JSON.stringify(rawData, null, 2)],
        { type: 'application/json' });

      // Özet veri (Inquisit'teki _summary karşılığı)
      const summaryBlob = new Blob([JSON.stringify(summaryData, null, 2)],
        { type: 'application/json' });

      // İki ayrı dosya olarak indirme
      const downloadFile = (blob, filename) => {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `igt_${participantInfo.id}_${filename}_${Date.now()}.json`;
        link.click();
      };

      downloadFile(rawBlob, 'raw');
      downloadFile(summaryBlob, 'summary');
    };


    // Katılımcı bilgi formu
const [formSubmitted, setFormSubmitted] = useState(false);

if (!formSubmitted) {
  return (
    <div className="participant-form">
      {/* 1. Bölüm: Bilgilendirme */}
      <div className="info-container">
        <h2>Iowa Kumar Testi (IGT) Hakkında</h2>
        <p>
          Iowa Kumar Testi, karar verme becerilerini ölçen psikolojik bir değerlendirme aracıdır. 
          Bu testte 4 farklı desteden kartlar seçerek sanal para kazanacaksınız. 
          Amacınız 100 seçim sonunda mümkün olduğunca fazla para biriktirmek.
        </p>

         <h3>Test Nasıl Yapılır?</h3>
  <ul className="modern-list">
    <li>Ekranda göreceğiniz 4 desteden birini tıklayarak seçim yapacaksınız.</li>
    <li>Her seçimde belirli miktarda para kazanacaksınız.</li>
    <li>Bazı seçimlerde ek olarak para kaybı yaşayabilirsiniz.</li>
    <li>Toplamda 100 seçim yapılacaktır.</li>
    <li>Destelerin kazanç/kayıp dengesi birbirinden farklıdır.</li>
  </ul>
</div>

      {/* 2. Bölüm: Hasta Formu */}
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
          {/* Form içeriği aynı kalacak */}
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
              <option value="other">Diğer</option>
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

    // Ana oyun arayüzü
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
              style={{ left: `${(parseInt(deck.replace('deck', '')) * 20)}%` }}

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