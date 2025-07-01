import Image, { ImageProps } from "next/image";

function PreviewImage({ src, blurDataURL, alt, loading = "lazy", unoptimized = true, ...props }: ImageProps) {
   const image = blurDataURL ? (
      <Image
         src={src}
         blurDataURL={blurDataURL}
         placeholder="blur"
         loading={loading}
         alt={alt}
         unoptimized={unoptimized}
         {...props}
      />
   ) : (
      <Image alt={alt} src={src} {...props} />
   );
   return image;
}

export default PreviewImage;
