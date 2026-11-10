"use client";

import { Fragment, useEffect, useMemo, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { categoryLabel, formatDate, imageUrl, type PostSummary } from "@/lib/blogFormat";
import GoogleSourceButton from "@/components/ui/GoogleSourceButton";
import heroFoot from "@/components/ui/HeroFoot.module.css";
import PostCard from "./PostCard";
import styles from "./Blog.module.css";

const PAGE = 12;

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((word, index) => (
        <Fragment key={index}>
          {index > 0 && " "}
          <span className={styles.wordSlot}><span data-word className={styles.word}>{word}</span></span>
        </Fragment>
      ))}
    </>
  );
}

export default function BlogIndex({ posts }: { posts: PostSummary[] }) {
  const [category, setCategory] = useState("All");
  const [shown, setShown] = useState(PAGE);

  const categories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const post of posts) if (post.category) counts.set(post.category, (counts.get(post.category) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [posts]);

  const [featured, ...rest] = posts;
  // The featured post leads "All"; filtered views list everything in that category.
  const list = category === "All" ? rest : posts.filter((post) => post.category === category);
  const visible = list.slice(0, shown);

  // More cards change the page height under the footer trigger.
  useEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [category, shown]);

  return (
    <>
      <section id="top" className={styles.indexHero}>
        <h1 data-hero-title className={styles.indexTitle}>
          <Words text="Insights" />{" "}
          <span className={styles.wordSlot}><span data-word className={styles.word}>&amp;&nbsp;ideas<span className="hero-period">.</span></span></span>
        </h1>
        <div className={heroFoot.foot}>
          <p data-hero-fade className={styles.indexIntro}>
            Stories, guides and updates from the BytesPlatform team on web, apps, SEO, marketing and AI.
          </p>
          <div data-hero-fade><GoogleSourceButton /></div>
        </div>
      </section>

      {featured && (
        <section className={styles.section}>
          <a data-hero-fade href={`/blogs/${featured.slug}`} className={styles.featured}>
            <div className={styles.featuredMedia}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageUrl(featured.image, 1200, 1200)} alt="" />
            </div>
            <div className={styles.featuredText}>
              <p className={styles.meta}>
                <span className={styles.latest}>Latest</span>
                {featured.category && <span>{categoryLabel(featured.category)}</span>}
                <span>{formatDate(featured.date)}</span>
              </p>
              <h2 className={styles.featuredTitle}>{featured.title}</h2>
              {featured.excerpt && <p className={styles.excerpt}>{featured.excerpt}</p>}
              <span className={styles.readMore}>Read article <span aria-hidden>→</span></span>
            </div>
          </a>
        </section>
      )}

      <section className={styles.section}>
        <div className={styles.listHead}>
          <h2 className={styles.h2}>All articles</h2>
          <div role="group" aria-label="Filter by category" className={styles.filters}>
            {[["All", posts.length] as const, ...categories].map(([name, count]) => (
              <button
                key={name}
                type="button"
                aria-pressed={category === name}
                onClick={() => { setCategory(name); setShown(PAGE); }}
              >
                {name === "All" ? "All" : categoryLabel(name)}
                <span className={styles.filterCount}>{count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {visible.map((post) => <PostCard key={post.slug} post={post} />)}
        </div>

        {visible.length < list.length && (
          <div className={styles.more}>
            <button type="button" className={styles.moreButton} onClick={() => setShown((count) => count + PAGE)}>
              Load more
              <span className={styles.filterCount}>{list.length - visible.length}</span>
            </button>
          </div>
        )}
      </section>
    </>
  );
}
