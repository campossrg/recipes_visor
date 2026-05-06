import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getRecipeBook, getRecipeBooks } from "@/lib/recipes";

export const revalidate = 300;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const books = await getRecipeBooks();
  return books.map((book) => ({ slug: book.slug }));
}

export default async function BookPage({ params }: PageProps) {
  const { slug } = await params;
  const book = await getRecipeBook(slug);

  if (!book) {
    notFound();
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "32px 0 64px",
      }}
    >
      <div
        style={{
          width: "100%",
          margin: "0 auto",
          display: "grid",
          gap: "20px",
        }}
      >
        <div
          style={{
            width: "min(960px, calc(100% - 40px))",
            margin: "0 auto",
            display: "grid",
            gap: "10px",
            padding: "24px",
            borderRadius: "24px",
            background: "var(--card)",
            border: "1px solid var(--border)",
            boxShadow: "var(--shadow)",
          }}
        >
          <Link href="/" style={{ color: "var(--muted)", width: "fit-content" }}>
            Back to books
          </Link>
          <h1 style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)" }}>{book.title}</h1>
          <p style={{ color: "var(--muted)" }}>{book.images.length} recipe pages</p>
        </div>

        <section style={{ display: "grid", gap: "18px" }}>
          {book.images.map((image, index) => (
            <article
              key={image.id}
              style={{
                overflow: "hidden",
                width: "100%",
                background: "var(--card)",
                borderTop: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
                boxShadow: "var(--shadow)",
              }}
            >
              <div
                style={{
                  width: "min(960px, calc(100% - 40px))",
                  margin: "0 auto",
                  padding: "14px 0",
                  color: "var(--muted)",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                Page {index + 1}
              </div>
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                sizes="100vw"
                style={{ width: "100%", height: "auto" }}
                priority={index === 0}
              />
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
