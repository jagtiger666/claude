"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/motion-footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
.carousel-track {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.carousel-track::-webkit-scrollbar {
  display: none;
}
.carousel-card-media {
  background-color: color-mix(in oklch, var(--foreground) 6%, var(--background));
  background-image: repeating-linear-gradient(135deg, color-mix(in oklch, var(--foreground) 5%, transparent) 0 2px, transparent 2px 16px);
}
.carousel-card-icon {
  color: color-mix(in oklch, var(--foreground) 70%, transparent);
  transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), color 0.4s ease;
}
.carousel-card:hover .carousel-card-icon {
  color: var(--primary);
  transform: scale(1.08);
}
.carousel-card-media::after {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 55%, color-mix(in oklch, var(--background) 85%, transparent) 100%);
  pointer-events: none;
}
`;

export interface CarouselProduct {
  index: string;
  name: string;
  meta: string;
  price: string;
  icon: React.ReactNode;
  alt: string;
  tag?: string;
}

// Hand-drawn line-art placeholders in the SANTI brutalist style —
// deliberately not stock photography, to keep the raw, industrial identity.
const HoodieIcon = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true" className="w-[48%] h-[48%]">
    <path d="M30 18 L38 10 H62 L70 18 L88 30 L78 46 L70 40 V88 H30 V40 L22 46 L12 30 Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="miter" />
    <path d="M42 10 Q50 20 58 10" fill="none" stroke="currentColor" strokeWidth="2.2" />
  </svg>
);

const CargoIcon = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true" className="w-[48%] h-[48%]">
    <path d="M32 8 H68 L70 46 L84 90 L68 92 L58 52 L50 52 L42 92 L26 90 L30 46 Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="miter" />
    <line x1="32" y1="20" x2="68" y2="20" stroke="currentColor" strokeWidth="2.2" />
  </svg>
);

const BomberIcon = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true" className="w-[48%] h-[48%]">
    <path d="M28 20 L40 10 H60 L72 20 L90 34 L80 50 L72 44 V88 H28 V44 L20 50 L10 34 Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="miter" />
    <line x1="50" y1="12" x2="50" y2="88" stroke="currentColor" strokeWidth="2.2" />
  </svg>
);

const CapIcon = () => (
  <svg viewBox="0 0 100 100" aria-hidden="true" className="w-[48%] h-[48%]">
    <path d="M20 52 Q50 24 80 52 L80 60 Q50 40 20 60 Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="miter" />
    <path d="M80 54 L96 58 L82 64 Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="miter" />
  </svg>
);

const DEFAULT_PRODUCTS: CarouselProduct[] = [
  {
    index: "01",
    name: "Concrete Hoodie",
    meta: "Heavyweight / 480GSM",
    price: "€ 420",
    tag: "NEW",
    icon: <HoodieIcon />,
    alt: "SANTI oversized concrete hoodie, front view",
  },
  {
    index: "02",
    name: "Angular Cargo",
    meta: "Ripstop / 12 Pocket",
    price: "€ 385",
    icon: <CargoIcon />,
    alt: "SANTI angular cargo trousers",
  },
  {
    index: "03",
    name: "Structured Bomber",
    meta: "Raw Canvas / Unlined",
    price: "€ 690",
    tag: "LOW STOCK",
    icon: <BomberIcon />,
    alt: "SANTI structured bomber jacket",
  },
  {
    index: "04",
    name: "Industrial Cap",
    meta: "Molded Peak / Steel Rivet",
    price: "€ 145",
    icon: <CapIcon />,
    alt: "SANTI industrial cap",
  },
];

export function ProductCarousel({
  products = DEFAULT_PRODUCTS,
  className,
}: {
  products?: CarouselProduct[];
  className?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const dragState = useRef({ isDown: false, startX: 0, startScroll: 0, moved: false });

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".carousel-card",
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.1,
          ease: "power3.out",
          duration: 0.8,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const cards = Array.from(track.children) as HTMLElement[];

    // Cards snap to their start edge, so the active card is whichever
    // offsetLeft sits closest to the current scroll position.
    const handleScroll = () => {
      let closest = 0;
      let closestDist = Infinity;
      cards.forEach((card, i) => {
        const dist = Math.abs(card.offsetLeft - track.scrollLeft);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActiveIndex(closest);
    };

    track.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);
    const raf = requestAnimationFrame(handleScroll);
    return () => {
      track.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      cancelAnimationFrame(raf);
    };
  }, [products]);

  const scrollToIndex = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i] as HTMLElement | undefined;
    if (!card) return;
    track.scrollTo({ left: card.offsetLeft - 1, behavior: "smooth" });
  };

  const step = (dir: 1 | -1) => {
    const next = Math.min(Math.max(activeIndex + dir, 0), products.length - 1);
    scrollToIndex(next);
  };

  // Pointer drag-to-scroll, for desktop pointers that lack trackpad swipe.
  const onPointerDown = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (!track) return;
    dragState.current = { isDown: true, startX: e.clientX, startScroll: track.scrollLeft, moved: false };
    track.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const track = trackRef.current;
    const state = dragState.current;
    if (!state.isDown || !track) return;
    const dx = e.clientX - state.startX;
    if (Math.abs(dx) > 3) state.moved = true;
    track.scrollLeft = state.startScroll - dx;
  };

  const endDrag = (e: React.PointerEvent) => {
    const track = trackRef.current;
    if (track) track.releasePointerCapture(e.pointerId);
    dragState.current.isDown = false;
  };

  // Suppress the click on a card's link/button if the pointer actually dragged.
  const onTrackClickCapture = (e: React.MouseEvent) => {
    if (dragState.current.moved) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  return (
    <section ref={sectionRef} id="grid" className={cn("py-20 md:py-28 px-6 md:px-12", className)}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-10 pb-6 border-b border-border/60">
          <h2 className="text-3xl md:text-5xl font-display tracking-tighter uppercase">
            [ Current&nbsp;Drop ]
          </h2>
          <div className="flex items-center gap-6">
            <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              {String(activeIndex + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")} Units
            </span>
            <div className="hidden md:flex items-center gap-2">
              <MagneticButton
                as="button"
                onClick={() => step(-1)}
                aria-label="Previous product"
                className="w-10 h-10 rounded-full footer-glass-pill flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <ChevronLeft className="w-4 h-4" />
              </MagneticButton>
              <MagneticButton
                as="button"
                onClick={() => step(1)}
                aria-label="Next product"
                className="w-10 h-10 rounded-full footer-glass-pill flex items-center justify-center text-muted-foreground hover:text-foreground"
              >
                <ChevronRight className="w-4 h-4" />
              </MagneticButton>
            </div>
          </div>
        </div>

        <div
          ref={trackRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={onTrackClickCapture}
          className="carousel-track flex gap-px overflow-x-auto snap-x snap-mandatory cursor-grab active:cursor-grabbing bg-border/60 border border-border/60"
          style={{ scrollBehavior: "smooth" }}
        >
          {products.map((product) => (
            <article
              key={product.index}
              className="carousel-card group snap-start shrink-0 basis-[85%] sm:basis-[55%] md:basis-[38%] lg:basis-[28%] bg-background flex flex-col select-none"
            >
              <div
                className="carousel-card-media relative aspect-[4/5] overflow-hidden flex items-center justify-center"
                role="img"
                aria-label={product.alt}
              >
                <div className="carousel-card-icon relative z-0">{product.icon}</div>
                <span className="absolute top-3 left-3 z-10 font-mono text-xs tracking-widest bg-background text-foreground border border-border/70 px-2 py-1">
                  {product.index}
                </span>
                {product.tag && (
                  <span className="absolute top-3 right-3 z-10 font-mono text-[10px] tracking-widest bg-primary text-primary-foreground px-2 py-1">
                    {product.tag}
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col gap-2 flex-1">
                <h3 className="font-display text-lg tracking-tight uppercase">{product.name}</h3>
                <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">
                  {product.meta}
                </p>
                <div className="mt-auto pt-4 flex items-center justify-between">
                  <span className="font-mono text-base">{product.price}</span>
                  <MagneticButton
                    as="button"
                    aria-label={`Add ${product.name} to cart`}
                    className="footer-glass-pill w-9 h-9 rounded-full flex items-center justify-center text-foreground hover:text-primary"
                  >
                    <Plus className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex md:hidden items-center justify-center gap-2 mt-6">
          {products.map((product, i) => (
            <button
              key={product.index}
              onClick={() => scrollToIndex(i)}
              aria-label={`Go to ${product.name}`}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === activeIndex ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/40"
              )}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
