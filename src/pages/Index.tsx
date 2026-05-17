import Icon from "@/components/ui/icon";
import Confetti from "@/components/gift/Confetti";
import GiftBackground from "@/components/gift/GiftBackground";
import GiftParade from "@/components/gift/GiftParade";
import { RoundBox, Postcard, Block2Photo, Lightbox } from "@/components/gift/GiftBox";
import { useGiftState } from "@/gift/useGiftState";
import {
  BLOCK1_PHOTO, BLOCK2_PHOTOS, BLOCK3_PHOTOS, BLOCK4_PHOTOS, BLOCK5_PHOTOS,
  CARD1_TEXT, CARD2_TEXT, CARD3_TEXT, CARD4_TEXT, CARD5_TEXT,
  CARD2_BG, CARD3_BG, CARD4_BG, CARD5_BG,
} from "@/gift/giftData";

export default function Index() {
  const s = useGiftState();

  return (
    <div className="gift-bg min-h-screen flex flex-col items-center justify-center overflow-hidden relative py-8">
      <Confetti active={s.confetti} />
      <GiftBackground />

      {/* Music control */}
      {s.opened && (
        <button className="music-btn" onClick={s.handleToggleMusic} title={s.isPlaying ? "Пауза" : "Играть"}>
          <span className={`music-icon${s.isPlaying ? " music-playing" : ""}`}>
            {s.isPlaying ? "♫" : "♪"}
          </span>
          {s.isPlaying && (
            <span className="music-bars">
              <span /><span /><span /><span />
            </span>
          )}
        </button>
      )}

      {/* === ЗАСТАВКА: надпись сверху, коробка, надпись снизу === */}
      {!s.opened && (
        <div className="box-stage">
          <p className="gift-title text-center px-4">
            Нажми, чтобы открыть подарок
          </p>
          <div style={{ position: "relative", marginTop: 8, marginBottom: 8 }}>
            <RoundBox opened={false} onClick={s.handleOpen} onHover={s.handleHover} shaking={s.shaking} />
          </div>
          <p className="cta-label-big">👆 Нажми на коробку</p>
        </div>
      )}

      {/* Title после открытия */}
      {s.opened && (
        <p className="gift-title mb-6 text-center px-4">С любовью, для тебя 💛</p>
      )}

      {/* === БЛОК 1: Фото + Открытка === */}
      {s.opened && !s.showBlock2 && (
        <div
          className="block1-scene"
          style={{ opacity: s.showBlock1Photo ? 1 : 0, transition: "opacity 0.6s ease" }}
        >
          <div className={`block1-photo${s.showBlock1Photo ? " block1-photo--visible" : ""}`}>
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
          <Postcard text={CARD1_TEXT} visible={s.showBlock1Card} animFrom="right" />
        </div>
      )}

      {/* Кнопка "Дальше" после блока 1 */}
      {s.isBlock1Done && !s.showBlock2 && (
        <button className="next-btn" onClick={s.startBlock2}>Дальше ✈️</button>
      )}

      {/* === БЛОК 2: открытка → фото === */}
      {s.showBlock2 && !s.showBlock3 && (
        <div className="block2-scene">
          <div className="b2-card-wrap" style={{
            opacity: s.showCard2 ? 1 : 0,
            transform: s.showCard2 ? "scale(1)" : "scale(0.7)",
            transition: "all 0.9s cubic-bezier(0.34,1.2,0.64,1)",
            pointerEvents: s.showCard2 ? "auto" : "none",
            maxHeight: s.showCard2 ? "600px" : "0px",
          }}>
            <Postcard text={CARD2_TEXT} visible={s.showCard2} emoji="✈️" flowers={["🌍","🗺️","✈️"]} bgStyle={CARD2_BG} rotate={2} animFrom="center" />
          </div>
          {s.b2PhotosVisible && (
            <div className="b2-row">
              {BLOCK2_PHOTOS.map((src, i) => (
                <Block2Photo key={i} src={src} index={i} state={s.b2States[i]} onClick={() => s.setLightboxSrc(src)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Кнопка "Дальше" после блока 2 */}
      {s.b2Done && !s.showBlock3 && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <button className="next-btn" onClick={s.startBlock3}>Дальше 😊</button>
        </div>
      )}

      {/* === БЛОК 3: открытка → фото === */}
      {s.showBlock3 && !s.showBlock4 && (
        <div className="block2-scene">
          <div className="b2-card-wrap" style={{
            opacity: s.showCard3 ? 1 : 0,
            transform: s.showCard3 ? "scale(1)" : "scale(0.7)",
            transition: "all 0.9s cubic-bezier(0.34,1.2,0.64,1)",
            pointerEvents: s.showCard3 ? "auto" : "none",
            maxHeight: s.showCard3 ? "600px" : "0px",
          }}>
            <Postcard text={CARD3_TEXT} visible={s.showCard3} emoji="😊" flowers={["💛","🌸","💛"]} bgStyle={CARD3_BG} rotate={-2} animFrom="center" />
          </div>
          {s.b3PhotosVisible && (
            <div className="b2-row">
              {BLOCK3_PHOTOS.map((src, i) => (
                <Block2Photo key={i} src={src} index={i} state={s.b3States[i]} onClick={() => s.setLightboxSrc(src)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Кнопка "Дальше" после блока 3 */}
      {s.b3Done && !s.showBlock4 && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <button className="next-btn" onClick={s.startBlock4}>Дальше 🏛️</button>
        </div>
      )}

      {/* === БЛОК 4: открытка → фото === */}
      {s.showBlock4 && !s.showBlock5 && (
        <div className="block2-scene">
          <div className="b2-card-wrap" style={{
            opacity: s.showCard4 ? 1 : 0,
            transform: s.showCard4 ? "scale(1)" : "scale(0.7)",
            transition: "all 0.9s cubic-bezier(0.34,1.2,0.64,1)",
            pointerEvents: s.showCard4 ? "auto" : "none",
            maxHeight: s.showCard4 ? "600px" : "0px",
          }}>
            <Postcard text={CARD4_TEXT} visible={s.showCard4} emoji="🏛️" flowers={["🗽","🕌","🗼"]} bgStyle={CARD4_BG} rotate={2} animFrom="center" />
          </div>
          {s.b4PhotosVisible && (
            <div className="b2-row">
              {BLOCK4_PHOTOS.map((src, i) => (
                <Block2Photo key={i} src={src} index={i} state={s.b4States[i]} onClick={() => s.setLightboxSrc(src)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Кнопка "Дальше" после блока 4 */}
      {s.b4Done && !s.showBlock5 && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <button className="next-btn" onClick={s.startBlock5}>Дальше 🌸</button>
        </div>
      )}

      {/* === БЛОК 5: открытка → фото === */}
      {s.showBlock5 && !s.showParade && (
        <div className="block2-scene">
          <div className="b2-card-wrap" style={{
            opacity: s.showCard5 ? 1 : 0,
            transform: s.showCard5 ? "scale(1)" : "scale(0.7)",
            transition: "all 0.9s cubic-bezier(0.34,1.2,0.64,1)",
            pointerEvents: s.showCard5 ? "auto" : "none",
            maxHeight: s.showCard5 ? "600px" : "0px",
          }}>
            <Postcard text={CARD5_TEXT} visible={s.showCard5} emoji="🌸" flowers={["💜","🌿","💜"]} bgStyle={CARD5_BG} rotate={-2} animFrom="center" />
          </div>
          {s.b5PhotosVisible && (
            <div className="b2-row">
              {BLOCK5_PHOTOS.map((src, i) => (
                <Block2Photo key={i} src={src} index={i} state={s.b5States[i]} onClick={() => s.setLightboxSrc(src)} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Кнопка "Финальный парад" после блока 5 */}
      {s.b5Done && !s.showParade && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <button className="next-btn" onClick={s.startParade}>Все фото вместе 🎉</button>
        </div>
      )}

      {/* === ФИНАЛЬНЫЙ ПАРАД === */}
      {s.showParade && (
        <GiftParade
          paradeVisible={s.paradeVisible}
          showParadeCaption={s.showParadeCaption}
          onPhotoClick={s.setLightboxSrc}
        />
      )}

      {/* Controls */}
      {s.showParadeCaption && (
        <div className="mt-8 flex flex-col items-center gap-3">
          <button className="reset-btn" onClick={s.handleReset}>
            <Icon name="RefreshCw" size={14} />
            Открыть снова
          </button>
        </div>
      )}

      {/* Lightbox */}
      {s.lightboxSrc && <Lightbox src={s.lightboxSrc} onClose={() => s.setLightboxSrc(null)} />}
    </div>
  );
}
