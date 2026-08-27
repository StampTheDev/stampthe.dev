import "./App.css";

import NavigationBar from "./components/NavigationBar";

function App() {
  return (
    <>
      <NavigationBar />

      <img
        className="homepage-image"
        src="/private/AIgen.png"
        alt="Homepage"
      />

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
              <span>XXXXXXXXXXXX</span>
            </div>

            <div>
              <strong>17</strong>
              <span>XXXXXXXXX</span>
            </div>

            <div>
              <strong>5</strong>
              <span>XXXXXXXXXXX</span>
            </div>
          </div>
        </div>

        <img
          className="homepage-about-photo"
          src="/private/myphoto.png"
          alt="Jacob Stamper"
        />
      </section>

      <section className="homepage-projects">
        <h2>Projects</h2>

        <div className="homepage-project-cards">
          <div className="homepage-project-card">
            <img src="/private/project1.png" alt="Project 1" />
            <p>Project 1</p>
          </div>

          <div className="homepage-project-card">
            <img src="/private/project2.png" alt="Project 2" />
            <p>Project 2</p>
          </div>

          <div className="homepage-project-card">
            <img src="/private/project3.png" alt="Project 3" />
            <p>Project 3</p>
          </div>
        </div>
      </section>

    </>
  );
}

export default App;