import Image, { type ImageProps } from "next/image";

type TmdbImageProps = Omit<ImageProps, "unoptimized">;

/**
 * TMDB already serves purpose-sized CDN assets. Bypass Vercel's image
 * transformation pipeline while retaining next/image layout and lazy loading.
 */
export function TmdbImage(props: TmdbImageProps) {
  const unoptimized = typeof props.src === "string" && props.src.startsWith("https://image.tmdb.org/t/p/");

  return <Image {...props} unoptimized={unoptimized} />;
}
