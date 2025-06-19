import { useState, useEffect } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
} from "@mui/material";

import weatherImg from "../../../assets/Cloud angled rain zap.png";
import heatWatchImg from "../../../assets/Group 427319122.png";
import cycloneImg from "../../../assets/Tornado.png";
import droughtImg from "../../../assets/Sun.png";
import nowcastImg from "../../../assets/f1faf7e49dc03a9d97669947c2ea71a1f7b90dd3.png";
import floodImg from "../../../assets/Cloud angled rain zap.png";
import { useAuth } from "../../../Context/ContextAPI";

// Array of disaster names and their matching images
const disasterImages = [
  { text: "Flood", img: weatherImg },
  { text: "Urban Floods", img: heatWatchImg },
  { text: "Cloudburst", img: cycloneImg },
  { text: "Fire Hazard", img: droughtImg },
  { text: "Forest Fire Hazard", img: nowcastImg },
  { text: "Landslide", img: floodImg },
  { text: "Thunderstorm", img: floodImg },
  { text: "Mass Casualty", img: floodImg },
  { text: "Other", img: floodImg },
];

const Sidebar = ({ darkMode }) => {
  const [open, setOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const { disaster } = useAuth();

  useEffect(() => {
    if (disaster && disaster.length > 0) {
      const dynamicMenuItems = disaster.map((item) => {
        const imageObj = disasterImages.find((d) => d.text === item.disaster_name);
        return {
          id: item.disaster_id,
          text: item.disaster_name,
          img: imageObj ? imageObj.img : "", // fallback empty string if not found
        };
      });
      setMenuItems(dynamicMenuItems);
    }
  }, [disaster]);

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        sx={{
          width: open ? 200 : 50,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: open ? 200 : 50,
            height: "60vh",
            overflowY: "auto",
            overflowX: "hidden",
            background: darkMode
              ? "linear-gradient(to bottom, #5FC8EC, rgb(19, 26, 28))"
              : "linear-gradient(to bottom, #5FC8EC, rgb(18, 24, 26))",
            border: "1px solid rgba(255, 255, 255, 0.5)",
            color: "#fff",
            borderRadius: "30px",
            display: "flex",
            flexDirection: "column",
            paddingTop: 1,
            paddingBottom: 3,
            marginTop: "9em",
            marginLeft: "0.8em",
            transition: "width 0.5s ease-in-out",
            "&::-webkit-scrollbar": {
              width: "0px",
            },
            "&:hover": {
              background: darkMode
                ? "linear-gradient(to bottom, #53bce1, rgb(19, 26, 28))"
                : "linear-gradient(to bottom, #5FC8EC, rgb(18, 24, 26))",
            },
          },
        }}
      >
        <List sx={{ width: "100%", padding: 0 }}>
          {menuItems.map((item, index) => (
            <ListItemButton
              key={index}
              sx={{
                color: "black",
                "&:hover": { background: "rgb(95, 200, 236)" },
              }}
              onClick={() => console.log("Clicked:", item.text)}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                <img
                  src={item.img}
                  alt={item.text}
                  style={{ width: 24, height: 24, objectFit: "contain" }}
                  onError={(e) => (e.target.style.display = "none")} // hide broken image
                />
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: "14px",
                  lineHeight: 1.3,
                }}
                sx={{
                  opacity: open ? 1 : 0,
                  whiteSpace: "nowrap",
                  color: "white",
                }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
