"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useVideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showUnmutePrompt, setShowUnmutePrompt] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    const attemptAutoplay = async () => {
      try {
        video.muted = false;
        await video.play();
        setIsPlaying(true);
        setIsMuted(false);
      } catch {
        try {
          video.muted = true;
          await video.play();
          setIsPlaying(true);
          setIsMuted(true);
          setShowUnmutePrompt(true);
        } catch {
          setIsPlaying(false);
        }
      }
    };

    if (video.readyState >= 2) {
      void attemptAutoplay();
    } else {
      const onCanPlay = () => {
        void attemptAutoplay();
        video.removeEventListener("canplay", onCanPlay);
      };
      video.addEventListener("canplay", onCanPlay);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

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

  const togglePlay = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }

    setHasInteracted(true);
  }, []);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = !video.muted;
    setIsMuted(video.muted);
    setShowUnmutePrompt(false);
    setHasInteracted(true);
  }, []);

  const handleUnmuteClick = useCallback(() => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    video.muted = false;
    setIsMuted(false);
    setShowUnmutePrompt(false);
    setHasInteracted(true);

    if (video.paused) {
      void video.play();
      setIsPlaying(true);
    }
  }, []);

  return {
    videoRef,
    isPlaying,
    isMuted,
    showUnmutePrompt,
    hasInteracted,
    togglePlay,
    toggleMute,
    handleUnmuteClick,
  };
}
