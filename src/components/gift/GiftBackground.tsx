export default function GiftBackground() {
  return (
    <>
      {/* Gold glitters — плавающие блёстки и сердечки */}
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
        ].map((sp, i) => (
          <div key={i} className="sparkle" style={{left:`${sp.l}%`,top:`${sp.t}%`,animationDelay:`${sp.d}s`,animationDuration:`${sp.s}s`}}>
            {sp.e}
          </div>
        ))}
      </div>
    </>
  );
}
