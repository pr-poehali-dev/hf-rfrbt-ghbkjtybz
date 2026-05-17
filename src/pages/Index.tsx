import { useState, useRef } from "react";
import Icon from "@/components/ui/icon";
import Confetti from "@/components/gift/Confetti";
import GiftBackground from "@/components/gift/GiftBackground";
import { RoundBox, Postcard, Block2Photo, Lightbox, PhotoState } from "@/components/gift/GiftBox";

/* ═══════════════════════════════════════
   ДАННЫЕ
═══════════════════════════════════════ */
const MUSIC_URL = "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/4ccf70ff-861f-4fd6-a45d-007aa1b6f91a.mp3";

const BLOCK1_PHOTO = "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/d0891551-98a7-4554-924b-0e708a069193.png";

const BLOCK2_PHOTOS = [
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/2cacdc00-8209-48d2-aae4-93480856df10.png",
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/d1aae224-eee5-4b3c-bac6-b85e23190be6.png",
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/ca78ace9-9e04-4b27-a1a1-e1aab682080c.png",
];

const CARD1_TEXT = "Дорогая наша Галочка! 💛\n\nОт всей души поздравляем тебя с днём рождения! Оставайся всегда такой же милой, красивой и доброй ❤️\n\nТаких как ты — очень мало на нашей планете 🌸\n\nМы знаем, что ты очень хотела путешествовать, и поэтому...";

const CARD2_TEXT = "Мы решили подарить тебе путешествие ✈️\n\nТы будешь смотреть на эти фото и, закрыв глаза, представлять себе эти места, в которых побывала — хоть и виртуально 🌍\n\nПосмотри, какая красота... 😍";

const CARD2_BG: React.CSSProperties = {
  background: "radial-gradient(ellipse at 20% 80%, rgba(180,220,255,0.4) 0%, transparent 55%), radial-gradient(ellipse at 80% 20%, rgba(200,235,255,0.45) 0%, transparent 55%), linear-gradient(145deg, #f5fbff 0%, #eaf5ff 50%, #e0f0ff 100%)",
  border: "1.5px solid rgba(120,180,230,0.4)",
  boxShadow: "0 4px 32px rgba(80,150,220,0.13), 0 1px 4px rgba(0,0,0,0.07), inset 0 0 0 6px rgba(180,220,255,0.3)",
};

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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const setB2State = (idx: number, state: PhotoState) => {
    setB2States(prev => { const next = [...prev]; next[idx] = state; return next; });
  };

  /* Запускаем блок 2 */
  const startBlock2 = () => {
    setShowBlock1Photo(false);
    setShowBlock1Card(false);

    setTimeout(() => {
      setShowBlock2(true);
      setShowCard2(true);

      // Через 10с открытка исчезает, появляются фото
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

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    setConfetti(true);

    if (MUSIC_URL) {
      const audio = new Audio(MUSIC_URL);
      audio.volume = 0.75;
      audioRef.current = audio;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
      audio.onended = () => setIsPlaying(false);
    }

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
    setConfetti(false);
    if (audioRef.current) {
      const audio = audioRef.current;
      const fadeOut = setInterval(() => {
        if (audio.volume > 0.05) { audio.volume -= 0.05; }
        else { audio.pause(); clearInterval(fadeOut); }
      }, 80);
      audioRef.current = null;
    }
    setIsPlaying(false);
  };

  const handleToggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
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
          style={{
            opacity: showBlock1Photo ? 1 : 0,
            transition: "opacity 0.6s ease",
          }}
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

          <Postcard
            text={CARD1_TEXT}
            visible={showBlock1Card}
            animFrom="right"
          />
        </div>
      )}

      {/* Кнопка "Дальше" после блока 1 */}
      {isBlock1Done && !showBlock2 && (
        <button className="next-btn" onClick={startBlock2}>
          Дальше ✈️
        </button>
      )}

      {/* === БЛОК 2: открытка → фото → кнопка === */}
      {showBlock2 && (
        <div className="block2-scene">
          {/* Открытка — появляется первой */}
          <div className="b2-card-wrap" style={{
            opacity: showCard2 ? 1 : 0,
            transform: showCard2 ? "scale(1)" : "scale(0.7)",
            transition: "all 0.9s cubic-bezier(0.34,1.2,0.64,1)",
            pointerEvents: showCard2 ? "auto" : "none",
            maxHeight: showCard2 ? "600px" : "0px",
            marginBottom: showCard2 ? "0" : "0",
          }}>
            <Postcard
              text={CARD2_TEXT}
              visible={showCard2}
              emoji="✈️"
              flowers={["🌍","🗺️","✈️"]}
              bgStyle={CARD2_BG}
              rotate={2}
              animFrom="center"
            />
          </div>

          {/* Фото в ряд — появляются после открытки */}
          {b2PhotosVisible && (
            <div className="b2-row">
              {BLOCK2_PHOTOS.map((src, i) => (
                <Block2Photo
                  key={i}
                  src={src}
                  index={i}
                  state={b2States[i]}
                  onClick={() => setLightboxSrc(src)}
                />
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
      ) : b2Done ? (
        <div className="mt-8 flex flex-col items-center gap-3">
          <button className="next-btn" onClick={() => {}}>
            Дальше 🌟
          </button>
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
