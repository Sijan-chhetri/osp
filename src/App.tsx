import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/osp/Navbar'
import Footer from './components/osp/Footer'
import Hero from './pages/osp/Hero'
import Software from './pages/osp/Software'
import Contact from './pages/osp/Contact'
import Activationkey from './pages/osp/Activationkey'
import EgHero from './pages/eg/eghero'
import EgProduct from './pages/eg/egproduct'
import EgFooter from './components/eg/egFooter'

function App() {
  return (
    <Router>
      <Routes>
        {/* OSP Home Page Route */}
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-white">
              <Navbar />
              <Hero />
              <Software />
              <Contact />
              <Footer />
            </div>
          }
        />
        {/* OSP Activation Key Route */}
        <Route 
          path="/activation" 
          element={
            <div className="min-h-screen bg-gradient-to-b from-purple-900 via-purple-800 to-white">
              <Navbar />
              <Activationkey />
              <Footer />
            </div>
          } 
        />
        {/* EG Cartridge Page Route */}
        <Route 
          path="/eg" 
          element={
            <>
              <EgHero />
              <EgProduct />
              <EgFooter />
            </>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App
