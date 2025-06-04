import {
  Paper,
  Grid,
  Typography,
  TextField,
  Skeleton,
  Box,
  Button,
  CircularProgress,
  Alert,

} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';


const CaseClosureDetails = ({ darkMode, flag, selectedIncident }) => {
  const port = import.meta.env.VITE_APP_API_KEY;
  const token = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("userId");

  const [formData, setFormData] = useState({
    acknowledge: "",
    startBaseLocation: "",
    atScene: "",
    fromScene: "",
    backToBase: "",
    closureRemark: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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



  // useEffect(() => {
  //   if (selectedIncident) {
  //     setTimestamps({
  //       acknowledge: formatDateTimeLocal(selectedIncident.acknowledge),
  //       startBaseLocation: formatDateTimeLocal(
  //         selectedIncident.startBaseLocation
  //       ),
  //       atScene: formatDateTimeLocal(selectedIncident.atScene),
  //       fromScene: formatDateTimeLocal(selectedIncident.fromScene),
  //       backToBase: formatDateTimeLocal(selectedIncident.backToBase),
  //     });
  //   }
  // }, [selectedIncident]);

  // const handleChange = (key, value) => {
  //   setTimestamps((prev) => ({ ...prev, [key]: value }));
  // };

  const textFieldStyle = {
    "& .MuiInputLabel-root": { color: labelColor },
    "& .MuiOutlinedInput-root": {
      backgroundColor: darkMode ? "#1e293b" : "#fff",
      borderRadius: 2,
    },
  };

  // Load data when selectedIncident changes
  useEffect(() => {
    if (selectedIncident) {
      setFormData({
        acknowledge: selectedIncident.acknowledge || "",
        startBaseLocation: selectedIncident.startBaseLocation || "",
        atScene: selectedIncident.atScene || "",
        fromScene: selectedIncident.fromScene || "",
        backToBase: selectedIncident.backToBase || "",
        closureRemark: selectedIncident.closureRemark || "",
      });
    }
  }, [selectedIncident]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!selectedIncident?.IncidentId) return;

    const payload = {
      incident_id: selectedIncident.IncidentId,
      closure_acknowledge: formData.acknowledge,
      closure_start_base_location: formData.startBaseLocation,
      closure_at_scene: formData.atScene,
      closure_from_scene: formData.fromScene,
      closure_back_to_base: formData.backToBase,
      // closure_is_deleted: false,
      closure_added_by: userName, // replace with dynamic user if needed
      closure_modified_by: userName,
      closure_modified_date: new Date().toISOString(),
      closure_remark: formData.closureRemark,
    };

    try {
      setLoading(true);
      const res = await axios.post(
        `${port}/admin_web/closure_post_api/`,
        payload
      );
      setSubmitStatus({ type: "success", message: "Closure details saved successfully!" });
    } catch (error) {
      setSubmitStatus({ type: "error", message: "Failed to save closure details." });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const renderText = (label, value) => (
    <Box sx={{ pb: 1.5, mb: 1.5, borderBottom: `1px solid ${borderColor}` }}>
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
              sx={{ fontWeight: 600, color: labelColor, fontFamily, mb: 2 }}
            >
              Incident Info
            </Typography>
            {flag === 0 ? (
              <Box>
                {renderText("Incident ID", selectedIncident?.IncidentId)}
                {renderText("Disaster Type", selectedIncident?.disasterId)}
                {renderText("Alert Type", selectedIncident?.disasterType)}
              </Box>
            ) : (
              <Typography variant="body2" sx={{ color: textColor }}>
                No incident data to display.
              </Typography>
            )}
          </Grid>

          {/* Middle Column */}
          <Grid
            item
            xs={12}
            md={5}
            sx={{
              borderRight: { md: `1px solid ${borderColor}` },
              px: { md: 3 },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: labelColor, fontFamily, mb: 2 }}
            >
              Case Timeline
            </Typography>

            <Grid container spacing={2}>
              {/* <Grid container spacing={2}>
              {[
                ["Acknowledge", "acknowledge"],
                ["Start Base Location", "startBaseLocation"],
                ["At Scene", "atScene"],
                ["From Scene", "fromScene"],
                ["Back to Base", "backToBase"],
              ].map(([label, field], i) => (
                <Grid item xs={12} sm={6} key={i}>
                  <TextField
                    fullWidth
                    type="datetime-local"
                    label={label}
                    variant="outlined"
                    InputLabelProps={{ shrink: true }}
                    value={formData[field]}
                    onChange={(e) => handleChange(field, e.target.value)}
                  
                    InputProps={{
                      sx: {
                        color: textColor, "& input::-webkit-calendar-picker-indicator": {
                          filter: "invert(1)", // white icon
                        },
                      }
                    }}
                    sx={textFieldStyle}

                  />
                </Grid>
              ))}
            </Grid> */}
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                  {[
                    ["Acknowledge", "acknowledge"],
                    ["Start Base Location", "startBaseLocation"],
                    ["At Scene", "atScene"],
                    ["From Scene", "fromScene"],
                    ["Back to Base", "backToBase"],
                  ].map(([label, field], i) => (
                    <Grid item xs={12} sm={6} key={i}>
                      <DateTimePicker
                        label={label}
                        value={formData[field] || null}
                        onChange={(newValue) => handleChange(field, newValue)}
                        inputFormat="yyyy-MM-dd | HH:mm"
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            placeholder="yyyy-MM-dd | hh:mm"
                            variant="outlined"
                            InputLabelProps={{ shrink: true }}
                            InputProps={{
                              ...params.InputProps,
                              sx: {
                                color: textColor,
                                "& .MuiSvgIcon-root": {
                                  color: "white", // calendar icon color
                                },
                              },
                            }}
                            sx={textFieldStyle}
                          />
                        )}
                      />
                    </Grid>
                  ))}
                </Grid>
              </LocalizationProvider>
            </Grid>
          </Grid>

          {/* Right Column */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              sx={{ fontWeight: 600, color: labelColor, fontFamily, mb: 2 }}
            >
              Closure Remark
            </Typography>

            <TextField
              label="Remark"
              variant="outlined"
              fullWidth
              multiline
              rows={6}
              value={formData.closureRemark}
              onChange={(e) => handleChange("closureRemark", e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{ sx: { color: textColor } }}
              sx={textFieldStyle}
            />

            <Box mt={3} sx={{ textAlign: "right" }}>
              <Button
                variant="contained"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Submit"}
              </Button>
            </Box>

            {submitStatus && (
              <Box mt={2}>
                <Alert severity={submitStatus.type}>{submitStatus.message}</Alert>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default CaseClosureDetails;
