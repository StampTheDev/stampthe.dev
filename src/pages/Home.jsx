function Home() {
  return (
    <div className="page">
      <div className="homepage-image-container">
        <img
          className="homepage-image"
          src="/home_main.jpg"
          alt="Homepage"
        />
      </div>

      <section className="homepage-intro">
        <p className="homepage-audience">
          STUDENTS, EMPLOYERS, AND WHOEVER ELSE FINDS THEIR WAY HERE...
        </p>

        <h1 className="homepage-progress-title">
          This website is a work in progress.
        </h1>

        <p className="homepage-progress-text">
          I'll be updating and expanding it regularly over the next several
          months as it grows into its final form. In the meantime, feel free
          to look around.
        </p>

        <p className="homepage-progress-text">
          The Terminal is already one of the most complete parts of the site.
          Feel free to explore it — there's more there than it first appears.
        </p>

        <a className="homepage-terminal-link" href="/terminal">
          Explore the Terminal →
        </a>
      </section>

      <section className="homepage-about">
        <div className="homepage-about-text">
          <h2>Who I am:</h2>

          <p>
            My name is Jacob Stamper. I write software.
            I'm always looking for the next big thing.
          </p>

          <div className="homepage-about-stats">
            <div>
              <strong>6</strong>
              <span>Semesters</span>
            </div>

            <div>
              <strong>3.70+</strong>
              <span>GPA</span>
            </div>

            <div>
              <strong>97</strong>
              <span>Days Until Available Full-Time</span>
            </div>
          </div>
        </div>

        <img
          className="homepage-about-photo"
          src="/Good Pic.PNG"
          alt="Jacob Stamper"
        />
      </section>

      <section className="homepage-projects">
        <h2>Projects</h2>

        <div className="homepage-project-cards">
          <div className="homepage-project-card">
            <img src="/campusbuzz.png" alt="Project 1" />
            <p>CampusBuzz</p>
            <p>Career Fair Web App</p>
          </div>

          <div className="homepage-project-card">
            <img src="/myvinyl.jpg" alt="Project 2" />
            <p>MyVinyl</p>
            <p>Programmable Record Prototype</p>
          </div>

          <div className="homepage-project-card">
            <img src="/home_main.jpg" alt="Project 3" />
            <p>Personal Website</p>
            <p>What you're looking at...</p>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home