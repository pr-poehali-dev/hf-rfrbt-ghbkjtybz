import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const PHOTOS = [
  {
    id: 1,
    src: "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/files/c79a9be2-c1eb-454b-bcab-877f9ba0bc9f.jpg",
    caption: "Лучший день",
    rotate: -7,
  },
  {
    id: 2,
    src: "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/files/6fd2b8a9-ac25-4b0a-887d-23e44b897696.jpg",
    caption: "С днём рождения!",
    rotate: 5,
  },
  {
    id: 3,
    src: "https://cdn.poehali.dev/projects/d16ae21f-f210-4a6c-a55c-d3151bda89a5/files/a77187c0-08ac-43c7-978f-05f141bc2f6d.jpg",
    caption: "Всегда рядом",
    rotate: -4,
  },
];

interface Particle {
  id: number;
  x: number; y: number;
  color: string;
  size: number;
  speedX: number; speedY: number;
  rotation: number; rotationSpeed: number;
  shape: "rect" | "circle" | "star";
  opacity: number;
}

function Confetti({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const COLORS = ["#e8a020", "#ffd97d", "#c0392b", "#ff6b6b", "#fff5d6", "#f783ac", "#6bcb77", "#4d96ff"];

  useEffect(() => {
    if (!active) { particlesRef.current = []; return; }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    particlesRef.current = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: canvas.width / 2 + (Math.random() - 0.5) * 100,
      y: canvas.height * 0.48,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 11 + 5,
      speedX: (Math.random() - 0.5) * 15,
      speedY: -(Math.random() * 20 + 9),
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 13,
      shape: (["rect", "circle", "star"] as const)[Math.floor(Math.random() * 3)],
      opacity: 1,
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      particlesRef.current.forEach((p) => {
        if (p.opacity <= 0) return;
        alive = true;
        p.x += p.speedX; p.y += p.speedY;
        p.speedY += 0.52; p.speedX *= 0.99;
        p.rotation += p.rotationSpeed;
        if (p.y > canvas.height * 0.65) p.opacity -= 0.022;
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        if (p.shape === "circle") {
          ctx.beginPath(); ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2); ctx.fill();
        } else if (p.shape === "star") {
          ctx.beginPath();
          for (let i = 0; i < 5; i++) {
            const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
            const r = i % 2 === 0 ? p.size / 2 : p.size / 4;
            if (i === 0) ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
            else ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
          }
          ctx.closePath(); ctx.fill();
        } else {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        }
        ctx.restore();
      });
      if (alive) rafRef.current = requestAnimationFrame(animate);
      else ctx.clearRect(0, 0, canvas.width, canvas.height);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" style={{ display: active ? "block" : "none" }} />;
}

/* ── Круглая 3D-коробка ── */
function RoundBox({ opened, onClick, onHover, shaking }: {
  opened: boolean;
  onClick: () => void;
  onHover: () => void;
  shaking: boolean;
}) {
  return (
    <div
      className={`round-box-scene${shaking ? " shake" : ""}`}
      onClick={onClick}
      onMouseEnter={onHover}
      style={{ cursor: opened ? "default" : "pointer" }}
    >
      {/* ── LID ── */}
      <div className={`round-lid${opened ? " lid-open" : ""}`}>
        {/* ellipse top */}
        <div className="lid-top-ellipse">
          <div className="lid-top-inner" />
        </div>
        {/* cylinder side */}
        <div className="lid-side">
          <div className="lid-gold-rim" />
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="round-body">
        {/* gold horizontal ribbon */}
        <div className="body-ribbon" />

        {/* rose SVG emblem */}
        <div className="body-rose">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="56" height="56">
            <circle cx="32" cy="32" r="18" stroke="#e8a020" strokeWidth="1.5" fill="none" opacity="0.35"/>
            <path d="M32 20 C32 20 22 26 22 33 C22 39 26 42 32 42 C38 42 42 39 42 33 C42 26 32 20 32 20Z" fill="#e8a020" opacity="0.7"/>
            <path d="M32 24 C32 24 25 29 25 34 C25 38 28 40 32 40 C36 40 39 38 39 34 C39 29 32 24 32 24Z" fill="#ffd97d" opacity="0.6"/>
            <path d="M32 28 C32 28 28 31 28 35 C28 37.5 29.8 39 32 39 C34.2 39 36 37.5 36 35 C36 31 32 28 32 28Z" fill="#e8a020" opacity="0.9"/>
            <circle cx="32" cy="35" r="3" fill="#ffd97d" opacity="0.95"/>
          </svg>
        </div>

        {/* inscription */}
        <div className="body-inscription">С любовью</div>

        {/* bow */}
        <div className="body-bow">
          <div className="bow-left-loop" />
          <div className="bow-right-loop" />
          <div className="bow-knot-circle" />
          <div className="bow-tail-l" />
          <div className="bow-tail-r" />
          {/* charm */}
          <div className="bow-charm-line" />
          <div className="bow-charm">♡</div>
        </div>

        {/* inner glow when open */}
        {opened && <div className="body-inner-glow" />}
      </div>

      {/* bottom ellipse shadow */}
      <div className="box-shadow-ellipse" />
    </div>
  );
}

export default function Index() {
  const [opened, setOpened] = useState(false);
  const [visiblePhotos, setVisiblePhotos] = useState<number[]>([]);
  const [confetti, setConfetti] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<number | null>(null);
  const [shaking, setShaking] = useState(false);

  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    setConfetti(true);
    PHOTOS.forEach((_, i) => {
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

  return (
    <div className="gift-bg min-h-screen flex flex-col items-center justify-center overflow-hidden relative">
      <Confetti active={confetti} />

      {/* Sparkles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[
          { l:8,  t:12, d:0.3, s:2.8, e:"✦" }, { l:22, t:75, d:1.1, s:3.5, e:"✧" },
          { l:88, t:18, d:0.7, s:2.2, e:"⋆" }, { l:93, t:65, d:1.8, s:4.0, e:"✦" },
          { l:50, t:8,  d:0.5, s:3.1, e:"★" }, { l:72, t:88, d:2.2, s:2.6, e:"✧" },
          { l:15, t:45, d:1.5, s:3.8, e:"⋆" }, { l:38, t:90, d:0.9, s:2.4, e:"✦" },
          { l:64, t:35, d:2.5, s:3.3, e:"★" }, { l:82, t:50, d:0.2, s:2.9, e:"✧" },
        ].map((sp, i) => (
          <div key={i} className="sparkle" style={{ left:`${sp.l}%`, top:`${sp.t}%`, animationDelay:`${sp.d}s`, animationDuration:`${sp.s}s` }}>
            {sp.e}
          </div>
        ))}
      </div>

      {/* Title */}
      <p className="gift-title mb-8 text-center px-4">
        {opened ? "С любовью, для тебя 💛" : "Нажми, чтобы открыть подарок"}
      </p>

      {/* Scene */}
      <div className="relative flex items-end justify-center" style={{ width: 420, height: 460 }}>

        {/* Flying photos */}
        {PHOTOS.map((photo, i) => {
          const isVisible = visiblePhotos.includes(i);
          const positions = [
            { x: -168, y: -220 },
            { x: 6,    y: -278 },
            { x: 172,  y: -205 },
          ];
          const pos = positions[i];
          return (
            <div
              key={photo.id}
              className="polaroid-wrap"
              style={{
                position: "absolute",
                bottom: "calc(50% + 20px)",
                left: "50%",
                width: 155,
                transform: isVisible
                  ? `translate(calc(-50% + ${pos.x}px), ${pos.y}px) rotate(${photo.rotate}deg) scale(1)`
                  : `translate(-50%, 50px) rotate(0deg) scale(0.15)`,
                opacity: isVisible ? 1 : 0,
                transition: "all 0.72s cubic-bezier(0.34, 1.56, 0.64, 1)",
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
        <div style={{ position: "absolute", bottom: 0, left: "50%", transform: "translateX(-50%)" }}>
          <RoundBox opened={opened} onClick={handleOpen} onHover={handleHover} shaking={shaking} />
        </div>
      </div>

      {/* CTA */}
      {!opened && (
        <div className="mt-8 flex flex-col items-center gap-1 cta-bounce">
          <Icon name="ChevronUp" size={20} style={{ color: "var(--gold)" }} />
          <span className="cta-label">Нажми на коробку</span>
        </div>
      )}

      {/* Reset */}
      {opened && visiblePhotos.length === PHOTOS.length && (
        <button className="mt-8 reset-btn" onClick={handleReset}>
          <Icon name="RefreshCw" size={14} />
          Открыть снова
        </button>
      )}

      {/* Lightbox */}
      {selectedPhoto !== null && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center lightbox-bg"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="lightbox-card"
            style={{ rotate: `${PHOTOS[selectedPhoto].rotate * 0.4}deg` }}
            onClick={(e) => e.stopPropagation()}
          >
            <img src={PHOTOS[selectedPhoto].src} alt={PHOTOS[selectedPhoto].caption} className="lightbox-img" />
            <div className="lightbox-caption">{PHOTOS[selectedPhoto].caption}</div>
          </div>
          <button className="lightbox-close" onClick={() => setSelectedPhoto(null)}>
            <Icon name="X" size={24} />
          </button>
        </div>
      )}
    </div>
  );
}
