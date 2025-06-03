import { useState } from "react";
import {
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Box,
  Snackbar,
  Alert,
} from "@mui/material";

function CommentsPanel({
  darkMode,
  setFlag,
  flag,
  selectedIncident,
  selectedResponders,
  setSelectedResponders,
  fetchDispatchList, // Assuming this is passed down from parent component
}) {
  window.addEventListener("storage", (e) => {
    if (e.key === "logout") {
      location.href = "/login";
    }
  });

  const port = import.meta.env.VITE_APP_API_KEY;
  const userName = localStorage.getItem("userId");
  console.log(userName, "userId");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [placeholderVisible, setPlaceholderVisible] = useState(true);
  const [commentText, setCommentText] = useState("");

  const textColor = darkMode ? "#ffffff" : "#000000";
  const bgColor = darkMode ? "#0a1929" : "#ffffff";

  const paperStyle = {
    padding: 1,
    marginTop: 0.5, // reduced from 6
    borderRadius: 3,
    maxHeight: 250, // 👈 restrict height
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: bgColor,
    color: textColor,
    transition: "background-color 0.5s ease-in-out, color 0.5s ease-in-out",
  };

  const commentFieldStyle = {
    mb: 2,
    backgroundColor: darkMode ? "#1e293b" : "#f9f9f9",
    borderRadius: 1,
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        border: "none",
      },
      "&:hover fieldset": {
        border: "none",
      },
      "&.Mui-focused fieldset": {
        border: "none",
      },
    },
    input: { color: textColor },
    textarea: { color: textColor },
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAlertSubmit = async () => {
    const payload = {
      responder_scope: selectedResponders.map(String),
      alert_id: selectedIncident?.pk_id,
      disaster_type: selectedIncident?.disaster_id_id,
      comments: commentText,
      comm_added_by: userName,
      inc_added_by: userName,
      latitude: selectedIncident?.latitude,
      longitude: selectedIncident?.longitude,
      mode: "2", // 2 for dispatch alert
    };

    try {
      const response = await fetch(`${port}/admin_web/DMS_Incident_Post/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setSnackbar({
          open: true,
          message: "dispatch alert sent successfully!",
          severity: "success",
        });

        // Clear input fields
        setCommentText("");
        setSelectedResponders([]);
        setFlag(0);
        fetchDispatchList(); // Fetch updated dispatch list after sending alert
      } else {
        setSnackbar({
          open: true,
          message: "Failed to send comment.",
          severity: "error",
        });
        console.error("API error:", response.status);
      }
    } catch (err) {
      console.error("Network error:", err);
      setSnackbar({
        open: true,
        message: "Something went wrong.",
        severity: "error",
      });
    }
  };

  return (
    <Paper elevation={1} sx={paperStyle}>
      <Box>
        <Typography variant="h6" mb={2} color="#5FECC8">
          Comments
        </Typography>

        <TextField
          multiline
          rows={3} // 👈 reduced from 6
          fullWidth
          variant="outlined"
          onChange={(e) => setCommentText(e.target.value)}
          placeholder={placeholderVisible ? "Write your comments here..." : ""}
          onFocus={() => setPlaceholderVisible(false)}
          value={commentText}
          onBlur={(e) => {
            if (e.target.value.trim() === "") {
              setPlaceholderVisible(true);
            }
          }}
          sx={commentFieldStyle}
          aria-label="Comment text area"
        />
      </Box>

      <Stack direction="row" justifyContent="flex-end">
        {flag === 1 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              handleAlertSubmit();
            }}
            sx={{ mt: 1, mb: 1, mr: 1 }}
          >
            Save
          </Button>
        ) : (
          <Button variant="contained" color="primary">
            Send
          </Button>
        )}
      </Stack>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}

export default CommentsPanel;
