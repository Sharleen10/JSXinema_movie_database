import { useState, useRef } from 'react';

export const useVideoPlayer = () => {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setProgress(progress);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };

  const changeVolume = (value) => {
    if (videoRef.current) {
      videoRef.current.volume = value;
      setVolume(value);
    }
  };

  const seek = (value) => {
    if (videoRef.current) {
      videoRef.current.currentTime = (value / 100) * videoRef.current.duration;
      setProgress(value);
    }
  };

  return {
    videoRef,
    playing,
    progress,
    duration,
    volume,
    togglePlay,
    handleTimeUpdate,
    handleLoadedMetadata,
    changeVolume,
    seek
  };
};
