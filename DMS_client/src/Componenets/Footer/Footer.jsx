import { Box, Typography } from '@mui/material';
import logo from '../../assets/SperoLogo.png'

export default function Footer({ darkMode }) {
    return (
        <Box
            sx={{
                position: 'fixed',
                bottom: 0,
                height: '40px',
                width: '100%',
                zIndex: 1000,
                backgroundColor: darkMode ? "#202328" : "#CCDBEF",
                transition: "background-color 0.5s ease-in-out, color 0.5s ease-in-out",
                color: darkMode ? 'white' : 'black',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center', 
                px: 2,
            }}
        >
            <Typography
                variant="subtitle2"
                sx={{
                    fontFamily: 'sans-serif',
                    fontStyle: 'normal',
                    textDecoration: 'none',
                }}
            >
                Powered by Spero 2025
            </Typography>

            <Box
                component="img"
                src={logo}
                alt="Logo"
                sx={{
                    height: 35,
                    width: 40,
                    position: 'absolute',
                    right: 16,
                }}
            />
        </Box>
    );
}
