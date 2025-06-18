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
import { styled, Switch } from '@mui/material';
import { useAuth } from "./../../Context/ContextAPI";


const pages = [];
const settings = ["Profile", "Logout"];



const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb': {
        backgroundColor: '#0f2027', // Sun - Yellow
        '&:before': {
          backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='20' width='20' viewBox='0 0 20 20'><path fill='${encodeURIComponent(
            '#fff'
          )}' d='M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z'/></svg>")`,
        },
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor:
          theme.palette.mode === 'dark' ? '#8796A5' : '#fdd835',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor:
      theme.palette.mode === 'dark' ? '#003892' : '#fdd835',
    width: 32,
    height: 30,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' height='20' width='20' viewBox='0 0 20 20'><path fill='${encodeURIComponent(
        '#fff'
      )}' d='M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z'/></svg>")`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor:
      theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));



const Navbar = ({ darkMode, toggleDarkMode }) => {

  const port = import.meta.env.VITE_APP_API_KEY;
  const { newToken } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();
  const [openProfileDialog, setOpenProfileDialog] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);

  // Determine effective token (context token takes priority)
  const effectiveToken = newToken || localStorage.getItem("access_token");



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
    const effectiveToken = newToken || localStorage.getItem("access_token");
    console.log(localStorage.getItem("access_token"), "hii");

    console.log(effectiveToken, 'effectiveTokeneffectiveToken');

    if (!effectiveToken) {
      console.error('No access token found');
      // window.location.href = '/login';
      navigate("/login");
      return;
    }

    const refreshToken = localStorage.getItem("refresh_token");
    console.log(refreshToken, 'refresh token i got');

    try {
      const response = await fetch(`${port}/admin_web/logout/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${effectiveToken}`,
        },
        body: JSON.stringify({
          refresh_token: refreshToken
        })
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

      // window.location.href = '/login';
      navigate("/login");
    } catch (error) {
      console.error('Error during logout:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token');
      // window.location.href = '/login';
      // navigate("/login");
    }
  };

  //auto logout for browser and tab close

  // useEffect(() => {
  //   // 1. Flag if it's a refresh
  //   let wasInteracted = false;
  //   let unloadTime = Date.now();

  //   const markInteraction = () => {
  //     wasInteracted = true;
  //   };

  //   const handleBeforeUnload = () => {
  //     unloadTime = Date.now();
  //     sessionStorage.setItem('lastUnloadTime', unloadTime.toString());
  //   };

  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === 'hidden') {
  //       const now = Date.now();
  //       const diff = now - unloadTime;

  //       // If no interaction recently, treat it as a close (not refresh)
  //       if (!wasInteracted && diff < 500) {
  //         localStorage.setItem('logout', Date.now().toString());
  //       }
  //     }
  //   };

  //   // 2. Cross-tab logout listener
  //   const handleStorage = (e) => {
  //     if (e.key === 'logout') {
  //       // Cleanup and redirect to login
  //       Cookies.remove('token');
  //       localStorage.removeItem('userData');
  //       sessionStorage.clear();

  //       if ('caches' in window) {
  //         caches.keys().then(cacheNames =>
  //           cacheNames.forEach(name => caches.delete(name))
  //         );
  //       }

  //       // Avoid flickering during fast reloads
  //       setTimeout(() => {
  //         if (!window.location.pathname.includes('/login')) {
  //           window.location.href = '/login';
  //         }
  //       }, 100);
  //     }

  //     if (e.key === 'login') {
  //       // Auto-navigate to main page if someone logs in
  //       if (window.location.pathname === '/login') {
  //         window.location.href = '/alert'; // your main page
  //       }
  //     }
  //   };

  //   // 3. Bind all handlers
  //   document.addEventListener('mousedown', markInteraction);
  //   document.addEventListener('keydown', markInteraction);
  //   window.addEventListener('beforeunload', handleBeforeUnload);
  //   document.addEventListener('visibilitychange', handleVisibilityChange);
  //   window.addEventListener('storage', handleStorage);

  //   return () => {
  //     document.removeEventListener('mousedown', markInteraction);
  //     document.removeEventListener('keydown', markInteraction);
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //     document.removeEventListener('visibilitychange', handleVisibilityChange);
  //     window.removeEventListener('storage', handleStorage);
  //   };
  // }, []);




  return (
    <AppBar
      position="static"
      sx={{
        background: darkMode
          ? "#202328"
          : "linear-gradient(90deg, #ffffff, #f0f0f0)",
        // background: darkMode
        //   ? "linear-gradient(90deg, #0f2027, #203a43, #2c5364)"
        //   : "linear-gradient(90deg, #ffffff, #f0f0f0)",
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
            cursor: "pointer",
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
          <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"} arrow>
            <MaterialUISwitch
              checked={darkMode}
              onChange={toggleDarkMode}
              sx={{
                transition: "transform 0.3s ease, color 0.3s ease",
                "&:hover": { transform: "scale(1.2)" },
                color: darkMode ? "#FFD700" : "#333",
              }}
            />
          </Tooltip>

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
                sx={{
                  // bgcolor: '#5FECC8',
                  color: 'white',
                  background: darkMode
                    ? "linear-gradient(90deg, #0f3443 0%, #34e89e 100%)"
                    : "linear-gradient(90deg, #1C3B52 0%, #2EB9A3 100%)",
                }}
              >
                {initials}
              </Avatar>
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
                <Avatar sx={{
                  background: darkMode
                    ? "linear-gradient(90deg, #0f3443 0%, #34e89e 100%)"
                    : "linear-gradient(90deg, #1C3B52 0%, #2EB9A3 100%)",
                  width: 56,
                  height: 56
                }}>
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
