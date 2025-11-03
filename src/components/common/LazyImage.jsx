import { useEffect, useRef, useState } from "react";

// Simple global queue to load images sequentially
let queue = [];
let active = 0;
const MAX_CONCURRENCY = 1;

function runNext() {
  if (active >= MAX_CONCURRENCY) return;
  const next = queue.shift();
  if (!next) return;
  active++;
  next()
    .catch(() => {})
    .finally(() => {
      active--;
      runNext();
    });
}

function enqueue(task) {
  queue.push(task);
  runNext();
}

export default function LazyImage({
  src,
  alt = "",
  className = "",
  style,
  onError,
  eager = false, // if true, bypass queue and load immediately
  ...rest
}) {
  const imgRef = useRef(null);
  const resolverRef = useRef(null);
  const [inView, setInView] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(eager); // gated by queue when not eager
  const [loaded, setLoaded] = useState(false);

  // Observe visibility
  useEffect(() => {
    const el = imgRef.current;
    if (!el) return;

    // If eager, no need to observe
    if (eager) {
      setInView(true);
      setShouldLoad(true);
      return;
    }

    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setInView(true);
              obs.disconnect();
            }
          });
        },
        { threshold: 0.01 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }

    // Fallback: immediately load
    setInView(true);
  }, [src, eager]);

  // When in view, join the queue (unless eager)
  useEffect(() => {
    if (!inView || eager || shouldLoad) return;

    let cancelled = false;
    enqueue(() =>
      new Promise((resolve) => {
        if (cancelled) {
          resolve();
          return;
        }
        resolverRef.current = resolve;
        setShouldLoad(true);
      })
    );

    return () => {
      cancelled = true;
      // If we were the active one but unmounted before load, release the queue
      if (resolverRef.current) {
        resolverRef.current();
        resolverRef.current = null;
      }
    };
  }, [inView, eager, shouldLoad]);

  const handleLoad = () => {
    setLoaded(true);
    if (resolverRef.current) {
      resolverRef.current();
      resolverRef.current = null;
    }
  };

  const handleError = (e) => {
    if (onError) onError(e);
    if (resolverRef.current) {
      resolverRef.current();
      resolverRef.current = null;
    }
  };

  return (
    <img
      ref={imgRef}
      src={shouldLoad ? src : undefined}
      data-src={src}
      alt={alt}
      className={`${className} ${loaded ? "opacity-100" : "opacity-0 blur-sm"} transition-all duration-500`}
      style={style}
      loading={eager ? "eager" : "lazy"}
      fetchpriority={eager ? "high" : undefined}
      decoding="async"
      onLoad={handleLoad}
      onError={handleError}
      {...rest}
    />
  );
}
