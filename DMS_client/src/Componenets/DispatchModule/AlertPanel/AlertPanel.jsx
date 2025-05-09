import { useState } from 'react';
import {
    Box, CardContent, Typography, Table, TableBody, TableContainer,
    TableHead, TableRow, Grid, Checkbox, CircularProgress
} from '@mui/material';
import { styled } from '@mui/system';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

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
    height: '40px'
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


const alertData = [
    {
        id: 1,
        incidentId: '2023052400004',
        eventDateTime: '4-04-2025 13:44:07',
        location: 'North Goa',
        alertType: 'Unknown',
        trigger: 'Triggered',
        status: '65%',
    },
    {
        id: 2,
        incidentId: '2023052400005',
        eventDateTime: '4-04-2025 13:44:07',
        location: 'North Goa',
        alertType: 'Unknown',
        trigger: 'Trigger',
        status: '10%',
    },
    {
        id: 3,
        incidentId: '2023052400005',
        eventDateTime: '4-04-2025 13:44:07',
        location: 'North Goa',
        alertType: 'Unknown',
        trigger: 'Trigger',
        status: '30%',
    },
    {
        id: 4,
        incidentId: '2023052400005',
        eventDateTime: '4-04-2025 13:44:07',
        location: 'North Goa',
        alertType: 'Unknown',
        trigger: 'Trigger',
        status: '80%',
    },
];

const AlertPanel = ({ darkMode }) => {
    const [selected, setSelected] = useState([]);
    const navigate = useNavigate();

    const handleCheckboxChange = (id) => {
        setSelected((prevSelected) =>
            prevSelected.includes(id)
                ? prevSelected.filter((item) => item !== id)
                : [...prevSelected, id]
        );
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
                                        {/* <StyledCardContent style={{ flex: 0.2 }} /> */}
                                        <StyledCardContent style={{ flex: 0.3, borderRight: "1px solid black" }}>
                                            <Typography variant="subtitle2">Sr. No</Typography>
                                        </StyledCardContent>
                                        <StyledCardContent style={{ flex: 1.2, borderRight: "1px solid black" }}>
                                            <Typography variant="subtitle2">Incident ID</Typography>
                                        </StyledCardContent>
                                        <StyledCardContent style={{ flex: 1.2, borderRight: "1px solid black" }}>
                                            <Typography variant="subtitle2">Event Date & Time</Typography>
                                        </StyledCardContent>
                                        <StyledCardContent style={{ flex: 1, borderRight: "1px solid black" }}>
                                            <Typography variant="subtitle2">Location</Typography>
                                        </StyledCardContent>
                                        <StyledCardContent style={{ flex: 1, borderRight: "1px solid black" }}>
                                            <Typography variant="subtitle2">Alert Type</Typography>
                                        </StyledCardContent>
                                        <StyledCardContent style={{ flex: 1, marginTop: '15px' }}>
                                            <Typography variant="subtitle2">Trigger</Typography>
                                        </StyledCardContent>
                                        {/* <StyledCardContent style={{ flex: 0.8, borderRight: "1px solid black" }}>
                                            <Typography variant="subtitle2">Status</Typography>
                                        </StyledCardContent> */}
                                    </EnquiryCard>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {alertData.map((item, index) => {
                                    const normalizedValue = parseInt(item.status.replace('%', ''), 10) || 0;
                                    return (
                                        <EnquiryCardBody
                                            key={item.id}
                                            sx={{
                                                backgroundColor: darkMode ? "#1C223C" : "#FFFFFF",
                                                color: darkMode ? "white" : "black",
                                            }}
                                        >
                                            {/* <StyledCardContent style={{ flex: 0.2 }}>
                                                <Checkbox
                                                    checked={selected.includes(item.id)}
                                                    onChange={() => handleCheckboxChange(item.id)}
                                                    sx={{
                                                        color: darkMode ? "white" : "black",
                                                        '&.Mui-checked': {
                                                            color: darkMode ? "white" : "black",
                                                        },
                                                    }}
                                                />
                                            </StyledCardContent> */}
                                            <StyledCardContent style={{ flex: 0.3 }}>
                                                <Typography variant="subtitle2">{index + 1}</Typography>
                                            </StyledCardContent>
                                            <StyledCardContent style={{ flex: 1.2 }}>
                                                <Typography variant="subtitle2">{item.incidentId}</Typography>
                                            </StyledCardContent>
                                            <StyledCardContent style={{ flex: 1.2 }}>
                                                <Typography variant="subtitle2">{item.eventDateTime}</Typography>
                                            </StyledCardContent>
                                            <StyledCardContent style={{ flex: 1 }}>
                                                <Typography variant="subtitle2">{item.location}</Typography>
                                            </StyledCardContent>
                                            <StyledCardContent style={{ flex: 1 }}>
                                                <Typography variant="subtitle2">{item.alertType}</Typography>
                                            </StyledCardContent>
                                            <StyledCardContent style={{ flex: 1 }}>
                                                <Button
                                                    onClick={() => navigate('/Sop', { state: { flag: 1 } })}
                                                    style={{
                                                        width: '70%',
                                                        textAlign: 'left',
                                                        backgroundColor: item.trigger === 'Triggered' ? '#00BFA6' : '#FF4C4C',
                                                        color: 'black',
                                                        borderRadius: '10px',
                                                        marginTop: '15px',
                                                    }}
                                                >
                                                    <Typography variant="subtitle2"
                                                        style={{
                                                            color: darkMode ? "white" : "black",
                                                            fontSize: '11px',
                                                        }}>
                                                        {item.trigger.charAt(0).toUpperCase() + item.trigger.slice(1).toLowerCase()}
                                                    </Typography>
                                                </Button>
                                            </StyledCardContent>

                                            {/* <StyledCardContent style={{ flex: 0.8, position: 'relative', display: 'flex', justifyContent: 'center' }}>
                                                <Box position="relative" display="inline-flex">
                                                    <CircularProgress
                                                        variant="determinate"
                                                        value={normalizedValue}
                                                        size={40}
                                                        thickness={4}
                                                        sx={{
                                                            color: normalizedValue > 0 ? '#4df2ce' : '#ff5e5e',
                                                        }}
                                                    />
                                                    <Box
                                                        top={0}
                                                        left={0}
                                                        bottom={0}
                                                        right={0}
                                                        position="absolute"
                                                        display="flex"
                                                        alignItems="center"
                                                        justifyContent="center"
                                                    >
                                                        <Typography variant="caption"
                                                            sx={{
                                                                color: darkMode ? "white" : "black",
                                                            }}
                                                        >
                                                            {`${normalizedValue}%`}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </StyledCardContent> */}
                                        </EnquiryCardBody>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center',height:'30px' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                console.log('View All clicked');
                            }}
                        >
                            View All
                        </Button>
                    </Box> */}
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box sx={{
                        backgroundColor: '#fff3cd',
                        padding: 2,
                        borderRadius: '8px',
                        border: '1px solid #ffeeba'
                    }}>
                        <Typography variant="h6" sx={{ color: '#856404' }}>
                            Hey! Welcome to the Alert Panel!
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Box >
    );
};

export default AlertPanel;
