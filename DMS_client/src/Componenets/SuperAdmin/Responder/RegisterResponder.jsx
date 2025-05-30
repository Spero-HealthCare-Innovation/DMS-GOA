import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Box, Typography, TextField, Button, Paper, InputAdornment, Grid, Popover, Snackbar } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Search, DeleteOutline, EditOutlined, } from "@mui/icons-material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { styled } from "@mui/material/styles";
import { Alert } from '@mui/material';
import { Select, MenuItem } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { useAuth } from "../../../Context/ContextAPI";
import {
    getCustomSelectStyles,
} from "../../../CommonStyle/Style";
import { Checkbox, ListItemText, FormControl, InputLabel } from '@mui/material';


function RegisterResponder({ darkMode }) {
    const port = import.meta.env.VITE_APP_API_KEY;

    const { newToken } = useAuth();
    const [departmentList, setDepartmentList] = useState([]);
    const [departmentId, setDepartmentId] = useState("");
    const [groupName, setGroupName] = useState("");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('success');
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // States for edit functionality
    const [isEditing, setIsEditing] = useState(false);
    const [editingGroupId, setEditingGroupId] = useState(null);
    const [selectedGroup, setSelectedGroup] = useState(null);

    // Determine effective token (context token takes priority)
    const effectiveToken = newToken || localStorage.getItem("access_token");

    const fetchDepartments = async () => {
        try {
            setLoading(true);
            console.log("Using token:", effectiveToken);

            const response = await axios.get(`${port}/admin_web/Department_get/`, {
                headers: {
                    Authorization: `Bearer ${effectiveToken}`,
                },
            });

            console.log(" Departments fetched:", response.data);
            setDepartmentList(response.data);
        } catch (err) {
            console.error(" Error fetching departments:", err);
            if (err.response) {
                console.error("Server Response:", err.response.data);
            }
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (effectiveToken) {
            fetchDepartments();
        } else {
            console.warn("No token found for department fetch.");
        }
    }, [effectiveToken]);

    const textColor = darkMode ? "#ffffff" : "#000000";
    const bgColor = darkMode ? "#0a1929" : "#0a1929";
    const labelColor = darkMode ? "#5FECC8" : "#1976d2";
    const fontFamily = "Roboto, sans-serif";
    const borderColor = darkMode ? "#7F7F7F" : "#ccc";

    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";
    const selectStyles = getCustomSelectStyles(isDarkMode);

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [anchorEl, setAnchorEl] = useState(null);

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

    const paginatedData = groups.slice((page - 1) * rowsPerPage, page * rowsPerPage);
    const open = Boolean(anchorEl);
    const handleClose = () => {
        setAnchorEl(null);
        setSelectedGroup(null);
    };

    const [selectedResponders, setSelectedResponders] = useState([]);

    const [responder] = useState([
        { id: 1, name: "Fire" },
        { id: 2, name: "Cyclone" },
        { id: 3, name: "Rain" },
    ]);

    const handleChange = (event) => {
        setSelectedResponders(event.target.value);
    };

    return (
        <div style={{ marginLeft: "3.5rem" }}>
            <Snackbar
                open={showSuccessAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                autoHideDuration={3000}
                onClose={() => setShowSuccessAlert(false)}
            >
                <Alert
                    onClose={() => setShowSuccessAlert(false)}
                    severity={alertType}
                    variant="filled"
                    sx={{ width: '100%' }}
                >
                    {alertMessage}
                </Alert>
            </Snackbar>

            <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 2, mt: 3 }}>
                <Typography variant="h6" sx={{
                    color: labelColor,
                    fontWeight: 600,
                    fontFamily,
                    fontSize: 16,
                }}>
                    Register Responder
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
                                        <EnquiryCard sx={{
                                            backgroundColor: "#5FECC8",
                                            color: "#000",
                                            display: "flex",
                                            width: "100%",
                                            borderRadius: 2,
                                            p: 2,
                                        }}>
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
                                                <Typography variant="subtitle2">
                                                    Disaster Name
                                                </Typography>
                                            </StyledCardContent>

                                            <StyledCardContent
                                                sx={{
                                                    flex: 2,
                                                    borderRight: "1px solid black",
                                                    justifyContent: "center",
                                                    ...fontsTableHeading,
                                                }}
                                            >
                                                <Typography variant="subtitle2">
                                                    Responder
                                                </Typography>
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
                                    <EnquiryCardBody
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
                                                1
                                            </Typography>
                                        </StyledCardContent>

                                        <StyledCardContent sx={{ flex: 1.9, justifyContent: "center", ...fontsTableBody }}>
                                            <Typography variant="subtitle2">fffffffffffffffffffffff</Typography>
                                        </StyledCardContent>

                                        <StyledCardContent sx={{ flex: 2, justifyContent: "center", ...fontsTableBody }}>
                                            <Typography variant="subtitle2">ffffffffffffffffffffffffff</Typography>
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
                                </TableBody>
                            </Table>
                        </TableContainer>

                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mt={2}
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
                                <Box>{page}/ {Math.ceil(groups.length / rowsPerPage)}</Box>
                                <Box
                                    onClick={() =>
                                        page < Math.ceil(groups.length / rowsPerPage) &&
                                        setPage(page + 1)
                                    }
                                    sx={{
                                        cursor:
                                            page < Math.ceil(groups.length / rowsPerPage)
                                                ? "pointer"
                                                : "not-allowed",
                                        userSelect: "none",
                                    }}
                                >
                                    &#8250;
                                </Box>
                            </Box>
                        </Box>
                    </Paper>
                </Grid>

                <Popover
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: "center",
                        horizontal: "right",
                    }}
                    transformOrigin={{
                        vertical: "center",
                        horizontal: "left",
                    }}
                    PaperProps={{
                        sx: {
                            p: 2,
                            display: "flex",
                            flexDirection: "column",
                            gap: 1.5,
                            borderRadius: 2,
                            minWidth: 120,
                        },
                    }}
                >


                    <Button
                        fullWidth
                        variant="outlined"
                        color="warning"
                        startIcon={<EditOutlined />}
                    >
                        Edit
                    </Button>

                    <Button
                        fullWidth
                        variant="outlined"
                        color="error"
                        startIcon={<DeleteOutline />}
                    >
                        Delete
                    </Button>
                </Popover>

                <Grid item xs={12} md={4.9}>
                    <Paper elevation={3} sx={{ padding: 2, borderRadius: 3, backgroundColor: bgColor, mt: 1, mb: 5 }}>
                        <Typography
                            sx={{
                                color: labelColor,
                                fontWeight: 600,
                                fontSize: 16,
                                mb: 2,
                                fontFamily,
                            }}
                        >
                            {isEditing ? 'Edit SOP' : 'Add SOP'}
                        </Typography>

                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Select
                                fullWidth
                                displayEmpty
                                defaultValue=""
                                inputProps={{ "aria-label": "Select Disaster" }}
                                sx={selectStyles}
                            >
                                <MenuItem value="" disabled>
                                    Select Disaster Type
                                </MenuItem>
                            </Select>

                            <FormControl fullWidth>
                                <Select
                                    multiple
                                    value={selectedResponders}
                                    onChange={handleChange}
                                    displayEmpty
                                    renderValue={(selected) => {
                                        if (selected.length === 0) {
                                            return "Select Responder";
                                        }
                                        return responder
                                            .filter((res) => selected.includes(res.id))
                                            .map((res) => res.name)
                                            .join(", ");
                                    }}
                                    inputProps={{ "aria-label": "Select Responder" }}
                                    sx={selectStyles}
                                >
                                    <MenuItem value="" disabled>
                                        Select Responder
                                    </MenuItem>
                                    {responder.map((res) => (
                                        <MenuItem key={res.id} value={res.id}>
                                            <Checkbox checked={selectedResponders.includes(res.id)} />
                                            <ListItemText primary={res.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, mb: 1 }}>
                            <Button
                                variant="contained"
                                disabled={loading}
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

export default RegisterResponder