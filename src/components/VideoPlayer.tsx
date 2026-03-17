"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import styles from "./VideoPlayer.module.css";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  className?: string;
  ariaLabel?: string;
};

export function VideoPlayer({
  src,
  poster,
  className = "",
  ariaLabel = "Video player",
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showUnmutePrompt, setShowUnmutePrompt] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Attempt autoplay with sound, fallback to muted if blocked
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptAutoplay = async () => {
      try {
        // Try playing with sound first
        video.muted = false;
        await video.play();
        setIsPlaying(true);
        setIsMuted(false);
      } catch (error) {
        // Autoplay with sound blocked, try muted
        try {
          video.muted = true;
          await video.play();
          setIsPlaying(true);
          setIsMuted(true);
          setShowUnmutePrompt(true);
        } catch (mutedError) {
          // Even muted autoplay failed, show play button
          setIsPlaying(false);
        }
      }
    };

    attemptAutoplay();
  }, []);

  // Handle play/pause toggle
  const togglePlay = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    setHasInteracted(true);
  }, []);

  // Handle mute/unmute toggle
  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
    setShowUnmutePrompt(false);
    setHasInteracted(true);
  }, []);

  // Handle unmute prompt click
  const handleUnmuteClick = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = false;
    setIsMuted(false);
    setShowUnmutePrompt(false);
    setHasInteracted(true);

    // Ensure video is playing
    if (video.paused) {
      video.play();
      setIsPlaying(true);
    }
  }, []);

  // Sync state with video events
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => setIsMuted(video.muted);

    video.addEventListener("play", handlePlay);
    video.addEventListener("pause", handlePause);
    video.addEventListener("volumechange", handleVolumeChange);

    return () => {
      video.removeEventListener("play", handlePlay);
      video.removeEventListener("pause", handlePause);
      video.removeEventListener("volumechange", handleVolumeChange);
    };
  }, []);

  return (
    <div className={`${styles.videoContainer} ${className}`} aria-label={ariaLabel}>
      <video
        ref={videoRef}
        className={styles.video}
        src={src}
        poster={poster}
        loop
        playsInline
        preload="auto"
      />

      {/* Unmute Prompt Overlay */}
      {showUnmutePrompt && !hasInteracted && (
        <button
          className={styles.unmutePrompt}
          onClick={handleUnmuteClick}
          aria-label="Click to unmute video"
        >
          <span className={styles.unmuteIcon}>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          </span>
          <span className={styles.unmuteText}>Click to unmute</span>
        </button>
      )}

      {/* Video Controls */}
      <div className={styles.controls}>
        {/* Play/Pause Button */}
        <button
          className={styles.controlButton}
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        {/* Mute/Unmute Button */}
        <button
          className={styles.controlButton}
          onClick={toggleMute}
          aria-label={isMuted ? "Unmute video" : "Mute video"}
        >
          {isMuted ? (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          ) : (
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
            </svg>
          )}
        </button>
      </div>

      {/* Play overlay for initial state when autoplay fails completely */}
      {!isPlaying && !hasInteracted && (
        <button
          className={styles.playOverlay}
          onClick={togglePlay}
          aria-label="Play video"
        >
          <div className={styles.playButton}>
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        </button>
      )}
    </div>
  );
}
