import {
  Paper,
  Grid,
  Typography,
  TextField,
  Skeleton,
  Box,
} from "@mui/material";
import { useState, useEffect } from "react";
const CaseClosureDetails = ({ darkMode, flag, selectedIncident }) => {
  const labelColor = darkMode ? "#5FECC8" : "#1976d2";
  const textColor = darkMode ? "#ffffff" : "#000000";
  const fontFamily = "Roboto, sans-serif";
  const borderColor = darkMode ? "#7F7F7F" : "#e0e0e0";
  const [remark, setRemark] = useState("");
  const toISOString = (datetime) => {
    if (!datetime) return null;
    const date = new Date(datetime);
    return date.toISOString(); // returns like "2025-05-29T10:00:00.000Z"
  };

  const [timestamps, setTimestamps] = useState({
    acknowledge: "",
    startBaseLocation: "",
    atScene: "",
    fromScene: "",
    backToBase: "",
  });
  // Load initial values from props

 

  useEffect(() => {
    if (selectedIncident) {
      setTimestamps({
        acknowledge: formatDateTimeLocal(selectedIncident.acknowledge),
        startBaseLocation: formatDateTimeLocal(
          selectedIncident.startBaseLocation
        ),
        atScene: formatDateTimeLocal(selectedIncident.atScene),
        fromScene: formatDateTimeLocal(selectedIncident.fromScene),
        backToBase: formatDateTimeLocal(selectedIncident.backToBase),
      });
    }
  }, [selectedIncident]);

  const handleChange = (key, value) => {
    setTimestamps((prev) => ({ ...prev, [key]: value }));
  };

  const textFieldStyle = {
    "& .MuiInputLabel-root": { color: labelColor },
    "& .MuiOutlinedInput-root": {
      backgroundColor: darkMode ? "#1e293b" : "#fff",
      borderRadius: 2,
    },
  };

  const formatDateTimeLocal = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return ""; // invalid date
    return date.toISOString().slice(0, 16); // get YYYY-MM-DDTHH:mm
  };

  const renderText = (label, value) => (
    <Box
      sx={{
        pb: 1.5,
        mb: 1.5,
        borderBottom: `1px solid ${borderColor}`,
      }}
    >
      <Typography
        variant="body2"
        sx={{ color: labelColor, fontWeight: 600, fontFamily }}
      >
        {label}
      </Typography>
      {selectedIncident ? (
        <Typography variant="body2" sx={{ fontFamily, color: textColor }}>
          {value || "N/A"}
        </Typography>
      ) : (
        <Skeleton variant="text" width={120} height={24} />
      )}
    </Box>
  );

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          fontFamily,
          mb: 2,
          fontWeight: 700,
          color: labelColor,
        }}
      >
        Case Closure Details
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 2,
          backgroundColor: darkMode ? "#0a1929" : "#ffffff",
          color: textColor,
          transition: "all 0.3s ease",
        }}
      >
        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid
            item
            xs={12}
            md={3}
            sx={{
              borderRight: { md: `1px solid ${borderColor}` },
              pr: { md: 3 },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: labelColor,
                fontFamily,
                mb: 2,
              }}
            >
              Incident Info
            </Typography>
            {flag === 0 ? (
              <Box>
                {renderText("Alert ID", selectedIncident?.IncidentId)}
                {renderText("Disaster Id", selectedIncident?.disasterType)}
                {renderText("Disaster Type", selectedIncident?.disasterType)}
              </Box>
            ) : (
              <Box>
                {/* You can put placeholder text or leave it empty */}
                <Typography
                  variant="body2"
                  sx={{ color: textColor, fontFamily }}
                >
                  No incident data to display.
                </Typography>
              </Box>
            )}
          </Grid>
          {/* Middle Column */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              borderRight: { md: `1px solid ${borderColor}` },
              px: { md: 3 },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: labelColor,
                fontFamily,
                mb: 2,
              }}
            >
              Case Timeline
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Acknowledge"
                  variant="outlined"
                  value={timestamps.acknowledge}
                  onChange={(e) => handleChange("acknowledge", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: { color: textColor } }}
                  sx={textFieldStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Start Base Location"
                  variant="outlined"
                  value={timestamps.startBaseLocation}
                  onChange={(e) =>
                    handleChange("startBaseLocation", e.target.value)
                  }
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: { color: textColor } }}
                  sx={textFieldStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="At Scene"
                  variant="outlined"
                  value={timestamps.atScene}
                  onChange={(e) => handleChange("atScene", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: { color: textColor } }}
                  sx={textFieldStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="From Scene"
                  variant="outlined"
                  value={timestamps.fromScene}
                  onChange={(e) => handleChange("fromScene", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: { color: textColor } }}
                  sx={textFieldStyle}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="datetime-local"
                  label="Back to Base"
                  variant="outlined"
                  value={timestamps.backToBase}
                  onChange={(e) => handleChange("backToBase", e.target.value)}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: { color: textColor } }}
                  sx={textFieldStyle}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={5}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                color: labelColor,
                fontFamily,
                mb: 2,
              }}
            >
              Closure Remark
            </Typography>

            <TextField
              label="Remark"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              value={selectedIncident?.closureRemark || ""}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { color: textColor } }}
              sx={textFieldStyle}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default CaseClosureDetails;
