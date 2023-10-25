import './App.css'
import { Routes, Route, Navigate } from "react-router-dom"
import { RequireAuth, useAuth } from './context/Auth'
import { useEffect } from 'react'
import Home from "./pages/Home"
import LoadingSurvey from './pages/LoadingSurvey'
import BunkerSurvey from './pages/BunkerSurvey'
import Report from './pages/Report'
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import Unauthorized from './pages/Unauthorized'
import Layout from './components/Layout';
import LoadingUpdate from './pages/LoadingUpdate'
import BunkerUpdate from './pages/BunkerUpdate'
import VesselList from './pages//VesselList'
import TopLoadingBar from './components/TopLoadingBar'
import UpdatePasssword from './pages/UpdatePassword'
import Setting from './pages/Setting'

const ROLES = {
  'User': 'user',
  'Admin': 'admin'
}

function App() {
  const { setProgress } = useAuth();
  useEffect(() => {
      document.body.style.backgroundColor = "#F1F4F7"
      setProgress(100)
  }, []);
  return (
    <>
      <TopLoadingBar/>
      <div className="page-container">
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/login" />} />
              <Route element={< RequireAuth allowedRoles={[ROLES.User, ROLES.Admin]} />}>
                  <Route path="/home" element={<Home />} />
                  <Route path="/loadingsurvey" element={<LoadingSurvey />} />
                  <Route path="/loading/edit/:id" element={<LoadingUpdate />} />
                  <Route path="/bunker/edit/:id" element={<BunkerUpdate />} />
                  <Route path="/bunkersurvey" element={<BunkerSurvey />} />
                  <Route path="/report" element={<Report />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/update_password" element={<UpdatePasssword />} />
              </Route>
              <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
                  <Route path="/vessel_list" element={<VesselList />} />
                  <Route path="/setting" element={<Setting />} />
              </Route>
              <Route path="/login" element={<Login />} />
              <Route path="/forgot_password" element={<ForgotPassword />} />
              <Route path="/reset_password/:token" element={<ResetPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="*" element={<Navigate to="/login" />} />

          </Route>
        </Routes>
        
      </div>
    </>
  )
}

export default App
