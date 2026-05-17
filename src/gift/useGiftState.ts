import { useState, useRef } from "react";
import { PhotoState } from "@/components/gift/GiftBox";
import { MUSIC_BOX_URL, MUSIC_MAIN_URL, ALL_PHOTOS } from "@/gift/giftData";

function playAudio(url: string, volume = 0.75): HTMLAudioElement {
  const audio = new Audio(url);
  audio.volume = volume;
  audio.play().catch(() => {});
  return audio;
}

function fadeOutAudio(audio: HTMLAudioElement, onDone?: () => void) {
  const fadeOut = setInterval(() => {
    if (audio.volume > 0.05) { audio.volume -= 0.05; }
    else { audio.pause(); clearInterval(fadeOut); onDone?.(); }
  }, 80);
}

export function useGiftState() {
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
  const [showBlock3, setShowBlock3] = useState(false);

  // Block 3
  const [b3States, setB3States] = useState<PhotoState[]>(["hidden","hidden","hidden"]);
  const [showCard3, setShowCard3] = useState(false);
  const [b3PhotosVisible, setB3PhotosVisible] = useState(false);
  const [b3Done, setB3Done] = useState(false);
  const [showBlock4, setShowBlock4] = useState(false);

  // Block 4
  const [b4States, setB4States] = useState<PhotoState[]>(["hidden","hidden","hidden"]);
  const [showCard4, setShowCard4] = useState(false);
  const [b4PhotosVisible, setB4PhotosVisible] = useState(false);
  const [b4Done, setB4Done] = useState(false);
  const [showBlock5, setShowBlock5] = useState(false);

  // Block 5
  const [b5States, setB5States] = useState<PhotoState[]>(["hidden","hidden","hidden"]);
  const [showCard5, setShowCard5] = useState(false);
  const [b5PhotosVisible, setB5PhotosVisible] = useState(false);
  const [b5Done, setB5Done] = useState(false);

  // Финальный парад
  const [showParade, setShowParade] = useState(false);
  const [paradeVisible, setParadeVisible] = useState<boolean[]>(Array(13).fill(false));
  const [showParadeCaption, setShowParadeCaption] = useState(false);

  const boxAudioRef = useRef<HTMLAudioElement | null>(null);
  const mainAudioRef = useRef<HTMLAudioElement | null>(null);

  const setB2State = (idx: number, state: PhotoState) => {
    setB2States(prev => { const next = [...prev]; next[idx] = state; return next; });
  };
  const setB3State = (idx: number, state: PhotoState) => {
    setB3States(prev => { const next = [...prev]; next[idx] = state; return next; });
  };
  const setB4State = (idx: number, state: PhotoState) => {
    setB4States(prev => { const next = [...prev]; next[idx] = state; return next; });
  };
  const setB5State = (idx: number, state: PhotoState) => {
    setB5States(prev => { const next = [...prev]; next[idx] = state; return next; });
  };

  /* ── Запуск блока 3 ── */
  const startBlock3 = () => {
    setShowBlock3(true);
    setShowCard3(true);
    setTimeout(() => {
      setShowCard3(false);
      setTimeout(() => {
        setB3PhotosVisible(true);
        setTimeout(() => setB3State(0, "row"), 100);
        setTimeout(() => setB3State(1, "row"), 320);
        setTimeout(() => setB3State(2, "row"), 540);
        setTimeout(() => setB3Done(true), 1800);
      }, 600);
    }, 10000);
  };

  /* ── Запуск блока 4 ── */
  const startBlock4 = () => {
    setShowBlock4(true);
    setShowCard4(true);
    setTimeout(() => {
      setShowCard4(false);
      setTimeout(() => {
        setB4PhotosVisible(true);
        setTimeout(() => setB4State(0, "row"), 100);
        setTimeout(() => setB4State(1, "row"), 320);
        setTimeout(() => setB4State(2, "row"), 540);
        setTimeout(() => setB4Done(true), 1800);
      }, 600);
    }, 10000);
  };

  /* ── Запуск блока 5 ── */
  const startBlock5 = () => {
    setShowBlock5(true);
    setShowCard5(true);
    setTimeout(() => {
      setShowCard5(false);
      setTimeout(() => {
        setB5PhotosVisible(true);
        setTimeout(() => setB5State(0, "row"), 100);
        setTimeout(() => setB5State(1, "row"), 320);
        setTimeout(() => setB5State(2, "row"), 540);
        setTimeout(() => setB5Done(true), 1800);
      }, 600);
    }, 10000);
  };

  /* ── Открытие коробки ── */
  const handleOpen = () => {
    if (opened) return;
    setOpened(true);
    setConfetti(true);

    const boxAudio = playAudio(MUSIC_BOX_URL, 0.75);
    boxAudio.loop = true;
    boxAudioRef.current = boxAudio;

    setTimeout(() => setShowBlock1Photo(true), 600);
    setTimeout(() => setShowBlock1Card(true), 1800);
    setTimeout(() => setConfetti(false), 3500);
  };

  /* ── Переход в блок 2 — сменяем музыку ── */
  const startBlock2 = () => {
    setShowBlock1Photo(false);
    setShowBlock1Card(false);

    if (boxAudioRef.current) {
      fadeOutAudio(boxAudioRef.current, () => { boxAudioRef.current = null; });
    }
    if (!mainAudioRef.current) {
      const mainAudio = playAudio(MUSIC_MAIN_URL, 0.75);
      mainAudio.loop = true;
      mainAudioRef.current = mainAudio;
      mainAudio.addEventListener("play", () => setIsPlaying(true));
      mainAudio.addEventListener("pause", () => setIsPlaying(false));
      mainAudio.addEventListener("ended", () => setIsPlaying(false));
      setIsPlaying(true);
    }

    setTimeout(() => {
      setShowBlock2(true);
      setShowCard2(true);
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

  /* ── Запуск финального парада ── */
  const startParade = () => {
    setShowParade(true);
    ALL_PHOTOS.forEach((_, i) => {
      setTimeout(() => {
        setParadeVisible(prev => { const next = [...prev]; next[i] = true; return next; });
      }, i * 250);
    });
    setTimeout(() => setShowParadeCaption(true), ALL_PHOTOS.length * 250 + 600);
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
    setShowBlock3(false);
    setB3States(["hidden","hidden","hidden"]);
    setShowCard3(false);
    setB3PhotosVisible(false);
    setB3Done(false);
    setShowBlock4(false);
    setB4States(["hidden","hidden","hidden"]);
    setShowCard4(false);
    setB4PhotosVisible(false);
    setB4Done(false);
    setShowBlock5(false);
    setB5States(["hidden","hidden","hidden"]);
    setShowCard5(false);
    setB5PhotosVisible(false);
    setB5Done(false);
    setShowParade(false);
    setParadeVisible(Array(13).fill(false));
    setShowParadeCaption(false);
    setConfetti(false);
    if (boxAudioRef.current) { fadeOutAudio(boxAudioRef.current); boxAudioRef.current = null; }
    if (mainAudioRef.current) { fadeOutAudio(mainAudioRef.current); mainAudioRef.current = null; }
    setIsPlaying(false);
  };

  const handleToggleMusic = () => {
    const audio = mainAudioRef.current;
    if (!audio) return;
    if (isPlaying) { audio.pause(); setIsPlaying(false); }
    else { audio.play().catch(() => {}); setIsPlaying(true); }
  };

  return {
    // UI state
    opened, confetti, shaking, isPlaying, lightboxSrc, setLightboxSrc,
    // Block 1
    showBlock1Photo, showBlock1Card, showBlock2,
    // Block 2
    b2States, showCard2, b2PhotosVisible, b2Done, showBlock3,
    // Block 3
    b3States, showCard3, b3PhotosVisible, b3Done, showBlock4,
    // Block 4
    b4States, showCard4, b4PhotosVisible, b4Done, showBlock5,
    // Block 5
    b5States, showCard5, b5PhotosVisible, b5Done,
    // Parade
    showParade, paradeVisible, showParadeCaption,
    // Handlers
    handleOpen, handleHover, handleReset, handleToggleMusic,
    startBlock2, startBlock3, startBlock4, startBlock5, startParade,
    isBlock1Done: showBlock1Photo && showBlock1Card,
  };
}
