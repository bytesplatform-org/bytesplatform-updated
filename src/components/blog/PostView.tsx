import { Fragment } from "react";
import ActionPill from "@/components/ui/ActionPill";
import GoogleSourceButton from "@/components/ui/GoogleSourceButton";
import heroFoot from "@/components/ui/HeroFoot.module.css";
import { categoryLabel, formatDate, imageUrl, postHeadings, readingMinutes, type Post, type PostSummary } from "@/lib/blog";
import PostBody from "./PostBody";
import PostCard from "./PostCard";
import PostToc from "./PostToc";
import styles from "./Blog.module.css";

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

export default function PostView({ post, related }: { post: Post; related: PostSummary[] }) {
  const headings = postHeadings(post.body);
  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    image: post.detailImage ? imageUrl(post.detailImage, 1200) : undefined,
    author: { "@type": "Organization", name: "BytesPlatform" },
    publisher: { "@type": "Organization", name: "BytesPlatform" },
  };

  return (
    <article>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />

      <header id="top" className={styles.postHero}>
        <div className={heroFoot.topRow}>
          <a data-hero-fade href="/blogs" className={styles.back}><span aria-hidden>←</span> All articles</a>
          <div data-hero-fade><GoogleSourceButton /></div>
        </div>
        <p data-hero-fade className={styles.meta}>
          {post.category && <span>{categoryLabel(post.category)}</span>}
          <span>{formatDate(post.date)}</span>
          <span>{readingMinutes(post)} min read</span>
        </p>
        <h1 data-hero-title className={styles.postTitle}><Words text={post.title} /></h1>
        {post.excerpt && <p data-hero-fade className={styles.postLead}>{post.excerpt}</p>}
      </header>

      {post.detailImage && (
        <div data-hero-fade className={styles.postMedia}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imageUrl(post.detailImage, 2000)} alt="" />
        </div>
      )}

      <div className={styles.postBody}>
        <aside className={styles.postAside}>
          <div className={styles.postAsideSticky}>
            {headings.length > 1 && <PostToc headings={headings} />}
            <div className={styles.postAbout}>
              <p className={styles.label}>Written by</p>
              <p>The BytesPlatform team</p>
              <p className={styles.label}>Need help with this?</p>
              <ActionPill href="/contact" label="Talk to us" />
            </div>
          </div>
        </aside>
        <PostBody body={post.body} />
      </div>

      {related.length > 0 && (
        <section className={styles.section}>
          <div className={styles.listHead}>
            <h2 className={styles.h2}>Keep reading</h2>
            <a href="/blogs" className={styles.readMore}>All articles <span aria-hidden>→</span></a>
          </div>
          <div className={styles.grid}>
            {related.map((item) => <PostCard key={item.slug} post={item} />)}
          </div>
        </section>
      )}
    </article>
  );
}
