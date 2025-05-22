import {
    Box, Grid
} from '@mui/material';
import MapView from '../Map/Map';
import { useAuth } from './../../../Context/ContextAPI';

const Incident = ({ darkMode }) => {
    const { newToken } = useAuth();
    console.log(newToken, 'newToken');

    return (
        <Box>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', pt: 2 }}>
                        Hey
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
