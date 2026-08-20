"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CinematicFooter, MagneticButton } from "@/components/ui/motion-footer";
import { ProductCarousel } from "@/components/ui/product-carousel";

function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-border/60">
      <div className="flex items-center justify-between px-6 md:px-12 py-5">
        <a href="#top" className="block">
          <img src="/images/logo.jpg" alt="SANTI" className="h-9 w-auto object-contain" />
        </a>
        <nav className="hidden md:flex items-center gap-8 font-mono text-xs tracking-widest">
          <a href="#grid" className="hover:text-primary transition-colors">[ ARCHIVE ]</a>
          <a href="#signup" className="hover:text-primary transition-colors">[ ACCÈS ]</a>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative px-6 md:px-12 pt-16 pb-24 md:pt-24 md:pb-32 overflow-hidden">
      <div
        aria-hidden="true"
        className="absolute top-[8%] right-[6%] w-40 md:w-72 h-40 md:h-72 bg-primary opacity-90"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 78%, 78% 100%, 0 100%)" }}
      />
      <div className="relative max-w-5xl">
        <p className="font-mono text-xs tracking-widest text-muted-foreground mb-6">
          /// SS26 — UNITÉ N° 001 — SÉRIE LIMITÉE
        </p>
        <h1 className="font-display uppercase leading-[0.94] tracking-tighter text-[clamp(2.5rem,10vw,8rem)]">
          La<br />
          Mode<br />
          Éternelle<span className="text-primary">.</span>
        </h1>
        <p className="mt-8 max-w-xl text-base md:text-lg text-muted-foreground">
          SANTI ne se porte pas en douceur. Des silhouettes brutes en béton, conçues pour les
          corps qui refusent de se fondre dans la masse.
        </p>
        <div className="mt-10">
          <MagneticButton
            as="a"
            href="#grid"
            className="inline-flex items-center gap-2 bg-foreground text-background font-mono text-sm tracking-widest px-7 py-4 hover:bg-primary transition-colors"
          >
            ENTRER DANS L'ARCHIVE <ArrowRight className="w-4 h-4" />
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}

function Newsletter() {
  const [status, setStatus] = useState<"idle" | "success">("idle");

  return (
    <section id="signup" className="px-6 md:px-12 py-20 md:py-28 border-t border-border/60">
      <div className="max-w-2xl">
        <p className="font-mono text-xs tracking-widest text-muted-foreground mb-5">
          /// ACCÈS RESTREINT
        </p>
        <h2 className="font-display uppercase leading-[0.98] tracking-tighter text-[clamp(2rem,6vw,4rem)]">
          Entre<br />avant que ce soit parti<span className="text-primary">.</span>
        </h2>
        <p className="mt-6 text-muted-foreground max-w-md">
          Rejoins la liste. Alertes drops, accès à l'archive, zéro bruit.
        </p>
        <form
          className="mt-10 flex flex-col sm:flex-row border border-foreground"
          onSubmit={(e) => {
            e.preventDefault();
            setStatus("success");
          }}
        >
          <label htmlFor="email" className="sr-only">Adresse email</label>
          <input
            id="email"
            type="email"
            required
            placeholder="TON@EMAIL.COM"
            className="flex-1 bg-transparent px-5 py-4 font-mono text-sm tracking-wide outline-none placeholder:text-muted-foreground"
          />
          <button
            type="submit"
            className="font-mono text-sm tracking-widest px-7 py-4 bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors border-t sm:border-t-0 sm:border-l border-foreground"
          >
            S'ABONNER →
          </button>
        </form>
        <p className={`mt-4 font-mono text-[11px] tracking-widest ${status === "success" ? "text-primary" : "text-muted-foreground"}`}>
          {status === "success"
            ? "[ ACCÈS ACCORDÉ — VÉRIFIE TA BOÎTE MAIL ]"
            : "[ UN EMAIL / MOIS. DÉSABONNEMENT À TOUT MOMENT. ]"}
        </p>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <div className="relative w-full bg-background text-foreground min-h-screen font-sans selection:bg-primary/30 overflow-x-hidden">
      <Header />
      <Hero />
      <ProductCarousel />
      <Newsletter />
      <CinematicFooter />
    </div>
  );
}
