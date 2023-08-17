import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"
import { RequireAuth } from './context/Auth'
import { useState, useEffect } from 'react'
import LoadingBar from 'react-top-loading-bar'
import Home from "./pages/Home"
import LoadingSurvey from './pages/LoadingSurvey'
import BunkerSurvey from './pages/BunkerSurvey'
import Report from './pages/Report'
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Unauthorized from './pages/Unauthorized'
import Layout from './components/Layout';
import LoadingUpdate from './pages/LoadingUpdate'
import BunkerUpdate from './pages/BunkerUpdate'

function App() {
  const [progress, setProgress] = useState(0)
  useEffect(() => {
      document.body.style.backgroundColor = "#F1F4F7"
      setProgress(100)
  }, []);
  return (
    <>
      <LoadingBar
        color='#f11946'
        progress={progress}
        onLoaderFinished={() => setProgress(0)}
      />
      <div className="page-container">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/login" />} />
              <Route element={< RequireAuth />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/loadingsurvey" element={<LoadingSurvey />} />
                  <Route path="/loading/edit/:id" element={<LoadingUpdate />} />
                  <Route path="/bunker/edit/:id" element={<BunkerUpdate />} />
                  <Route path="/bunkersurvey" element={<BunkerSurvey />} />
                  <Route path="/report" element={<Report />} />
                  <Route path="/profile" element={<Profile />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<Navigate to="/login" />} />

          </Route>
        </Routes>
        
      </div>
    </>
  )
}

export default App
