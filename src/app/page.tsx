import Image from "next/image";
import Link from "next/link";
import { getRecipeBooksState, getRecipeLibraryFolder } from "@/lib/recipes";

export const revalidate = 300;

const pageStyles = {
  shell: {
    minHeight: "100vh",
    padding: "40px 20px 64px",
  },
  frame: {
    width: "min(1120px, 100%)",
    margin: "0 auto",
  },
  hero: {
    display: "grid",
    gap: "20px",
    marginBottom: "32px",
    padding: "28px",
    borderRadius: "28px",
    background: "var(--card)",
    border: "1px solid var(--border)",
    boxShadow: "var(--shadow)",
    backdropFilter: "blur(16px)",
  },
  eyebrow: {
    color: "var(--muted)",
    fontSize: "0.9rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.16em",
  },
  title: {
    fontSize: "clamp(2.6rem, 8vw, 5rem)",
    lineHeight: 0.94,
    maxWidth: "10ch",
  },
  description: {
    fontSize: "1.05rem",
    color: "var(--muted)",
    lineHeight: 1.6,
    maxWidth: "60ch",
  },
  badgeRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "12px",
  },
  badge: {
    padding: "10px 14px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.42)",
    border: "1px solid var(--border)",
    fontSize: "0.95rem",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },
  card: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "var(--shadow)",
    backdropFilter: "blur(16px)",
  },
  cardMedia: {
    aspectRatio: "4 / 5",
    position: "relative" as const,
    background: "rgba(88, 63, 46, 0.12)",
  },
  cardBody: {
    display: "grid",
    gap: "8px",
    padding: "18px",
  },
  cardMeta: {
    color: "var(--muted)",
    fontSize: "0.95rem",
  },
  empty: {
    padding: "24px",
    borderRadius: "24px",
    border: "1px dashed var(--border)",
    color: "var(--muted)",
    lineHeight: 1.7,
  },
};

export default async function Home() {
  const { books, source, message } = await getRecipeBooksState();
  const folder = getRecipeLibraryFolder();

  return (
    <main style={pageStyles.shell}>
      <div style={pageStyles.frame}>
        <section style={pageStyles.hero}>
          <p style={pageStyles.eyebrow}>Recipes Visor</p>
          <h1 style={pageStyles.title}>Your recipe books, always on hand.</h1>
          <p style={pageStyles.description}>
            Upload recipe photos from your phone into Cloudinary folders. Each subfolder becomes a book, and each image becomes a page in reading order.
          </p>
          <div style={pageStyles.badgeRow}>
            <span style={pageStyles.badge}>{source === "cloudinary" ? "Cloudinary connected" : "Demo mode active"}</span>
            <span style={pageStyles.badge}>Root folder: {folder}</span>
            <span style={pageStyles.badge}>Free to host on Vercel</span>
          </div>
          {message ? <p style={pageStyles.description}>{message}</p> : null}
        </section>

        {books.length > 0 ? (
          <section style={pageStyles.grid}>
            {books.map((book) => (
              <Link key={book.slug} href={`/book/${book.slug}`} style={pageStyles.card}>
                <div style={pageStyles.cardMedia}>
                  {book.cover ? (
                    <Image src={book.cover.src} alt={book.cover.alt} fill sizes="(max-width: 768px) 100vw, 25vw" style={{ objectFit: "cover" }} />
                  ) : null}
                </div>
                <div style={pageStyles.cardBody}>
                  <h2>{book.title}</h2>
                  <p style={pageStyles.cardMeta}>{book.images.length} pages</p>
                </div>
              </Link>
            ))}
          </section>
        ) : (
          <section style={pageStyles.empty}>
            No books found yet. Create subfolders inside <strong>{folder}</strong> and upload images named like <code>001.jpg</code>, <code>002.jpg</code>, <code>003.jpg</code> so they stay in recipe order.
          </section>
        )}
      </div>
    </main>
  );
}
