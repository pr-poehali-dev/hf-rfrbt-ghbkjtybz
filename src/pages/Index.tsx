import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

interface PhotoItem {
  src: string;
  rotate: number;
  fileName?: string;
}

interface Particle {
  id: number; x: number; y: number; color: string; size: number;
  speedX: number; speedY: number; rotation: number; rotationSpeed: number;
  shape: "rect" | "circle" | "star"; opacity: number;
}

/* ── Confetti ── */
function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const COLORS = ["#e8a020","#ffd97d","#c0392b","#ff6b6b","#fff5d6","#f783ac","#6bcb77","#4d96ff"];

  useEffect(() => {
    if (!active) { particlesRef.current = []; return; }
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    particlesRef.current = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: canvas.width / 2 + (Math.random() - 0.5) * 100,
      y: canvas.height * 0.55,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 11 + 5,
      speedX: (Math.random() - 0.5) * 15,
      speedY: -(Math.random() * 20 + 9),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 13,
      shape: (["rect","circle","star"] as const)[Math.floor(Math.random() * 3)],
      opacity: 1,
    }));
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particlesRef.current.forEach((p) => {
        if (p.opacity <= 0) return; alive = true;
        p.x += p.speedX; p.y += p.speedY; p.speedY += 0.52; p.speedX *= 0.99;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height * 0.7) p.opacity -= 0.022;
        ctx.save(); ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y); ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.shape === "circle") { ctx.beginPath(); ctx.arc(0,0,p.size/2,0,Math.PI*2); ctx.fill(); }
        else if (p.shape === "star") {
          ctx.beginPath();
          for (let i=0;i<5;i++){const a=(i*4*Math.PI)/5-Math.PI/2;const r=i%2===0?p.size/2:p.size/4;if(i===0)ctx.moveTo(Math.cos(a)*r,Math.sin(a)*r);else ctx.lineTo(Math.cos(a)*r,Math.sin(a)*r);}
          ctx.closePath(); ctx.fill();
        } else { ctx.fillRect(-p.size/2,-p.size/4,p.size,p.size/2); }
        ctx.restore();
      });
      if (alive) rafRef.current = requestAnimationFrame(animate);
      else ctx.clearRect(0,0,canvas.width,canvas.height);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" style={{ display: active ? "block" : "none" }} />;
}

/* ── Round Box ── */
function RoundBox({ opened, onClick, onHover, shaking }: {
  opened: boolean; onClick: () => void; onHover: () => void; shaking: boolean;
}) {
  return (
    <div className={`round-box-scene${shaking ? " shake" : ""}`} onClick={onClick} onMouseEnter={onHover}
      style={{ cursor: opened ? "default" : "pointer" }}>
      <div className={`round-lid${opened ? " lid-open" : ""}`}>
        <div className="lid-top-ellipse"><div className="lid-top-inner" /></div>
        <div className="lid-side"><div className="lid-gold-rim" /></div>
      </div>
      <div className="round-body">
        <div className="body-ribbon" />
        <div className="body-rose">
          <svg viewBox="0 0 64 64" fill="none" width="56" height="56">
            <circle cx="32" cy="32" r="18" stroke="#e8a020" strokeWidth="1.5" fill="none" opacity="0.35"/>
            <path d="M32 20 C32 20 22 26 22 33 C22 39 26 42 32 42 C38 42 42 39 42 33 C42 26 32 20 32 20Z" fill="#e8a020" opacity="0.7"/>
            <path d="M32 24 C32 24 25 29 25 34 C25 38 28 40 32 40 C36 40 39 38 39 34 C39 29 32 24 32 24Z" fill="#ffd97d" opacity="0.6"/>
            <path d="M32 28 C32 28 28 31 28 35 C28 37.5 29.8 39 32 39 C34.2 39 36 37.5 36 35 C36 31 32 28 32 28Z" fill="#e8a020" opacity="0.9"/>
            <circle cx="32" cy="35" r="3" fill="#ffd97d" opacity="0.95"/>
          </svg>
        </div>
        <div className="body-inscription">С любовью</div>
        <div className="body-bow">
          <div className="bow-left-loop" /><div className="bow-right-loop" />
          <div className="bow-knot-circle" />
          <div className="bow-tail-l" /><div className="bow-tail-r" />
          <div className="bow-charm-line" /><div className="bow-charm">♡</div>
        </div>
        {opened && <div className="body-inner-glow" />}
      </div>
      <div className="box-shadow-ellipse" />
    </div>
  );
}

/* ── Postcard Component ── */
function Postcard({
  text,
  visible,
  emoji = "❤️",
  flowers = ["🌸","🌷","🌸"],
  bgStyle,
  rotate = -2,
  animFrom = "right",
}: {
  text: string;
  visible: boolean;
  emoji?: string;
  flowers?: string[];
  bgStyle?: React.CSSProperties;
  rotate?: number;
  animFrom?: "right" | "center";
}) {
  const fromTransform = animFrom === "center"
    ? `scale(0.6) rotate(${rotate}deg)`
    : `translateX(80px) rotate(${rotate}deg)`;

  return (
    <div
      className="postcard-wrap"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? `rotate(${rotate}deg)` : fromTransform,
        transition: "all 0.9s cubic-bezier(0.34,1.2,0.64,1)",
        transitionDelay: visible ? "0.3s" : "0s",
      }}
    >
      <div className="postcard" style={bgStyle}>
        <div className="postcard-stamp">
          <div className="postcard-stamp-inner">{emoji}</div>
        </div>
        <div className="postcard-lines">
          <div className="postcard-line" />
          <div className="postcard-line" />
          <div className="postcard-line short" />
        </div>
        <div className="postcard-corner tl" />
        <div className="postcard-corner tr" />
        <div className="postcard-corner bl" />
        <div className="postcard-corner br" />
        <div className="postcard-flowers">
          {flowers.map((f, i) => <span key={i}>{f}</span>)}
        </div>
        <div className="postcard-text">{text}</div>
        <div className="postcard-footer">
          <span>✨</span>
          <div className="postcard-divider" />
          <span>✨</span>
        </div>
      </div>
    </div>
  );
}

/* ── Block2Photo: одно фото для блока 2 ── */
// Состояния: hidden → row (в ряд, 20с) → shrinking → parked-left
type PhotoState = "hidden" | "row" | "shrinking" | "parked";

// Горизонтальные сдвиги для ряда из 3 фото
const ROW_OFFSETS = [-34, 0, 34]; // vw от центра
// Конечные позиции слева (после улёта)
const PARK_OFFSETS = [-38, -46, -54]; // vw от центра, немного веером

function Block2Photo({
  src,
  index,
  state,
  onClick,
}: {
  src: string;
  index: number;
  state: PhotoState;
  onClick: () => void;
}) {
  const rowX = ROW_OFFSETS[index] ?? 0;
  const parkX = PARK_OFFSETS[index] ?? -42;
  const rot = [-3, 1, -2][index] ?? 0;

  const getStyle = (): React.CSSProperties => {
    switch (state) {
      case "hidden":
        return {
          opacity: 0,
          transform: `translate(calc(-50% + ${rowX}vw), -50%) scale(0.05) rotate(360deg)`,
          transition: "none",
          pointerEvents: "none",
        };
      case "row":
        return {
          opacity: 1,
          transform: `translate(calc(-50% + ${rowX}vw), -50%) scale(1) rotate(${rot}deg)`,
          transition: "all 1s cubic-bezier(0.34,1.15,0.64,1)",
          transitionDelay: `${index * 0.22}s`,
          pointerEvents: "auto",
          cursor: "pointer",
        };
      case "shrinking":
        return {
          opacity: 1,
          transform: `translate(calc(-50% + ${parkX}vw), -50%) scale(0.28) rotate(${rot * 2}deg)`,
          transition: "all 0.9s cubic-bezier(0.4,0,0.6,1)",
          transitionDelay: `${index * 0.1}s`,
          pointerEvents: "none",
        };
      case "parked":
        return {
          opacity: 1,
          transform: `translate(calc(-50% + ${parkX}vw), -50%) scale(0.28) rotate(${rot * 2}deg)`,
          transition: "all 0.3s ease",
          pointerEvents: "none",
        };
    }
  };

  return (
    <div
      className="b2-photo"
      style={getStyle()}
      onClick={onClick}
    >
      <div className="photo-frame b2-photo-frame">
        <div className="photo-frame-inner">
          <img src={src} alt="" className="b2-img" draggable={false} />
        </div>
        <div className="photo-frame-corner tl" />
        <div className="photo-frame-corner tr" />
        <div className="photo-frame-corner bl" />
        <div className="photo-frame-corner br" />
      </div>
    </div>
  );
}

/* ── Lightbox ── */
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center lightbox-bg" onClick={onClose}>
      <div className="lightbox-card" onClick={e => e.stopPropagation()}>
        <img src={src} alt="" className="lightbox-img" />
      </div>
      <button className="lightbox-close" onClick={onClose}>
        <Icon name="X" size={24} />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   BLOCK 2 PHOTOS — данные
═══════════════════════════════════════ */
const BLOCK2_PHOTOS = [
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/2cacdc00-8209-48d2-aae4-93480856df10.png",
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/d1aae224-eee5-4b3c-bac6-b85e23190be6.png",
  "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/ca78ace9-9e04-4b27-a1a1-e1aab682080c.png",
];

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

  // Block 2 photo states
  const [b2States, setB2States] = useState<PhotoState[]>(["hidden","hidden","hidden"]);
  const [showCard2, setShowCard2] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const MUSIC_URL = "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/4ccf70ff-861f-4fd6-a45d-007aa1b6f91a.mp3";

  const BLOCK1_PHOTO = "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/d0891551-98a7-4554-924b-0e708a069193.png";

  const CARD1_TEXT = "Дорогая наша Галочка! 💛\n\nОт всей души поздравляем тебя с днём рождения! Оставайся всегда такой же милой, красивой и доброй ❤️\n\nТаких как ты — очень мало на нашей планете 🌸\n\nМы знаем, что ты очень хотела путешествовать, и поэтому...";

  const CARD2_TEXT = "Мы решили подарить тебе путешествие ✈️\n\nТы будешь смотреть на эти фото и, закрыв глаза, представлять себе эти места, в которых побывала — хоть и виртуально 🌍\n\nПосмотри, какая красота... 😍";

  const setB2State = (idx: number, state: PhotoState) => {
    setB2States(prev => {
      const next = [...prev];
      next[idx] = state;
      return next;
    });
  };

  const setAllB2States = (state: PhotoState) => {
    setB2States([state, state, state]);
  };

  /* Запускаем блок 2 */
  const startBlock2 = () => {
    // Блок 1 растворяется
    setShowBlock1Photo(false);
    setShowBlock1Card(false);

    // Чуть позже показываем блок 2
    setTimeout(() => {
      setShowBlock2(true);
      // Фото влетают по одному в ряд
      setTimeout(() => setB2State(0, "row"), 200);
      setTimeout(() => setB2State(1, "row"), 420);
      setTimeout(() => setB2State(2, "row"), 640);

      // Через 20с — сжимаются и улетают влево
      setTimeout(() => setAllB2States("shrinking"), 20800);
      setTimeout(() => {
        setAllB2States("parked");
        setShowCard2(true);
      }, 22000);
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
    setAllB2States("hidden");
    setShowCard2(false);
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

      {/* Gold glitters */}
      <div className="glitter-field">
        {Array.from({ length: 50 }).map((_, i) => {
          const isHeart = i % 4 === 0;
          const size = isHeart ? 14 + (i % 5) * 5 : 10 + (i % 6) * 4;
          const shapes = ["✦","✧","◆","★","♦","✦","◆","✧"];
          const hearts = ["♥","❤","♡","💛","🤍"];
          const goldColors = ["#e8a020","#ffd97d","#f5c842","#ffb347","#ffe066","#fce08a","#d4910e"];
          const heartColors = ["#c0213a","#e8354e","#ff6b8a","#ff4466","#d63060","#e8a020","#ffd97d"];
          const shape = isHeart ? hearts[i % hearts.length] : shapes[i % shapes.length];
          const color = isHeart ? heartColors[i % heartColors.length] : goldColors[i % goldColors.length];
          return (
            <div key={i} className="glitter" style={{
              left: `${((i * 2.1 + Math.sin(i * 0.7) * 18) % 100 + 100) % 100}%`,
              top: `${((i * 4.3 + Math.cos(i * 0.5) * 22) % 100 + 100) % 100}%`,
              fontSize: `${size}px`,
              color,
              animationDuration: `${4 + (i % 6)}s`,
              animationDelay: `${(i * 0.25) % 6}s`,
            }}>{shape}</div>
          );
        })}
      </div>

      {/* Sparkles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[{l:8,t:12,d:0.3,s:2.8,e:"✦"},{l:22,t:75,d:1.1,s:3.5,e:"✧"},{l:88,t:18,d:0.7,s:2.2,e:"⋆"},
          {l:93,t:65,d:1.8,s:4.0,e:"✦"},{l:50,t:8,d:0.5,s:3.1,e:"★"},{l:72,t:88,d:2.2,s:2.6,e:"✧"},
          {l:15,t:45,d:1.5,s:3.8,e:"⋆"},{l:38,t:90,d:0.9,s:2.4,e:"✦"},{l:64,t:35,d:2.5,s:3.3,e:"★"},
          {l:82,t:50,d:0.2,s:2.9,e:"✧"}
        ].map((sp,i) => (
          <div key={i} className="sparkle" style={{left:`${sp.l}%`,top:`${sp.t}%`,animationDelay:`${sp.d}s`,animationDuration:`${sp.s}s`}}>
            {sp.e}
          </div>
        ))}
      </div>

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

      {/* === БЛОК 2: 3 крупных фото + открытка === */}
      {showBlock2 && (
        <div className="b2-scene">
          {/* 3 фото поверх экрана */}
          {BLOCK2_PHOTOS.map((src, i) => (
            <Block2Photo
              key={i}
              src={src}
              index={i}
              state={b2States[i]}
              onClick={() => setLightboxSrc(src)}
            />
          ))}

          {/* Открытка появляется по центру после улёта фото */}
          <div
            className="b2-card-center"
            style={{
              opacity: showCard2 ? 1 : 0,
              transform: showCard2 ? "translate(-50%, -50%) scale(1)" : "translate(-50%, -50%) scale(0.6)",
              transition: "all 1s cubic-bezier(0.34,1.2,0.64,1)",
              transitionDelay: showCard2 ? "0.2s" : "0s",
            }}
          >
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
      ) : showCard2 ? (
        <div className="mt-8 flex flex-col items-center gap-3" style={{ position: "relative", zIndex: 10 }}>
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