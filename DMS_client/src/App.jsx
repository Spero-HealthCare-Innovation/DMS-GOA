// src/App.js
import { useState, useMemo } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Navbar from "./Componenets/Navbar/Navbar";
import Sop from "./Componenets/DispatchModule/SOP/Sop";
import Login from "./Componenets/Login/Login";
import Footer from "./Componenets/Footer/Footer";
import AlertPanel from "./Componenets/DispatchModule/AlertPanel/AlertPanel";
import Sidebar from "./Componenets/DispatchModule/Sidebar/Sidebar";

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // <-- Login state
  const location = useLocation();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

  const authRoutes = ["/Login"];
  const isAuthRoute = authRoutes.includes(location.pathname);

  const hideSidebarRoutes = ["/alert-panel", "/Sop"];
  const shouldHideSidebar = hideSidebarRoutes.includes(location.pathname);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          backgroundColor: darkMode ? "#0a1929" : "#f5f5f5",
          transition: "background-color 0.5s ease-in-out",
        }}
      >
        <div style={{ flex: 1 }}>
          {!isAuthRoute && <Sidebar darkMode={darkMode} toggleDarkMode={() => setDarkMode(prev => !prev)} />}
          {!isAuthRoute && <Navbar darkMode={darkMode} toggleDarkMode={() => setDarkMode(prev => !prev)} />}

          <div style={{ marginLeft: '70px' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/Login" replace />} />
              <Route path="/Login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="/Sop" element={<Sop darkMode={darkMode} />} />
              <Route path="/alert-panel" element={<AlertPanel darkMode={darkMode} />} />
            </Routes>
          </div>

          {!isAuthRoute && <Footer darkMode={darkMode} />}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
