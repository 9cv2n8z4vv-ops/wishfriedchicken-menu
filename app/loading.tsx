export default function Loading() {
  return (
    <main className="menu-page" aria-busy="true" aria-label="Menü yükleniyor">
      <div className="menu-hero"><div style={{ width: 180, height: 244, border: "1px solid rgba(93,42,44,.18)" }} /></div>
      <div className="menu-content">
        {[1, 2, 3].map((section) => (
          <section className="menu-section" key={section}>
            <div style={{ width: "42%", height: 54, border: "1px solid rgba(93,42,44,.16)", marginBottom: 24 }} />
            {[1, 2, 3].map((row) => <div key={row} style={{ height: 82, borderTop: "1px solid rgba(93,42,44,.12)" }} />)}
          </section>
        ))}
      </div>
    </main>
  );
}
