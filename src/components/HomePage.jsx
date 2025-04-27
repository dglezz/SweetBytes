function HomePage() {
  return (
    <div className="home">
      <h1>Sweet Bytes</h1>
      <p>Sweeten your day, one byte at a time!</p>
      <img
        src="/images/donuts.jpeg"
        alt="Donuts Banner"
        className="home-banner"
      />
      <section className="reviews-section">
        <h2>Read what our customers had to say!</h2>
        <div className="review-grid">
          {Array(6)
            .fill()
            .map((_, i) => (
              <div key={i} className="review-card">
                <p>
                  <strong>Review {i + 1}</strong>
                </p>
                <p>Title</p>
                <p className="review-desc">Description</p>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
