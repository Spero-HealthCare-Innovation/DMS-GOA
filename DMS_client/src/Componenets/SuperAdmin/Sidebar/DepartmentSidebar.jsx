import { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Grid,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";
import LockIcon from "@mui/icons-material/Lock";
import { useNavigate } from "react-router-dom";
import AddBoxIcon from "@mui/icons-material/AddBox";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";

const screenConfig = {
  "System User": {
    icon: <AccountCircleIcon />,
    screens: [
      { id: 1, text: "Add Department", path: "/add-department" },
      { id: 2, text: "Add Group", path: "/add-group" },
      { id: 3, text: "Add Employee", path: "/add-employee" },
    ],
  },
  "Register Sop": {
    icon: <AddBoxIcon />,
    screens: [],
  },
  Responder: {
    icon: <AddCircleOutlineOutlinedIcon />,
    screens: [],
  },
  "Closure Detail": {
    icon: <TextSnippetOutlinedIcon />,
    screens: [],
  },
  Permission: {
    icon: <LockIcon />,
    screens: [
      { id: 4, text: "Manage Roles", path: "/roles" },
      { id: 5, text: "Access Control", path: "/access-control" },
    ],
  },
};

const Departmentsidebar = ({ darkMode }) => {
  const [open, setOpen] = useState(false);
  const [dropdowns, setDropdowns] = useState({});
  const navigate = useNavigate();

  const toggleDropdown = (key) => {
    setDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <Grid container>
      <Grid item>
        <Drawer
          variant="permanent"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => {
            setOpen(false);
            setDropdowns({});
          }}
          sx={{
            width: open ? 200 : 60,
            "& .MuiDrawer-paper": {
              width: open ? 200 : 50,
              position: "absolute",
              top: "50%",

              transform: "translateY(-50%)",
              background: darkMode
                ? "linear-gradient(to bottom, #5FECC8, rgba(32, 43, 40, 0.05))"
                : "radial-gradient(6035.71% 72.44% at 0% 50%, #00BFA6 0%, #292D45 100%)",
              borderRadius: "30px",
              transition: "width 0.5s ease-in-out",
              display: "flex",
              alignItems: open ? "flex-start" : "center",
              justifyContent: "center",
              overflow: "hidden",
              height: "50vh",
              maxHeight: "90vh",
              // marginLeft: "0.2em",
              alignContent: "left",
            },
          }}
        >
          <Box sx={{ width: "100%", overflow: "hidden", alignContent: "left" }}>
            <List>
              {Object.entries(screenConfig).map(
                ([sectionName, { icon, screens }]) => {
                  const hasSubmenus = screens && screens.length > 0;

                  return (
                    <Box key={sectionName} sx={{ width: "100%" }}>
                      <ListItemButton
                        onClick={() =>
                          hasSubmenus
                            ? toggleDropdown(sectionName)
                            : navigate("/" + sectionName)
                        }
                        sx={{
                          flexDirection: open ? "row" : "column",
                          justifyContent: "left",
                          py: 1,
                          gap: 1,
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 0 }}>{icon}</ListItemIcon>

                        {open && (
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                              gap: 0.5,
                            }}
                          >
                            <Typography variant="caption">
                              {sectionName}
                            </Typography>
                            {hasSubmenus &&
                              (dropdowns[sectionName] ? (
                                <ArrowDropUpIcon fontSize="small" />
                              ) : (
                                <ArrowDropDownIcon fontSize="small" />
                              ))}
                          </Box>
                        )}
                      </ListItemButton>

                      {open && dropdowns[sectionName] && hasSubmenus && (
                        <Box sx={{ mt: 1, pl: 3 }}>
                          {screens.map((screen) => (
                            <ListItemButton
                              key={screen.id}
                              onClick={() => navigate(screen.path)}
                              sx={{ py: 0.5 }}
                            >
                              <ListItemText
                                primary={screen.text}
                                primaryTypographyProps={{ fontSize: 12 }}
                              />
                            </ListItemButton>
                          ))}
                        </Box>
                      )}
                    </Box>
                  );
                }
              )}
            </List>
          </Box>
        </Drawer>
      </Grid>
    </Grid>
  );
};

export default Departmentsidebar;
