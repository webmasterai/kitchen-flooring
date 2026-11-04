"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

type Item = { id: string; src: string; alt: string };

export function LightboxGallery({ images }: { images: Item[] }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const labelId = useId();
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (active === null) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
  }, [active]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (active === null) return;
      if (e.key === "ArrowRight") {
        setActive((i) => (i === null ? i : (i + 1) % images.length));
      }
      if (e.key === "ArrowLeft") {
        setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, images.length]);

  return (
    <>
      <ul className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <li key={image.id}>
            <button
              type="button"
              className="group relative block aspect-square w-full overflow-hidden bg-ivory focus-visible:outline-offset-4"
              onClick={() => setActive(index)}
              aria-label={`Open gallery image: ${image.alt || image.id}`}
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
                loading="lazy"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        className="m-auto w-[min(96vw,1100px)] max-w-none border-0 bg-transparent p-0 text-white backdrop:bg-black/80"
        onClose={() => setActive(null)}
        aria-labelledby={labelId}
      >
        {active !== null ? (
          <div className="relative bg-black">
            <div className="flex items-center justify-between gap-3 px-4 py-3">
              <p id={labelId} className="text-sm">
                Image {active + 1} of {images.length}
              </p>
              <button
                type="button"
                className="border border-white/40 px-3 py-1.5 text-sm hover:bg-white/10"
                onClick={() => setActive(null)}
              >
                Close
              </button>
            </div>
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={images[active].src}
                alt={images[active].alt}
                fill
                sizes="96vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="flex justify-between gap-3 px-4 py-3">
              <button
                type="button"
                className="border border-white/40 px-3 py-1.5 text-sm hover:bg-white/10"
                onClick={() => setActive((i) => (i === null ? i : (i - 1 + images.length) % images.length))}
              >
                Previous
              </button>
              <button
                type="button"
                className="border border-white/40 px-3 py-1.5 text-sm hover:bg-white/10"
                onClick={() => setActive((i) => (i === null ? i : (i + 1) % images.length))}
              >
                Next
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
