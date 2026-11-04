"use client";

import Image from "next/image";
import { useEffect, useId, useRef } from "react";
import { IconChevron, IconClose } from "@/components/icons/Icons";

export type GalleryLightboxItem = {
  id: string;
  src: string;
  alt: string;
  caption?: string;
};

type Props = {
  images: GalleryLightboxItem[];
  index: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
};

export function GalleryLightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
  returnFocusRef,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const labelId = useId();
  const open = index !== null && images[index];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      if (!dialog.open) dialog.showModal();
      closeRef.current?.focus();
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
    if (dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        onNext();
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onPrev();
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, onNext, onPrev]);

  useEffect(() => {
    if (index !== null) return;
    returnFocusRef?.current?.focus();
  }, [index, returnFocusRef]);

  const item = open ? images[index] : null;

  return (
    <dialog
      ref={dialogRef}
      className="m-auto w-[min(96vw,1100px)] max-w-none border-0 bg-transparent p-0 text-white backdrop:bg-black/85"
      onClose={onClose}
      aria-labelledby={labelId}
    >
      {item ? (
        <div className="relative bg-charcoal">
          <div className="flex items-center justify-between gap-3 px-4 py-3">
            <div>
              <p id={labelId} className="text-sm font-medium">
                {item.caption || item.alt}
              </p>
              <p className="text-xs text-white/70">
                Image {index! + 1} of {images.length}
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center border border-white/40 hover:bg-white/10"
              onClick={onClose}
              aria-label="Close lightbox"
            >
              <IconClose className="h-5 w-5" size={20} />
            </button>
          </div>
          <div className="relative aspect-[4/3] w-full bg-black">
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="96vw"
              className="object-contain motion-reduce:transition-none"
              priority
            />
          </div>
          <div className="flex justify-between gap-3 px-4 py-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 border border-white/40 px-3 py-2 text-sm hover:bg-white/10"
              onClick={onPrev}
              aria-label="Previous image"
            >
              <IconChevron className="h-4 w-4 rotate-90" size={16} />
              Previous
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 border border-white/40 px-3 py-2 text-sm hover:bg-white/10"
              onClick={onNext}
              aria-label="Next image"
            >
              Next
              <IconChevron className="h-4 w-4 -rotate-90" size={16} />
            </button>
          </div>
        </div>
      ) : null}
    </dialog>
  );
}
