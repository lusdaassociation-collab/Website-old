function injectContent(target) {
  target.innerHTML = `
    <section class="hero reveal">
    <link rel="icon" type="image/png" href="/favicon.png">
      <h1>Welcome to My Website</h1>
      <p class="muted">This homepage is built with Astro + a small client script.</p>
    </section>

    <section class="grid">
      <article class="card reveal">
        <h2>Fast</h2>
        <p class="muted">Astro ships zero JS by default — super fast.</p>
      </article>
      <article class="card reveal">
        <h2>Flexible</h2>
        <p class="muted">Enhance only where you need interactivity.</p>
      </article>
      <article class="card reveal">
        <h2>Future-proof</h2>
        <p class="muted">Deploy anywhere: static or serverless.</p>
      </article>
    </section>

    <section class="cta reveal">
      <a href="/events" class="btn">View Events →</a>
    </section>
  `;

  // reveal
}