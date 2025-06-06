import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Paper, InputAdornment, Grid, Popover, Snackbar } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Search, DeleteOutline, EditOutlined, Description, } from "@mui/icons-material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { styled } from "@mui/material/styles";
import { Alert } from '@mui/material';
import { Select, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../../Context/ContextAPI";
import {
    getCustomSelectStyles,
} from "../../../CommonStyle/Style";

function SopRegister({ darkMode }) {
    const port = import.meta.env.VITE_APP_API_KEY;
    const { newToken, disaster } = useAuth();
    const token = localStorage.getItem("access_token");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const textColor = darkMode ? "#ffffff" : "#000000";
    const bgColor = darkMode ? "#0a1929" : "#0a1929";
    const labelColor = darkMode ? "#5FECC8" : "#1976d2";
    const fontFamily = "Roboto, sans-serif";
    const borderColor = darkMode ? "#7F7F7F" : "#ccc";

    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";
    const selectStyles = getCustomSelectStyles(isDarkMode);

    const [anchorEl, setAnchorEl] = useState(null);

    const [description, setDescription] = useState("");
    const [selectedDisaster, setSelectedDisaster] = useState(null);
    const userName = localStorage.getItem('userId');
    const [sop, setSop] = useState([]);

    const EnquiryCard = styled("div")(() => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: "#5FECC8",
        borderRadius: "8px 10px 0 0",
        padding: "6px 12px",
        color: "black",
        height: "40px",
    }));

    const EnquiryCardBody = styled("tr")(({ theme, status }) => ({
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        background: theme.palette.mode === "dark" ? "#112240" : "#fff",
        color: theme.palette.mode === "dark" ? "#fff" : "#000",
        marginTop: "0.5em",
        borderRadius: "8px",
        padding: "10px 12px",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": {
            boxShadow: `0 0 8px ${status === "Completed"
                ? "#00e67699"
                : status === "Pending"
                    ? "#f4433699"
                    : "#88888855"
                }`,
        },
        height: "45px",
    }));

    const StyledCardContent = styled("td")({
        padding: "0 8px",
        display: "flex",
        alignItems: "center",
    });

    const fontsTableHeading = {
        fontFamily: "Roboto",
        fontWeight: 500,
        fontSize: 14,
        letterSpacing: 0,
        textAlign: "center",
    };

    const inputBgColor = darkMode
        ? "rgba(255, 255, 255, 0.16)"
        : "rgba(0, 0, 0, 0.04)";

    const fontsTableBody = {
        fontFamily: "Roboto",
        fontWeight: 400,
        fontSize: 13,
        letterSpacing: 0,
        textAlign: "center",
    };

    const handleSubmit = async () => {
        const payload = {
            sop_description: description,
            disaster_id: selectedDisaster,
            sop_added_by: userName,
            sop_modified_by: userName,
        };

        try {
            const response = await fetch(`${port}/admin_web/sop_post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token || newToken}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.status === 201) {
                setSnackbarMessage("SOP Registered Successfully");
                setSnackbarOpen(true);
            } else if (response.status === 500) {
                setSnackbarMessage("Internal Server Error");
                setSnackbarOpen(true);
            } else {
                setSnackbarMessage(data?.detail || "Something went wrong");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    // GET API SOP
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    useEffect(() => {
        const fetchSop = async () => {
            try {
                const response = await fetch(`${port}/admin_web/sop_get`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token || newToken}`,
                    },
                });

                const data = await response.json();
                if (response.status === 200) {
                    setSop(data);
                    console.log(data, "SOP");
                    setPage(1); // reset page on new data
                }
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchSop();
    }, [port, token, newToken]);

    // Calculate total pages and sliced data for pagination
    const totalPages = Math.ceil(sop.length / rowsPerPage);
    const paginatedData = sop.slice((page - 1) * rowsPerPage, page * rowsPerPage);

    return (
        <div style={{ marginLeft: "3.5rem" }}>
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

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 2, mt: 3 }}>
                <Typography variant="h6" sx={{
                    color: labelColor,
                    fontWeight: 600,
                    fontFamily,
                    fontSize: 16,
                }}>
                    Register SOP
                </Typography>

                <TextField
                    variant="outlined"
                    size="small"
                    placeholder="Search"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ color: "gray", fontSize: 18 }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        width: "250px",
                        "& .MuiOutlinedInput-root": {
                            borderRadius: "25px",
                            backgroundColor: darkMode ? "#1e293b" : "#fff",
                            color: darkMode ? "#fff" : "#000",
                            px: 1,
                            py: 0.2,
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: darkMode ? "#444" : "#ccc",
                        },
                        "& input": {
                            color: darkMode ? "#fff" : "#000",
                            padding: "6px 8px",
                            fontSize: "13px",
                        },
                    }}
                />
            </Box>

            <Grid container spacing={2}>
                <Grid item xs={12} md={7}>
                    <Paper elevation={3} sx={{ padding: 2, borderRadius: 3, backgroundColor: bgColor, mt: 1, mb: 5, ml: 1 }}>
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <EnquiryCard
                                            sx={{
                                                backgroundColor: "#5FECC8",
                                                color: "#000",
                                                display: "flex",
                                                width: "100%",
                                                borderRadius: 2,
                                                p: 2,
                                            }}
                                        >
                                            <StyledCardContent
                                                sx={{
                                                    flex: 0.6,
                                                    borderRight: "1px solid black",
                                                    justifyContent: "center",
                                                }}
                                            >
                                                <Typography variant="subtitle2" sx={fontsTableHeading}>
                                                    Sr. No
                                                </Typography>
                                            </StyledCardContent>

                                            <StyledCardContent
                                                sx={{
                                                    flex: 1.9,
                                                    borderRight: "1px solid black",
                                                    justifyContent: "center",
                                                    ...fontsTableHeading,
                                                }}
                                            >
                                                <Typography variant="subtitle2">Disaster Name</Typography>
                                            </StyledCardContent>

                                            <StyledCardContent
                                                sx={{
                                                    flex: 2,
                                                    borderRight: "1px solid black",
                                                    justifyContent: "center",
                                                    ...fontsTableHeading,
                                                }}
                                            >
                                                <Typography variant="subtitle2">Description</Typography>
                                            </StyledCardContent>

                                            <StyledCardContent
                                                sx={{
                                                    flex: 0.5,
                                                    justifyContent: "center",
                                                    ...fontsTableHeading,
                                                }}
                                            >
                                                <Typography variant="subtitle2">Actions</Typography>
                                            </StyledCardContent>
                                        </EnquiryCard>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {paginatedData.map((item, index) => (
                                        <EnquiryCardBody
                                            key={(page - 1) * rowsPerPage + index}
                                            sx={{
                                                backgroundColor: inputBgColor,
                                                p: 2,
                                                borderRadius: 2,
                                                color: textColor,
                                                display: "flex",
                                                width: "100%",
                                                mb: 1,
                                            }}
                                        >
                                            <StyledCardContent sx={{ flex: 0.6, justifyContent: "center" }}>
                                                <Typography variant="subtitle2" sx={fontsTableBody}>
                                                    {(page - 1) * rowsPerPage + index + 1}
                                                </Typography>
                                            </StyledCardContent>

                                            <StyledCardContent sx={{ flex: 1.9, justifyContent: "center", ...fontsTableBody }}>
                                                <Typography variant="subtitle2">{item.disaster_id}</Typography>
                                            </StyledCardContent>

                                            <StyledCardContent sx={{ flex: 2, justifyContent: "center", ...fontsTableBody }}>
                                                <Typography variant="subtitle2">{item.sop_description || "No Description"}</Typography>
                                            </StyledCardContent>

                                            <StyledCardContent sx={{ flex: 0.5, justifyContent: "center", ...fontsTableBody }}>
                                                <MoreHorizIcon
                                                    sx={{
                                                        color: "#00f0c0",
                                                        cursor: "pointer",
                                                        fontSize: 28,
                                                        justifyContent: "center",
                                                        ...fontsTableBody,
                                                    }}
                                                />
                                            </StyledCardContent>
                                        </EnquiryCardBody>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} px={1}>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="body2" sx={{ color: textColor }}>
                                    Records per page:
                                </Typography>
                                <Select
                                    value={rowsPerPage}
                                    onChange={(e) => {
                                        setRowsPerPage(parseInt(e.target.value, 10));
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
                                        opacity: page > 1 ? 1 : 0.5,
                                    }}
                                >
                                    &#8249;
                                </Box>

                                <Typography variant="body2">
                                    {page} / {totalPages || 1}
                                </Typography>

                                <Box
                                    onClick={() => page < totalPages && setPage(page + 1)}
                                    sx={{
                                        cursor: page < totalPages ? "pointer" : "not-allowed",
                                        userSelect: "none",
                                        opacity: page < totalPages ? 1 : 0.5,
                                    }}
                                >
                                    &#8250;
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={4.9}>
                    <Paper elevation={3} sx={{ padding: 2, borderRadius: 3, backgroundColor: bgColor, mt: 1, mb: 5 }}>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Select
                                select
                                fullWidth
                                size="small"
                                label="Disaster Type"
                                variant="outlined"
                                sx={selectStyles}
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
                            </Select>

                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Discription"
                                InputLabelProps={{ shrink: false }}
                                sx={selectStyles}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, mb: 1 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    mt: 2,
                                    width: "40%",
                                    backgroundColor: "#00f0c0",
                                    color: "black",
                                    fontWeight: "bold",
                                    borderRadius: "12px",
                                    "&:hover": {
                                        backgroundColor: bgColor,
                                        color: "white !important",
                                    },
                                }}
                                onClick={handleSubmit}
                            >
                                Submit
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default SopRegister