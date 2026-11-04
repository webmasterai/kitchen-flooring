import Image from "next/image";
import { cn } from "@/lib/cn";

type Props = {
  collage: string;
  images: string[];
  title: string;
};

function UniqueImages(images: string[]) {
  const seen = new Set<string>();
  return images.filter((src) => {
    if (seen.has(src)) return false;
    seen.add(src);
    return true;
  });
}

export function ProjectCollage({ collage, images, title }: Props) {
  const imgs = UniqueImages(images);
  const main = imgs[0];
  const detailA = imgs[1];
  const detailB = imgs[2];

  if (!main) return null;

  if (collage === "hero-two-detail" && detailA && detailB) {
    return (
      <div className="flex h-[min(26rem,48vh)] flex-col gap-2.5 lg:h-[min(28rem,50vh)]">
        <div className="relative min-h-0 basis-[72%] overflow-hidden bg-ivory-deep">
          <Image
            src={main}
            alt={`${title} — primary view`}
            fill
            sizes="(max-width: 1024px) 100vw, 64vw"
            className="object-cover object-center"
            priority={false}
          />
        </div>
        <div className="grid min-h-0 basis-[28%] grid-cols-2 gap-2.5">
          <div className="relative overflow-hidden bg-ivory-deep">
            <Image
              src={detailA}
              alt={`${title} — detail`}
              fill
              sizes="(max-width: 1024px) 50vw, 32vw"
              className="object-cover object-center"
              loading="lazy"
            />
          </div>
          <div className="relative overflow-hidden bg-ivory-deep">
            <Image
              src={detailB}
              alt={`${title} — detail`}
              fill
              sizes="(max-width: 1024px) 50vw, 32vw"
              className="object-cover object-center"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    );
  }

  if (collage === "landscape-detail" && detailA) {
    return (
      <div className="grid h-[min(22rem,42vh)] grid-cols-[minmax(0,1.55fr)_minmax(0,0.7fr)] gap-2.5 lg:h-[min(24rem,44vh)]">
        <div className="relative min-h-0 overflow-hidden bg-ivory-deep">
          <Image
            src={main}
            alt={`${title} — primary view`}
            fill
            sizes="(max-width: 1024px) 70vw, 40vw"
            className="object-cover object-center"
          />
        </div>
        <div className="relative min-h-0 overflow-hidden bg-ivory-deep">
          <Image
            src={detailA}
            alt={`${title} — detail`}
            fill
            sizes="(max-width: 1024px) 30vw, 20vw"
            className="object-cover object-[center_30%]"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-ivory-deep",
        "aspect-[16/10] max-h-[min(24rem,46vh)] w-full",
      )}
    >
      <Image
        src={main}
        alt={`${title} — primary view`}
        fill
        sizes="(max-width: 1024px) 100vw, 64vw"
        className="object-cover object-center"
      />
    </div>
  );
}
