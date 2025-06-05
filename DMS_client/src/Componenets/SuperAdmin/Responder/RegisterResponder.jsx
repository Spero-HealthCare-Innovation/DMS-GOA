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

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const userName = localStorage.getItem('userId');

    const [selectedResponders, setSelectedResponders] = useState([]);
    const [selectedDisaster, setSelectedDisaster] = useState(null);
    const [responder, setResponder] = useState([]);
    const [responderTableData, setResponderTableData] = useState([]);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    // Edit
    const [responderID, setResponderID] = useState(null);
    const [isEditMode, setIsEditMode] = useState(false);

    const getResponderData = async () => {
        try {
            const response = await fetch(`${port}/admin_web/Disaster_Responder_get/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token || newToken}`,
                },
            });

            const data = await response.json();
            if (response.status === 200) {
                setResponderTableData(data);
                console.log(data, "SOP");
                setPage(1);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        getResponderData();
    }, [port, token, newToken]);

    const fetchResponder = async () => {
        try {
            const response = await fetch(`${port}/admin_web/responder_get/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token || newToken}`,
                },
            });
            if (response.ok) {
                const data = await response.json();
                setResponder(data);
                console.log("Responder list:", data);
            } else {
                console.error("Failed to fetch responders. Status:", response.status);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    useEffect(() => {
        fetchResponder();
    }, [port, token, newToken]);

    const handleChange = (event) => {
        setSelectedResponders(event.target.value);
    };

    const handleSubmit = async () => {
        const payload = {
            res_id: selectedResponders,
            dis_id: selectedDisaster,
            sop_added_by: userName,
            sop_modified_by: userName
        };

        try {
            const response = await fetch(`${port}/admin_web/Disaster_Responder_post/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token || newToken}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.status === 201) {
                setSnackbarMessage("Responder Registered Successfully");
                setSnackbarOpen(true);
            }
            else if (response.status === 409) {
                setSnackbarMessage("Responder already exists with this disaster type");
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

    const handleUpdate = async () => {
        const payload = {
            res_id: selectedResponders,
            dis_id: selectedDisaster,
            sop_added_by: userName,
            sop_modified_by: userName
        };

        try {
            const response = await fetch(`${port}/admin_web/disaster_responder_put/${responderID}/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token || newToken}`,
                },
                body: JSON.stringify(payload),
            });

            if (response.status === 200) {
                setSnackbarMessage("Responder Data Updated Successfully");
                setSnackbarOpen(true);
                await fetchResponder();
            }
            else if (response.status === 409) {
                setSnackbarMessage("SOP already exists with this disaster type");
                setSnackbarOpen(true);
                // setDescription("");
                // setSelectedDisaster("");
            } else if (response.status === 500) {
                setSnackbarMessage("Internal Server Error");
                setSnackbarOpen(true);
            }
        } catch (error) {
            console.error('Update error:', error);
        }
    };

    /// POP UP 
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);

    const handleClick = (event, row) => {
        setAnchorEl(event.currentTarget);
        setSelectedItem(row);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const handleEdit = async (selectedItem) => {
        const Id = selectedItem.pk_id;
        console.log(Id, "idddddddddd");

        setResponderID(Id);
        setIsEditMode(true);

        try {
            const res = await axios.get(
                `${port}/admin_web/disaster_responder_put/${Id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token || newToken}`,
                    },
                }
            );
            const data = res.data[0];

            setSelectedDisaster(data.dis_id);
            setSelectedResponders(data.res_id);
            // setDescription(data.sop_description);
        } catch (err) {
            console.error("Error fetching department data:", err);
        }
    };

    const handleDelete = async (selectedItem) => {
        try {
            const res = await axios.delete(
                `${port}/admin_web/Disaster_Responder_delete/${selectedItem.pk_id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token || newToken}`,
                    },
                }
            );

            console.log("Delete success:", res.data);
            setSnackbarMessage("Responder Data Deleted Successfully");
            await fetchResponder();
            setSnackbarOpen(true);
            handleClose();
        } catch (err) {
            console.error("Error deleting department:", err);
        }
    };


    const [searchQuery, setSearchQuery] = useState("");

    const filteredData = responderTableData.filter((row) => {
        const disasterMatch = row.disaster_name?.toLowerCase().includes(searchQuery);
        const responderMatch = row.res_id.some((responder) =>
            responder.responder_name?.toLowerCase().includes(searchQuery)
        );
        return disasterMatch || responderMatch;
    });

    const paginatedData = filteredData.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    return (
        <div style={{ marginLeft: "3.5rem" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 2, mt: 3 }}>
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
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
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
                                                    flex: 0.5,
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
                                                    flex: 3,
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
                                    {paginatedData.length > 0 ? (
                                        paginatedData.map((row, index) => (
                                            <EnquiryCardBody
                                                key={row.pk_id}
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
                                                <StyledCardContent sx={{ flex: 0.5, justifyContent: "center" }}>
                                                    <Typography variant="subtitle2" sx={fontsTableBody}>
                                                        {index + 1}
                                                    </Typography>
                                                </StyledCardContent>

                                                <StyledCardContent sx={{ flex: 1.9, justifyContent: "center", ...fontsTableBody }}>
                                                    <Typography variant="subtitle2">{row.disaster_name}</Typography>
                                                </StyledCardContent>

                                                <StyledCardContent sx={{ flex: 3, justifyContent: "left", ...fontsTableBody }}>
                                                    <Typography variant="subtitle2">
                                                        {row.res_id.map((res) => res.responder_name).join(", ")}
                                                    </Typography>
                                                </StyledCardContent>

                                                <StyledCardContent sx={{ flex: 0.5, justifyContent: "center", ...fontsTableBody }}>
                                                    <MoreHorizIcon
                                                        aria-describedby={id}
                                                        onClick={(e) => handleClick(e, row)}
                                                        sx={{
                                                            color: "#00f0c0",
                                                            cursor: "pointer",
                                                            fontSize: 28,
                                                            justifyContent: "center",
                                                        }}
                                                    />
                                                </StyledCardContent>
                                            </EnquiryCardBody>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={4} align="center" sx={{ py: 4, color: textColor }}>
                                                No data found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>

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
                                onClick={() => handleEdit(selectedItem)}
                            >
                                Edit
                            </Button>

                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                startIcon={<DeleteOutline />}
                                onClick={() => handleDelete(selectedItem)}
                            // onClick={() => {
                            //     setDeleteDepId(selectedItem.dep_id);
                            //     setOpenDeleteDialog(true);
                            // }}
                            >
                                Delete
                            </Button>
                        </Popover>

                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={2} px={1}>
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
                                <Box>
                                    {page} / {Math.ceil(filteredData.length / rowsPerPage)}
                                </Box>
                                <Box
                                    onClick={() =>
                                        page < Math.ceil(responderTableData.length / rowsPerPage) &&
                                        setPage(page + 1)
                                    }
                                    sx={{
                                        cursor:
                                            page < Math.ceil(responderTableData.length / rowsPerPage)
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

                <Grid item xs={12} md={4.9}>
                    <Paper elevation={3} sx={{ padding: 2, borderRadius: 3, backgroundColor: bgColor, mt: 1, mb: 5 }}>
                        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={12}>
                                    {isEditMode && (
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "flex-end",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <Button
                                                variant="contained"
                                                sx={{
                                                    mb: 1,
                                                    width: "40%",
                                                    backgroundColor: "#00f0c0",
                                                    color: "black",
                                                    fontWeight: "bold",
                                                    borderRadius: "12px",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                    setSelectedDisaster("");
                                                    setSelectedResponders([]);
                                                }}
                                            >
                                                + Add Responder
                                            </Button>
                                        </Box>
                                    )}
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        size="small"
                                        label="Disaster Type"
                                        variant="outlined"
                                        value={selectedDisaster || ""}
                                        onChange={(e) => setSelectedDisaster(e.target.value)}
                                        SelectProps={{
                                            MenuProps: {
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 250,
                                                        width: '250'
                                                    },
                                                },
                                            },
                                        }}
                                    >
                                        {disaster.map((item) => (
                                            <MenuItem key={item.disaster_id} value={item.disaster_id}>
                                                {item.disaster_name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>

                                <Grid item xs={12} sm={6}>
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
                                                    .filter((res) => selected.includes(res.responder_id))
                                                    .map((res) => res.responder_name)
                                                    .join(", ");
                                            }}
                                            size="small"
                                            inputProps={{ "aria-label": "Select Responder" }}
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 250,
                                                        width: 200,
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem disabled value="">
                                                <em>Select Responder</em>
                                            </MenuItem>
                                            {responder.map((res) => (
                                                <MenuItem key={res.responder_id} value={res.responder_id}>
                                                    <Checkbox checked={selectedResponders.includes(res.responder_id)} />
                                                    <ListItemText primary={res.responder_name} />
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
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
                                onClick={isEditMode ? handleUpdate : handleSubmit}
                            >
                                {isEditMode ? 'Update' : 'Submit'}
                            </Button>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </div>
    )
}

export default RegisterResponder