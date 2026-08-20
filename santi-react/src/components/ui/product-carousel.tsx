"use client";

import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/ui/motion-footer";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const STYLES = `
@keyframes coverflow-breathe {
  0% { opacity: 0.55; transform: translateX(-50%) scale(1); }
  100% { opacity: 0.9; transform: translateX(-50%) scale(1.08); }
}
@keyframes coverflow-detail-in {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: translateY(0); }
}
.coverflow-spotlight {
  position: absolute;
  top: -6%;
  left: 50%;
  width: 62%;
  height: 70%;
  background: radial-gradient(ellipse at center, color-mix(in oklch, var(--primary) 20%, transparent) 0%, transparent 72%);
  filter: blur(30px);
  pointer-events: none;
  animation: coverflow-breathe 6s ease-in-out infinite alternate;
}
.coverflow-floor {
  position: absolute;
  bottom: 8%;
  left: 50%;
  translate: -50% 0;
  width: 64%;
  height: 12px;
  border-radius: 999px;
  background: linear-gradient(
    90deg,
    transparent,
    #ff2e6c 12%,
    #ff8a3d 30%,
    var(--primary) 50%,
    #2ee6ff 70%,
    #b96bff 88%,
    transparent
  );
  filter: blur(16px);
  opacity: 0.85;
  pointer-events: none;
}
.coverflow-floor::after {
  content: "";
  position: absolute;
  inset: -6px 20% auto 20%;
  height: 4px;
  border-radius: 999px;
  background: inherit;
  filter: blur(6px);
  opacity: 0.9;
}
.coverflow-item-media {
  position: relative;
  overflow: hidden;
  box-shadow: 0 40px 70px -25px rgba(0,0,0,0.8);
  background-color: color-mix(in oklch, var(--foreground) 6%, var(--background));
}
.coverflow-item-media img {
  filter: grayscale(1) contrast(1.05) brightness(0.78);
  transition: filter 0.6s ease;
}
.coverflow-item.is-active .coverflow-item-media img {
  filter: grayscale(0) contrast(1.05) saturate(1.05) brightness(0.98);
}
.coverflow-reflection {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  height: 55%;
  overflow: hidden;
  transform: scaleY(-1);
  mask-image: linear-gradient(to bottom, rgba(0,0,0,0.35), transparent 80%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.35), transparent 80%);
  pointer-events: none;
}
.coverflow-reflection img {
  width: 100%;
  height: 182%;
  object-fit: cover;
  object-position: top;
  filter: grayscale(1) brightness(0.6);
}
.coverflow-item.is-active .coverflow-reflection img {
  filter: grayscale(0) brightness(0.7) saturate(1.05);
}
.coverflow-detail {
  animation: coverflow-detail-in 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}
`;

export interface CarouselProduct {
  index: string;
  name: string;
  meta: string;
  price: string;
  image: string;
  alt: string;
  tag?: string;
}

const DEFAULT_PRODUCTS: CarouselProduct[] = [
  {
    index: "01",
    name: "T-Shirt Tié un Tigre",
    meta: "Coton Épais / Sérigraphie Tigre",
    price: "€ 65",
    tag: "NOUVEAU",
    image: "/images/product-01.jpg",
    alt: "T-shirt Tié un Tigre SANTI, porté bras croisés",
  },
  {
    index: "02",
    name: "T-Shirt Tié un Tigre",
    meta: "Coton Épais / Sérigraphie Tigre",
    price: "€ 65",
    image: "/images/product-02.jpg",
    alt: "T-shirt Tié un Tigre SANTI, porté avec caméra",
  },
  {
    index: "03",
    name: "T-Shirt Tié un Tigre",
    meta: "Coton Épais / Sérigraphie Tigre",
    price: "€ 65",
    image: "/images/product-03.jpg",
    alt: "T-shirt Tié un Tigre SANTI, porté cheveux platine",
  },
  {
    index: "04",
    name: "T-Shirt Tié un Tigre",
    meta: "Coton Épais / Sérigraphie Tigre",
    price: "€ 65",
    image: "/images/product-04.jpg",
    alt: "T-shirt Tié un Tigre SANTI, porté avec bouteille de vodka",
  },
  {
    index: "05",
    name: "T-Shirt Tié un Tigre",
    meta: "Coton Épais / Sérigraphie Tigre",
    price: "€ 65",
    image: "/images/product-05.jpg",
    alt: "T-shirt Tié un Tigre SANTI, porté en train de fumer",
  },
];

// Coverflow geometry, tuned per breakpoint tier (stage width in px).
function geometryFor(stageWidth: number) {
  const tier = stageWidth < 640 ? "sm" : stageWidth < 1024 ? "md" : "lg";
  switch (tier) {
    case "sm":
      return { itemWidth: 190, spacing: 118, depth: 90 };
    case "md":
      return { itemWidth: 250, spacing: 165, depth: 130 };
    default:
      return { itemWidth: 300, spacing: 210, depth: 170 };
  }
}

export function ProductCarousel({
  products = DEFAULT_PRODUCTS,
  className,
}: {
  products?: CarouselProduct[];
  className?: string;
}) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [dragDeltaIndex, setDragDeltaIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [stageWidth, setStageWidth] = useState(1024);
  const dragState = useRef({ startX: 0, moved: false });

  useEffect(() => {
    if (typeof window === "undefined" || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".coverflow-stage, .coverflow-detail, .coverflow-nav",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.08,
          ease: "power3.out",
          duration: 0.8,
          scrollTrigger: { trigger: sectionRef.current, start: "top 75%" },
        }
      );
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const update = () => setStageWidth(stage.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(stage);
    return () => ro.disconnect();
  }, []);

  const { itemWidth, spacing, depth } = useMemo(() => geometryFor(stageWidth), [stageWidth]);

  const step = (dir: 1 | -1) => {
    setActiveIndex((i) => Math.min(Math.max(i + dir, 0), products.length - 1));
  };

  const onPointerDown = (e: React.PointerEvent) => {
    dragState.current = { startX: e.clientX, moved: false };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    setIsDragging(true);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragState.current.startX;
    if (Math.abs(dx) > 3) dragState.current.moved = true;
    setDragDeltaIndex(-dx / spacing);
  };

  const endDrag = () => {
    if (!isDragging) return;
    setIsDragging(false);
    const next = Math.min(Math.max(Math.round(activeIndex + dragDeltaIndex), 0), products.length - 1);
    setActiveIndex(next);
    setDragDeltaIndex(0);
  };

  const active = products[activeIndex];

  return (
    <section ref={sectionRef} id="grid" className={cn("py-20 md:py-28 px-6 overflow-hidden", className)}>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />

      <div className="max-w-6xl mx-auto">
        <div className="flex flex-wrap items-baseline justify-between gap-4 mb-6 pb-6 border-b border-border/60 px-2">
          <h2 className="text-3xl md:text-5xl font-display tracking-tighter uppercase">
            [ Drop&nbsp;Actuel ]
          </h2>
          <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
            {String(activeIndex + 1).padStart(2, "0")} / {String(products.length).padStart(2, "0")} Unités
          </span>
        </div>

        <div
          ref={stageRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          className="relative h-[360px] md:h-[440px] select-none cursor-grab active:cursor-grabbing touch-pan-y"
          style={{ perspective: "1600px" }}
        >
          <div className="coverflow-spotlight" aria-hidden="true" />
          <div className="coverflow-floor" aria-hidden="true" />

          <div className="relative w-full h-full" style={{ transformStyle: "preserve-3d" }}>
            {products.map((product, i) => {
              const offset = i - activeIndex + dragDeltaIndex;
              const abs = Math.min(Math.abs(offset), 4);
              const translateX = offset * spacing;
              const translateZ = -abs * depth;
              const rotateY = Math.max(-58, Math.min(58, -offset * 34));
              const scale = Math.max(1 - abs * 0.16, 0.5);
              const opacity = abs > 3.4 ? 0 : 1 - Math.max(0, abs - 2.4) * 0.7;
              const zIndex = Math.round(100 - abs * 10);

              return (
                <div
                  key={product.index}
                  className={cn("coverflow-item absolute top-1/2 left-1/2", i === activeIndex && "is-active")}
                  onClick={() => {
                    if (!dragState.current.moved) setActiveIndex(i);
                  }}
                  style={{
                    width: itemWidth,
                    marginLeft: -itemWidth / 2,
                    marginTop: -(itemWidth * 1.25) / 2,
                    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
                    opacity,
                    zIndex,
                    transition: isDragging ? "none" : "transform 0.6s cubic-bezier(0.16,1,0.3,1), opacity 0.6s ease",
                    transformStyle: "preserve-3d",
                    cursor: i === activeIndex ? "default" : "pointer",
                  }}
                >
                  <div className="coverflow-item-media aspect-[4/5]">
                    <img src={product.image} alt={product.alt} draggable={false} className="w-full h-full object-cover object-top" />
                    {product.tag && (
                      <span className="absolute top-2 right-2 z-10 font-mono text-[9px] tracking-widest bg-primary text-primary-foreground px-2 py-1">
                        {product.tag}
                      </span>
                    )}
                  </div>
                  <div className="coverflow-reflection" aria-hidden="true">
                    <img src={product.image} alt="" draggable={false} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="coverflow-nav hidden md:flex absolute inset-y-0 left-0 right-0 items-center justify-between px-2 pointer-events-none">
            <MagneticButton
              as="button"
              onClick={() => step(-1)}
              aria-label="Produit précédent"
              className="pointer-events-auto w-11 h-11 rounded-full footer-glass-pill flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="w-4 h-4" />
            </MagneticButton>
            <MagneticButton
              as="button"
              onClick={() => step(1)}
              aria-label="Produit suivant"
              className="pointer-events-auto w-11 h-11 rounded-full footer-glass-pill flex items-center justify-center text-muted-foreground hover:text-foreground"
            >
              <ChevronRight className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>

        <div key={activeIndex} className="coverflow-detail flex flex-col items-center text-center gap-3 mt-8">
          <span className="font-mono text-xs tracking-widest text-muted-foreground">{active.index}</span>
          <h3 className="font-display text-2xl md:text-3xl tracking-tight uppercase">{active.name}</h3>
          <p className="font-mono text-[11px] tracking-widest text-muted-foreground uppercase">{active.meta}</p>
          <div className="flex items-center gap-5 mt-2">
            <span className="font-mono text-lg">{active.price}</span>
            <MagneticButton
              as="button"
              aria-label={`Ajouter ${active.name} au panier`}
              className="footer-glass-pill w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:text-primary"
            >
              <Plus className="w-4 h-4" />
            </MagneticButton>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {products.map((product, i) => (
            <button
              key={product.index}
              onClick={() => setActiveIndex(i)}
              aria-label={`Aller à ${product.name}`}
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
