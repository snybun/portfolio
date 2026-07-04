import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Process from './components/Process'
import Work from './components/Work'
import Contact from './components/Contact'
import Footer from './components/Footer'

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="main-content">
        <Hero />
        <About />
        <Process />
        <Work />
        <Contact />
      </main>
      <Footer />
    </div>
  )
}

export default App
