"use client";

import { useEffect, useState } from "react";

type NavCategory = { id: string; slug: string; name: string };

export function CategoryNav({ categories }: { categories: NavCategory[] }) {
  const [active, setActive] = useState(categories[0]?.slug ?? "");

  useEffect(() => {
    if (!categories.length) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-82px 0px -55% 0px", threshold: [0.05, 0.2, 0.5] }
    );

    for (const category of categories) {
      const element = document.getElementById(category.slug);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [categories]);

  return (
    <div className="category-nav-wrap">
      <nav className="category-nav" aria-label="Menü kategorileri">
        {categories.map((category) => (
          <a
            key={category.id}
            href={`#${category.slug}`}
            className={active === category.slug ? "is-active" : ""}
            onClick={(event) => {
              event.preventDefault();
              setActive(category.slug);
              document.getElementById(category.slug)?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            {category.name}
          </a>
        ))}
      </nav>
    </div>
  );
}
