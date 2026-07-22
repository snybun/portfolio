import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import TechStack from './components/TechStack'
import Work from './components/Work'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Preloader from './components/Preloader'
import CustomCursor from './components/CustomCursor'

function App() {
  const [preloaderDone, setPreloaderDone] = useState(false)

  return (
    <>
      <CustomCursor />
      {!preloaderDone && (
        <Preloader onComplete={() => setPreloaderDone(true)} />
      )}
      <div className={`app ${!preloaderDone ? 'app--loading' : ''}`}>
        <Navbar preloaderDone={preloaderDone} />
        <main className="main-content">
          <Hero preloaderDone={preloaderDone} />
          <About />
          <TechStack />
          <Work />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}

export default App
