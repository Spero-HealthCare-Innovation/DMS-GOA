import { useEffect, useState } from 'react';
import {
    Box, CardContent, Typography, Table, TableBody, TableContainer,
    TableHead, TableRow, Grid, Button, Select, MenuItem
} from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import MapView from './Map';
import { useAuth } from './../../../Context/ContextAPI';

const EnquiryCard = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: "#5FECC8",
    color: 'black',
    borderRadius: '8px 10px 0 0',
    fontWeight: '600',
    height: '35px'
});

const EnquiryCardBody = styled('div')({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '0.5em',
    borderRadius: '8px',
    position: 'relative',
    height: '40px',
    cursor: 'pointer',
});

const StyledCardContent = styled(CardContent)({
    padding: '8px 12px',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
    height: '100%',
});

const AlertPanel = ({ darkMode }) => {
    const { newToken } = useAuth();
    console.log(newToken, 'newToken');

    const port = import.meta.env.VITE_APP_API_KEY;
    const group = localStorage.getItem('user_group');
    const token = localStorage.getItem('access_token');
    console.log(group, 'groupgroup');
    const navigate = useNavigate();

    const textColor = darkMode ? "#ffffff" : "#000000";
    const bgColor = darkMode ? "#0a1929" : "#ffffff";
    const borderColor = darkMode ? "#7F7F7F" : "#ccc";
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [alertData, setAlertData] = useState([]);
    const [triggeredData, setTriggeredData] = useState([]);
    console.log(triggeredData, 'triggeredData');

    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = alertData.slice(startIndex, endIndex);
    const totalPages = Math.ceil(alertData.length / rowsPerPage);

    useEffect(() => {
        document.title = "DMS-AlertPanel";
    }, []);

    useEffect(() => {
        const socket = new WebSocket('ws://192.168.1.116:7777/ws/weather_alerts');

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                console.log(data, 'data');
                setAlertData((prev) => [...prev, data]);
            } catch (error) {
                console.error('Invalid JSON:', event.data);
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = () => {
            console.log('WebSocket closed');
        };

        return () => {
            socket.close();
        };
    }, []);

    const handleTriggerClick = async (id, triggerStatus) => {
        try {
            const response = await fetch(`${port}/admin_web/alert/?id=${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token || newToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTriggeredData(data);

            if (group === "2") {
                navigate('/Sop', {
                    state: {
                        triggerStatus: triggerStatus
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching alert details:', error);
        }
    };
    
    const handleTriggeredData = async (id, triggerStatus) => {
        try {
            const response = await fetch(`${port}/admin_web/alert/?id=${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token || newToken}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTriggeredData(data);

            if (group === "2") {
                navigate('/Sop', {
                    state: {
                        triggerStatus: triggerStatus
                    }
                });
            }
        } catch (error) {
            console.error('Error fetching alert details:', error);
        }
    };

    return (
        <Box sx={{ flexGrow: 1, mt: 1, ml: 1, mr: 1, mb: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={8}>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <EnquiryCard>
                                        <StyledCardContent style={{ flex: 0.3, borderRight: "1px solid black" }}>
                                            <Typography variant="subtitle2">Sr. No</Typography>
                                        </StyledCardContent>
                                        <StyledCardContent style={{ flex: 1, borderRight: "1px solid black" }}>
                                            <Typography variant="subtitle2">Time</Typography>
                                        </StyledCardContent>
                                        <StyledCardContent style={{ flex: 1, borderRight: "1px solid black" }}>
                                            <Typography variant="subtitle2">Temperature (°C)</Typography>
                                        </StyledCardContent>
                                        <StyledCardContent style={{ flex: 1, borderRight: "1px solid black" }}>
                                            <Typography variant="subtitle2">Rain (mm)</Typography>
                                        </StyledCardContent>
                                        <StyledCardContent style={{ flex: 1, marginTop: '15px' }}>
                                            <Typography variant="subtitle2">Trigger</Typography>
                                        </StyledCardContent>
                                    </EnquiryCard>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {paginatedData.length === 0 ? (
                                    <TableRow>
                                        <StyledCardContent style={{ flex: 1, textAlign: 'center' }} colSpan={5}>
                                            <Typography variant="subtitle2" sx={{ color: textColor }}>
                                                No alerts available.
                                            </Typography>
                                        </StyledCardContent>
                                    </TableRow>
                                ) : (
                                    paginatedData.map((item, index) => (
                                        <EnquiryCardBody
                                            key={startIndex + index}
                                            onClick={() => handleTriggeredData(item.pk_id, item.triger_status)} // Add row click
                                            sx={{
                                                backgroundColor: darkMode ? "#1C223C" : "#FFFFFF",
                                                color: darkMode ? "white" : "black",
                                                cursor: "pointer", // Optional for visual feedback
                                            }}
                                        >
                                            <StyledCardContent style={{ flex: 0.3 }}>
                                                <Typography variant="subtitle2">{item.pk_id}</Typography>
                                            </StyledCardContent>
                                            <StyledCardContent style={{ flex: 1 }}>
                                                <Typography variant="subtitle2">{new Date(item.time).toLocaleString()}</Typography>
                                            </StyledCardContent>
                                            <StyledCardContent style={{ flex: 1 }}>
                                                <Typography variant="subtitle2">{item.temperature_2m}°C</Typography>
                                            </StyledCardContent>
                                            <StyledCardContent style={{ flex: 1 }}>
                                                <Typography variant="subtitle2">{item.rain} mm</Typography>
                                            </StyledCardContent>
                                            <StyledCardContent style={{ flex: 1 }}>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation(); // Prevent parent click from firing
                                                        handleTriggerClick(item.pk_id, item.triger_status);
                                                    }}
                                                    style={{
                                                        width: '60%',
                                                        backgroundColor: item.triger_status === 1 ? '#FF4C4C' : '#00BFA6',
                                                        color: darkMode ? 'white' : 'black',
                                                        borderRadius: '10px',
                                                        height: '30px',
                                                        marginTop: '15px'
                                                    }}
                                                >
                                                    {item.triger_status === 1 ? "Trigger" : "Triggered"}
                                                </Button>
                                            </StyledCardContent>
                                        </EnquiryCardBody>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
                        mb={4}
                        px={1}
                    >
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" sx={{ color: textColor }}>
                                Records per page:
                            </Typography>
                            <Select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value));
                                    setPage(1);
                                }}
                                size="small"
                                variant="outlined"
                                sx={{
                                    fontSize: "13px",
                                    color: textColor,
                                    borderColor: borderColor,
                                    height: "30px",
                                    minWidth: "70px",
                                    backgroundColor: bgColor,
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: borderColor,
                                    },
                                    "& .MuiSvgIcon-root": { color: textColor },
                                }}
                            >
                                {[5, 10, 25, 50].map((option) => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Box>

                        <Box
                            sx={{
                                border: "1px solid #ffffff",
                                borderRadius: "6px",
                                px: 2,
                                py: 0.5,
                                height: "30px",
                                display: "flex",
                                alignItems: "center",
                                gap: 2,
                                color: textColor,
                                fontSize: "13px",
                            }}
                        >
                            <Box
                                onClick={() => page > 1 && setPage(page - 1)}
                                sx={{
                                    cursor: page > 1 ? "pointer" : "not-allowed",
                                    userSelect: "none",
                                }}
                            >
                                &#8249;
                            </Box>
                            <Box>{page} / {totalPages || 1}</Box>
                            <Box
                                onClick={() =>
                                    page < totalPages &&
                                    setPage(page + 1)
                                }
                                sx={{
                                    cursor:
                                        page < totalPages
                                            ? "pointer"
                                            : "not-allowed",
                                    userSelect: "none",
                                }}
                            >
                                &#8250;
                            </Box>
                        </Box>
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <MapView data={triggeredData}/>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AlertPanel;
