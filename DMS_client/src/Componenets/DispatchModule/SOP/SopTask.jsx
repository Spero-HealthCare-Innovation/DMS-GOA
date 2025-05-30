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
  IconButton,
} from "@mui/material";
import {
  Search,
  Visibility,
  AddCircleOutline,
  CheckCircle,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { tasks } from "./dummydata";
import { Tooltip } from "@mui/material";

import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

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
    boxShadow: `0 0 8px ${
      status === "Completed"
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

const Alerts = [
  "Alert ID",
  // "Disaster ID",
  "Disaster Type",
  "Latitude",
  "Longitude",
  "Temperature",
  "Rain",
  "Time",
  "Added By",
];

const Dispatch = [
  "Incident ID",
  "Disaster ID",
  "Date & Time",
  "Disaster Type",
  "Priority",
  "Status",
  "Mode",
  "Initiated By",

  "Actions",
];

function SopTask({
  darkMode,
  flag,
  setFlag,
  setSelectedIncident,
  setViewmode,
}) {
  const socketUrl = import.meta.env.VITE_SOCKET_API_KEY;
  const location = useLocation();
  const [alerts, setAlerts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  window.addEventListener("storage", (e) => {
    if (e.key === "logout") {
      location.href = "/login";
    }
  });
  useEffect(() => {
    let socket;
    const timer = setTimeout(() => {
      socket = new WebSocket(`${socketUrl}/ws/weather_alerts_trigger2`);

      socket.onopen = () => {
        console.log("WebSocket connected");
      };

      socket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log(data, "latest alert");
          setAlerts([data]);
          setSelectedIncident(data);
          setFlag(1);
          setViewmode("incident"); // Set view mode to incident when new data is received
          // Show snackbar when data is received
          setSnackbarMsg(data.message || "⚠️ New weather alert triggered!");
          setOpenSnackbar(true);
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
    }, 1000);

    return () => {
      console.log("Cleaning up timeout and socket");
      clearTimeout(timer);
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const handleBack = () => {
    setFlag(0);
    setSelectedIncident(); // Clear selected incident
    setViewmode("incident"); // Reset view mode to incident
  };

  // const handleForward = () => {
  //   setFlag(1);
  //   setSelectedIncident(); // Clear selected incident
  //   setViewmode("incident"); // Reset view mode to incident
  // };

  const textColor = darkMode ? "#ffffff" : "#000000";
  const bgColor = darkMode ? "#0a1929" : "#ffffff";

  return (
    <Paper
      elevation={3}
      sx={{ padding: 2, borderRadius: 3, backgroundColor: bgColor }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 2 }}>
        {/* Back Button */}
        {flag === 1 && (
          <Tooltip title="Go Back to Alert Tasks">
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
          </Tooltip>
        )}
        {/* Forward Button */}
        {/* {flag === 0 && (
          <Tooltip title="Go Forward to Dispatch SOP">
            <ArrowForwardIcon
              onClick={handleForward}
              sx={{
                cursor: "pointer",
                fontSize: 26,
                color: darkMode ? "#fff" : "#000",
                "&:hover": {
                  color: "#00f0c0",
                },
              }}
            />
          </Tooltip>
        )} */}

        {/* Title */}
        <Typography
          variant="h6"
          sx={{
            color: textColor,
            fontSize: "20px",
            fontWeight: 500,
            lineHeight: "32px",
          }}
        >
          {flag === 1 ? "Alert Task" : "Dispatch SOP"}
        </Typography>

        {/* Search Field */}
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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

      {flag === 1 ? (
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
              {Alerts.map((label, idx) => (
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
                  <Typography variant="subtitle2" fontWeight={400}>
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
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    marginTop: "8px",
                  }}
                >
                  <StyledCardContent sx={{ flex: 1, justifyContent: "center" }}>
                    <Typography variant="subtitle2">{item.pk_id}</Typography>
                  </StyledCardContent>
                  {/* <StyledCardContent sx={{ flex: 1, justifyContent: "center" }}>
                    <Typography variant="subtitle2">{item.disaster_id_id}</Typography>
                  </StyledCardContent> */}
                  <StyledCardContent sx={{ flex: 1, justifyContent: "center" }}>
                    <Typography variant="subtitle2">
                      {item.disaster_name}
                    </Typography>
                  </StyledCardContent>
                  <StyledCardContent sx={{ flex: 1, justifyContent: "center" }}>
                    <Typography variant="subtitle2">{item.latitude}</Typography>
                  </StyledCardContent>
                  <StyledCardContent sx={{ flex: 1, justifyContent: "center" }}>
                    <Typography variant="subtitle2">
                      {item.longitude}
                    </Typography>
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
                  {/* <StyledCardContent sx={{ flex: 1, justifyContent: "center" }}>
            <Visibility
              onClick={() => {
                setSelectedIncident(item);
                setFlag(1);
              }}
              sx={{
                color: "#00f0c0",
                cursor: "pointer",
                fontSize: 28,
              }}
            />
          </StyledCardContent> */}
                </EnquiryCardBody>
              ))
            )}
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TableContainer>
              <Table>
                <TableBody>
                  {/* Header Row */}
                  <EnquiryCard>
                    {Dispatch.map((label, idx) => (
                      <StyledCardContent
                        key={idx}
                        style={{
                          flex: 1,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <Typography variant="subtitle2" fontWeight={500}>
                          {label}
                        </Typography>
                      </StyledCardContent>
                    ))}
                  </EnquiryCard>

                  {/* Body Rows */}
                  {tasks.length === 0 ? (
                    <Box p={2}>
                      <Typography align="center" color="textSecondary">
                        No tasks available.
                      </Typography>
                    </Box>
                  ) : (
                    tasks.map((item) => (
                      <EnquiryCardBody key={item.id} status={item.status}>
                        <StyledCardContent
                          sx={{ flex: 1, justifyContent: "center" }}
                        >
                          <Typography variant="subtitle2">
                            {item.alertId}
                          </Typography>
                        </StyledCardContent>

                        <StyledCardContent
                          sx={{ flex: 1, justifyContent: "center" }}
                        >
                          <Typography variant="subtitle2">
                            {item.disasterId}
                          </Typography>
                        </StyledCardContent>

                        <StyledCardContent
                          sx={{ flex: 1, justifyContent: "center" }}
                        >
                          <Typography variant="subtitle2">{`${item.date} ${item.time}`}</Typography>
                        </StyledCardContent>

                        <StyledCardContent
                          sx={{ flex: 1, justifyContent: "center" }}
                        >
                          <Typography variant="subtitle2">
                            {item.disasterType}
                          </Typography>
                        </StyledCardContent>

                        <StyledCardContent
                          sx={{ flex: 1, justifyContent: "center" }}
                        >
                          <Typography variant="subtitle2">
                            {item.priority}
                          </Typography>
                        </StyledCardContent>

                        <StyledCardContent
                          sx={{ flex: 1, justifyContent: "center" }}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{
                              color:
                                item.status === "Completed"
                                  ? "#00e676"
                                  : "#f44336",
                            }}
                          >
                            {item.status}
                          </Typography>
                        </StyledCardContent>

                        <StyledCardContent
                          sx={{ flex: 1, justifyContent: "center" }}
                        >
                          <Typography variant="subtitle2">
                            {item.mode}
                          </Typography>
                        </StyledCardContent>

                        <StyledCardContent
                          sx={{ flex: 1, justifyContent: "center" }}
                        >
                          <Typography variant="subtitle2">
                            {item.initiatedBy}
                          </Typography>
                        </StyledCardContent>

                        <StyledCardContent
                          sx={{
                            flex: 1,
                            justifyContent: "center",
                            gap: 1,
                            display: "flex",
                          }}
                        >
                          <Tooltip title="View Details">
                            <IconButton
                              onClick={() => {
                                setSelectedIncident(item);
                                setFlag(0);
                                setViewmode("incident"); // Set view mode to true
                              }}
                            >
                              <Visibility
                                sx={{ color: "#00f0c0", fontSize: 28 }}
                              />
                            </IconButton>
                          </Tooltip>

                          <Tooltip title="Closure Details">
                            <IconButton
                              onClick={() => {
                                setSelectedIncident(item);
                                setFlag(0);
                                setViewmode("closure"); // Or use a different flag if needed
                              }}
                            >
                              <CheckCircle
                                sx={{ color: "#4caf50", fontSize: 28 }}
                              />
                            </IconButton>
                          </Tooltip>
                        </StyledCardContent>
                      </EnquiryCardBody>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      )}

      {/* SNACKBAR FOR ALERT SHOW */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={5000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity="info"
          sx={{
            width: "100%",
            bgcolor: darkMode ? "#0a1929" : "#fff",
            color: darkMode ? "#fff" : "#000",
            boxShadow: darkMode
              ? "0 2px 10px rgba(255, 255, 255, 0.1)"
              : "0 2px 10px rgba(0,0,0,0.1)",
          }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default SopTask;
