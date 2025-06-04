import React,{useState } from 'react'
import { Box, Typography, TextField, Button, Paper, InputAdornment, Grid, Popover, Snackbar } from "@mui/material";
import { Select, MenuItem, IconButton, Popper } from "@mui/material";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useTheme } from "@mui/material/styles";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import DownloadIcon from "@mui/icons-material/Download";
import { Search, ArrowBack, DeleteOutline, EditOutlined, AddCircleOutline } from "@mui/icons-material";
import {
    TableDataCardBody,
    TableHeadingCard,
    CustomTextField,
    getThemeBgColors,
    textfieldInputFonts,
    fontsTableBody,
    getCustomSelectStyles,
    fontsTableHeading,
    StyledCardContent,
    inputStyle,
    EnquiryCardBody,
    EnquiryCard,

} from "./../../../CommonStyle/Style";

function ClosureDetail({ darkMode ,fromDate, toDate, onChange, onSubmit, onDownload }) {
    const textColor = darkMode ? "#ffffff" : "#000000";
    const bgColor = darkMode ? "#0a1929" : "#ffffff";
    const labelColor = darkMode ? "#5FECC8" : "#1976d2";
    const fontFamily = "Roboto, sans-serif";
    const borderColor = darkMode ? "#7F7F7F" : "#ccc";

    const theme = useTheme();
    const isDarkMode = theme.palette.mode === "dark";
    const selectStyles = getCustomSelectStyles(isDarkMode);
     const inputBgColor = darkMode
    ? "rgba(255, 255, 255, 0.16)"
    : "rgba(0, 0, 0, 0.04)";

    const [formData, setFormData] = useState({
  fromDate: null,
  toDate: null,
});

const handleChange = (field, value) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
};

    const mockData = [
        {
            incidentId: "INC001",
            disasterType: "Flood",
            startBaseLocation: "Base A",
            atScene: "10:00 AM",
            fromScene: "10:30 AM",
            backToBase: "11:00 AM",
            remark: "Handled well",
        },
        {
            incidentId: "INC002",
            disasterType: "Cyclone",
            startBaseLocation: "Base B",
            atScene: "12:00 PM",
            fromScene: "12:45 PM",
            backToBase: "01:15 PM",
            remark: "Evacuation done",
        },
        // Add more objects to test pagination
    ];

    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const paginatedData = mockData.slice(
        (page - 1) * rowsPerPage,
        page * rowsPerPage
    );

    const totalPages = Math.ceil(mockData.length / rowsPerPage);


    return (
        <div style={{ marginLeft: "3.5rem" }}>
          

<LocalizationProvider dateAdapter={AdapterDateFns}>
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap", // handles responsiveness
      gap: 2,
      pb: 2,
      mt: 3,
    }}
  >
    {/* Back Button */}
    <IconButton
      size="small"
      onClick={() => {/* handle back */ }}
      sx={{
        backgroundColor: "#00f0c0",
        color: "#fff",
        "&:hover": {
          backgroundColor: "#00d8ac",
        },
        width: 30,
        height: 30,
      }}
    >
      <ArrowBackIosIcon
        sx={{ fontSize: 20, color: darkMode ? "#fff" : "#000" }}
      />
    </IconButton>

    {/* Title */}
    <Typography
      variant="h6"
      sx={{
        color: labelColor,
        fontWeight: 600,
        fontFamily,
        fontSize: 16,
        minWidth: "120px",
      }}
    >
      Closure Detail
    </Typography>

    {/* Search Field */}
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
        width: "200px",
        "& .MuiOutlinedInput-root": {
          borderRadius: "25px",
          backgroundColor: darkMode ? "#1e293b" : "#fff",
          color: darkMode ? "#fff" : "#000",
          px: 1,
          py: 0.2,
          height: "35px", // reduced height
        },
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: darkMode ? "#444" : "#ccc",
        },
        "& input": {
          padding: "6px 8px",
          fontSize: "13px",
        },
      }}
    />

    {/* From Date */}
    <DatePicker
      label="From Date"
      value={fromDate}
      onChange={(newValue) => onChange("fromDate", newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="From Date"
          size="small"
           InputProps={{
        ...params.InputProps,
        sx: {
          borderRadius: "25px",
          backgroundColor: darkMode ? "#1e293b" : "#fff",
          color: darkMode ? "#fff" : "#000",
          height: "35px",
          px: 1,
          py: 0.2,
          "& input": {
            padding: "6px 8px",
            fontSize: "13px",
            color: darkMode ? "#fff" : "#000",
          },
          "& .MuiSvgIcon-root": {
            color: darkMode ? "#ccc" : "#555",
          },
        },
      }}
      sx={{
        width: "200px",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: darkMode ? "#444" : "#ccc",
        },
      }}
        />
      )}
    />

    {/* To Date */}
    <DatePicker
      label="To Date"
      value={toDate}
      onChange={(newValue) => onChange("toDate", newValue)}
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder="To Date"
          size="small"
           InputProps={{
        ...params.InputProps,
        sx: {
          borderRadius: "25px",
          backgroundColor: darkMode ? "#1e293b" : "#fff",
          color: darkMode ? "#fff" : "#000",
          height: "35px",
          px: 1,
          py: 0.2,
          "& input": {
            padding: "6px 8px",
            fontSize: "13px",
            color: darkMode ? "#fff" : "#000",
          },
          "& .MuiSvgIcon-root": {
            color: darkMode ? "#ccc" : "#555",
          },
        },
      }}
      sx={{
        width: "200px",
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: darkMode ? "#444" : "#ccc",
        },
      }}
        />
      )}
    />

    {/* Submit */}
    <Button
      variant="contained"
      color="primary"
      size="small"
      sx={{ height: 35, minWidth: 100 }}
      onClick={onSubmit}
    >
      Submit
    </Button>

    {/* Download */}
    <Button
      variant="outlined"
      color="success"
      startIcon={<DownloadIcon />}
      size="small"
      sx={{ height: 35, minWidth: 130 }}
      onClick={onDownload}
    >
      Download
    </Button>
  </Box>
</LocalizationProvider>

            <Grid item xs={12} md={7}>
                <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, backgroundColor: bgColor, mt: 1, mb: 5 }}>
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
                                        p: 3,
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
                                                flex: 1.5,
                                                borderRight: "1px solid black",
                                                justifyContent: "center",
                                                ...fontsTableHeading,
                                            }}
                                        >
                                            <Typography variant="subtitle2">
                                                Incident ID
                                            </Typography>
                                        </StyledCardContent>

                                        <StyledCardContent
                                            sx={{
                                                flex: 1.6,
                                                borderRight: "1px solid black",
                                                justifyContent: "center",
                                                ...fontsTableHeading,
                                            }}
                                        >
                                            <Typography variant="subtitle2">
                                                Disaster Type
                                            </Typography>
                                        </StyledCardContent>
                                        <StyledCardContent
                                            sx={{
                                                flex: 1.6,
                                                borderRight: "1px solid black",
                                                justifyContent: "center",
                                                ...fontsTableHeading,
                                            }}
                                        >
                                            <Typography variant="subtitle2">
                                                Start Base Location
                                            </Typography>
                                        </StyledCardContent>
                                        <StyledCardContent
                                            sx={{
                                                flex: 1.6,
                                                borderRight: "1px solid black",
                                                justifyContent: "center",
                                                ...fontsTableHeading,
                                            }}
                                        >
                                            <Typography variant="subtitle2">
                                                At Scene
                                            </Typography>
                                        </StyledCardContent>
                                        <StyledCardContent
                                            sx={{
                                                flex: 1.6,
                                                borderRight: "1px solid black",
                                                justifyContent: "center",
                                                ...fontsTableHeading,
                                            }}
                                        >
                                            <Typography variant="subtitle2">
                                                From Scene
                                            </Typography>
                                        </StyledCardContent>
                                        <StyledCardContent
                                            sx={{
                                                flex: 1.6,
                                                borderRight: "1px solid black",
                                                justifyContent: "center",
                                                ...fontsTableHeading,
                                            }}
                                        >
                                            <Typography variant="subtitle2">
                                                Back to Base
                                            </Typography>
                                        </StyledCardContent>
                                        <StyledCardContent
                                            sx={{
                                                flex: 1.6,
                                                // borderRight: "1px solid black",
                                                justifyContent: "center",
                                                ...fontsTableHeading,
                                            }}
                                        >
                                            <Typography variant="subtitle2">
                                                Remark
                                            </Typography>
                                        </StyledCardContent>

                                        {/* <StyledCardContent
                              sx={{
                                flex: 1,
                                justifyContent: "center",
                                ...fontsTableHeading,
                              }}
                            >
                              <Typography variant="subtitle2">Actions</Typography>
                            </StyledCardContent> */}
                                    </EnquiryCard>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {paginatedData.length === 0 ? (
                                    <Box p={2}>
                                        <Typography align="center" color="textSecondary">
                                            {searchTerm ? 'No groups found matching your search.' : 'No groups available.'}
                                        </Typography>
                                    </Box>
                                ) : (
                                    paginatedData.map((item, index) => (
                                        <EnquiryCardBody
                                            key={index}
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
                                            <StyledCardContent sx={{ flex: 2, justifyContent: "center", ...fontsTableBody }}>
                                                <Typography variant="subtitle2">11111111111</Typography>
                                            </StyledCardContent>
                                            <StyledCardContent sx={{ flex: 2, justifyContent: "center", ...fontsTableBody }}>
                                                <Typography variant="subtitle2">Cyclone</Typography>
                                            </StyledCardContent>
                                            <StyledCardContent sx={{ flex: 2, justifyContent: "center", ...fontsTableBody }}>
                                                <Typography variant="subtitle2">12-052025</Typography>
                                            </StyledCardContent>
                                            <StyledCardContent sx={{ flex: 2, justifyContent: "center", ...fontsTableBody }}>
                                                <Typography variant="subtitle2">7777jjj</Typography>
                                            </StyledCardContent>
                                            <StyledCardContent sx={{ flex: 2, justifyContent: "center", ...fontsTableBody }}>
                                                <Typography variant="subtitle2">nsjdn</Typography>
                                            </StyledCardContent>
                                            <StyledCardContent sx={{ flex: 2, justifyContent: "center", ...fontsTableBody }}>
                                                <Typography variant="subtitle2">sdnajkcsdn</Typography>
                                            </StyledCardContent>
                                            <StyledCardContent sx={{ flex: 2, justifyContent: "center", ...fontsTableBody }}>
                                                <Typography variant="subtitle2">asjdbjk</Typography>
                                            </StyledCardContent>



                                            {/* <StyledCardContent sx={{ flex: 1.2, justifyContent: "center", ...fontsTableBody }}>
                                <MoreHorizIcon
                                  onClick={(e) => handleOpen(e, item)}
                                  sx={{
                                    color: "#00f0c0",
                                    cursor: "pointer",
                                    fontSize: 28,
                                    justifyContent: "center",
                                    ...fontsTableBody,
                                  }}
                                />
                              </StyledCardContent> */}
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
                        px={1}
                    >
                        {/* Records Per Page */}
                        <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2" sx={{ color: textColor }}>
                                Records per page:
                            </Typography>
                            <Select
                                value={rowsPerPage}
                                onChange={(e) => {
                                    setRowsPerPage(parseInt(e.target.value));
                                    setPage(1); // Reset to first page on limit change
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

                        {/* Page Navigation - Updated to use filteredGroups */}
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
                                }}>
                                &#8249;
                            </Box>
                            <Box>{page} / {totalPages}</Box>
                            <Box
                                onClick={() => page < totalPages && setPage(page + 1)}
                                sx={{
                                    cursor: page < totalPages ? "pointer" : "not-allowed",
                                    userSelect: "none",
                                }}>
                                &#8250;
                            </Box>
                        </Box>
                    </Box>
                </Paper>
            </Grid>
        </div>
    )
}

export default ClosureDetail
