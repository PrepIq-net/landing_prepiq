"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Play, Pause, SoundHigh } from "iconoir-react";

/** Format seconds as m:ss for the elapsed / total readout. */
function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

/**
 * Compact "listen to this article" bar backed by a pre-generated narration MP3.
 * Rendered only when a track exists for the language the reader is viewing, so
 * it never appears empty. Once the bar scrolls out of the viewport it docks to
 * the bottom of the screen so playback always stays reachable, and slides back
 * into its original spot as soon as that spot re-enters view. The space bar
 * toggles play/pause unless focus sits on an interactive control.
 */
export default function PostAudioPlayer({ src }: { src: string }) {
  const { t } = useTranslation();
  const audioRef = useRef<HTMLAudioElement>(null);
  const inPlaceRef = useRef<HTMLDivElement>(null);
  const dockedRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);
  const [docked, setDocked] = useState(false);

  // A language switch swaps `src`; reset the transport so the readout doesn't
  // show the previous track's position against the new clip.
  useEffect(() => {
    setPlaying(false);
    setCurrent(0);
    setDuration(0);
  }, [src]);

  // While the reader scrolls, mirror the in-place bar's visibility: as soon as
  // it leaves the viewport dock it at the bottom, and undock the moment its
  // original spot is visible again.
  useEffect(() => {
    const el = inPlaceRef.current;
    if (!el) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = el.getBoundingClientRect();
      setDocked(rect.bottom <= 0 || rect.top >= window.innerHeight);
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Reserve space under the fold while docked so the fixed bar never covers
  // the footer or the related posts.
  useEffect(() => {
    const el = dockedRef.current;
    document.body.style.paddingBottom =
      docked && el ? `${el.offsetHeight}px` : "";
    return () => {
      document.body.style.paddingBottom = "";
    };
  }, [docked]);

  // Space toggles playback unless focus is on an interactive control (inputs,
  // buttons, links…) where the browser already consumes the key.
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code !== "Space" || e.repeat) return;
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
      const node = e.target as HTMLElement | null;
      if (
        node &&
        (node.isContentEditable ||
          node.closest(
            "input, textarea, select, button, a, [role='button'], [contenteditable='true']",
          ))
      ) {
        return;
      }
      const el = audioRef.current;
      if (!el) return;
      e.preventDefault();
      if (el.paused) {
        void el.play();
      } else {
        el.pause();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const toggle = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play();
    } else {
      el.pause();
    }
  };

  const seek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const el = audioRef.current;
    if (!el) return;
    const next = Number(event.target.value);
    el.currentTime = next;
    setCurrent(next);
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  const bar = (
    <div className="flex items-center gap-4 rounded-xl border border-border/60 bg-card/60 px-4 py-3">
      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? t("blog.listen.pause") : t("blog.listen.play")}
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        {playing ? (
          <Pause className="h-5 w-5" />
        ) : (
          <Play className="h-5 w-5 translate-x-[1px]" />
        )}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5 text-sm font-medium text-foreground">
          <SoundHigh className="h-4 w-4 text-primary" />
          <span className="truncate">{t("blog.listen.label")}</span>
        </div>

        <div className="mt-2 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={duration || 0}
            step="any"
            value={current}
            onChange={seek}
            aria-label={t("blog.listen.label")}
            className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-border accent-primary"
            style={{
              background: `linear-gradient(to right, hsl(var(--primary)) ${progress}%, hsl(var(--border)) ${progress}%)`,
            }}
          />
          <span className="flex-shrink-0 font-mono text-xs tabular-nums text-muted-foreground">
            {formatTime(current)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div
        ref={inPlaceRef}
        className={`overflow-hidden transition-opacity duration-200 ${
          docked ? "h-0 opacity-0" : "mt-8 opacity-100"
        }`}
      >
        {bar}
      </div>

      <div
        ref={dockedRef}
        aria-hidden={!docked}
        className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 ease-out ${
          docked
            ? "translate-y-0"
            : "pointer-events-none invisible translate-y-full"
        }`}
      >
        <div className="border-t border-border/60 bg-background/95 backdrop-blur">
          <div className="section-container max-w-6xl pb-[env(safe-area-inset-bottom)]">
            <div className="pt-3 pb-3">{bar}</div>
          </div>
        </div>
      </div>

      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
      />
    </>
  );
}