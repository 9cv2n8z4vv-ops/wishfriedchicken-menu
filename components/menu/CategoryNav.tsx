"use client";

import { useEffect, useState } from "react";

type NavCategory = { id: string; slug: string; name: string };

export function CategoryNav({ categories }: { categories: NavCategory[] }) {
  const [active, setActive] = useState(categories[0]?.slug ?? "");

  useEffect(() => {
    if (!categories.length) return;
    let scheduled = false;
    function update() {
      const sections = categories.map(c => document.getElementById(c.slug)).filter((e): e is HTMLElement => !!e);
      const current = sections.filter(e => e.getBoundingClientRect().top <= 130).at(-1) || sections[0];
      if (current) setActive(current.id);
      scheduled = false;
    }
    function scroll() { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } }
    window.addEventListener("scroll", scroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", scroll);
  }, [categories]);

  return (
    <div className="category-nav-wrap">
      <nav className="category-nav" aria-label="Menü kategorileri">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.slug}`}
            aria-current={active === category.slug ? "location" : undefined}
            className={active === category.slug ? "is-active" : ""}
            onClick={(event) => {
              event.preventDefault();
              setActive(category.slug);
              document.getElementById(category.slug)?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth", block: "start" });
            }}
          >
            {category.name}
          </a>
        ))}
      </nav>
    </div>
  );
}
