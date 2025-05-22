import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  Grid,
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";
import { Search, Visibility, AddCircleOutline } from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { tasks } from "./dummydata";

const EnquiryCard = styled("div")(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: "#5FECC8",
  borderRadius: "8px 10px 0 0",
  padding: "6px 12px",
  color: "black",
  height: "40px",
}));

const EnquiryCardBody = styled("tr")(({ theme, status }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  background: theme.palette.mode === "dark" ? "#112240" : "#fff",
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
  marginTop: "0.5em",
  borderRadius: "8px",
  padding: "10px 12px",
  transition: "all 0.3s ease",
  cursor: "pointer",
  "&:hover": {
    boxShadow: `0 0 8px ${status === "Completed"
        ? "#00e67699"
        : status === "Pending"
          ? "#f4433699"
          : "#88888855"
      }`,
  },
  height: "45px",
}));

const StyledCardContent = styled("td")({
  padding: "0 8px",
  display: "flex",
  alignItems: "center",
});

const Alert = [
  "Alert Id",
  "Disaster Id",
  "Alert Type",
  "Date & Time",
  "Priority",
  "Initiated By",
  "Add",
  "View",
];

const Dispatch = [
  "Alert ID",
  "Disaster ID",
  "Date & Time",
  "Disaster Type",
  "Priority",
  "Status",
  "Mode",
  "Initiated By",
  "View",
];

function SopTask({ darkMode, flag, setFlag, setSelectedIncident }) {
  useLocation(); // This line does nothing
  const location = useLocation(); // This is the correct usage
  const socketUrl = import.meta.env.VITE_SOCKET_API_KEY;
  const [alerts, setAlerts] = useState([]); 
  const socketRef = useRef(null);


  window.addEventListener('storage', (e) => {
    if (e.key === 'logout') {
      location.href = '/login';
    }
  });;

  // useEffect(() => {
  //   socketRef.current = new WebSocket("ws://127.0.0.1:9000/ws/weather_alerts_trigger2");

  //   socketRef.current.onopen = () => {
  //     console.log("✅ WebSocket connected");
  //   };

  //   socketRef.current.onmessage = (event) => {
  //     try {
  //       const newAlert = JSON.parse(event.data); // Assuming backend sends JSON

  //       setAlerts((prevAlerts) => [newAlert, ...prevAlerts]); // Latest alert on top
  //     } catch (error) {
  //       console.error("Error parsing alert:", error);
  //     }
  //   };

  //   socketRef.current.onerror = (error) => {
  //     console.error("❌ WebSocket error", error);
  //   };

  //   socketRef.current.onclose = () => {
  //     console.log("🔌 WebSocket disconnected");
  //   };

  //   return () => {
  //     socketRef.current?.close(); // Cleanup
  //   };
  // }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const socket = new WebSocket(
        `${socketUrl}/ws/weather_alerts_trigger2`
      );

      socket.onopen = () => {
        console.log("WebSocket connected");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log(data, "latest alert");
          setAlerts([data]);
          // only latest alert
          // Auto-select this incident and open detail view
          setSelectedIncident(data);
          setFlag(1);


        } catch (error) {
          console.error("Invalid JSON:", event.data);
        }
      };

      socket.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      socket.onclose = () => {
        console.log("WebSocket closed");
      };

      // Clean up
      return () => {
        socket.close();
      };
    }, 1000); // delay 1 sec

    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    setFlag(0);
  };

  const textColor = darkMode ? "#ffffff" : "#000000";
  const bgColor = darkMode ? "#0a1929" : "#ffffff";

  return (
    <Paper
      elevation={3}
      sx={{ padding: 2, borderRadius: 3, backgroundColor: bgColor }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 2 }}>
        {flag === 1 && (
          <ArrowBackIcon
            onClick={handleBack}
            sx={{
              cursor: "pointer",
              fontSize: 26,
              color: darkMode ? "#fff" : "#000",
              "&:hover": {
                color: "#00f0c0",
              },
            }}
          />
        )}
        {flag === 1 ? (
          <Typography
            variant="h6"
            sx={{
              color: textColor,
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: "32px",
            }}
          >
            Task
          </Typography>
        ) : (
          <Typography
            variant="h6"
            sx={{
              color: textColor,
              fontSize: "20px",
              fontWeight: 500,
              lineHeight: "32px",
            }}
          >
            Dispatch SOP
          </Typography>
        )}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "gray", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "200px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "25px",
              backgroundColor: darkMode ? "#1e293b" : "#fff",
              color: darkMode ? "#fff" : "#000",
              px: 1,
              py: 0.2,
            },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: darkMode ? "#444" : "#ccc",
            },
            "& input": {
              color: darkMode ? "#fff" : "#000",
              padding: "6px 8px",
              fontSize: "13px",
            },
          }}
        />
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* Header Row */}
          <EnquiryCard
            sx={{
              display: "flex",
              flexDirection: "row",
              backgroundColor: "#5FECC8",
            }}
          >
            {[
              "Alert ID",
              "Latitude",
              "Longitude",
              "Temperature",
              "Rain",
              "Time",
              "Added By",
            ].map((label, idx) => (
              <StyledCardContent
                key={idx}
                sx={{
                  flex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  padding: "8px",
                }}
              >
                <Typography variant="subtitle2" fontWeight={600}>
                  {label}
                </Typography>
              </StyledCardContent>
            ))}
          </EnquiryCard>

          {/* Table Content */}
          {alerts.length === 0 ? (
            <Box p={2}>
              <Typography align="center" color="textSecondary">
                No alerts available.
              </Typography>
            </Box>
          ) : (
            alerts.map((item) => (
              <EnquiryCardBody
                key={item.pk_id}
                status={item.status}
                sx={{ display: "flex", flexDirection: "row", marginTop: "8px" }}
              >
                <StyledCardContent sx={{ flex: 1, justifyContent: "center" }}>
                  <Typography variant="subtitle2">{item.pk_id}</Typography>
                </StyledCardContent>
                <StyledCardContent sx={{ flex: 1, justifyContent: "center" }}>
                  <Typography variant="subtitle2">{item.latitude}</Typography>
                </StyledCardContent>
                <StyledCardContent sx={{ flex: 1, justifyContent: "center" }}>
                  <Typography variant="subtitle2">{item.longitude}</Typography>
                </StyledCardContent>
                <StyledCardContent sx={{ flex: 1, justifyContent: "center" }}>
                  <Typography variant="subtitle2">
                    {item.temperature_2m}
                  </Typography>
                </StyledCardContent>
                <StyledCardContent sx={{ flex: 1, justifyContent: "center" }}>
                  <Typography variant="subtitle2">{item.rain}</Typography>
                </StyledCardContent>
                <StyledCardContent sx={{ flex: 1, justifyContent: "center" }}>
                  <Typography variant="subtitle2" fontSize={12}>
                    {item.time || `${item.date} ${item.time}`}
                  </Typography>
                </StyledCardContent>
                <StyledCardContent sx={{ flex: 1, justifyContent: "center" }}>
                  <Typography variant="subtitle2">{item.added_by}</Typography>
                </StyledCardContent>
              </EnquiryCardBody>
            ))
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}

export default SopTask;
