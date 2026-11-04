import Image from "next/image";

type Props = {
  eyebrow?: string;
  title: string;
  description?: string;
  imageSrc?: string;
  imageAlt?: string;
};

export function PageHero({
  eyebrow,
  title,
  description,
  imageSrc,
  imageAlt = "",
}: Props) {
  return (
    <section className="relative isolate overflow-hidden bg-forest-deep text-white">
      {imageSrc ? (
        <>
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-45"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-forest-deep via-forest-deep/85 to-forest-deep/40" />
        </>
      ) : null}
      <div className="container-wide relative py-16 lg:py-24">
        {eyebrow ? <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-[#cfe0d5] uppercase">{eyebrow}</p> : null}
        <h1 className="heading-display max-w-3xl text-4xl sm:text-5xl">{title}</h1>
        {description ? (
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
            {description}
          </p>
        ) : null}
      </div>
    </section>
  );
}
