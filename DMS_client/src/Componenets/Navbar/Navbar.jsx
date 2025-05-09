import { useState } from "react";
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

const pages = [];
const settings = ["Profile", "Logout"];

const Navbar = ({ darkMode, toggleDarkMode }) => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseMenu = () => {
    setAnchorElNav(null);
    setAnchorElUser(null);
  };

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
              {pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseMenu}>
                  <Typography>{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          {/* User Menu */}
          <Tooltip title="Open settings">
            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar
                alt="User Avatar"
                src="/static/images/avatar/1.jpg"
                sx={{ bgcolor: '#5FECC8', color: 'white' }}
              />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseMenu}
          >
            {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseMenu}>
                <Typography>{setting}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
