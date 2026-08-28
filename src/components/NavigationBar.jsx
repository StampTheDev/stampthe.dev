import { Link } from "react-router-dom"

function NavigationBar() {
  return (
    <nav className="navigation-bar">
      <Link to="/">Home</Link>
      <Link to="/projects">Projects</Link>
      <Link to="/experience">Experience</Link>
      <Link to="/skills">Skills</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
      <Link to="/terminal">Terminal</Link>
    </nav>
  )
}

export default NavigationBar