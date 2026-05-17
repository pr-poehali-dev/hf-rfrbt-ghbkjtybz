import { useRef, useEffect } from "react";

interface Particle {
  id: number; x: number; y: number; color: string; size: number;
  speedX: number; speedY: number; rotation: number; rotationSpeed: number;
  shape: "rect" | "circle" | "star"; opacity: number;
}

export default function Confetti({ active }: { active: boolean }) {
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
