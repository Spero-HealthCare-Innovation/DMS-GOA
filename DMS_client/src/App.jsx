// src/App.js
import { useState, useMemo, useEffect } from "react";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useLocation } from "react-router-dom";
import Navbar from "./Componenets/Navbar/Navbar";
import Footer from "./Componenets/Footer/Footer";
import Sidebar from "./Componenets/DispatchModule/Sidebar/Sidebar";
import AppRoutes from "./routes/AppRoutes";
import Departmentsidebar from "./Componenets/SuperAdmin/Sidebar/Departmentsidebar";



function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [userGroup, setUserGroup] = useState(null);
  const location = useLocation();

  const isAuthRoute = location.pathname === "/login";

  // Load dark mode & user group from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("dark_mode");
    const storedGroup = localStorage.getItem("user_group");
    if (savedMode) setDarkMode(savedMode === "true");
    if (storedGroup) setUserGroup(storedGroup);
  }, []);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("dark_mode", darkMode);
  }, [darkMode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? "dark" : "light",
        },
      }),
    [darkMode]
  );

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
          {!isAuthRoute && (
            <>
              <Navbar
                darkMode={darkMode}
                toggleDarkMode={() => setDarkMode((prev) => !prev)}
              />

              {/* 👇 Correct Sidebar logic */}
              {userGroup === "2" && <Sidebar darkMode={darkMode} />}
              {userGroup === "1" && <Departmentsidebar darkMode={darkMode} />}
            </>
          )}

          <div style={{ marginLeft: "70px" }}>
            <AppRoutes darkMode={darkMode} />
          </div>

          {!isAuthRoute && <Footer darkMode={darkMode} />}
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
