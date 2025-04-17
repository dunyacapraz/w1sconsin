import React, { useRef, useState, useEffect } from 'react';
// Chart.js ve react-chartjs-2 importları
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import './App.css'; // Stil dosyasını import etmeyi unutmayın

// Chart.js bileşenlerini kaydet
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Veri Analizi Hesaplama Fonksiyonu (Bileşen Dışında)
const calculateAnalysisData = (inputRawData) => {
  if (!inputRawData || inputRawData.length === 0) {
    console.warn("calculateAnalysisData fonksiyonuna geçerli rawData gelmedi!");
    return { intervalCounts: [], totalCounts: { A: 0, B: 0, C: 0, D: 0 }, totalDiff: 0 };
  }
  const intervals = [ { start: 1, end: 20 }, { start: 21, end: 40 }, { start: 41, end: 60 }, { start: 61, end: 80 }, { start: 81, end: 100 }, ];
  const intervalCounts = intervals.map(({ start, end }) => { const intervalData = inputRawData.filter((item) => item.trial >= start && item.trial <= end); const counts = { A: intervalData.filter((item) => item.deck === "A'").length, B: intervalData.filter((item) => item.deck === "B'").length, C: intervalData.filter((item) => item.deck === "C'").length, D: intervalData.filter((item) => item.deck === "D'").length, }; const diff = (counts.C + counts.D) - (counts.A + counts.B); return { start, end, intervalLabel: `${start}-${end}`, counts, diff }; });
  const totalCounts = { A: inputRawData.filter((item) => item.deck === "A'").length, B: inputRawData.filter((item) => item.deck === "B'").length, C: inputRawData.filter((item) => item.deck === "C'").length, D: inputRawData.filter((item) => item.deck === "D'").length, };
  const totalDiff = (totalCounts.C + totalCounts.D) - (totalCounts.A + totalCounts.B);
  return { intervalCounts, totalCounts, totalDiff };
};


// Yorumlama Fonksiyonu
const getIgtInterpretation = (analysisData) => {
  if (!analysisData || !analysisData.intervalCounts || analysisData.intervalCounts.length < 5 || typeof analysisData.totalDiff !== 'number') {
    return "Yorum için yeterli veri yok veya hesaplama hatası.";
  }
  const { totalDiff, intervalCounts } = analysisData;
  const earlyDiff = (intervalCounts[0]?.diff ?? 0) + (intervalCounts[1]?.diff ?? 0);
  const lateDiff = (intervalCounts[2]?.diff ?? 0) + (intervalCounts[3]?.diff ?? 0) + (intervalCounts[4]?.diff ?? 0);
  const veryGoodThreshold = 20; const goodThreshold = 10; const slightlyGoodThreshold = 1;
  const slightlyBadThreshold = -9; const badThreshold = -10;
  const significantLearningThreshold = 15; const someLearningThreshold = 5;
  let overallPerformanceComment = ""; let learningComment = "";
  if (totalDiff >= veryGoodThreshold) { overallPerformanceComment = "Genel olarak avantajlı desteler (C', D') belirgin şekilde tercih edilmiştir. Bu, uzun vadeli sonuçları gözeten sağlam bir karar verme stratejisini gösterir."; }
  else if (totalDiff >= goodThreshold) { overallPerformanceComment = "Genel olarak avantajlı desteler (C', D') iyi bir düzeyde tercih edilmiştir. Bu durum, genellikle riskten kaçınan ve kazancı optimize etmeye yönelik bir yaklaşıma işaret eder."; }
  else if (totalDiff >= slightlyGoodThreshold) { overallPerformanceComment = "Avantajlı destelere (C', D') hafif bir yönelim gözlenmiştir, ancak dezavantajlı destelerden de tam olarak kaçınılmamıştır. Karar verme stratejisi kısmen etkilidir."; }
  else if (totalDiff > slightlyBadThreshold) { overallPerformanceComment = "Karar verme stratejisi belirsizdir. Avantajlı ve dezavantajlı desteler arasında net bir tercih yapılamamış veya dengeli bir seçim örüntüsü izlenmiştir."; }
  else if (totalDiff >= badThreshold) { overallPerformanceComment = "Dezavantajlı destelere (A', B') hafif bir yönelim gözlenmiştir. Bu, anlık kazançların cazibesine kapılma veya uzun vadeli kayıpları yeterince değerlendirememe eğilimine işaret edebilir."; }
  else { overallPerformanceComment = "Dezavantajlı desteler (A', B') belirgin şekilde tercih edilmiştir. Bu durum, genellikle yüksek risk alma davranışına, dürtüsel karar vermeye veya görevin mantığını öğrenmede zorluğa işaret eder."; }
  const learningDifference = lateDiff - earlyDiff;
  if (lateDiff > earlyDiff && learningDifference >= significantLearningThreshold) { learningComment = "Testin ilerleyen aşamalarında avantajlı destelere doğru belirgin bir yönelim olmuştur. Bu, görevdeki ödül/ceza yapısının zamanla öğrenildiğini ve stratejinin adapte edildiğini güçlü bir şekilde göstermektedir."; }
  else if (lateDiff > earlyDiff && learningDifference >= someLearningThreshold) { learningComment = "Testin sonlarına doğru avantajlı desteleri tercih etme eğiliminde bir artış gözlenmiştir. Bu durum, görev yapısının kısmen öğrenildiğine ve stratejinin olumlu yönde değiştiğine işaret etmektedir."; }
  else if (lateDiff <= earlyDiff && earlyDiff > 0 && lateDiff > 0) { learningComment = "Testin başından itibaren avantajlı desteler tercih edilmiş ve bu tercih büyük ölçüde korunmuştur. Görev mantığı erken kavranmış olabilir."; }
  else if (lateDiff <= earlyDiff && earlyDiff <= 0 && lateDiff <= 0) { learningComment = "Test boyunca dezavantajlı destelerden kaçınma konusunda belirgin bir öğrenme gözlenmemiştir. Riskli seçimler devam etmiş veya strateji değişmemiştir."; }
  else if (lateDiff < earlyDiff && earlyDiff > 0 && lateDiff <=0) { learningComment = "Başlangıçta avantajlı destelere yönelim olsa da, testin sonlarına doğru bu stratejiden uzaklaşılmış ve riskli seçimler artmıştır. Dikkat, motivasyon veya karar verme süreçlerinde bir değişiklik olabilir."; }
  else { learningComment = "Test süresince karar verme stratejisinde belirgin bir öğrenme veya değişim örüntüsü saptanamamıştır."; }
  return `${overallPerformanceComment} ${learningComment}`;
};


// Ana Test Bileşeni
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
  const [rawData, setRawData] = useState([]); // Ham verileri tutar
  const [borrowAmount, setBorrowAmount] = useState(2000);
  const startTimeRef = useRef(null);
  const [lossQueues, setLossQueues] = useState({
    deck1: [], deck2: [], deck3: [], deck4: []
  });
  const [analysisData, setAnalysisData] = useState(null); // Hesaplanan analiz verisi
  const fileInputRef = useRef(null);

  // DESTE YAPILARI
  const decks = {
    deck1: { gain: 100, possibleLosses: [0,0,0,0,0,150,200,250,300,350], image: '/images/deck.jpg', imageActive: '/images/decon.jpg' },
    deck2: { gain: 100, possibleLosses: [0,0,0,0,0,0,0,0,0,1250], image: '/images/deck.jpg', imageActive: '/images/decon.jpg' },
    deck3: { gain: 50, possibleLosses: [0,0,0,0,0,50,50,50,50,50], image: '/images/deck.jpg', imageActive: '/images/decon.jpg' },
    deck4: { gain: 50, possibleLosses: [0,0,0,0,0,0,0,0,0,250], image: '/images/deck.jpg', imageActive: '/images/decon.jpg' }
  };

  // KARIŞTIRMA ALGORİTMASI
  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  // İLK KURULUM (Desteleri karıştır - Testi Başlat Butonu İçin)
  useEffect(() => {
    if (formSubmitted && rawData.length === 0 && !gameOver) {
       setLossQueues({
         deck1: shuffleArray(decks.deck1.possibleLosses),
         deck2: shuffleArray(decks.deck2.possibleLosses),
         deck3: shuffleArray(decks.deck3.possibleLosses),
         deck4: shuffleArray(decks.deck4.possibleLosses)
       });
    }
  }, [formSubmitted, rawData.length, gameOver]);

  // KAYIP DEĞERİ AL
  const getLoss = (deckId) => {
    const currentQueue = [...lossQueues[deckId]];
    if (currentQueue.length === 0) {
      if (gameOver || rawData.length > 0) {
         console.warn(`Deste ${deckId} için kayıp kuyruğu boşaldı ama test bitti veya veri yüklendi.`);
         return 0;
      }
      const reshuffled = shuffleArray(decks[deckId].possibleLosses);
      setLossQueues(prev => ({...prev, [deckId]: reshuffled.slice(1)}));
      return reshuffled[0];
    } else {
      const loss = currentQueue[0];
      if (!gameOver && rawData.length < 100) {
         setLossQueues(prev => ({...prev, [deckId]: currentQueue.slice(1)}));
      }
      return loss;
    }
  };

  // OYUN BİTTİĞİNDE ANALİZİ HESAPLA
  useEffect(() => {
    if (rawData.length >= 100 && !analysisData) {
      console.log("Analysis conditions met. Calculating...");
      const calculatedData = calculateAnalysisData(rawData);
      console.log("Calculation result:", calculatedData);
      if (calculatedData && calculatedData.intervalCounts && calculatedData.intervalCounts.length > 0) {
           console.log("Setting analysisData...");
           setAnalysisData(calculatedData);
           setGameOver(true);
           const lastTrial = rawData[rawData.length - 1];
           if (lastTrial) {
             setCurrentTotal(lastTrial.score);
             setBorrowAmount(lastTrial.borrow);
           }
      } else {
           console.error("Calculation returned invalid or empty data:", calculatedData);
      }
    }
     else if (rawData.length < 100) {
        setAnalysisData(null);
     }
  }, [rawData]);

  // DESTE SEÇİMİ (Normal Oyun Akışı İçin)
  const handleDeckClick = (deckId) => {
    if (gameOver || showFeedback) return;
    if (startTimeRef.current === null) startTimeRef.current = Date.now();
    const clickTime = Date.now();
    const deck = decks[deckId];
    const lossAmount = getLoss(deckId);
    const net = deck.gain - lossAmount;
    let newTotal = currentTotal + net;
    let newBorrow = borrowAmount;
    if (newTotal < 0) {
      newTotal += 2000; newBorrow += 2000;
    }
    const trialData = {
      trial: cardsSelected + 1,
      deck: String.fromCharCode(64 + parseInt(deckId.replace('deck',''))) + "'",
      win: deck.gain, lose: lossAmount > 0 ? lossAmount : 0, score: newTotal,
      borrow: newBorrow, time: clickTime - startTimeRef.current
    };
    setRawData(prevData => [...prevData, trialData]);
    setCurrentTotal(newTotal);
    setBorrowAmount(newBorrow);
    setSelectedDeck(deckId); // Seçilen desteyi state'e kaydet (feedback için)
    setGain(deck.gain); setLoss(lossAmount);
    const newCardsSelected = cardsSelected + 1;
    setCardsSelected(newCardsSelected);
    if (newCardsSelected >= 100) {
       setGameOver(true);
    } else { setShowFeedback(true); } // Feedback'i göster
  };

  // VERİ İNDİRME FONKSİYONU
  const downloadData = () => {
    if (!rawData || rawData.length === 0) {
       alert("İndirilecek veri bulunamadı.");
       return;
    }
    const currentAnalysisData = calculateAnalysisData(rawData);
    const colWidths = { trial: 7, deck: 6, win: 7, lose: 7, score: 9, borrow: 10, time: 11 };
    const header = "Trial".padEnd(colWidths.trial) + "Deck".padEnd(colWidths.deck) + "Win".padEnd(colWidths.win) + "Lose".padEnd(colWidths.lose) + "Score".padEnd(colWidths.score) + "Borrow".padEnd(colWidths.borrow) + "Time(ms)".padEnd(colWidths.time) + "\n";
    const rows = rawData.map((item) => ( item.trial.toString().padEnd(colWidths.trial) + item.deck.padEnd(colWidths.deck) + item.win.toString().padEnd(colWidths.win) + item.lose.toString().padEnd(colWidths.lose) + item.score.toString().padEnd(colWidths.score) + item.borrow.toString().padEnd(colWidths.borrow) + item.time.toString().padEnd(colWidths.time) )).join("\n");
    let analysisText = "\n\nDetailed Total\n";
    analysisText += "Interval".padEnd(15) + "A".padEnd(5) + "B".padEnd(5) + "C".padEnd(5) + "D".padEnd(5) + "(C+D)-(A+B)".padEnd(12) + "\n";
    if (currentAnalysisData && currentAnalysisData.intervalCounts) {
        currentAnalysisData.intervalCounts.forEach(({ intervalLabel, counts, diff }) => { analysisText += intervalLabel.padEnd(15) + counts.A.toString().padEnd(5) + counts.B.toString().padEnd(5) + counts.C.toString().padEnd(5) + counts.D.toString().padEnd(5) + diff.toString().padEnd(12) + "\n"; });
        analysisText += "\nOverall Total".padEnd(15) + currentAnalysisData.totalCounts.A.toString().padEnd(5) + currentAnalysisData.totalCounts.B.toString().padEnd(5) + currentAnalysisData.totalCounts.C.toString().padEnd(5) + currentAnalysisData.totalCounts.D.toString().padEnd(5) + currentAnalysisData.totalDiff.toString().padEnd(12) + "\n";
    } else { analysisText += "\nAnaliz verisi hesaplanamadı veya bulunamadı."; }
    analysisText += "\n\nGenel Yorum:\n";
    analysisText += getIgtInterpretation(currentAnalysisData);
    const fileContent = header + rows + analysisText;
    const blob = new Blob([fileContent], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    const safeId = participantInfo.id.replace(/[^a-zA-Z0-9]/g, '_') || 'bilinmeyen';
    link.href = url; link.download = `IGT_${safeId}_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(link); link.click(); document.body.removeChild(link); URL.revokeObjectURL(url);
  };

  // FORM GÖNDERME (Normal Test Başlatma)
  const handleFormSubmit = (e) => {
    e.preventDefault(); if (!participantInfo.id.trim()) { alert('Lütfen hasta adı soyadı giriniz'); return; }
    setCurrentTotal(2000); setSelectedDeck(null); setGain(0); setLoss(0);
    setCardsSelected(0); setShowFeedback(false); setGameOver(false);
    setRawData([]); setBorrowAmount(2000); setAnalysisData(null);
    startTimeRef.current = Date.now();
    setFormSubmitted(true);
  };

  // "Data Kullan" Butonu Tıklama İşleyicisi
  const handleUseDataClick = () => {
    fileInputRef.current.click();
  };

  // Dosya Yükleme ve Ayrıştırma İşleyicisi
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file || !file.type.startsWith('text/')) {
      alert("Lütfen geçerli bir metin dosyası (.txt) seçin.");
      event.target.value = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileContent = e.target.result;
        const lines = fileContent.split('\n').map(line => line.trim()).filter(line => line);

        const parsedRawData = [];
        let headerSkipped = false;
        const dataLineRegex = /^\d+\s+[A-D]'\s+\d+/;

        for (const line of lines) {
          if (line.startsWith("Trial") || line.startsWith("Detailed Total") || line.startsWith("Interval") || line.startsWith("Overall Total") || line.startsWith("Genel Yorum:") || line.trim() === "") {
             if(line.startsWith("Trial")) headerSkipped = true;
            continue;
          }
          if (headerSkipped && dataLineRegex.test(line)) {
             const parts = line.split(/\s{2,}/);
             if (parts.length === 7) {
                const trial = parseInt(parts[0]);
                const deck = parts[1];
                const win = parseInt(parts[2]);
                const lose = parseInt(parts[3]);
                const score = parseInt(parts[4]);
                const borrow = parseInt(parts[5]);
                const time = parseInt(parts[6]);
                 if (![trial, win, lose, score, borrow, time].some(isNaN) && deck && deck.match(/[A-D]'/)) {
                     parsedRawData.push({ trial, deck, win, lose, score, borrow, time });
                 } else {
                     console.warn("Satır ayrıştırılamadı (geçersiz değerler):", line, parts);
                 }
             } else {
                 console.warn("Satır ayrıştırılamadı (yanlış sütun sayısı):", line, parts);
             }
          } else if (headerSkipped) {
              console.warn("Veri satırı formatına uymayan satır atlandı:", line);
          }
        }

        console.log("Ayrıştırılan Veri:", parsedRawData);

        if (parsedRawData.length >= 100) {
          setParticipantInfo({ id: 'Yüklenen Veri', age: '', gender: '' });
          setRawData(parsedRawData);
          setCardsSelected(parsedRawData.length);
          setFormSubmitted(true);
          // Not: gameOver ve analysisData state'leri rawData'ya bağlı useEffect tarafından ayarlanacak.
        } else {
          alert(`Yüklenen dosyada yeterli sayıda (en az 100) geçerli deneme bulunamadı. Bulunan: ${parsedRawData.length}`);
          setRawData([]);
          setAnalysisData(null);
          setGameOver(false);
        }

      } catch (error) {
        console.error("Dosya işleme hatası:", error);
        alert("Dosya okunurken veya işlenirken bir hata oluştu.");
        setRawData([]);
        setAnalysisData(null);
        setGameOver(false);
      } finally {
         event.target.value = null;
      }
    };

    reader.onerror = (error) => {
      console.error("Dosya okuma hatası:", error);
      alert("Dosya okunurken bir hata oluştu.");
      event.target.value = null;
    };

    reader.readAsText(file);
  };


  //------------------------------------------------------------------
  // RENDER KISMI
  //------------------------------------------------------------------

  // 1. HASTA BİLGİ FORMÜ EKRANI
  if (!formSubmitted) {
    return (
      <div className="participant-form">
         {/* ... (info-container içeriği aynı) ... */}
         <div className="info-container"> <h2>Iowa Kumar Testi (IGT) Nedir?</h2> <p>Iowa Gambling Task, karar verme ve risk değerlendirme becerilerini ölçen<strong> nöropsikolojik bir testtir</strong>. Frontal lob fonksiyonlarını değerlendirmek için kliniklerde yaygın kullanılır.</p> <h3>Test Nasıl Yapılır?</h3> <ul className="modern-list"><li>4 farklı desteden (A', B', C', D') kart seçeceksiniz</li><li>Her seçimde <strong>kazanç</strong> ve bazen <strong>kayıp</strong> yaşayacaksınız</li><li>Toplam <strong>100 seçim</strong> yapacaksınız</li><li>Amacınız mümkün olduğunca fazla sanal para kazanmak</li></ul> <div className="deck-info"><h4>Desteler Hakkında:</h4><p><strong>Avantajlı Desteler (C' ve D'):</strong> Küçük kazançlar ama daha küçük kayıplar<br/><strong>Dezavantajlı Desteler (A' ve B'):</strong> Büyük kazançlar ama çok daha büyük kayıplar</p></div> </div>
         <div className="form-container">
            <h2>Hasta Bilgileri</h2>
            <form onSubmit={handleFormSubmit}>
                <div className="form-group"><input type="text" placeholder="Hasta Adı Soyadı *" required value={participantInfo.id} onChange={(e) => setParticipantInfo({...participantInfo, id: e.target.value})} /></div>
                <div className="form-group"><input type="number" placeholder="Yaş" min="1" max="120" value={participantInfo.age} onChange={(e) => setParticipantInfo({...participantInfo, age: e.target.value})} /></div>
                <div className="form-group"><select value={participantInfo.gender} onChange={(e) => setParticipantInfo({...participantInfo, gender: e.target.value})}><option value="">Cinsiyet seçiniz</option><option value="male">Erkek</option><option value="female">Kadın</option><option value="other">Diğer</option></select></div>
                <div className="button-group">
                    <button type="submit" className="start-button">Testi Başlat</button>
                    <button type="button" onClick={handleUseDataClick} className="use-data-button">
                      Data Kullan (.txt)
                    </button>
                </div>
                <input
                  type="file"
                  accept=".txt"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileUpload}
                />
            </form>
         </div>
      </div>
    );
  }

  // 2. ANA OYUN EKRANI VE OYUN BİTTİ DURUMU

  // chartOptions
   const chartOptions = {
     responsive: true,
     maintainAspectRatio: false,
     plugins: { legend: { position: 'top', labels: { color: 'rgba(230, 230, 250, 0.7)', padding: 20 } }, title: { display: true, text: 'Aralığa Göre Deste Seçimleri', color: '#E6EDF3', font: { size: 18, weight: 'bold', }, padding: { top: 10, bottom: 20 } }, tooltip: { backgroundColor: 'rgba(0, 0, 0, 0.8)', titleColor: 'rgba(255, 255, 255, 0.9)', bodyColor: 'rgba(255, 255, 255, 0.8)', padding: 10, cornerRadius: 4, } },
     scales: { x: { ticks: { color: 'rgba(230, 230, 250, 0.7)', font: { size: 12 } }, grid: { color: 'rgba(108, 92, 231, 0.1)', } }, y: { ticks: { color: 'rgba(230, 230, 250, 0.7)', font: { size: 12 } }, grid: { color: 'rgba(108, 92, 231, 0.1)', }, beginAtZero: true } },
   };

   // chartData
   const chartData = analysisData ? {
     labels: analysisData.intervalCounts.map(item => item.intervalLabel),
     datasets: [ { label: 'Deste A Seçimi', data: analysisData.intervalCounts.map(item => item.counts.A), backgroundColor: 'rgba(255, 99, 132, 0.6)', borderColor: 'rgba(255, 99, 132, 1)', borderWidth: 1 }, { label: 'Deste B Seçimi', data: analysisData.intervalCounts.map(item => item.counts.B), backgroundColor: 'rgba(255, 159, 64, 0.6)', borderColor: 'rgba(255, 159, 64, 1)', borderWidth: 1 }, { label: 'Deste C Seçimi', data: analysisData.intervalCounts.map(item => item.counts.C), backgroundColor: 'rgba(75, 192, 192, 0.6)', borderColor: 'rgba(75, 192, 192, 1)', borderWidth: 1 }, { label: 'Deste D Seçimi', data: analysisData.intervalCounts.map(item => item.counts.D), backgroundColor: 'rgba(54, 162, 235, 0.6)', borderColor: 'rgba(54, 162, 235, 1)', borderWidth: 1 }, ],
   } : null;


  // JSX Render
  return (
    <div className="game-container">
      <h1>Iowa Kumar Testi</h1>
      <div className="info-panel">
        <p>Toplam: ${currentTotal}</p>
        <p>Seçilen Kart: {cardsSelected}/100</p>
        <p>Hasta: {participantInfo.id || 'N/A'}</p>
      </div>

      {/* ====> DEĞİŞİKLİK: Destelerin render koşulu güncellendi <==== */}
      {/* Form gönderildiyse (oyun başladıysa) veya oyun bittiyse desteleri göster */}
      {(formSubmitted || gameOver) && (
         <div className="decks">
           {['deck1', 'deck2', 'deck3', 'deck4'].map((deckId) => (
             <div key={deckId} className={`deck ${selectedDeck === deckId && showFeedback ? 'active' : ''}`}
                  // Oyun bitmediyse VE feedback gösterilmiyorsa tıkla
                  onClick={() => { if (!gameOver && !showFeedback) handleDeckClick(deckId); }}
                  style={{
                      // Oyun bittiyse VEYA feedback gösteriliyorsa tıklamayı engelle/soluklaştır
                      pointerEvents: gameOver || showFeedback ? 'none' : 'auto',
                      opacity: gameOver || showFeedback ? 0.6 : 1,
                      cursor: gameOver || showFeedback ? 'default' : 'pointer'
                  }}>
               <img
                 // Feedback sırasında seçili destenin aktif resmini göster
                 src={(selectedDeck === deckId && showFeedback) ? decks[deckId].imageActive : decks[deckId].image}
                 alt={`Deste ${deckId.replace('deck','')}`}
                 className="deck-image"
               />
               <p>{`Deste ${String.fromCharCode(64 + parseInt(deckId.replace('deck','')))}'`}</p>
             </div>
           ))}
         </div>
      )}
      {/* ====> DEĞİŞİKLİK SONU <==== */}


      {/* Feedback gösteriliyorsa */}
      {showFeedback && !gameOver && (
        <div className="feedback">
          <p style={{ color: 'green' }}>${gain} kazandınız!</p>
          {loss > 0 && <p style={{ color: 'red' }}>${loss} kaybettiniz.</p>}
          <p>Yeni Toplam: ${currentTotal}</p>
          {/* ====> DEĞİŞİKLİK: Butona basınca selectedDeck'i de null yap <==== */}
          <button onClick={() => { setShowFeedback(false); setSelectedDeck(null); }}>Devam Et</button>
        </div>
      )}

      {/* Oyun bittiğinde gösterilecekler */}
      {gameOver && (
        <>
          <div className="game-over">
            <h2>Oyun Bitti!</h2>
            <p>Son skor: ${currentTotal}</p>
            <button onClick={downloadData} disabled={!rawData || rawData.length < 100}> Verileri İndir </button>
             <button onClick={() => {
                  setFormSubmitted(false); setGameOver(false); setRawData([]);
                  setAnalysisData(null); setCardsSelected(0); setCurrentTotal(2000);
                  setBorrowAmount(2000); setParticipantInfo({ id: '', age: '', gender: '' });
             }} className="restart-button">
               Yeni Test Başlat
             </button>
          </div>

          {/* Sonuçlar, Grafik ve Yorum Alanı */}
          {analysisData && analysisData.intervalCounts.length > 0 ? (
            <div className="results-display-container">
              <div className="analysis-section">
                <h3>Detaylı Sonuçlar</h3>
                <table className="results-table">
                   <thead><tr><th>Interval</th><th>A</th><th>B</th><th>C</th><th>D</th><th>(C+D)-(A+B)</th></tr></thead>
                    <tbody>{analysisData.intervalCounts.map((item, index) => (<tr key={index}><td>{item.intervalLabel}</td><td>{item.counts.A}</td><td>{item.counts.B}</td><td>{item.counts.C}</td><td>{item.counts.D}</td><td>{item.diff}</td></tr>))}</tbody>
                    <tfoot><tr><th>Overall Total</th><th>{analysisData.totalCounts.A}</th><th>{analysisData.totalCounts.B}</th><th>{analysisData.totalCounts.C}</th><th>{analysisData.totalCounts.D}</th><th>{analysisData.totalDiff}</th></tr></tfoot>
                </table>
                <div className="chart-container">
                  {chartData && <Bar options={chartOptions} data={chartData} />}
                </div>
                <div className="interpretation-section">
                    <h4>Genel Yorum:</h4>
                    <p className="interpretation-text">
                      {getIgtInterpretation(analysisData)}
                    </p>
                </div>
              </div>
            </div>
          ) : (
             <div className="loading-analysis"><p>Analiz verileri yükleniyor veya hesaplanamadı...</p></div>
          )}
        </>
      )}
    </div>
  );

}

export default IowaGamblingTask;