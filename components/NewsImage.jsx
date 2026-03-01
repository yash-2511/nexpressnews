"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const FALLBACK_SRC = "/placeholder.png";
const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 675;
const BLUR_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='1200' height='675'%3E%3Crect fill='%23f0f0f0' width='1200' height='675'/%3E%3C/svg%3E";

const isValidSrc = (src) => typeof src === "string" && src.trim().length > 0;

export default function NewsImage({
  src,
  alt,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  className = "",
  containerClassName = "",
  ...rest
}) {
  const [currentSrc, setCurrentSrc] = useState(isValidSrc(src) ? src : FALLBACK_SRC);

  useEffect(() => {
    setCurrentSrc(isValidSrc(src) ? src : FALLBACK_SRC);
  }, [src]);

  const handleError = () => {
    if (currentSrc !== FALLBACK_SRC) {
      setCurrentSrc(FALLBACK_SRC);
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden ${containerClassName}`}
      style={{ aspectRatio: `${width}/${height}` }}
    >
      <Image
        src={currentSrc}
        alt={alt || "News image"}
        width={width}
        height={height}
        sizes={sizes}
        priority={priority}
        loading={priority ? "eager" : "lazy"}
        unoptimized
        placeholder="blur"
        blurDataURL={BLUR_PLACEHOLDER}
        className={`w-full h-full object-cover ${className}`}
        onError={handleError}
        {...rest}
      />
    </div>
  );
}
