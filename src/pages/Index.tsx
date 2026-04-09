import { useState, useRef, useEffect } from "react";
import Icon from "@/components/ui/icon";

const DEFAULT_PHOTOS = [
  {
    src: "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/files/c79a9be2-c1eb-454b-bcab-877f9ba0bc9f.jpg",
    caption: "Лучший день",
    rotate: -7,
  },
  {
    src: "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/files/6fd2b8a9-ac25-4b0a-887d-23e44b897696.jpg",
    caption: "С днём рождения!",
    rotate: 5,
  },
  {
    src: "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/files/a77187c0-08ac-43c7-978f-05f141bc2f6d.jpg",
    caption: "Всегда рядом",
    rotate: -4,
  },
];

interface PhotoItem {
  src: string;
  caption: string;
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

/* ── Upload Button ── */
function UploadZone({ photos, onChange }: { photos: PhotoItem[]; onChange: (p: PhotoItem[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const ROTATIONS = [-7, 5, -4, 8, -3, 6];
    const CAPTIONS = ["Наш момент", "С любовью", "Всегда вместе", "Навсегда", "Счастье", "Тепло"];
    Array.from(files).slice(0, 6).forEach((file, i) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const src = e.target?.result as string;
        const idx = photos.length + i;
        onChange([...photos.slice(0, idx), {
          src,
          caption: CAPTIONS[idx % CAPTIONS.length],
          rotate: ROTATIONS[idx % ROTATIONS.length],
          fileName: file.name,
        }, ...photos.slice(idx + 1)]);
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="upload-zone">
      <input ref={inputRef} type="file" accept="image/*" multiple className="hidden"
        onChange={(e) => handleFiles(e.target.files)} />

      <div className="upload-grid">
        {Array.from({ length: 3 }).map((_, i) => {
          const photo = photos[i];
          return (
            <div key={i} className="upload-slot" onClick={() => !photo && inputRef.current?.click()}>
              {photo ? (
                <>
                  <img src={photo.src} alt="" className="upload-preview" />
                  <button className="upload-remove" onClick={(e) => { e.stopPropagation(); const next = [...photos]; next.splice(i,1,DEFAULT_PHOTOS[i]); onChange(next); }}>
                    <Icon name="X" size={10} />
                  </button>
                </>
              ) : (
                <div className="upload-empty">
                  <Icon name="ImagePlus" size={20} style={{ color: "var(--gold)" }} />
                  <span>Фото {i + 1}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button className="upload-btn" onClick={() => inputRef.current?.click()}>
        <Icon name="Upload" size={14} />
        Загрузить фото
      </button>
      <p className="upload-hint">До 3 фотографий · Нажми на ячейку или кнопку</p>
    </div>
  );
}

export default function Index() {
  const [photos, setPhotos] = useState<PhotoItem[]>(DEFAULT_PHOTOS);
  const [opened, setOpened] = useState(false);
  const [visiblePhotos, setVisiblePhotos] = useState<number[]>([]);
  const [confetti, setConfetti] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [shaking, setShaking] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true); setShowUpload(false); setConfetti(true);
    photos.forEach((_, i) => {
      setTimeout(() => setVisiblePhotos((prev) => [...prev, i]), 350 + i * 230);
    });
    setTimeout(() => setConfetti(false), 3500);
  };

  const handleHover = () => {
    if (!opened) { setShaking(true); setTimeout(() => setShaking(false), 600); }
  };

  const handleReset = () => {
    setOpened(false); setVisiblePhotos([]); setSelectedPhoto(null); setConfetti(false);
  };

  const handleDownload = (photo: PhotoItem) => {
    const a = document.createElement("a");
    a.href = photo.src;
    a.download = photo.fileName || `photo-${photo.caption}.jpg`;
    // для внешних URL открываем в новой вкладке
    if (photo.src.startsWith("http")) {
      window.open(photo.src, "_blank");
    } else {
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }
  };

  /* Fan positions: left, center, right */
  const FAN = [
    { x: -145, y: -180 },
    { x:    0, y: -230 },
    { x:  145, y: -175 },
  ];

  return (
    <div className="gift-bg min-h-screen flex flex-col items-center justify-center overflow-hidden relative py-8">
      <Confetti active={confetti} />

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

      {/* Title */}
      <p className="gift-title mb-6 text-center px-4">
        {opened ? "С любовью, для тебя 💛" : "Нажми, чтобы открыть подарок"}
      </p>

      {/* Upload panel (before open) */}
      {!opened && showUpload && (
        <div className="mb-6 animate-in">
          <UploadZone photos={photos} onChange={setPhotos} />
        </div>
      )}

      {/* Scene */}
      <div className="scene-wrap">

        {/* Flying photos — rendered inside scene, fan out above box */}
        {photos.map((photo, i) => {
          const isVisible = visiblePhotos.includes(i);
          const pos = FAN[i] ?? FAN[0];
          return (
            <div key={i} className="photo-fly"
              style={{
                transform: isVisible
                  ? `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px)) rotate(${photo.rotate}deg) scale(1)`
                  : `translate(-50%, -50%) rotate(0deg) scale(0.1)`,
                opacity: isVisible ? 1 : 0,
                transition: "all 0.72s cubic-bezier(0.34,1.56,0.64,1)",
                transitionDelay: `${i * 0.15}s`,
                zIndex: 30 + i,
                cursor: isVisible ? "pointer" : "default",
              }}
              onClick={() => isVisible && setSelectedPhoto(i)}
            >
              <div className="polaroid">
                <img src={photo.src} alt={photo.caption} className="polaroid-img" draggable={false} />
                <div className="polaroid-caption">{photo.caption}</div>
              </div>
            </div>
          );
        })}

        {/* Box */}
        <div className="box-anchor">
          <RoundBox opened={opened} onClick={handleOpen} onHover={handleHover} shaking={shaking} />
        </div>
      </div>

      {/* CTA / controls */}
      {!opened ? (
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="cta-bounce flex flex-col items-center gap-1">
            <Icon name="ChevronUp" size={20} style={{ color: "var(--gold)" }} />
            <span className="cta-label">Нажми на коробку</span>
          </div>
          <button className="edit-btn" onClick={() => setShowUpload(v => !v)}>
            <Icon name={showUpload ? "ChevronUp" : "ImagePlus"} size={14} />
            {showUpload ? "Скрыть" : "Добавить свои фото"}
          </button>
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
          <div className="lightbox-card" style={{ rotate: `${photos[selectedPhoto].rotate * 0.4}deg` }}
            onClick={(e) => e.stopPropagation()}>
            <img src={photos[selectedPhoto].src} alt={photos[selectedPhoto].caption} className="lightbox-img" />
            <div className="lightbox-footer">
              <div className="lightbox-caption">{photos[selectedPhoto].caption}</div>
              <button className="lightbox-download" onClick={() => handleDownload(photos[selectedPhoto])}>
                <Icon name="Download" size={16} />
                Скачать
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
