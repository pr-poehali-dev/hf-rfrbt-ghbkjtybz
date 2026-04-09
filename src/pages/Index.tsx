import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const ROTATIONS = [-7, 5, -4, 8, -3, 6, -5, 9, -6, 4];

const DEFAULT_PHOTOS = [
  { src: "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/b5e09914-3a46-4307-bc5c-374a8632e876.png", rotate: 0, fileName: "photo9.png" },
  { src: "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/de5def99-c182-4d3f-80e6-57183ef4d148.jpg", rotate: -7, fileName: "photo1.jpg" },
  { src: "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/2ea0a8dd-4812-4fda-b4f0-5ca0e041582e.jpg", rotate: 5, fileName: "photo2.jpg" },
  { src: "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/da567b94-ce61-402c-a212-167db2b9366e.jpg", rotate: -4, fileName: "photo3.jpg" },
  { src: "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/433bf212-c395-4f31-9399-81c279560e9c.jpg", rotate: 8, fileName: "photo4.jpg" },
  { src: "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/2a98fe9f-d6f2-4b11-a4cc-d9f7d9e9357e.jpg", rotate: -3, fileName: "photo5.jpg" },
  { src: "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/b76ef4e0-8005-465a-8ffc-b1e70634f560.jpg", rotate: 6, fileName: "photo6.jpg" },
  { src: "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/6d7b8cca-3fae-4f39-bac8-2d18460c24c4.jpg", rotate: -5, fileName: "photo7.jpg" },
  { src: "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/40272bd3-65c1-4413-b4d8-ffe4b8284889.jpg", rotate: 9, fileName: "photo8.jpg" },
];

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

/* ── Fan positions for up to 10 photos ── */
function getFanPositions(count: number) {
  const positions = [];
  const spread = Math.min(260, 40 * count);
  for (let i = 0; i < count; i++) {
    const t = count === 1 ? 0.5 : i / (count - 1);
    const x = (t - 0.5) * spread;
    // arc: center photo highest, edges lower
    const arc = -Math.pow((t - 0.5) * 2, 2) * 40;
    const y = -170 + arc;
    positions.push({ x, y });
  }
  return positions;
}

export default function Index() {
  const isEditMode = new URLSearchParams(window.location.search).get("edit") === "true";

  const [photos, setPhotos] = useState<PhotoItem[]>(DEFAULT_PHOTOS);
  const [opened, setOpened] = useState(false);
  const [visiblePhotos, setVisiblePhotos] = useState<number[]>([]);
  const [confetti, setConfetti] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [shaking, setShaking] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [boxHidden, setBoxHidden] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MUSIC_URL = "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/bucket/4ccf70ff-861f-4fd6-a45d-007aa1b6f91a.mp3";

  const handleOpen = () => {
    if (opened) return;
    setOpened(true); setShowUpload(false); setConfetti(true);
    // play music
    if (MUSIC_URL) {
      const audio = new Audio(MUSIC_URL);
      audio.volume = 0.75;
      audioRef.current = audio;
      audio.play().then(() => setIsPlaying(true)).catch(() => {});
      audio.onended = () => setIsPlaying(false);
    }
    // Первое фото — крупное, по центру
    setTimeout(() => setVisiblePhotos([0]), 350);
    // Через 5 сек — коробка и первое фото исчезают ОДНОВРЕМЕННО, сразу вылетают остальные
    setTimeout(() => setBoxHidden(true), 5000);
    photos.slice(1).forEach((_, i) => {
      setTimeout(() => setVisiblePhotos((prev) => [...prev, i + 1]), 5000 + i * 200);
    });
    setTimeout(() => setConfetti(false), 3500);
  };

  const handleHover = () => {
    if (!opened) { setShaking(true); setTimeout(() => setShaking(false), 600); }
  };

  const handleReset = () => {
    setOpened(false); setVisiblePhotos([]); setSelectedPhoto(null); setConfetti(false); setBoxHidden(false);
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

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const newPhotos: PhotoItem[] = [];
    Array.from(files).slice(0, 10).forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        newPhotos.push({
          src: e.target?.result as string,
          rotate: ROTATIONS[i % ROTATIONS.length],
          fileName: file.name,
        });
        if (newPhotos.length === Math.min(files.length, 10)) {
          setPhotos(newPhotos);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDownload = (photo: PhotoItem) => {
    if (photo.src.startsWith("data:")) {
      const a = document.createElement("a");
      a.href = photo.src;
      a.download = photo.fileName || "photo.jpg";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    } else {
      window.open(photo.src, "_blank");
    }
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

  // Позиции для фото 1-9 (без первого) когда коробка исчезла
  const fanPositions = getFanPositions(photos.length - 1);

  return (
    <div className="gift-bg min-h-screen flex flex-col items-center justify-center overflow-hidden relative py-8">
      <Confetti active={confetti} />

      {/* Gold glitters — плавающие блёстки */}
      <div className="glitter-field">
        {Array.from({ length: 30 }).map((_, i) => {
          const size = 4 + Math.random() * 8;
          const shapes = ["✦","✧","◆","▲","●","★","♦"];
          const colors = ["#e8a020","#ffd97d","#f5c842","#ffb347","#ffe066","#fce08a"];
          const shape = shapes[i % shapes.length];
          const color = colors[i % colors.length];
          return (
            <div key={i} className="glitter" style={{
              left: `${(i * 3.7 + Math.sin(i) * 15) % 100}%`,
              top: `${(i * 7.3 + Math.cos(i) * 20) % 100}%`,
              fontSize: `${size}px`,
              color,
              animationDuration: `${3 + (i % 5)}s`,
              animationDelay: `${(i * 0.4) % 5}s`,
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

      {/* Music control — появляется после открытия */}
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

      {/* Upload panel — только в режиме редактирования */}
      {isEditMode && !opened && showUpload && (
        <div className="mb-5 animate-in" style={{ width: "min(360px, 92vw)" }}>
          <div className="upload-zone">
            <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden"
              onChange={(e) => handleFiles(e.target.files)} />
            {/* Preview grid */}
            {photos.length > 0 && (
              <div className="upload-grid mb-3">
                {photos.map((p, i) => (
                  <div key={i} className="upload-slot" style={{ position: "relative" }}>
                    <img src={p.src} alt="" className="upload-preview" />
                    <button className="upload-remove" onClick={() => {
                      const next = photos.filter((_, idx) => idx !== i);
                      setPhotos(next.length > 0 ? next : DEFAULT_PHOTOS);
                    }}>
                      <Icon name="X" size={9} />
                    </button>
                  </div>
                ))}
                {photos.length < 10 && (
                  <div className="upload-slot upload-add" onClick={() => fileInputRef.current?.click()}>
                    <div className="upload-empty">
                      <Icon name="Plus" size={22} style={{ color: "var(--gold)" }} />
                      <span>Добавить</span>
                    </div>
                  </div>
                )}
              </div>
            )}
            <button className="upload-btn" onClick={() => fileInputRef.current?.click()}>
              <Icon name="ImagePlus" size={14} />
              {photos === DEFAULT_PHOTOS ? "Выбрать свои фото" : "Добавить ещё"}
            </button>
            <p className="upload-hint mt-2">До 10 фотографий</p>
          </div>
        </div>
      )}

      {/* Scene */}
      <div className={`scene-wrap${boxHidden ? " scene-expanded" : ""}`}>

        {/* Первое фото — крупная заставка по центру */}
        {visiblePhotos.includes(0) && (
          <div
            className="photo-hero"
            style={{
              opacity: boxHidden ? 0 : 1,
              transform: boxHidden ? "translate(-50%, -50%) scale(0.3)" : "translate(-50%, -50%) scale(1)",
              transition: "all 0.6s cubic-bezier(0.34,1.2,0.64,1)",
              pointerEvents: boxHidden ? "none" : "auto",
            }}
            onClick={() => !boxHidden && setSelectedPhoto(0)}
          >
            <div className="polaroid">
              <img src={photos[0].src} alt="" className="polaroid-img" draggable={false} />
            </div>
          </div>
        )}

        {/* Остальные фото — веер после исчезновения коробки */}
        {photos.slice(1).map((photo, i) => {
          const isVisible = visiblePhotos.includes(i + 1);
          const pos = fanPositions[i] ?? { x: 0, y: -150 };
          return (
            <div key={i + 1} className="photo-fly"
              style={{
                transform: isVisible
                  ? `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) rotate(${photo.rotate}deg) scale(1)`
                  : `translate(-50%, -50%) rotate(0deg) scale(0.08)`,
                opacity: isVisible ? 1 : 0,
                transition: "all 0.72s cubic-bezier(0.34,1.56,0.64,1)",
                transitionDelay: `${i * 0.12}s`,
                zIndex: 30 + i,
                cursor: isVisible ? "pointer" : "default",
              }}
              onClick={() => isVisible && setSelectedPhoto(i + 1)}
            >
              <div className="polaroid">
                <img src={photo.src} alt="" className="polaroid-img" draggable={false} />
              </div>
            </div>
          );
        })}

        {/* Box — исчезает через 5 сек */}
        <div className="box-anchor" style={{
          opacity: boxHidden ? 0 : 1,
          transform: `translateX(-50%) ${boxHidden ? "scale(0.7) translateY(30px)" : "scale(1)"}`,
          transition: "all 0.7s cubic-bezier(0.4,0,0.2,1)",
          pointerEvents: boxHidden ? "none" : "auto",
        }}>
          <RoundBox opened={opened} onClick={handleOpen} onHover={handleHover} shaking={shaking} />
        </div>
      </div>

      {/* Controls */}
      {!opened ? (
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="cta-bounce flex flex-col items-center gap-1">
            <Icon name="ChevronUp" size={20} style={{ color: "var(--gold)" }} />
            <span className="cta-label">Нажми на коробку</span>
          </div>
          {isEditMode && (
            <button className="edit-btn" onClick={() => setShowUpload(v => !v)}>
              <Icon name={showUpload ? "ChevronUp" : "ImagePlus"} size={14} />
              {showUpload ? "Скрыть" : "Добавить свои фото"}
            </button>
          )}
        </div>
      ) : visiblePhotos.length === photos.length ? (
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="upload-hint text-center">Нажми на фото, чтобы посмотреть или скачать</p>
          <button className="reset-btn" onClick={handleReset}>
            <Icon name="RefreshCw" size={14} />
            Открыть снова
          </button>
        </div>
      ) : null}

      {/* Lightbox */}
      {selectedPhoto !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center lightbox-bg"
          onClick={() => setSelectedPhoto(null)}>
          <div className="lightbox-card"
            style={{ rotate: `${photos[selectedPhoto].rotate * 0.4}deg` }}
            onClick={(e) => e.stopPropagation()}>
            <img src={photos[selectedPhoto].src} alt="" className="lightbox-img" />
            <div className="lightbox-footer">
              <button className="lightbox-nav" onClick={(e) => { e.stopPropagation(); setSelectedPhoto((selectedPhoto - 1 + photos.length) % photos.length); }}>
                <Icon name="ChevronLeft" size={18} />
              </button>
              <button className="lightbox-download" onClick={() => handleDownload(photos[selectedPhoto])}>
                <Icon name="Download" size={15} />
                Скачать
              </button>
              <button className="lightbox-nav" onClick={(e) => { e.stopPropagation(); setSelectedPhoto((selectedPhoto + 1) % photos.length); }}>
                <Icon name="ChevronRight" size={18} />
              </button>
            </div>
          </div>
          <button className="lightbox-close" onClick={() => setSelectedPhoto(null)}>
            <Icon name="X" size={24} />
          </button>
        </div>
      )}
    </div>
  );
}