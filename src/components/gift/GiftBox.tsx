import Icon from "@/components/ui/icon";

/* ── Types ── */
export type PhotoState = "hidden" | "row";

/* ══════════════════════════════════════
   RoundBox
══════════════════════════════════════ */
export function RoundBox({ opened, onClick, onHover, shaking }: {
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

/* ══════════════════════════════════════
   Postcard
══════════════════════════════════════ */
export function Postcard({
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

/* ══════════════════════════════════════
   Block2Photo
══════════════════════════════════════ */
export function Block2Photo({
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
  const rots = [-3, 1, -2];
  const rot = rots[index] ?? 0;

  return (
    <div
      className="b2-photo"
      style={{
        opacity: state === "row" ? 1 : 0,
        transform: state === "row" ? `rotate(${rot}deg) scale(1)` : "scale(0.7) translateY(30px)",
        transition: "all 0.9s cubic-bezier(0.34,1.2,0.64,1)",
        transitionDelay: `${index * 0.2}s`,
        cursor: state === "row" ? "pointer" : "default",
      }}
      onClick={state === "row" ? onClick : undefined}
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

/* ══════════════════════════════════════
   Lightbox
══════════════════════════════════════ */
export function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
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
