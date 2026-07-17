"use client";

export default function GlobalRootError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: "1rem", textAlign: "center", padding: "1.5rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Something went wrong</h1>
          <p style={{ color: "#666" }}>The app hit an unexpected error loading its shell.</p>
          <button
            type="button"
            onClick={reset}
            style={{ borderRadius: "0.375rem", padding: "0.5rem 1rem", background: "#111", color: "#fff", fontSize: "0.875rem" }}
          >
            Try again
          </button>
        </main>
      </body>
    </html>
  );
}
