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
import { useLocation } from "react-router-dom";
import Tooltip from "@mui/material/Tooltip";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

const inputStyle = {
    mb: 1.2,
};
const boxStyle = {
    mb: 2,
    pb: 1.5,
};

const Incident = ({ darkMode }) => {
    const port = import.meta.env.VITE_APP_API_KEY;
    const googleKey = import.meta.env.VITE_APP_GOOGLE_MAPS_API_KEY;
    const location = useLocation();
    const [secondsElapsed, setSecondsElapsed] = useState(0);
    const [timerActive, setTimerActive] = useState(false);

    useEffect(() => {
        if (location.state?.startData) {
            console.log("Received startData:", location.state.startData);
            setSecondsElapsed(0);
            setTimerActive(true);
        }
    }, [location.state]);

    useEffect(() => {
        let intervalId;
        if (timerActive) {
            intervalId = setInterval(() => {
                setSecondsElapsed((prev) => prev + 1);
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [timerActive]);

    const minutes = Math.floor(secondsElapsed / 60);
    const seconds = secondsElapsed % 60;
    const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;

    console.log(googleKey, 'googleKey');
    const navigate = useNavigate();
    const token = localStorage.getItem("access_token");
    const { newToken, responderScope, setDisasterIncident, disaster, popupText, setPopupText, lattitude, setLattitude,
        longitude, setLongitude, } = useAuth();
    console.log(popupText, 'popupTextpopupText');

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
    const handleCheckboxChange = (id) => {
        setSopId((prev) => {
            if (prev.includes(id)) {
                return prev.filter(item => item !== id);
            } else {
                return [...prev, id];
            }
        });
    };

    const handleSubmit = async () => {
        const payload = {
            inc_type: selectedEmergencyValue,
            disaster_type: selectedDisaster,
            alert_type: alertType,
            location: popupText || query,
            latitude: lattitude,
            longitude: longitude,
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
            mode: 1
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
    }, [selectedDisaster]);

    const [openSopModal, setOpenSopModal] = useState(false);


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
                <Grid item xs={12} md={7}>
                    <Paper
                        elevation={3}
                        sx={{
                            ...inputStyle,
                            p: 3,
                            borderRadius: 3,
                            backgroundColor: bgColor,
                            height: 'auto',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Create Incident
                            </Typography>
                            <Typography variant="h6" sx={{ fontSize: '16px', }} gutterBottom>
                                Time : {formattedTime}
                            </Typography>
                        </Box>

                        <Grid container spacing={1.6}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    select
                                    fullWidth
                                    size="small"
                                    label="Incident Type"
                                    variant="outlined"
                                    sx={inputStyle}
                                    value={selectedEmergencyValue}
                                    onChange={handleEmergencyChange}
                                >
                                    <MenuItem value={1}>Emergency</MenuItem>
                                    <MenuItem value={2}>Non Emergency</MenuItem>
                                </TextField>
                            </Grid>

                            {
                                selectedEmergencyValue === 1 && (
                                    <>
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
                                    </>
                                )
                            }

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Caller Number"
                                    variant="outlined"
                                    sx={inputStyle}
                                    value={callerNumber}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        if (/^\d{0,10}$/.test(value)) {
                                            setCallerNumber(value);
                                        }
                                    }}
                                    inputProps={{
                                        maxLength: 10,
                                        inputMode: 'numeric',
                                        pattern: '[0-9]*'
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Caller Name"
                                    variant="outlined"
                                    sx={inputStyle}
                                    value={callerName}
                                    onChange={(e) => setCallerName(e.target.value)}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Location"
                                    variant="outlined"
                                    sx={inputStyle}
                                    onChange={handleSearchChange}
                                    onClick={() => handleSelectSuggestion(item)}
                                    value={query}
                                />
                            </Grid>

                            <Grid item xs={12}>
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

                <Grid item xs={12} md={5}>
                    <IncidentCreateMap />
                </Grid>

                {selectedEmergencyValue === 1 && (
                    <Grid item xs={12}>
                        <Paper elevation={3} sx={{ ...inputStyle, p: 3, borderRadius: 3, backgroundColor: bgColor }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={3} sx={{ borderRight: { md: `1px solid white` }, pr: 2 }}>
                                    <Box sx={boxStyle}>
                                        <Typography sx={{ color: labelColor, fontWeight: 500, fontFamily }}>
                                            Incident Type
                                        </Typography>
                                        <Typography variant="subtitle2" sx={{ fontFamily }}>
                                            {selectedEmergencyValue === 1 ? "Emergency" : "Non-Emergency"}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="subtitle2" sx={{ color: labelColor, fontWeight: 500, fontFamily }}>
                                            Alert Type
                                        </Typography>
                                        <Typography variant="subtitle2" sx={{ fontFamily }}>
                                            {alertType === 1 ? "High" : alertType === 2 ? "Medium" : "Low"}
                                        </Typography>
                                    </Box>
                                </Grid>

                                {/* SOP Section */}
                                <Grid item xs={12} md={5} sx={{ px: 2, borderRight: { md: `1px solid white` } }}>
                                    <Box sx={boxStyle}>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <Typography variant="subtitle2" sx={{ color: labelColor, fontWeight: 500, fontFamily }}>
                                                Response Procedure
                                            </Typography>
                                            <IconButton
                                                size="small"
                                                onClick={() => setOpenSopModal(true)}
                                                sx={{ color: labelColor, ml: 1 }}
                                            >
                                                <VisibilityIcon />
                                            </IconButton>
                                        </Box>
                                        {/* <Typography variant="subtitle2" sx={{ fontFamily }}>
                                            {responderScope?.sop_responses?.map((sop) => (
                                                <div key={sop.sop_id}>{sop?.sop_description || "No SOP description"}</div>
                                            ))}
                                        </Typography> */}
                                        {/* <Tooltip
                                            title={
                                                responderScope?.sop_responses?.length > 0
                                                    ? (
                                                        <div>
                                                            {responderScope.sop_responses.map((sop) => (
                                                                <div key={sop.sop_id}>{sop?.sop_description || "No SOP description"}</div>
                                                            ))}
                                                        </div>
                                                    )
                                                    : "No SOP description"
                                            }
                                            arrow
                                            placement="top"
                                        > */}
                                            <Typography
                                                variant="subtitle2"
                                                sx={{
                                                    fontFamily,
                                                    cursor: "pointer",
                                                    display: "-webkit-box",
                                                    WebkitLineClamp: 2,
                                                    WebkitBoxOrient: "vertical",
                                                    overflow: "hidden",
                                                    textOverflow: "ellipsis",
                                                    maxWidth: 300, // adjust as needed
                                                }}
                                            >
                                                {(() => {
                                                    const sops = responderScope?.sop_responses || [];
                                                    if (sops.length === 0) return "No SOP description";
                                                    const shown = sops.slice(0, 2).map(sop => sop.sop_description || "No SOP description");
                                                    let text = shown.join(", ");
                                                    if (sops.length > 2) text += " ...";
                                                    return text;
                                                })()}
                                            </Typography>
                                        {/* </Tooltip> */}

                                        <Dialog open={openSopModal} onClose={() => setOpenSopModal(false)} maxWidth="sm" fullWidth>
                                            <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                                All Response Procedures
                                                <IconButton
                                                    aria-label="close"
                                                    onClick={() => setOpenSopModal(false)}
                                                    sx={{
                                                        color: (theme) => theme.palette.grey[500],
                                                        ml: 2,
                                                    }}
                                                    size="small"
                                                >
                                                    <CloseIcon />
                                                </IconButton>
                                            </DialogTitle>
                                            <DialogContent dividers>
                                                {(responderScope?.sop_responses?.length > 0)
                                                    ? responderScope.sop_responses.map((sop, idx) => (
                                                        <Typography key={sop.sop_id || idx} sx={{ mb: 1 }}>
                                                            {sop?.sop_description || "No SOP description"}
                                                        </Typography>
                                                    ))
                                                    : <Typography>No SOP description</Typography>
                                                }
                                            </DialogContent>
                                        </Dialog>
                                    </Box>

                                    <Box>
                                        <Typography variant="subtitle2" sx={{ color: labelColor, fontWeight: 500, fontFamily }}>
                                            Responder Scope
                                        </Typography>
                                        <Stack spacing={1} mt={1}>
                                            <Box display="flex" flexWrap="wrap" gap={1}>
                                                {responderScope?.responder_scope?.map((responder) => (
                                                    <FormControlLabel
                                                        key={responder.res_id}
                                                        control={
                                                            <Checkbox
                                                                checked={sopId.includes(responder.res_id)}
                                                                onChange={() => handleCheckboxChange(responder.res_id)}
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

                                <Grid item xs={12} md={4}>
                                    <Typography variant="h6" sx={{ fontSize: '16px' }} gutterBottom>
                                        Comments
                                    </Typography>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        multiline
                                        className='textarea'
                                        rows={4}
                                        variant="outlined"
                                        sx={{ ...inputStyle }}
                                        value={comments}
                                        onChange={(e) => setComments(e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                )}

                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            variant="contained"
                            sx={{
                                width: "10%",
                                backgroundColor: "white",
                                color: "black",
                                fontWeight: "bold",
                                borderRadius: "12px",
                                mb: 5,
                            }}
                            onClick={handleSubmit}
                        >
                            Submit
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Incident;
