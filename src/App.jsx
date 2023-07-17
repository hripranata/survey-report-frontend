// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { Routes, Route } from "react-router-dom"
import Navbar from './components/Navbar'
import Home from "./pages/Home"
import LoadingSurvey from './pages/LoadingSurvey'
import BunkerSurvey from './pages/BunkerSurvey'
import Report from './pages/Report'
import Footer from './components/Footer'
import Profile from "./pages/Profile"

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
    <Navbar />
    <body className="d-flex flex-column min-vh-100">
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/loadingsurvey" element={<LoadingSurvey />} />
        <Route path="/bunkersurvey" element={<BunkerSurvey />} />
        <Route path="/report" element={<Report />} />
        <Route path="/profile" element={<Profile />} />
    </Routes>
      
    </body>
      {/* <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div> */}
      {/* <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
      </div> */}

      <Footer />
    </>
  )
}

export default App
