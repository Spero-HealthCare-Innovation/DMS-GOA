import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Grid,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import LockIcon from "@mui/icons-material/Lock";
// import AddDepartment from "../System/Department/AddDepartment";
import { useNavigate } from "react-router-dom";
// import EmployeReg from "../System/Employee_reg/Employee_reg";
// import AddGroup from "../System/Groups/Add_group";
 
const Departmentsidebar = ({ darkMode }) => {
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activePage, setActivePage] = useState("");
  const navigate = useNavigate();
 
  const screens = [
    {
      id: "department",
      text: "Department Registration",
      path: "/department",
    //   component: (props) => <AddDepartment {...props} />,
    },
    {
      id: "group",
      text: "Group Registration",
      path: "/group",
    //   component: (props) => <AddGroup {...props} />,
    },
    {
      id: "employee",
      text: "Employee Registration",
      path: "/employee",
    //   component: (props) => <EmployeReg {...props} />,
    },
  ];
 
  return (
    <Grid container>
      {/* Sidebar */}
      <Grid item>
        <Drawer
          variant="permanent"
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => {
            setOpen(false);
            setDropdownOpen(false);
          }}
          sx={{
            width: open ? 200 : 60,
            "& .MuiDrawer-paper": {
              width: open ? 200 : 60,
              height: 300,
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              background: "linear-gradient(to bottom, #5FECC8, #5FECC80D)",
              borderRadius: "30px",
              transition: "width 0.5s ease-in-out",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
            },
          }}
        >
          <Box sx={{ width: "100%" }}>
            <List>
              {/* System User */}
              <ListItemButton
                onClick={() => setDropdownOpen((prev) => !prev)}
                sx={{ flexDirection: "column", alignItems: "center" }}
              >
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <AccountCircleIcon />
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary="System User"
                    primaryTypographyProps={{ variant: "caption" }}
                  />
                )}
              </ListItemButton>
 
              {/* Permission */}
              <ListItemButton
                sx={{ flexDirection: "column", alignItems: "center" }}
              >
                <ListItemIcon sx={{ minWidth: 0 }}>
                  <LockIcon />
                </ListItemIcon>
                {open && (
                  <ListItemText
                    primary="Permission"
                    primaryTypographyProps={{ variant: "caption" }}
                  />
                )}
              </ListItemButton>
 
              {/* Dropdown List inside drawer without overlapping */}
              {open && dropdownOpen && (
                <Box sx={{ mt: 1, pl: 3 }}>
                  {screens.map((screen) => (
                    <ListItemButton
                      key={screen.id}
                      onClick={() => {
                        setActivePage(screen.id);
                        setDropdownOpen(false);
                        navigate(screen.path);
                      }}
                      sx={{ py: 0.5 }}
                    >
                      <ArrowRightIcon fontSize="small" sx={{ mr: 1 }} />
                      <ListItemText
                        primary={screen.text}
                        primaryTypographyProps={{ fontSize: 12 }}
                      />
                    </ListItemButton>
                  ))}
                </Box>
              )}
            </List>
          </Box>
        </Drawer>
      </Grid>
 
      <Grid item xs sx={{ p: 2 }}>
        {screens.find((screen) => screen.id === activePage)?.component({ darkMode })}
      </Grid>
    </Grid>
  );
};
 
export default Departmentsidebar;