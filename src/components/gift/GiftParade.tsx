import Icon from "@/components/ui/icon";
import { ALL_PHOTOS } from "@/gift/giftData";

interface GiftParadeProps {
  paradeVisible: boolean[];
  showParadeCaption: boolean;
  onPhotoClick: (src: string) => void;
}

export default function GiftParade({ paradeVisible, showParadeCaption, onPhotoClick }: GiftParadeProps) {
  return (
    <div className="parade-scene">
      <div className="parade-grid">
        {ALL_PHOTOS.map((photo, i) => (
          <div
            key={i}
            className="parade-item"
            style={{
              opacity: paradeVisible[i] ? 1 : 0,
              transform: paradeVisible[i] ? "scale(1) translateY(0)" : "scale(0.7) translateY(20px)",
              transition: "all 0.6s cubic-bezier(0.34,1.2,0.64,1)",
            }}
          >
            <div className="parade-photo-wrap">
              <img
                src={photo.src}
                alt=""
                className="parade-img"
                draggable={false}
                onClick={() => onPhotoClick(photo.src)}
              />
              <a
                className="parade-download-btn"
                href={photo.src}
                download={photo.fileName}
                target="_blank"
                rel="noreferrer"
              >
                <Icon name="Download" size={13} />
                Скачать
              </a>
            </div>
          </div>
        ))}
      </div>

      <div
        className="parade-caption"
        style={{
          opacity: showParadeCaption ? 1 : 0,
          transform: showParadeCaption ? "translateY(0) scale(1)" : "translateY(16px) scale(0.92)",
          transition: "all 1s cubic-bezier(0.34,1.2,0.64,1)",
        }}
      >
        С любовью от нас, в твой День рождения! 💛❤️🌸
      </div>
    </div>
  );
}
