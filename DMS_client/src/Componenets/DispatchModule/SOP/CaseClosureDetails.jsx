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
  Select,
  MenuItem,

} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useAuth } from "../../../Context/ContextAPI";


const CaseClosureDetails = ({ darkMode, flag, selectedIncident, fetchDispatchList }) => {
  const port = import.meta.env.VITE_APP_API_KEY;
  const token = localStorage.getItem("accessToken");
  const userName = localStorage.getItem("userId");
  const { selectedIncidentFromSop, disasterIdFromSop, setSelectedIncidentFromSop } = useAuth();
  console.log("disater name and inc_id from sop", selectedIncidentFromSop, disasterIdFromSop);

  const [isDataCleared, setIsDataCleared] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});


  const validateForm = () => {
    const errors = {};

    if (!formData.acknowledge) errors.acknowledge = "Acknowledge is required";
    if (!formData.startBaseLocation) errors.startBaseLocation = "Start Base Location is required";
    if (!formData.atScene) errors.atScene = "At Scene is required";
    if (!formData.fromScene) errors.fromScene = "From Scene is required";
    if (!formData.backToBase) errors.backToBase = "Back to Base is required";
    if (!formData.closureRemark.trim()) errors.closureRemark = "Remark is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };


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

  const labelColor = darkMode ? "rgb(95,200,236)" : "rgb(95,200,236)";
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
      backgroundColor: darkMode ? "#202328" : "#FFFFFF",
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


  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const pad = (n) => (n < 10 ? "0" + n : n);
    return (
      d.getFullYear() +
      "-" +
      pad(d.getMonth() + 1) +
      "-" +
      pad(d.getDate()) +
      " " +
      pad(d.getHours()) +
      ":" +
      pad(d.getMinutes()) +
      ":" +
      pad(d.getSeconds())
    );
  };



  //   const handleSubmit = async () => {
  //     if (!selectedIncident?.IncidentId) return;

  //    const payload = {
  //   Incident_ID: selectedIncidentFromSop?.incident_id || selectedIncident?.IncidentId,
  //   Disaster_Type: selectedIncidentFromSop?.disaster_name || selectedIncident?.disasterId,
  //   Alert_Type: "High", // set this statically as required
  //   inc_id: selectedIncident?.IncidentId,
  //   closure_acknowledge: formData.acknowledge ? formatDate(formData.acknowledge) : "",
  //   closure_start_base_location: formData.startBaseLocation ? formatDate(formData.startBaseLocation) : "",
  //   closure_at_scene: formData.atScene ? formatDate(formData.atScene) : "",
  //   closure_from_scene: formData.fromScene ? formatDate(formData.fromScene) : "",
  //   closure_back_to_base: formData.backToBase ? formatDate(formData.backToBase) : "",
  //   closure_added_by: userName,
  //   closure_modified_by: userName,
  //   closure_remark: formData.closureRemark,
  // };


  //     try {
  //       setLoading(true);
  //       const res = await axios.post(
  //         `${port}/admin_web/closure_post_api/`,
  //         payload
  //       );
  //       setSubmitStatus({ type: "success", message: "Closure details saved successfully!" });
  //     } catch (error) {
  //       setSubmitStatus({ type: "error", message: "Failed to save closure details." });
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };


  const handleSubmit = async () => {

    if (!validateForm()) {
      setSubmitStatus({ type: "error", message: "Please fill all required fields" });
      return;
    }
    // Check if we have incident data
    const incidentId = selectedIncidentFromSop?.incident_id || selectedIncident?.incident_id;
    const numericIncId = selectedIncidentFromSop?.inc_id || selectedIncident?.inc_id;

    if (!incidentId || !numericIncId) {
      setSubmitStatus({ type: "error", message: "No incident ID found!" });
      return;
    }

    const payload = {

      incident_id: numericIncId, // Pass numeric inc_id (292) instead of string incident_id
      Disaster_Type: selectedIncidentFromSop?.disaster_name || selectedIncident?.disaster_name,
      Alert_Type: getAlertTypeName(selectedIncidentFromSop?.alert_type || selectedIncident?.alert_type),
      inc_id: numericIncId, // Same numeric ID
      closure_acknowledge: formData.acknowledge ? formatDate(formData.acknowledge) : "",
      closure_start_base_location: formData.startBaseLocation ? formatDate(formData.startBaseLocation) : "",
      closure_at_scene: formData.atScene ? formatDate(formData.atScene) : "",
      closure_from_scene: formData.fromScene ? formatDate(formData.fromScene) : "",
      closure_back_to_base: formData.backToBase ? formatDate(formData.backToBase) : "",
      closure_added_by: userName,
      closure_modified_by: userName,
      closure_remark: formData.closureRemark,
    };

    console.log("Payload being sent:", payload); // Debug log

    try {
      setLoading(true);
      setSubmitStatus(null); // Clear previous status

      // Get the correct token
      const authToken = localStorage.getItem("access_token") || token;

      const res = await axios.post(
        `${port}/admin_web/closure_post_api/`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("API Response:", res.data); // Debug log
      setSubmitStatus({ type: "success", message: "Closure details saved successfully!" });

      // Clear form fields after successful submit
      setFormData({
        acknowledge: "",
        startBaseLocation: "",
        atScene: "",
        fromScene: "",
        backToBase: "",
        closureRemark: "",
      });
      setSelectedIncidentFromSop(null);
      setIsDataCleared(true);
      fetchDispatchList()

    } catch (error) {
      console.error("API Error:", error); // Debug log
      console.error("Error response:", error.response?.data); // Debug log

      const errorMessage = error.response?.data?.message ||
        error.response?.data?.error ||
        "Failed to save closure details.";

      setSubmitStatus({ type: "error", message: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // Inside your component
  useEffect(() => {
    if (submitStatus) {
      const timer = setTimeout(() => {
        // Clear the submitStatus after 5 seconds
        setSubmitStatus(null);
      }, 3000);

      // Cleanup the timer if component unmounts or submitStatus changes before timeout
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  const getAlertTypeName = (alertType) => {
    const alertTypeMap = {
      1: "High",
      2: "Medium",
      3: "Low",
      4: "Very Low"
    };
    return alertTypeMap[alertType] || "Unknown";
  };
  const renderText = (label, value, index, total) => (
    <Box
      sx={{
        pb: 1.5,
        mb: 1.5,
        mr: 2,
        borderBottom: index === total - 1 ? "none" : `1px solid ${borderColor}`,
      }}
    >
      <Typography
        variant="body2"
        sx={{ color: labelColor, fontWeight: 500, fontFamily }}
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



  const [selectedDepartments, setSelectedDepartments] = useState([]);

  const handleChange1 = (event) => {
    setSelectedDepartments(event.target.value);
  };

  return (
    <>
      {submitStatus && (
        <Box sx={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "auto",
          margin: 0,
          padding: 0,
        }}>
          <Alert severity={submitStatus.type} >{submitStatus.message}</Alert>
        </Box>
      )}

      <Typography
        variant="h6"
        sx={{
          fontFamily,
          mb: 2,
          ml: 1,
          fontWeight: 500,
          color: labelColor,
        }}
      >
        Case Closure Details
      </Typography>

      <Paper
        elevation={3}
        sx={{
          p: 3,
          mb: 5,
          borderRadius: 2,
          backgroundColor: darkMode ? "#121212" : "#FFFFFF",
          color: textColor,
          transition: "all 0.3s ease",
        }}
      >
        <Grid container spacing={3} sx={{ height: '310px' }}>
          {/* Left Column - Incident Info (Reduced width) */}
          <Grid
            item
            xs={12}
            md={3.3}
            sx={{
              mt: 1,
              mb: 0.5,
              borderRight: { md: `1px solid ${borderColor}` },
              pr: { md: 3 },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                color: labelColor,
                fontFamily,
                mb: 2,
                textAlign: 'center',
                borderBottom: `2px solid ${labelColor}`,
                pb: 1
              }}
            >
              Incident Info
            </Typography>

            <Box sx={{
              height: '240px',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: darkMode ? '#2e2e2e' : '#f1f1f1',
                borderRadius: '3px',
                marginTop: '1rem',
              },
              '&::-webkit-scrollbar-thumb': {
                background: darkMode ? '#555' : '#888',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: darkMode ? '#777' : '#555',
              },
            }}>
              {flag === 0 ? (
                <Box>
                  <Grid container spacing={2} sx={{ mb: 2, mt: 0.6 }}>
                    <Grid item xs={6}>
                      {renderText("Caller Name", "9876543487")}
                    </Grid>
                    <Grid item xs={6}>
                      {renderText("Caller Number", "Person")}
                    </Grid>
                  </Grid>
                  {renderText(
                    "Location", "Ahilyanagar, Maharashtra")}
                  {renderText(
                    "Summary", "In case of emergency, call the ambulance immediately.Provide your location and details clearly to ensure quick response.")}
                </Box>
              ) : (
                <Typography variant="body2" sx={{ color: textColor, textAlign: 'center', mt: 4 }}>
                  No incident data to display.
                </Typography>
              )}
            </Box>
          </Grid>

          {/* Middle Column - Case Timeline (Increased width) */}
          <Grid
            item
            xs={12}
            md={4.7}
            sx={{
              mt: 1,
              mb: 0.5,
              borderRight: { md: `1px solid ${borderColor}` },
              px: { md: 3 },
            }}
          >
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                color: labelColor,
                fontFamily,
                mb: 2,
                textAlign: 'center',
                borderBottom: `2px solid ${labelColor}`,
                pb: 1
              }}
            >
              Case Timeline
            </Typography>

            <Box sx={{

              height: '220px',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: darkMode ? '#2e2e2e' : '#f1f1f1',
                borderRadius: '3px',
                marginTop: '1rem',
              },
              '&::-webkit-scrollbar-thumb': {
                background: darkMode ? '#555' : '#888',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: darkMode ? '#777' : '#555',
              },
            }}>
              <Grid container spacing={2} sx={{ mt: 0.6 }}>
                <Grid item xs={5.7}>
                  <Select
                    multiple
                    displayEmpty
                    value={selectedDepartments}
                    onChange={handleChange1}
                    renderValue={(selected) => {
                      if (selected.length === 0) {
                        return (
                          <span style={{ color: '#888', fontStyle: 'normal' }}>
                            Select Department
                          </span>
                        );
                      }
                      return selected.join(", ");
                    }}
                    size="small"
                    fullWidth
                    inputProps={{ "aria-label": "Select Department" }}
                    MenuProps={{
                      PaperProps: {
                        style: {
                          maxHeight: 250,
                          width: 200,
                        },
                      },
                    }}
                  >
                    <MenuItem disabled value="">
                      <em>Select Department</em>
                    </MenuItem>
                    {/* <MenuItem value="HR">HR</MenuItem>
                    <MenuItem value="Finance">Finance</MenuItem>
                    <MenuItem value="IT">IT</MenuItem> */}
                  </Select>
                </Grid>

                <Grid item xs={6.2}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Vehicle Number"
                    InputLabelProps={{ shrink: false }}
                  />
                </Grid>

                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <Grid item xs={5.5}>
                    <DateTimePicker
                      label="Acknowledge *"
                      value={formData.acknowledge || null}
                      onChange={(newValue) => {
                        handleChange("acknowledge", newValue);
                        if (validationErrors.acknowledge) {
                          setValidationErrors(prev => ({ ...prev, acknowledge: null }));
                        }
                      }}
                      ampm={false}
                      inputFormat="yyyy-MM-dd | HH:mm"
                      views={['year', 'month', 'day', 'hours', 'minutes']}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder="yyyy-MM-dd | hh:mm"
                          variant="outlined"
                          size="small"
                          required
                          error={!!validationErrors.acknowledge}
                          helperText={validationErrors.acknowledge}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              color: textColor,
                              height: '35px',
                              "& .MuiSvgIcon-root": {
                                color: "white",
                              },
                            },
                          }}
                          sx={textFieldStyle}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={6.4}>
                    <DateTimePicker
                      label="Start Base Location *"
                      value={formData.startBaseLocation || null}
                      onChange={(newValue) => {
                        handleChange("startBaseLocation", newValue);
                        if (validationErrors.startBaseLocation) {
                          setValidationErrors(prev => ({ ...prev, startBaseLocation: null }));
                        }
                      }}
                      ampm={false}
                      minDateTime={formData.acknowledge || new Date()}
                      inputFormat="yyyy-MM-dd | HH:mm"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder="yyyy-MM-dd | hh:mm"
                          variant="outlined"
                          size="small"
                          required
                          error={!!validationErrors.startBaseLocation}
                          helperText={validationErrors.startBaseLocation}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              color: textColor,
                              height: '35px',
                              fontSize: "0.45rem",
                              "& .MuiSvgIcon-root": {
                                color: "white",
                              },
                            },
                          }}
                          sx={textFieldStyle}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={5.5}>
                    <DateTimePicker
                      label="At Scene *"
                      value={formData.atScene || null}
                      onChange={(newValue) => {
                        handleChange("atScene", newValue);
                        if (validationErrors.atScene) {
                          setValidationErrors(prev => ({ ...prev, atScene: null }));
                        }
                      }}
                      ampm={false}
                      minDateTime={formData.acknowledge || new Date()}
                      inputFormat="yyyy-MM-dd | HH:mm"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder="yyyy-MM-dd | hh:mm"
                          variant="outlined"
                          size="small"
                          required
                          error={!!validationErrors.atScene}
                          helperText={validationErrors.atScene}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              color: textColor,
                              height: '35px',
                              fontSize: "0.85rem",
                              "& .MuiSvgIcon-root": {
                                color: "white",
                              },
                            },
                          }}
                          sx={textFieldStyle}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={6.4}>
                    <DateTimePicker
                      label="From Scene *"
                      value={formData.fromScene || null}
                      onChange={(newValue) => {
                        handleChange("fromScene", newValue);
                        if (validationErrors.fromScene) {
                          setValidationErrors(prev => ({ ...prev, fromScene: null }));
                        }
                      }}
                      ampm={false}
                      minDateTime={formData.acknowledge || new Date()}
                      inputFormat="yyyy-MM-dd | HH:mm"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder="yyyy-MM-dd | hh:mm"
                          variant="outlined"
                          size="small"
                          required
                          error={!!validationErrors.fromScene}
                          helperText={validationErrors.fromScene}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              color: textColor,
                              height: '35px',
                              fontSize: "0.85rem",
                              "& .MuiSvgIcon-root": {
                                color: "white",
                              },
                            },
                          }}
                          sx={textFieldStyle}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <DateTimePicker
                      label="Back to Base *"
                      value={formData.backToBase || null}
                      onChange={(newValue) => {
                        handleChange("backToBase", newValue);
                        if (validationErrors.backToBase) {
                          setValidationErrors(prev => ({ ...prev, backToBase: null }));
                        }
                      }}
                      ampm={false}
                      minDateTime={formData.acknowledge || new Date()}
                      inputFormat="yyyy-MM-dd | HH:mm"
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          fullWidth
                          placeholder="yyyy-MM-dd | hh:mm"
                          variant="outlined"
                          size="small"
                          required
                          error={!!validationErrors.backToBase}
                          helperText={validationErrors.backToBase}
                          InputLabelProps={{ shrink: true }}
                          InputProps={{
                            ...params.InputProps,
                            sx: {
                              color: textColor,
                              height: '35px',
                              fontSize: "0.85rem",
                              "& .MuiSvgIcon-root": {
                                color: "white",
                                fontSize: "0.8rem",
                              },
                            },
                          }}
                          sx={textFieldStyle}
                        />
                      )}
                    />
                  </Grid>
                </LocalizationProvider>
              </Grid>
            </Box>
          </Grid>

          {/* Right Column - Closure Remark */}
          <Grid item xs={12} md={4}>
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 500,
                color: labelColor,
                fontFamily,
                mb: 2,
                textAlign: 'center',
                borderBottom: `2px solid ${labelColor}`,
                pb: 1
              }}
            >
              Closure Remark
            </Typography>

            <Box sx={{

              height: '220px',
              overflowY: 'auto',
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-track': {
                background: darkMode ? '#2e2e2e' : '#f1f1f1',
                borderRadius: '3px',
                marginTop: '1.5rem',
              },
              '&::-webkit-scrollbar-thumb': {
                background: darkMode ? '#555' : '#888',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-thumb:hover': {
                background: darkMode ? '#777' : '#555',
              },
            }}>


              <Box sx={{ height: '200px', display: 'flex', flexDirection: 'column', mt: 3 }}>

                <TextField
                  label="Remark *"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={6}
                  required
                  value={formData.closureRemark}
                  onChange={(e) => {
                    handleChange("closureRemark", e.target.value);
                    if (validationErrors.closureRemark) {
                      setValidationErrors(prev => ({ ...prev, closureRemark: null }));
                    }
                  }}
                  error={!!validationErrors.closureRemark}
                  helperText={validationErrors.closureRemark}
                  InputLabelProps={{ shrink: true }}
                  InputProps={{ sx: { color: textColor } }}
                  sx={{ ...textFieldStyle, mb: 2, flex: 1 }}
                />

                <Box sx={{ textAlign: "center", mt: 'auto' }}>
                  <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    sx={{
                      backgroundColor: "rgb(18,166,95,0.8)",
                      color: "#fff",
                      px: 3,
                      py: 1,
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      minWidth: 100,
                      textTransform: "none",
                    }}
                  >
                    {loading ? <CircularProgress size={20} color="inherit" /> : "Submit"}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>

        </Grid>
      </Paper>
    </>
  );
};

export default CaseClosureDetails;
