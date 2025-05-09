// src/Components/Login/Login.js
import React, { useState } from 'react';
import {
    Box, Typography, TextField, Button, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import loginBg from '../../assets/Bg_login1.png';
import Spero from '../../assets/spero1.png';

function Login({ setIsLoggedIn }) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

    const [emp_username, setEmp_Username] = useState('');
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!emp_username || !password) {
            setLoginError('Please enter both User ID and Password.');
            return;
        }

        try {
            setLoading(true);
            setLoginError('');

            const response = await fetch('http://127.0.0.1:8000/admin_web/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emp_username, password }),
            });

            const data = await response.json();

            if (response.status === 200 && data.token) {
                localStorage.setItem('token', data.token); 
                setIsLoggedIn(true);
                navigate('/alert-panel');
            }
            else if (data.msg) {
                setLoginError(data.msg);
            } else {
                setLoginError('Unexpected response from server.');
            }

        } catch (err) {
            setLoginError('Failed to login. Please try again.');
            console.error('Login error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            height: '100vh',
            width: '100%',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: isSmallScreen ? 'column' : 'row'
        }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                    backgroundImage: `url(${loginBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0,
                }}
            />

            <Box
                sx={{
                    position: 'relative',
                    zIndex: 1,
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: isSmallScreen ? 'column' : 'row',
                }}
            >
                {!isSmallScreen && <Box sx={{ flex: 1 }} />}
                <Box
                    sx={{
                        width: isSmallScreen ? '100%' : '350px',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'radial-gradient(6035.71% 72.44% at 0% 50%, rgba(95, 236, 200, 0.7) 0%, rgba(95, 236, 200, 0.035) 100%)',
                        backdropFilter: 'blur(10px)',
                    }}
                >
                    <Box sx={{ width: '80%', maxWidth: 400, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>
                            <b>User Login</b>
                        </Typography>

                        <Box sx={{ width: '100%', mb: 2 }}>
                            <Typography sx={{ color: 'white', mb: 0.5, fontSize: '12px' }}>
                                User Name
                            </Typography>
                            <TextField
                                value={emp_username}
                                onChange={(e) => setEmp_Username(e.target.value)}
                                fullWidth
                                variant="outlined"
                                placeholder="Enter Name"
                                sx={{
                                    '& .MuiInputBase-input': { color: 'black' },
                                    backgroundColor: 'white',
                                    '& input::placeholder': { fontSize: '0.75rem', color: '#9e9e9e' },
                                    '& fieldset': { borderRadius: '8px' },
                                }}
                            />
                        </Box>

                        <Box sx={{ width: '100%', mb: 2 }}>
                            <Typography sx={{ color: 'white', mb: 0.5, fontSize: '12px' }}>
                                Password
                            </Typography>
                            <TextField
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                type="password"
                                variant="outlined"
                                placeholder="Enter Password"
                                sx={{
                                    '& .MuiInputBase-input': { color: 'black' },
                                    backgroundColor: 'white',
                                    '& input::placeholder': { fontSize: '0.75rem', color: '#9e9e9e' },
                                    '& fieldset': { borderRadius: '8px' },
                                }}
                            />
                        </Box>

                        {loginError && (
                            <Box sx={{ mt: 1, mb: 1, width: '100%', backgroundColor: 'rgba(255, 0, 0, 0.1)', padding: '8px', borderRadius: '4px', border: '1px solid rgba(255, 0, 0, 0.3)' }}>
                                <Typography sx={{ fontSize: '0.8rem', textAlign: 'center', color: 'white' }}>
                                    {loginError}
                                </Typography>
                            </Box>
                        )}

                        <Button
                            fullWidth
                            variant="contained"
                            onClick={handleLogin}
                            sx={{
                                mt: 2,
                                width: '50%',
                                backgroundColor: '#101329',
                                color: '#fff',
                                borderRadius: '30px',
                                textTransform: 'none',
                                fontWeight: 'bold',
                                '&:hover': { backgroundColor: '#101329' },
                            }}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>

                        <Box component="img" src={Spero} alt="Spero Logo" sx={{ width: '100px', mt: 5 }} />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
}

export default Login;
