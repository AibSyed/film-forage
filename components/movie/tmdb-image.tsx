import Image, { type ImageProps } from "next/image";

type TmdbImageProps = Omit<ImageProps, "unoptimized">;

export function TmdbImage(props: TmdbImageProps) {
  return <Image {...props} />;
}
