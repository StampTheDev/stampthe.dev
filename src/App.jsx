import { Routes, Route } from "react-router-dom"
import "./App.css"

import NavigationBar from "./components/NavigationBar"

import Home from "./pages/Home"
import Projects from "./pages/Projects"
import Experience from "./pages/Experience"
import Skills from "./pages/Skills"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Terminal from "./pages/Terminal"

function App() {
  return (
    <>
      <NavigationBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terminal" element={<Terminal />} />
      </Routes>
    </>
  )
}

export default App