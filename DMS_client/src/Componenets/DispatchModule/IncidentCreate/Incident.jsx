import { useState, useContext, useEffect } from 'react';
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

const inputStyle = {
    mb: 2,
};
const boxStyle = {
    mb: 2,
    pb: 1.5,
};

const Incident = ({ darkMode }) => {
    const port = import.meta.env.VITE_APP_API_KEY;
    const token = localStorage.getItem("access_token");
    const { newToken } = useAuth();
    const bgColor = darkMode ? "#0a1929" : "#ffffff";
    const labelColor = darkMode ? "#5FECC8" : "#1976d2";
    const fontFamily = "Roboto, sans-serif";
    const [selectedEmergencyValue, setSelectedEmergencyValue] = useState('');
    const { responderScope } = useAuth();
    console.log(responderScope, 'Fetching Scope Data');
    const [disaster, setDisaster] = useState([]);
    const [selectedDisaster, setSelectedDisaster] = useState('');
    const { setDisasterIncident } = useAuth();

    useEffect(() => {
        if (selectedDisaster) {
            setDisasterIncident(selectedDisaster);
        }
    }, [selectedDisaster]);;

    useEffect(() => {
        const fetchDisaster = async () => {
            const disaster = await fetch(`${port}/admin_web/DMS_Disaster_Type_Get/`, {
                headers: {
                    Authorization: `Bearer ${token || newToken}`,
                }
            })
            const disasterData = await disaster.json();
            setDisaster(disasterData);
        };
        fetchDisaster()
    }, [])

    const handleEmergencyChange = (event) => {
        setSelectedEmergencyValue(event.target.value);
    };

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: darkMode ? "#0a1929" : "#f5f5f5", px: 2, py: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Paper elevation={3} sx={{ ...inputStyle, p: 2, borderRadius: 3, backgroundColor: bgColor, height: "100%" }}>
                                <Typography variant="h6" gutterBottom>
                                    Create Incident
                                </Typography>
                                <Grid container spacing={1}>
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
                                        <TextField select fullWidth size="small" label="Alert Type" variant="outlined" sx={inputStyle}>
                                            <MenuItem value="Coast Guard">High</MenuItem>
                                            <MenuItem value="Police">Medium</MenuItem>
                                            <MenuItem value="Media">Low</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth size="small" label="Caller Number" variant="outlined" sx={inputStyle} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth size="small" label="Caller Name" variant="outlined" sx={inputStyle} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField fullWidth size="small" label="Location" variant="outlined" sx={inputStyle} />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            fullWidth size="small"
                                            label="Summary"
                                            multiline
                                            variant="outlined"
                                            sx={inputStyle}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Paper elevation={3} sx={{ ...inputStyle, p: 2, color: labelColor, borderRadius: 3, backgroundColor: bgColor, height: "100%" }}>
                                <Typography variant="h6">Comments</Typography>
                                <TextField
                                    fullWidth size="small"
                                    multiline
                                    rows={8}
                                    variant="outlined"
                                    sx={inputStyle}
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
                                                    sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                                                >
                                                    Alert ID
                                                </Typography>
                                                <Typography variant="subtitle2" sx={{ fontFamily }}>
                                                </Typography>
                                            </Box>

                                            <Box>
                                                <Typography
                                                    variant="subtitle2"
                                                    sx={{ color: labelColor, fontWeight: 500, fontFamily }}
                                                >
                                                    Alert Type
                                                </Typography>
                                                <Typography variant="subtitle2" sx={{ fontFamily }}>
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
                                                    Mass intimation to public, Media, Boat, Fisheries
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
                                                        <FormControlLabel
                                                            control={
                                                                <Checkbox defaultChecked sx={{ color: labelColor }} />
                                                            }
                                                            label={
                                                                <Typography variant="subtitle2" sx={{ fontFamily }}>
                                                                    Police
                                                                </Typography>
                                                            }
                                                        />
                                                        <FormControlLabel
                                                            control={<Checkbox sx={{ color: labelColor }} />}
                                                            label={
                                                                <Typography variant="subtitle2" sx={{ fontFamily }}>
                                                                    Fire
                                                                </Typography>
                                                            }
                                                        />
                                                        <FormControlLabel
                                                            control={<Checkbox sx={{ color: labelColor }} />}
                                                            label={
                                                                <Typography variant="subtitle2" sx={{ fontFamily }}>
                                                                    Marine
                                                                </Typography>
                                                            }
                                                        />
                                                        <FormControlLabel
                                                            control={<Checkbox sx={{ color: labelColor }} />}
                                                            label={
                                                                <Typography variant="subtitle2" sx={{ fontFamily }}>
                                                                    Fisheries
                                                                </Typography>
                                                            }
                                                        />
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>

                                <Grid
                                    item
                                    xs={12}
                                    md={9}
                                    sx={{ marginLeft: '6em' }}
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
                                        >
                                            Submit
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        )}

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
