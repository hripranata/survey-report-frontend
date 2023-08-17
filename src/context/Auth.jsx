/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const useLocalStorage = (keyName, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const value = window.localStorage.getItem(keyName);
      if (value) {
        return JSON.parse(value);
      } else {
        window.localStorage.setItem(keyName, JSON.stringify(defaultValue));
        return defaultValue;
      }
    } catch (err) {
      return defaultValue;
    }
  });
  const setValue = (newValue) => {
    try {
      window.localStorage.setItem(keyName, JSON.stringify(newValue));
    } catch (err) { /* empty */ }
    setStoredValue(newValue);
  };
  return [storedValue, setValue];
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useLocalStorage('user', null);
  const [progress, setProgress] = useState(0)
  return (
    <AuthContext.Provider value={{auth, setAuth, progress, setProgress}}>
      {children}
    </AuthContext.Provider>
  );
};

export const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth();
  const location = useLocation();

  if (!auth) {
    return (
      <Navigate
        to={{ pathname: "/login", state: { from: location } }}
        replace
      />
    );
  }

  return (
    <div>
        <Navbar />
        <div className="content-wrap">
            {/* <Outlet /> */}
            {/* { auth?.data?.user?.role.find(role => allowedRoles?.includes(role)) */}
            { allowedRoles.find(role => auth?.data?.user?.role === role)
              ? <Outlet />
              : auth?.data?.user
              ? <Navigate to="/unauthorized" state={{ from: location }} replace />
              : <Navigate to="/login" state={{ from: location }} replace />
            }
        </div>
        <Footer />
    </div>
  )
};