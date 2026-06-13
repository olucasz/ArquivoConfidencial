import { useCallback, useEffect, useRef, useState } from 'react';

export function useBackgroundMusic(audioSrc?: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!audioSrc) {
      return;
    }

    const audio = new Audio(audioSrc);
    audio.loop = true;
    audio.preload = 'auto';
    audioRef.current = audio;

    const updateProgress = () => {
      if (!audio.duration || Number.isNaN(audio.duration)) {
        return;
      }

      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.pause();
      audio.currentTime = 0;
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);

      if (audioRef.current === audio) {
        audioRef.current = null;
      }

      setIsPlaying(false);
      setProgress(0);
    };
  }, [audioSrc]);

  const play = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio) {
      return false;
    }

    try {
      await audio.play();
      setIsPlaying(true);
      return true;
    } catch {
      setIsPlaying(false);
      return false;
    }
  }, []);

  const pause = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    setIsPlaying(false);
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
    setProgress(0);
  }, []);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;

    if (!audio) {
      return false;
    }

    if (audio.paused) {
      return play();
    }

    pause();
    return true;
  }, [pause, play]);

  return {
    isPlaying,
    pause,
    play,
    progress,
    stop,
    toggle,
  };
}
