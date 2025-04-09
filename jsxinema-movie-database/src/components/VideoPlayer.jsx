import React, { useEffect } from 'react';
import { useVideoPlayer } from '../hooks/useVideoPlayer';

const VideoPlayer = ({ src, poster }) => {
  const {
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
  } = useVideoPlayer();

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <div className="video-player">
      <div className="video-container">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />
        
        <div className="video-controls">
          <button className="play-pause" onClick={togglePlay}>
            {playing ? '❚❚' : '▶'}
          </button>
          
          <div className="progress-container">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => seek(parseFloat(e.target.value))}
              className="progress-slider"
            />
            <div className="time-display">
              <span>{formatTime(videoRef.current?.currentTime || 0)}</span>
              <span>/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
          
          <div className="volume-container">
            <span>{volume === 0 ? '🔇' : volume < 0.5 ? '🔉' : '🔊'}</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={(e) => changeVolume(parseFloat(e.target.value))}
              className="volume-slider"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
