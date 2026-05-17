import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import Confetti from "@/components/gift/Confetti";
import GiftBackground from "@/components/gift/GiftBackground";
import { RoundBox, Postcard, Block2Photo, Lightbox, PhotoState } from "@/components/gift/GiftBox";

/* ═══════════════════════════════════════
   ДАННЫЕ
═══════════════════════════════════════ */
// Музыка для заставки с коробкой
const MUSIC_BOX_URL = "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/4ccf70ff-861f-4fd6-a45d-007aa1b6f91a.mp3";
// Музыка для блоков с фото (запускается с блока 1)
const MUSIC_MAIN_URL = "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/c827d397-b86e-4cf9-985c-7e7523a013d3.mp3";

const BLOCK1_PHOTO = "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/d0891551-98a7-4554-924b-0e708a069193.png";

const BLOCK2_PHOTOS = [
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/2cacdc00-8209-48d2-aae4-93480856df10.png",
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/d1aae224-eee5-4b3c-bac6-b85e23190be6.png",
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/ca78ace9-9e04-4b27-a1a1-e1aab682080c.png",
];

const BLOCK3_PHOTOS = [
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/ac6b2938-a5b0-4ec2-a28b-56496fa1ecd2.png",
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/a1ef9396-49a4-462b-9a55-5081fe506fb2.png",
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/198f6d3b-9bbd-4002-a85d-9eceecfc7d08.png",
];

const CARD1_TEXT = "Дорогая наша Галочка! 💛\n\nОт всей души поздравляем тебя с днём рождения! Оставайся всегда такой же милой, красивой и доброй ❤️\n\nТаких как ты — очень мало на нашей планете 🌸\n\nМы знаем, что ты очень хотела путешествовать, и поэтому...";

const CARD2_TEXT = "Мы решили подарить тебе путешествие ✈️\n\nТы будешь смотреть на эти фото и, закрыв глаза, представлять себе эти места, в которых побывала — хоть и виртуально 🌍\n\nПосмотри, какая красота... 😍";

const CARD3_TEXT = "Но самая красивая на этих фото — это ты и твоя улыбка! 😊\n\nХотим, чтобы ты так улыбалась чаще ❤️\n\nНо это ещё не всё...";

const BLOCK4_PHOTOS = [
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/ae472781-5344-4f32-a72e-3d48f5818177.png",
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/b459a7de-7b38-4b87-b617-42403a067fee.png",
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/31ab7dbd-339a-45ec-b409-59f6c2b23ab8.png",
];

const CARD4_TEXT = "Вот это тебе точно понравится! 🏛️\n\nТаких путешественников как ты — ещё не видел этот мир!\n\nКолизей, Тадж-Махал и Пиза... Посмотри, как ты прекрасна на фоне этих достопримечательностей 😍\n\nНо и это ещё не всё...";

const BLOCK5_PHOTOS = [
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/157dae5f-663d-49f6-99da-ae9109042d7b.png",
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/47f74a95-2082-421c-b355-e55715933354.png",
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/0f029686-3f6c-4743-a8e7-bfd6bd515dd2.png",
];

const CARD5_TEXT = "Не только Франции хорошо 🌸\n\nДома, среди сирени — нежной как ты — и лесным воздухом, чистым и свежим как твоя душа, тоже прекрасно!\n\nПоэтому мы очень рады, что ты с нами, а все твои путешествия — лишь лирическая фантазия 💛";

const CARD5_BG: React.CSSProperties = {
  background: "radial-gradient(ellipse at 20% 80%, rgba(200,170,220,0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(220,190,240,0.4) 0%, transparent 55%), linear-gradient(145deg, #fdf8ff 0%, #f8f0ff 50%, #f3e8ff 100%)",
  border: "1.5px solid rgba(170,120,210,0.35)",
  boxShadow: "0 4px 32px rgba(140,80,180,0.12), 0 1px 4px rgba(0,0,0,0.07), inset 0 0 0 6px rgba(210,170,240,0.25)",
};

const CARD4_BG: React.CSSProperties = {
  background: "radial-gradient(ellipse at 20% 80%, rgba(255,220,150,0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(255,235,180,0.4) 0%, transparent 55%), linear-gradient(145deg, #fffdf5 0%, #fff9e8 50%, #fff5d6 100%)",
  border: "1.5px solid rgba(210,170,80,0.4)",
  boxShadow: "0 4px 32px rgba(180,130,30,0.13), 0 1px 4px rgba(0,0,0,0.07), inset 0 0 0 6px rgba(255,220,120,0.25)",
};

const CARD2_BG: React.CSSProperties = {
  background: "radial-gradient(ellipse at 20% 80%, rgba(180,220,255,0.4) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(200,235,255,0.45) 0%, transparent 55%), linear-gradient(145deg, #f5fbff 0%, #eaf5ff 50%, #e0f0ff 100%)",
  border: "1.5px solid rgba(120,180,230,0.4)",
  boxShadow: "0 4px 32px rgba(80,150,220,0.13), 0 1px 4px rgba(0,0,0,0.07), inset 0 0 0 6px rgba(180,220,255,0.3)",
};

const CARD3_BG: React.CSSProperties = {
  background: "radial-gradient(ellipse at 20% 80%, rgba(200,255,200,0.35) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(220,255,220,0.4) 0%, transparent 55%), linear-gradient(145deg, #f5fff8 0%, #eafff0 50%, #e0ffe8 100%)",
  border: "1.5px solid rgba(120,200,140,0.4)",
  boxShadow: "0 4px 32px rgba(80,180,100,0.13), 0 1px 4px rgba(0,0,0,0.07), inset 0 0 0 6px rgba(180,255,200,0.3)",
};

/* вспомогательная функция для плавного старта аудио */
function playAudio(url: string, volume = 0.75): HTMLAudioElement {
  const audio = new Audio(url);
  audio.volume = volume;
  audio.play().catch(() => {});
  return audio;
}

function fadeOutAudio(audio: HTMLAudioElement, onDone?: () => void) {
  const fadeOut = setInterval(() => {
    if (audio.volume > 0.05) { audio.volume -= 0.05; }
    else { audio.pause(); clearInterval(fadeOut); onDone?.(); }
  }, 80);
}

/* ═══════════════════════════════════════
   MAIN
═══════════════════════════════════════ */
export default function Index() {
  const [opened, setOpened] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);

  // Block 1
  const [showBlock1Photo, setShowBlock1Photo] = useState(false);
  const [showBlock1Card, setShowBlock1Card] = useState(false);
  const [showBlock2, setShowBlock2] = useState(false);

  // Block 2
  const [b2States, setB2States] = useState<PhotoState[]>(["hidden","hidden","hidden"]);
  const [showCard2, setShowCard2] = useState(false);
  const [b2PhotosVisible, setB2PhotosVisible] = useState(false);
  const [b2Done, setB2Done] = useState(false);
  const [showBlock3, setShowBlock3] = useState(false);

  // Block 3
  const [b3States, setB3States] = useState<PhotoState[]>(["hidden","hidden","hidden"]);
  const [showCard3, setShowCard3] = useState(false);
  const [b3PhotosVisible, setB3PhotosVisible] = useState(false);
  const [b3Done, setB3Done] = useState(false);
  const [showBlock4, setShowBlock4] = useState(false);

  // Block 4
  const [b4States, setB4States] = useState<PhotoState[]>(["hidden","hidden","hidden"]);
  const [showCard4, setShowCard4] = useState(false);
  const [b4PhotosVisible, setB4PhotosVisible] = useState(false);
  const [b4Done, setB4Done] = useState(false);
  const [showBlock5, setShowBlock5] = useState(false);

  // Block 5
  const [b5States, setB5States] = useState<PhotoState[]>(["hidden","hidden","hidden"]);
  const [showCard5, setShowCard5] = useState(false);
  const [b5PhotosVisible, setB5PhotosVisible] = useState(false);
  const [b5Done, setB5Done] = useState(false);

  const boxAudioRef = useRef<HTMLAudioElement | null>(null);
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);
  const audioRef = mainAudioRef; // алиас для кнопки паузы

  const setB2State = (idx: number, state: PhotoState) => {
    setB2States(prev => { const next = [...prev]; next[idx] = state; return next; });
  };

  const setB3State = (idx: number, state: PhotoState) => {
    setB3States(prev => { const next = [...prev]; next[idx] = state; return next; });
  };

  const setB4State = (idx: number, state: PhotoState) => {
    setB4States(prev => { const next = [...prev]; next[idx] = state; return next; });
  };

  const setB5State = (idx: number, state: PhotoState) => {
    setB5States(prev => { const next = [...prev]; next[idx] = state; return next; });
  };

  /* ── Запуск блока 2 ── */
  const startBlock2 = () => {
    setShowBlock1Photo(false);
    setShowBlock1Card(false);

    setTimeout(() => {
      setShowBlock2(true);
      setShowCard2(true);

      setTimeout(() => {
        setShowCard2(false);
        setTimeout(() => {
          setB2PhotosVisible(true);
          setTimeout(() => setB2State(0, "row"), 100);
          setTimeout(() => setB2State(1, "row"), 320);
          setTimeout(() => setB2State(2, "row"), 540);
          setTimeout(() => setB2Done(true), 1800);
        }, 600);
      }, 10000);
    }, 600);
  };

  /* ── Запуск блока 3 ── */
  const startBlock3 = () => {
    setShowBlock3(true);
    setShowCard3(true);

    setTimeout(() => {
      setShowCard3(false);
      setTimeout(() => {
        setB3PhotosVisible(true);
        setTimeout(() => setB3State(0, "row"), 100);
        setTimeout(() => setB3State(1, "row"), 320);
        setTimeout(() => setB3State(2, "row"), 540);
        setTimeout(() => setB3Done(true), 1800);
      }, 600);
    }, 10000);
  };

  /* ── Запуск блока 4 ── */
  const startBlock4 = () => {
    setShowBlock4(true);
    setShowCard4(true);

    setTimeout(() => {
      setShowCard4(false);
      setTimeout(() => {
        setB4PhotosVisible(true);
        setTimeout(() => setB4State(0, "row"), 100);
        setTimeout(() => setB4State(1, "row"), 320);
        setTimeout(() => setB4State(2, "row"), 540);
        setTimeout(() => setB4Done(true), 1800);
      }, 600);
    }, 10000);
  };

  /* ── Запуск блока 5 ── */
  const startBlock5 = () => {
    setShowBlock5(true);
    setShowCard5(true);

    setTimeout(() => {
      setShowCard5(false);
      setTimeout(() => {
        setB5PhotosVisible(true);
        setTimeout(() => setB5State(0, "row"), 100);
        setTimeout(() => setB5State(1, "row"), 320);
        setTimeout(() => setB5State(2, "row"), 540);
        setTimeout(() => setB5Done(true), 1800);
      }, 600);
    }, 10000);
  };

  /* ── Открытие коробки ── */
  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    setConfetti(true);

    // Запускаем музыку коробки (если была)
    // Сразу запускаем основную музыку для фото-блоков
    const mainAudio = playAudio(MUSIC_MAIN_URL, 0.75);
    mainAudio.loop = true;
    mainAudioRef.current = mainAudio;
    mainAudio.addEventListener("play", () => setIsPlaying(true));
    mainAudio.addEventListener("pause", () => setIsPlaying(false));
    mainAudio.addEventListener("ended", () => setIsPlaying(false));

    setTimeout(() => setShowBlock1Photo(true), 600);
    setTimeout(() => setShowBlock1Card(true), 1800);
    setTimeout(() => setConfetti(false), 3500);
  };

  const handleHover = () => {
    if (!opened) { setShaking(true); setTimeout(() => setShaking(false), 600); }
  };

  const handleReset = () => {
    setOpened(false);
    setShowBlock1Photo(false);
    setShowBlock1Card(false);
    setShowBlock2(false);
    setB2States(["hidden","hidden","hidden"]);
    setShowCard2(false);
    setB2PhotosVisible(false);
    setB2Done(false);
    setShowBlock3(false);
    setB3States(["hidden","hidden","hidden"]);
    setShowCard3(false);
    setB3PhotosVisible(false);
    setB3Done(false);
    setShowBlock4(false);
    setB4States(["hidden","hidden","hidden"]);
    setShowCard4(false);
    setB4PhotosVisible(false);
    setB4Done(false);
    setShowBlock5(false);
    setB5States(["hidden","hidden","hidden"]);
    setShowCard5(false);
    setB5PhotosVisible(false);
    setB5Done(false);
    setConfetti(false);
    if (boxAudioRef.current) { fadeOutAudio(boxAudioRef.current); boxAudioRef.current = null; }
    if (mainAudioRef.current) { fadeOutAudio(mainAudioRef.current); mainAudioRef.current = null; }
    setIsPlaying(false);
  };

  const handleToggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().catch(() => {}); setIsPlaying(true); }
  };

  const isBlock1Done = showBlock1Photo && showBlock1Card;

  return (
    <div className="gift-bg min-h-screen flex flex-col items-center justify-center overflow-hidden relative py-8">
      <Confetti active={confetti} />
      <GiftBackground />

      {/* Music control */}
      {opened && (
        <button className="music-btn" onClick={handleToggleMusic} title={isPlaying ? "Пауза" : "Играть"}>
          <span className={`music-icon${isPlaying ? " music-playing" : ""}`}>
            {isPlaying ? "♫" : "♪"}
          </span>
          {isPlaying && (
            <span className="music-bars">
              <span /><span /><span /><span />
            </span>
          )}
        </button>
      )}

      {/* Title */}
      <p className="gift-title mb-6 text-center px-4">
        {opened ? "С любовью, для тебя 💛" : "Нажми, чтобы открыть подарок"}
      </p>

      {/* === КОРОБКА === */}
      {!opened && (
        <div style={{ position: "relative" }}>
          <RoundBox opened={false} onClick={handleOpen} onHover={handleHover} shaking={shaking} />
        </div>
      )}

      {/* === БЛОК 1: Фото + Открытка === */}
      {opened && !showBlock2 && (
        <div
          className="block1-scene"
          style={{ opacity: showBlock1Photo ? 1 : 0, transition: "opacity 0.6s ease" }}
        >
          <div className={`block1-photo${showBlock1Photo ? " block1-photo--visible" : ""}`}>
            <div className="photo-frame">
              <div className="photo-frame-inner">
                <img src={BLOCK1_PHOTO} alt="Галочка" className="block1-img" draggable={false} />
              </div>
              <div className="photo-frame-corner tl" />
              <div className="photo-frame-corner tr" />
              <div className="photo-frame-corner bl" />
              <div className="photo-frame-corner br" />
            </div>
          </div>
          <Postcard text={CARD1_TEXT} visible={showBlock1Card} animFrom="right" />
        </div>
      )}

      {/* Кнопка "Дальше" после блока 1 */}
      {isBlock1Done && !showBlock2 && (
        <button className="next-btn" onClick={startBlock2}>Дальше ✈️</button>
      )}

      {/* === БЛОК 2: открытка → фото → кнопка === */}
      {showBlock2 && !showBlock3 && (
        <div className="block2-scene">
          <div className="b2-card-wrap" style={{
            opacity: showCard2 ? 1 : 0,
            transform: showCard2 ? "scale(1)" : "scale(0.7)",
            transition: "all 0.9s cubic-bezier(0.34,1.2,0.64,1)",
            pointerEvents: showCard2 ? "auto" : "none",
            maxHeight: showCard2 ? "600px" : "0px",
          }}>
            <Postcard text={CARD2_TEXT} visible={showCard2} emoji="✈️" flowers={["🌍","🗺️","✈️"]} bgStyle={CARD2_BG} rotate={2} animFrom="center" />
          </div>

          {b2PhotosVisible && (
            <div className="b2-row">
              {BLOCK2_PHOTOS.map((src, i) => (
                <Block2Photo key={i} src={src} index={i} state={b2States[i]} onClick={() => setLightboxSrc(src)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Кнопка "Дальше" после блока 2 */}
      {b2Done && !showBlock3 && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <button className="next-btn" onClick={startBlock3}>Дальше 😊</button>
        </div>
      )}

      {/* === БЛОК 3: открытка → фото → кнопка === */}
      {showBlock3 && !showBlock4 && (
        <div className="block2-scene">
          <div className="b2-card-wrap" style={{
            opacity: showCard3 ? 1 : 0,
            transform: showCard3 ? "scale(1)" : "scale(0.7)",
            transition: "all 0.9s cubic-bezier(0.34,1.2,0.64,1)",
            pointerEvents: showCard3 ? "auto" : "none",
            maxHeight: showCard3 ? "600px" : "0px",
          }}>
            <Postcard text={CARD3_TEXT} visible={showCard3} emoji="😊" flowers={["💛","🌸","💛"]} bgStyle={CARD3_BG} rotate={-2} animFrom="center" />
          </div>

          {b3PhotosVisible && (
            <div className="b2-row">
              {BLOCK3_PHOTOS.map((src, i) => (
                <Block2Photo key={i} src={src} index={i} state={b3States[i]} onClick={() => setLightboxSrc(src)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Кнопка "Дальше" после блока 3 */}
      {b3Done && !showBlock4 && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <button className="next-btn" onClick={startBlock4}>Дальше 🏛️</button>
        </div>
      )}

      {/* === БЛОК 4: открытка → фото → кнопка === */}
      {showBlock4 && !showBlock5 && (
        <div className="block2-scene">
          <div className="b2-card-wrap" style={{
            opacity: showCard4 ? 1 : 0,
            transform: showCard4 ? "scale(1)" : "scale(0.7)",
            transition: "all 0.9s cubic-bezier(0.34,1.2,0.64,1)",
            pointerEvents: showCard4 ? "auto" : "none",
            maxHeight: showCard4 ? "600px" : "0px",
          }}>
            <Postcard text={CARD4_TEXT} visible={showCard4} emoji="🏛️" flowers={["🗽","🕌","🗼"]} bgStyle={CARD4_BG} rotate={2} animFrom="center" />
          </div>

          {b4PhotosVisible && (
            <div className="b2-row">
              {BLOCK4_PHOTOS.map((src, i) => (
                <Block2Photo key={i} src={src} index={i} state={b4States[i]} onClick={() => setLightboxSrc(src)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Кнопка "Дальше" после блока 4 */}
      {b4Done && !showBlock5 && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <button className="next-btn" onClick={startBlock5}>Дальше 🌸</button>
        </div>
      )}

      {/* === БЛОК 5: открытка → фото → финал === */}
      {showBlock5 && (
        <div className="block2-scene">
          <div className="b2-card-wrap" style={{
            opacity: showCard5 ? 1 : 0,
            transform: showCard5 ? "scale(1)" : "scale(0.7)",
            transition: "all 0.9s cubic-bezier(0.34,1.2,0.64,1)",
            pointerEvents: showCard5 ? "auto" : "none",
            maxHeight: showCard5 ? "600px" : "0px",
          }}>
            <Postcard text={CARD5_TEXT} visible={showCard5} emoji="🌸" flowers={["💜","🌿","💜"]} bgStyle={CARD5_BG} rotate={-2} animFrom="center" />
          </div>

          {b5PhotosVisible && (
            <div className="b2-row">
              {BLOCK5_PHOTOS.map((src, i) => (
                <Block2Photo key={i} src={src} index={i} state={b5States[i]} onClick={() => setLightboxSrc(src)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Controls */}
      {!opened ? (
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="cta-bounce flex flex-col items-center gap-1">
            <Icon name="ChevronUp" size={20} style={{ color: "var(--gold)" }} />
            <span className="cta-label">Нажми на коробку</span>
          </div>
        </div>
      ) : b5Done ? (
        <div className="mt-8 flex flex-col items-center gap-3">
          <button className="reset-btn" onClick={handleReset}>
            <Icon name="RefreshCw" size={14} />
            Открыть снова
          </button>
        </div>
      ) : null}

      {/* Lightbox */}
      {lightboxSrc && <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />}
    </div>
  );
}