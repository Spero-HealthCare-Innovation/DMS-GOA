import { Box, Grid, Paper } from '@mui/material';
import MapView from '../Map/Map';
import { useAuth } from './../../../Context/ContextAPI';

const Incident = ({ darkMode }) => {
    const { newToken } = useAuth();
    console.log(newToken, 'newToken');
    const bgColor = darkMode ? "#0a1929" : "#ffffff";

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Box
                        sx={{
                            ml: { xs: 2.5 },
                            pr: { xs: 2, sm: 3, md: 4 },
                            py: { xs: 2, sm: 3 },
                            mx: 0,
                            px: 0,
                            backgroundColor: darkMode ? "#0a1929" : "#f5f5f5",
                            minHeight: "100vh",
                            transition: "background-color 0.5s ease-in-out, color 0.5s ease-in-out",

                        }}
                    >
                        <Grid container spacing={2}>
                            <Grid item xs={8} >
                                <Paper
                                    elevation={3}
                                    sx={{ padding: 2, borderRadius: 3, backgroundColor: bgColor }}
                                >
                                    hey
                                </Paper>
                            </Grid>

                            <Grid item xs={4}>
                                <Paper
                                    elevation={3}
                                    sx={{ padding: 2, borderRadius: 3, backgroundColor: bgColor }}
                                >
                                    hey
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper
                                    elevation={3}
                                    sx={{ padding: 2, borderRadius: 3, backgroundColor: bgColor }}
                                >
                                    hey
                                </Paper>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <MapView />
                </Grid>
            </Grid>
        </Box>
    );
};

export default Incident;