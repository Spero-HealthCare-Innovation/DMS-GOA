import { Box, Typography } from '@mui/material';

export default function Footer({ darkMode }) {
    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 0,
                hight: '30px',
                width: '100%',
                zIndex: 1000,
                backgroundColor: darkMode ? "#1A1D33" : "#CCDBEF",
                   transition: "background-color 0.5s ease-in-out, color 0.5s ease-in-out", // 👈 Add this
                color: darkMode ? 'white' : 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 1,
            }}
        >
            <Typography
                variant="subtitle2"
                align="center"
                sx={{
                    fontFamily: 'sans-serif',
                    fontStyle: 'normal',
                    textDecoration: 'none',
                }}
            >
                Powered by Spero 2025
            </Typography>
        </Box>
    );
}
