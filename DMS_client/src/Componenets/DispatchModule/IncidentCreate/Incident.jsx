import { useEffect, useRef, useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    TextField,
    Typography,
    MenuItem,
    Button,
    Checkbox,
    FormControlLabel,
    Stack
} from "@mui/material";
import { useAuth } from "../../../Context/ContextAPI";
import IncidentCreateMap from "./IncidentCreateMap";
import { Snackbar, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const inputStyle = {
    mb: 2,
};
const boxStyle = {
    mb: 2,
    pb: 1.5,
};

const Incident = ({ darkMode }) => {
    const port = import.meta.env.VITE_APP_API_KEY;
    const googleKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
    console.log(googleKey, 'googleKey');
   const navigate = useNavigate();
    const token = localStorage.getItem("access_token");
    const { newToken, responderScope, setDisasterIncident, disaster, popupText, setPopupText } = useAuth();
    console.log(popupText,'popupTextpopupText');
    
    const { handleSearchChange, handleSelectSuggestion, query } = useAuth();
    const bgColor = darkMode ? "#0a1929" : "#ffffff";
    const labelColor = darkMode ? "#5FECC8" : "#1976d2";
    const fontFamily = "Roboto, sans-serif";
    const [selectedEmergencyValue, setSelectedEmergencyValue] = useState('');
    console.log(responderScope, 'Fetching Scope Data');
    const [summary, setSummary] = useState([]);
    const [selectedDisaster, setSelectedDisaster] = useState('');
    const [alertType, setAlertType] = useState('');

    // POST API
    const [callerNumber, setCallerNumber] = useState('');
    const [callerName, setCallerName] = useState('');
    const [summaryId, setSummaryId] = useState('');
    const [comments, setComments] = useState('');
    const [sopId, setSopId] = useState([]);

    /// snackbar
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    // Google API Start
    // const { isLoaded } = useJsApiLoader({
    //     googleMapsApiKey: googleKey,
    //     libraries: libraries,
    // });

    const addressRef = useRef();

    const handlePlaceChanged = () => {
        console.log("place select function hitting...");
        if (addressRef.current) {
            const place = addressRef.current.getPlace();
            console.log("place object", place);

            if (!place.geometry || !place.geometry.location) {
                console.warn("No geometry found for the selected place");
                return;
            }

            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();

            const formattedLat = parseFloat(lat.toFixed(6));
            const formattedLng = parseFloat(lng.toFixed(6));

            console.log("Selected Address:", place.formatted_address);
            console.log("Latitude:", formattedLat);
            console.log("Longitude:", formattedLng);
        }
    };

    // Google API End
    const handleCheckboxChange = (pk_id) => {
        setSopId((prev) =>
            prev.includes(pk_id)
                ? prev.filter((id) => id !== pk_id)
                : [...prev, pk_id]
        );
    };

    const handleSubmit = async () => {
        const payload = {
            inc_type: selectedEmergencyValue,
            disaster_type: selectedDisaster,
            alert_type: alertType,
            location: popupText || query,
            latitude: 12344444444454.45,
            longitude: 1234532.34,
            summary: summaryId,
            caller_no: callerNumber,
            caller_name: callerName,
            comments: comments,
            responder_scope: sopId,
            inc_added_by: "admin",
            inc_modified_by: "admin",
            caller_added_by: "admin",
            caller_modified_by: "admin",
            comm_added_by: "admin",
            comm_modified_by: "admin",
        };

        try {
            const response = await fetch(`${port}/admin_web/manual_call_incident/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token || newToken}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.status === 201) {
                setSnackbarMessage("Incident Created Successfully");
                setSnackbarOpen(true);
                navigate('/sop');
            } else if (response.status === 500) {
                setSnackbarMessage("Internal Server Error");
                setSnackbarOpen(true);
            } else {
                setSnackbarMessage(data?.detail || "Something went wrong");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error:', error);
            setSnackbarMessage("Network error or server not reachable");
            setSnackbarOpen(true);
        }
    };

    const handleAlertTypeChange = (event) => {
        setAlertType(event.target.value);
    };

    const handleEmergencyChange = (event) => {
        setSelectedEmergencyValue(event.target.value);
    };

    useEffect(() => {
        if (selectedDisaster) {
            setDisasterIncident(selectedDisaster);
        }
    }, [selectedDisaster]);;

    useEffect(() => {
        const fetchSummary = async () => {
            const res = await fetch(`${port}/admin_web/DMS_Summary_Get/`, {
                headers: {
                    Authorization: `Bearer ${token || newToken}`,
                }
            });
            const data = await res.json();
            setSummary(data);
        };
        fetchSummary();
    }, []);

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: darkMode ? "#0a1929" : "#f5f5f5", px: 2, py: 3 }}>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={3000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Paper elevation={3} sx={{ ...inputStyle, p: 3, borderRadius: 3, backgroundColor: bgColor, height: "100%" }}>
                                <Typography variant="h6" gutterBottom>
                                    Create Incident
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField select fullWidth size="small" label="Incident Type" variant="outlined" sx={inputStyle}
                                            value={selectedEmergencyValue}
                                            onChange={handleEmergencyChange}
                                        >
                                            <MenuItem value={1}>Emergency</MenuItem>
                                            <MenuItem value={2}>Non Emergency</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            fullWidth
                                            size="small"
                                            label="Disaster Type"
                                            variant="outlined"
                                            sx={inputStyle}
                                            value={selectedDisaster}
                                            onChange={(e) => setSelectedDisaster(e.target.value)}
                                        >
                                            <MenuItem disabled value="">
                                                Select Disaster Type
                                            </MenuItem>
                                            {disaster.map((item) => (
                                                <MenuItem key={item.disaster_id} value={item.disaster_id}>
                                                    {item.disaster_name}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            select
                                            fullWidth
                                            size="small"
                                            label="Alert Type"
                                            variant="outlined"
                                            value={alertType}
                                            onChange={handleAlertTypeChange}
                                            sx={inputStyle}
                                        >
                                            <MenuItem value={1}>High</MenuItem>
                                            <MenuItem value={2}>Medium</MenuItem>
                                            <MenuItem value={3}>Low</MenuItem>
                                        </TextField>
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth size="small" label="Caller Number" variant="outlined" sx={inputStyle}
                                            value={callerNumber} onChange={(e) => setCallerNumber(e.target.value)} />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth size="small" label="Caller Name" variant="outlined" sx={inputStyle}
                                            value={callerName} onChange={(e) => setCallerName(e.target.value)} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth size="small" label="Location" variant="outlined" sx={inputStyle} onChange={handleSearchChange} onClick={() => handleSelectSuggestion(item)} value={query} />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            select
                                            fullWidth
                                            size="small"
                                            label="Summary"
                                            variant="outlined"
                                            sx={inputStyle}
                                            value={summaryId}
                                            onChange={(e) => setSummaryId(e.target.value)}
                                        >
                                            <MenuItem disabled value="">
                                                Select Summary
                                            </MenuItem>
                                            {summary.map((item) => (
                                                <MenuItem key={item.sum_id} value={item.sum_id}>
                                                    {item.summary}
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ ...inputStyle, p: 2, borderRadius: 3, backgroundColor: bgColor, height: "100%" }}>
                                <Typography variant="h6">Comments</Typography>
                                <TextField
                                    fullWidth size="small"
                                    multiline
                                    rows={8}
                                    variant="outlined"
                                    sx={inputStyle}
                                    value={comments}
                                    onChange={(e) => setComments(e.target.value)}
                                />
                            </Paper>
                        </Grid>

                        {selectedEmergencyValue === 1 && (
                            <Grid item xs={12} md={12}>
                                <Paper elevation={3} sx={{ ...inputStyle, p: 3, borderRadius: 3, backgroundColor: bgColor }}>
                                    <Grid container>
                                        <Grid
                                            item
                                            xs={12}
                                            md={3}
                                            sx={{
                                                borderRight: { md: `1px solid white` },
                                                pr: { md: 2 },
                                                mb: { xs: 2, md: 0 },
                                            }}
                                        >
                                            <Box sx={boxStyle}>
                                                <Typography
                                                    sx={{ color: labelColor, fontWeight: 500, fontFamily, }}
                                                >
                                                    Incident Type
                                                </Typography>
                                                <Typography variant="subtitle2" sx={{ fontFamily }}>
                                                    {selectedEmergencyValue === 1 ? "Emergency" : "Non-Emergency"}
                                                </Typography>
                                            </Box>

                                            <Typography variant="subtitle2" sx={{ fontFamily, borderBottom: { md: `1px solid white` }, mb: 2 }}>
                                            </Typography>

                                            <Box>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                                                >
                                                    Alert Type
                                                </Typography>
                                                <Typography variant="subtitle2" sx={{ fontFamily }}>
                                                    {alertType === 1 ? "High" : alertType === 2 ? "Medium" : "Low"}
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        <Grid
                                            item
                                            xs={12}
                                            md={9}
                                            sx={{
                                                px: { md: 2 },
                                                mb: { xs: 5, md: 0 },
                                            }}
                                        >
                                            <Box sx={boxStyle}>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                                                >
                                                    Response Procedure
                                                </Typography>
                                                <Typography variant="subtitle2" sx={{ fontFamily }}>
                                                    {responderScope?.sop_responses?.map((sop) => (
                                                        <div key={sop.sop_id}>
                                                            {sop?.sop_description || "No SOP description"}
                                                        </div>
                                                    ))}
                                                </Typography>
                                            </Box>
                                            <Box>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                                                >
                                                    Responder Scope
                                                </Typography>
                                                <Stack spacing={1} mt={1}>
                                                    <Box display="flex" flexWrap="wrap" gap={1}>
                                                        {responderScope?.responder_scope?.map((responder) => (
                                                            <FormControlLabel
                                                                key={responder.pk_id}
                                                                control={
                                                                    <Checkbox
                                                                        checked={sopId.includes(responder.pk_id)}
                                                                        onChange={() => handleCheckboxChange(responder.pk_id)}
                                                                        sx={{ color: labelColor }}
                                                                    />
                                                                }
                                                                label={
                                                                    <Typography variant="subtitle2" sx={{ fontFamily }}>
                                                                        {responder.responder_name}
                                                                    </Typography>
                                                                }
                                                            />
                                                        ))}
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </Grid>
                        )}

                        <Grid
                            item
                            xs={12}
                            md={9}
                            sx={{ marginLeft: '4em' }}
                        >
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                <Button
                                    variant="contained"
                                    sx={{
                                        mb: '3em',
                                        width: "30%",
                                        backgroundColor: "white",
                                        color: "black",
                                        fontWeight: "bold",
                                        borderRadius: "12px",
                                    }}
                                    onClick={handleSubmit}
                                >
                                    Submit
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={4} style={{ position: "relative" }}>
                    <IncidentCreateMap />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Incident;
