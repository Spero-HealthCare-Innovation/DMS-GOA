import { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogActions from "@mui/material/DialogActions";
import CallIcon from "@mui/icons-material/Call";
import EmailIcon from "@mui/icons-material/Email";
import EditIcon from "@mui/icons-material/Edit";


const pages = [];
const settings = ["Profile", "Logout"];


const Navbar = ({ darkMode, toggleDarkMode }) => {

  const port = import.meta.env.VITE_APP_API_KEY;
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);



  const empName = user?.emp_name || "";
  const nameParts = empName.trim().split(" ");
  const initials = nameParts.length >= 2
    ? nameParts[0][0].toUpperCase() + nameParts[nameParts.length - 1][0].toUpperCase()
    : empName[0]?.toUpperCase() || "";

  const email = user?.email || '';
  const phoneNo = user?.phone_no || '';
  // console.log("User from localStorage:", user);


  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseMenu = () => {
    setAnchorElNav(null);
    setAnchorElUser(null);
  };


 const logout = async () => {
  const accessToken = localStorage.getItem('access_token');  // Use correct key

  if (!accessToken) {
    console.error('No access token found');
    window.location.href = '/login';
    return;
  }

  try {
    const response = await fetch(`${port}/admin_web/logout/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    });
       localStorage.setItem('logout', Date.now()); 

    // Clear tokens regardless of logout success or failure
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_group');


    if (response.ok) {
      console.log('Logged out successfully');
    } else {
      console.warn('Logout request failed:', await response.text());
    }

    window.location.href = '/login';
  } catch (error) {
    console.error('Error during logout:', error);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('token');
    window.location.href = '/login';
  }
};

//auto logout for browser and tab close

// First useEffect remains the same 
useEffect(() => {
  const handleBeforeUnload = () => {
    sessionStorage.setItem('isClosing', 'true');
  };
  
  window.addEventListener('beforeunload', handleBeforeUnload);
  
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  };
}, []);

// Modified second useEffect with cache clearing functionality
useEffect(() => {
  // When page loads, check if we have a 'isClosing' flag
  const checkClosingStatus = () => {
    const isClosing = sessionStorage.getItem('isClosing');
    
    if (isClosing === 'true') {
      // Set a flag that we're in the process of checking
      sessionStorage.setItem('isChecking', 'true');
      // Set a timeout - this is the key part
      // If this code runs, it means the page wasn't actually closed
      // The browser must have refreshed
      setTimeout(() => {
        // Clear the closing flag since it was just a refresh
        sessionStorage.removeItem('isClosing');
        sessionStorage.removeItem('isChecking');
      }, 100);
    }
  };
  
  // Check on initial page load
  checkClosingStatus();
  
  // Function to clear browser cache
  const clearBrowserCache = async () => {
    if ('caches' in window) {
      try {
        // Get all cache names
        const cacheNames = await caches.keys();
        // Delete each cache
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('Browser cache cleared successfully');
      } catch (error) {
        console.error('Error clearing browser cache:', error);
      }
    }
  };
  
  // On page unload (either close or refresh)
  const handlePageHide = () => {
    const isClosing = sessionStorage.getItem('isClosing');
    const isChecking = sessionStorage.getItem('isChecking');
  
    if (isClosing === 'true' && isChecking !== 'true') {
      // This was a genuine close, not a refresh
      const userData = localStorage.getItem('userData');
      const token = Cookies.get('token'); //  replaced with js-cookie
      clearBrowserCache();
      if (!userData || !token) {
        // Remove the token cookie
        Cookies.remove('token'); //  remove JWT from cookie
        // Also clean up local/session if needed
        localStorage.removeItem('userData');
        sessionStorage.clear();
        // Logout / redirect
        handleLogout({ logoutParams: { returnTo: window.location.origin } });
      }
    }
  };
  
  
  window.addEventListener('pagehide', handlePageHide);
  
  return () => {
    window.removeEventListener('pagehide', handlePageHide);
  };
}, []);


useEffect(() => {
  // Step 1: Mark tab as "might be closing"
  const handleBeforeUnload = () => {
    sessionStorage.setItem('isClosing', 'true');
  };

  window.addEventListener('beforeunload', handleBeforeUnload);

  // Step 2: On load, check if we were closing but didn't actually close (i.e., just refreshed)
  const isClosing = sessionStorage.getItem('isClosing');
  if (isClosing === 'true') {
    // We refreshed, not closed — cancel the flag
    sessionStorage.removeItem('isClosing');
  }

  // Step 3: Handle actual close on pagehide (when tab is really closed)
  const handlePageHide = () => {
    const isStillClosing = sessionStorage.getItem('isClosing');
    if (isStillClosing === 'true') {
      //  Actually closing — now clear auth + cache
      Cookies.remove('token');
      localStorage.removeItem('userData');
      sessionStorage.clear();
      if ('caches' in window) {
        caches.keys().then(cacheNames => {
          cacheNames.forEach(name => caches.delete(name));
        });
      }
    }
  };

  window.addEventListener('pagehide', handlePageHide);

  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('pagehide', handlePageHide);
  };
}, []);




  return (
    <AppBar
      position="static"
      sx={{
        background: darkMode
          ? "linear-gradient(90deg, #0f2027, #203a43, #2c5364)"
          : "linear-gradient(90deg, #ffffff, #f0f0f0)",
        color: darkMode ? "#E5F3F5" : "#000",
        boxShadow: "none",
        transition: "all 0.5s ease-in-out",
        height: "60px",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          sx={{
            display: "inline-flex",
            alignItems: "center",
            px: 2,
            py: 0.5,
            borderRadius: "40px",
            background: darkMode
              ? "linear-gradient(90deg, #0f3443 0%, #34e89e 100%)"
              : "linear-gradient(90deg, #1C3B52 0%, #2EB9A3 100%)",
            border: "2px solid grey",
            borderColor: darkMode ? "#5BB9B4" : "#1C3B52",
            gap: 1,
          }}
        >
          <Typography
            sx={{
              color: darkMode ? "#E5F3F5" : "#fff",
              fontSize: "15px",
              fontWeight: 400,
              fontFamily: "Roboto, sans-serif",
            }}
          >
            Spero
          </Typography>
          <Typography
            sx={{
              color: darkMode ? "#E5F3F5" : "#fff",
              fontSize: "20px",
              fontWeight: 400,
              fontFamily: "Roboto, sans-serif",
            }}
          >
            DMS
          </Typography>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "flex" },
            justifyContent: "center",
            gap: 2,
          }}
        >
          {pages.map((page) => (
            <Button key={page} sx={{ color: darkMode ? "white" : "black" }}>
              {page}
            </Button>
          ))}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <IconButton
            onClick={toggleDarkMode}
            sx={{
              transition: "transform 0.3s ease, color 0.3s ease",
              "&:hover": { transform: "scale(1.2)" },
              color: darkMode ? "#FFD700" : "#333",
            }}
          >
            {darkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>

          {/* Mobile Menu */}
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton onClick={handleOpenNavMenu}>
              <MenuIcon sx={{ color: darkMode ? "#fff" : "#000" }} />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseMenu}
            >
              {settings.map((setting) => (
                <MenuItem
                  key={setting}
                  onClick={() => {
                    handleCloseMenu();
                    if (setting === "Logout") {
                      setLogoutConfirmOpen(true);
                    } else if (setting === "Profile") {
                      setOpenProfileDialog(true);
                    }

                  }}
                >
                  <Typography>{setting}</Typography>
                </MenuItem>
              ))}

            </Menu>
          </Box>

          {/* User Menu */}
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }} >
              <Avatar
                alt="User Avatar"
                // src="/static/images/avatar/1.jpg"
                sx={{ bgcolor: '#5FECC8', color: 'white' }}
              >{initials}</Avatar>
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseMenu}
          >
            {settings.map((setting) => (
              <MenuItem
                key={setting}
                onClick={() => {
                  handleCloseMenu();
                  if (setting === "Logout") {
                    setLogoutConfirmOpen(true);
                  } else if (setting === "Profile") {
                    setOpenProfileDialog(true);
                  }

                }}
              >
                <Typography>{setting}</Typography>
              </MenuItem>
            ))}

          </Menu>
          <Dialog
            open={openProfileDialog}
            onClose={() => setOpenProfileDialog(false)}
            PaperProps={{
              sx: {
                position: "absolute",
                top: 70,
                right: 20,
                m: 0,
                width: 300,
                borderRadius: 2,
              },
            }}
          >
            <DialogTitle>
              <Box display="flex" alignItems="center" gap={2}>
                <Avatar sx={{ bgcolor: "#5FECC8", width: 56, height: 56 }}>
                  {initials}
                </Avatar>

                <Box>
                  <Typography variant="h6" display="inline">
                    {empName}
                  </Typography>
                </Box>

              </Box>
            </DialogTitle>

            <DialogContent dividers>
              <Box display="flex" alignItems="center" gap={1} mb={2}>
                <CallIcon color="primary" />
                <Typography>{phoneNo}</Typography>
              </Box>
              <Box display="flex" alignItems="center" gap={1}>
                <EmailIcon color="primary" />
                <Typography>{email}</Typography>
              </Box>
            </DialogContent>


            <DialogActions>
              <Button onClick={() => setOpenProfileDialog(false)} variant="outlined">Close</Button>
            </DialogActions>
          </Dialog>

          <Dialog
            open={logoutConfirmOpen}
            onClose={() => setLogoutConfirmOpen(false)}
          >
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogContent>
              <Typography>Are you sure you want to logout?</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setLogoutConfirmOpen(false)} variant="outlined">
                Cancel
              </Button>
              <Button onClick={logout} color="error" variant="contained">
                Logout
              </Button>
            </DialogActions>
          </Dialog>


        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
