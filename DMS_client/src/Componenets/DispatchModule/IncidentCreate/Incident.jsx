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

const inputStyle = {
    mb: 2,
};
const boxStyle = {
    mb: 2,
    pb: 1.5,
};

const Incident = ({ darkMode }) => {
    const { newToken } = useAuth();
    const bgColor = darkMode ? "#0a1929" : "#ffffff";
    const labelColor = darkMode ? "#5FECC8" : "#1976d2";
    const fontFamily = "Roboto, sans-serif";

    return (
        <Box sx={{ minHeight: "100vh", backgroundColor: darkMode ? "#0a1929" : "#f5f5f5", px: 2, py: 3 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={8}>
                            <Paper elevation={3} sx={{ ...inputStyle, p: 3, borderRadius: 3, backgroundColor: bgColor }}>
                                <Typography variant="h6" gutterBottom>
                                    Create Incident
                                </Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={4}>
                                        <TextField fullWidth size="small" label="Caller Name" variant="outlined" sx={inputStyle} />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField fullWidth size="small" label="Contact Number" variant="outlined" sx={inputStyle} />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField fullWidth size="small" label="Date & Time" type="datetime-local" InputLabelProps={{ shrink: true }} variant="outlined" sx={inputStyle} />
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField select fullWidth size="small" label="Incident Type" variant="outlined" sx={inputStyle}>
                                            <MenuItem value="Flood">Flood</MenuItem>
                                            <MenuItem value="Fire">Fire</MenuItem>
                                            <MenuItem value="Cyclone">Cyclone</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField select fullWidth size="small" label="Alert Type" variant="outlined" sx={inputStyle}>
                                            <MenuItem value="Coast Guard">Coast Guard</MenuItem>
                                            <MenuItem value="Police">Police</MenuItem>
                                            <MenuItem value="Media">Media</MenuItem>
                                        </TextField>
                                    </Grid>
                                    <Grid item xs={12} sm={4}>
                                        <TextField fullWidth size="small" label="Location" variant="outlined" sx={inputStyle} />
                                    </Grid>
                                    <Grid item xs={12}>
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
                            <Paper elevation={3} sx={{ ...inputStyle, p: 2, borderRadius: 3, backgroundColor: bgColor, height: "auto" }}>
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
                                            mb: { xs: 2, md: 0 },
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
                        </Grid>
                    </Grid>
                </Grid>

                <Grid item xs={12} md={4}>
                Map View
                </Grid>
            </Grid>
        </Box>
    );
};

export default Incident;
