import { useState, useEffect, useMemo } from "react";
import axios from 'axios';
import { Box, Typography, TextField, Button, Paper, InputAdornment, Grid, Popover, Snackbar } from "@mui/material";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Search, ArrowBack, DeleteOutline, EditOutlined, AddCircleOutline, } from "@mui/icons-material";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Alert } from '@mui/material';
import { styled } from "@mui/material/styles";
import dayjs from 'dayjs';
import { Select, MenuItem, IconButton, Popper } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useTheme } from "@mui/material/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
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

} from "../../../../CommonStyle/Style";
import { useAuth } from './../../../../Context/ContextAPI';

function Add_employee({ darkMode }) {
  const port = import.meta.env.VITE_APP_API_KEY;

  const {
    states,
    districts,
    Tehsils,
    Citys,
    selectedStateId,
    selectedDistrictId,
    selectedTehsilId,
    selectedCityID,
    setSelectedStateId,
    setSelectedDistrictId,
    setSelectedTehsilId,
    setSelectedCityId,
    loading,
    error,
  } = useAuth();


  const textColor = darkMode ? "#ffffff" : "#000000";
  const bgColor = darkMode ? "#0a1929" : "#ffffff";
  const labelColor = darkMode ? "#5FECC8" : "#1976d2";
  const fontFamily = "Roboto, sans-serif";
  const borderColor = darkMode ? "#7F7F7F" : "#ccc";
  const theme = useTheme();
  const isDarkMode = theme.palette.mode === "dark";
  const selectStyles = getCustomSelectStyles(isDarkMode);

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const inputBgColor = darkMode
    ? "rgba(255, 255, 255, 0.16)"
    : "rgba(0, 0, 0, 0.04)";

  const [isEditMode, setIsEditMode] = useState(false);
  const [empName, setEmpName] = useState('');
  const [empContact, setEmpContact] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empDOJ, setEmpDOJ] = useState('');
  const [empDOB, setEmpDOB] = useState('');
  const [groupId, setGroupId] = useState('');
  const [employees, setEmployees] = useState([]);
  const { newToken } = useAuth();
  const effectiveToken = newToken || localStorage.getItem("access_token");
  const [isEditing, setIsEditing] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [showUpdateAlert, setShowUpdateAlert] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [groupList, setGroupList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success'); // or 'error'

  const userName = localStorage.getItem("userId");
  console.log(userName, "userName");



  // Format date properly for API submission
  const formatDate = (date) => {
    if (!date) return '';
    try {
      const d = new Date(date);
      return d.toISOString().split('T')[0]; // gets YYYY-MM-DD
    } catch (err) {
      console.error("Date formatting error:", err);
      return '';
    }
  };
  const formattedDOB = formatDate(empDOB);
  const formattedDOJ = formatDate(empDOJ);


  const handleStateChange = (e) => {
    setSelectedStateId(e.target.value);
  };

  const handleDistrictChange = (e) => {
    setSelectedDistrictId(e.target.value);
  };

  const handleTehsilChange = (e) => {
    setSelectedTehsilId(e.target.value);
  };

  const handleCityChange = (e) => {
    setSelectedCityId(e.target.value);
  };


  const open = Boolean(anchorEl);
  const handleOpen = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedEmployee(item);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedEmployee(null);
  };

  const initialEmployeeData = [
    {
      empName: "Akshata",
      empContact: "9876543212",
      empDOJ: "22-02-25",
      groupID: "G-2323",
      state: "maharashtra"
    },
    {
      empName: "Sneha",
      empContact: "9876543212",
      empDOJ: "22-02-25",
      groupID: "G-2323",
      state: "maharashtra"
    }
  ]


  // Function to show alert
  const showAlertMessage = (message, type = 'success') => {
    setAlertMessage(message);
    setAlertType(type); // "success" or "error"
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };


  const handleSubmit = async () => {

    if (!validateForm()) {
      showAlertMessage("Please fix the form errors before submitting.", 'error');
      return;
    }


    if (!empName || !empContact || !empEmail || !empDOJ || !empDOB || !groupId ||
      !selectedStateId || !selectedDistrictId || !selectedTehsilId || !selectedCityID) {
      alert("Please fill all required fields");
      return;
    }

    // Generate a unique username based on name and timestamp
    const timestamp = new Date().getTime();
    const uniqueUsername = `${empName.replace(/\s+/g, '_').toLowerCase()}`;

    const payload = {
      emp_username: uniqueUsername, // Use unique username to avoid conflict
      grp_id: groupId,
      emp_email: empEmail, // Generate unique email to avoid conflict
      emp_name: empName,
      emp_contact_no: empContact,
      emp_doj: formatDate(empDOJ),
      emp_dob: formatDate(empDOB),
      emp_is_login: "0",
      state_id: selectedStateId,
      dist_id: selectedDistrictId,
      tahsil_id: selectedTehsilId,
      city_id: selectedCityID,
      emp_is_deleted: "0",
      emp_added_by: userName,
      emp_modified_by: userName,
      password: "DMS@Spero",
      password2: "DMS@Spero"
    };

    try {
      console.log("Sending employee data:", payload);
      const res = await axios.post(`${port}/admin_web/employee_post/`, payload);
      console.log("Employee Registered:", res.data);

      // Get state name from the states array
      const stateName = states.find(state => state.state_id === selectedStateId)?.state_name || "Unknown";

      await fetchEmployees();
      setShowSuccessAlert(true);

      // Optional: Auto-hide after 3 seconds
      setTimeout(() => setShowSuccessAlert(false), 3000);

      // Reset form after successful submission
      setEmpName('');
      setEmpContact('');
      setEmpEmail('');
      setEmpDOJ('');
      setEmpDOB('');
      setGroupId('');
      setSelectedStateId('');
      setSelectedDistrictId('');
      setSelectedTehsilId('');
      setSelectedCityId('');

    } catch (err) {
      console.error("Error creating employee:", err.response?.data || err.message);

      if (err.response) {
        const statusCode = err.response.status;
        const errorData = err.response.data;
        let errorMessage = "Failed to add employee:\n";

        if (statusCode === 409) {
          if (errorData.emp_username) {
            errorMessage += `- Username already exists\n`;
          }
          if (errorData.emp_email) {
            errorMessage += `- Email already exists\n`;
          }
          if (errorData.detail === "Employee with this emp_name already exists.") {
            errorMessage += `- Employee name already exists\n`;
          }
        } else {
          errorMessage += errorData.detail || "Unexpected server error.";
        }

        showAlertMessage(errorMessage, 'error');
      } else {
        showAlertMessage("Failed to add employee. Please check the console for details.", 'error');
      }
    }


  };

  // const paginatedData = employees; 

  const fetchEmployees = async () => {
    try {
      const response = await axios.get(`${port}/admin_web/employee_get/`, {
        headers: {
          Authorization: `Bearer ${effectiveToken}`, // Replace with actual token variable
        },
      });

      const employeeData = response.data.map(emp => {
        const stateName = states.find(state => state.state_id === emp.state_id)?.state_name || "Unknown";

        return {
          empName: emp.emp_name,
          empContact: emp.emp_contact_no,
          empDOJ: dayjs(emp.emp_doj).format("DD-MM-YY"),
          groupID: emp.grp_name,
          state: stateName,
          fullData: emp,
        };
      });
      console.log(`${port}/admin_web/employee_get/`);

      setEmployees(employeeData);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };


  useEffect(() => {
    fetchEmployees();
  }, []);

  // 1. Add validation functions at the top of your component
  const validateName = (value) => {
    // Only allow letters, spaces, and common name characters
    const nameRegex = /^[a-zA-Z\s.''-]+$/;
    return nameRegex.test(value);
  };

  const validateContact = (value) => {
    // Only allow numbers and common phone formatting characters
    const contactRegex = /^[0-9+\-\s()]+$/;
    return contactRegex.test(value) && value.replace(/\D/g, '').length >= 10;
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  // 2. Add new state for form validation
  const [formErrors, setFormErrors] = useState({
    empName: '',
    empContact: '',
    empEmail: ''
  });

  // 3. Add validation helper function
  const validateForm = () => {
    const errors = {};

    if (!empName.trim()) {
      errors.empName = 'Employee name is required';
    } else if (!validateName(empName)) {
      errors.empName = 'Please enter a valid name (letters only)';
    }

    if (!empContact.trim()) {
      errors.empContact = 'Contact number is required';
    } else if (!validateContact(empContact)) {
      errors.empContact = 'Please enter a valid contact number';
    }

    if (!empEmail.trim()) {
      errors.empEmail = 'Email is required';
    } else if (!validateEmail(empEmail)) {
      errors.empEmail = 'Please enter a valid email address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // / 4. Add new function to handle "Add New Employee" button click
  const handleAddNewEmployee = () => {
    // Reset form
    setEmpName('');
    setEmpContact('');
    setEmpEmail('');
    setEmpDOJ('');
    setEmpDOB('');
    setGroupId('');
    setSelectedStateId('');
    setSelectedDistrictId('');
    setSelectedTehsilId('');
    setSelectedCityId('');

    // Reset editing state
    setIsEditing(false);
    setEditingEmployeeId(null);

    // Clear form errors
    setFormErrors({
      empName: '',
      empContact: '',
      empEmail: ''
    });
  };

  const handleUpdate = async () => {

    if (!validateForm()) {
      showAlertMessage("Please fix the form errors before updating.", 'error');
      return;
    }

    // Create payload with only fields that have values
    const payload = {};

    if (empName) payload.emp_name = empName;
    if (groupId) payload.grp_id = groupId;
    if (empEmail) payload.emp_email = empEmail;
    if (empContact) payload.emp_contact_no = empContact;
    if (empDOJ) payload.emp_doj = formatDate(empDOJ);
    if (empDOB) payload.emp_dob = formatDate(empDOB);
    if (selectedStateId) payload.state_id = selectedStateId;
    if (selectedDistrictId) payload.dist_id = selectedDistrictId;
    if (selectedTehsilId) payload.tahsil_id = selectedTehsilId;
    if (selectedCityID) payload.city_id = selectedCityID;

    payload.emp_modified_by = userName;


    try {
      const res = await axios.put(`${port}/admin_web/employee_put/${editingEmployeeId}/`, payload, {
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
        },
      });

      console.log("Employee Updated:", res.data);

      // Show success message
      setShowUpdateAlert(true);
      setTimeout(() => setShowUpdateAlert(false), 3000);

      // Reset form and editing state
      handleCancel();

      // Refresh employee list
      await fetchEmployees();

    } catch (err) {
      console.error("Error updating employee:", err.response?.data || err.message);

      const errorMsg = err.response?.data?.detail || "Failed to update employee.";
      showAlertMessage(errorMsg, 'error');
    }

  };


  // 7. Add handleCancel function
  const handleCancel = () => {
    // Reset all form fields
    setEmpName('');
    setEmpContact('');
    setEmpEmail('');
    setEmpDOJ('');
    setEmpDOB('');
    setGroupId('');
    setSelectedStateId('');
    setSelectedDistrictId('');
    setSelectedTehsilId('');
    setSelectedCityId('');

    // Reset editing state
    setIsEditing(false);
    setEditingEmployeeId(null);

    setFormErrors({
      empName: '',
      empContact: '',
      empEmail: ''
    });
  };



  // 1. Add this useEffect after your existing useEffects to handle dependent dropdowns in edit mode
  useEffect(() => {
    if (isEditing && selectedStateId) {
      // This will trigger district loading when state is selected in edit mode
      console.log("State selected in edit mode:", selectedStateId);
    }
  }, [selectedStateId, isEditing]);

  useEffect(() => {
    if (isEditing && selectedDistrictId) {
      // This will trigger tehsil loading when district is selected in edit mode
      console.log("District selected in edit mode:", selectedDistrictId);
    }
  }, [selectedDistrictId, isEditing]);

  useEffect(() => {
    if (isEditing && selectedTehsilId) {
      // This will trigger city loading when tehsil is selected in edit mode
      console.log("Tehsil selected in edit mode:", selectedTehsilId);
    }
  }, [selectedTehsilId, isEditing]);

  useEffect(() => {
    if (isEditing && selectedCityID) {
      // This will ensure city is properly selected in edit mode
      console.log("City selected in edit mode:", selectedCityID);
    }
  }, [selectedCityID, isEditing]);



  const fetchGroups = async () => {
    try {
      setLoading1(true);
      console.log("Using token:", effectiveToken);

      const response = await axios.get(`${port}/admin_web/Group_get/`, {
        headers: {
          Authorization: `Bearer ${effectiveToken}`,
        },
      });

      console.log(" Groups fetched:", response.data);
      setGroupList(response.data);
    } catch (err) {
      console.error(" Error fetching groups:", err);
      if (err.response) {
        console.error("Server Response:", err.response.data);
      }
      setError(err);
    } finally {
      setLoading1(false);
    }
  };

  useEffect(() => {
    if (effectiveToken) {
      fetchGroups();
    } else {
      console.warn("No token found for department fetch.");
    }
  }, [effectiveToken]);


  const filteredEmployees = employees.filter(employee =>
    employee.empName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const paginatedData = filteredEmployees;

  return (
    <div style={{ marginLeft: "3.5rem" }}>
      <Snackbar
        open={showAlert}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
      >
        <Alert
          onClose={() => setShowAlert(false)}
          severity={alertType} // "success" or "error"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {alertMessage}
        </Alert>
      </Snackbar>


      <Box sx={{ display: "flex", alignItems: "center", gap: 2, pb: 2, mt: 3 }}>

        {/* Back Arrow */}
        <IconButton size="small" onClick={() => {/* handle back action here */ }} sx={{
          backgroundColor: "#00f0c0",
          color: "#fff",
          "&:hover": {
            backgroundColor: "#00d8ac",
          },
          width: 30,
          height: 30,
        }}>
          <ArrowBackIosIcon sx={{ fontSize: 20, color: darkMode ? "#fff" : "#000", }} />
        </IconButton>

        {/* Label */}

        <Typography
          sx={{
            color: labelColor,
            fontWeight: 600,
            fontSize: 16,
            fontFamily,
          }}
        >
          {isEditing ? "Edit Employee" : "Add Employee"}
        </Typography>
        <TextField
          variant="outlined"
          size="small"
          placeholder="Search by Emp Name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "gray", fontSize: 18 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            width: "200px",
            ml: 5,
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
          <Paper elevation={3} sx={{ padding: 3, borderRadius: 3, backgroundColor: bgColor, mt: 1, mb: 1 }}>
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
                          flex: 0.9,
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
                          Emp  Name
                        </Typography>
                      </StyledCardContent>
                      <StyledCardContent
                        sx={{
                          flex: 2.5,
                          borderRight: "1px solid black",
                          justifyContent: "center",
                          ...fontsTableHeading,
                        }}
                      >
                        <Typography variant="subtitle2">
                          Emp Contact
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
                          Group Name
                        </Typography>
                      </StyledCardContent>

                      <StyledCardContent
                        sx={{
                          flex: 1.2,
                          justifyContent: "center",
                          ...fontsTableHeading,
                        }}
                      >
                        <Typography variant="subtitle2">
                          Action
                        </Typography>
                      </StyledCardContent>
                    </EnquiryCard>
                  </TableRow>
                </TableHead>


                <TableBody>
                  {filteredEmployees.length === 0 ? (
                    <Box p={2}>
                      <Typography align="center" color="textSecondary">
                        {searchTerm ? "No employees found matching your search." : "No employees available."}
                      </Typography>
                    </Box>
                  ) : (
                    filteredEmployees
                      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                      .map((item, index) => (

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
                          <StyledCardContent
                            sx={{ flex: 0.6, justifyContent: "center" }}
                          >
                            <Typography variant="subtitle2" sx={fontsTableBody}>
                              {(page - 1) * rowsPerPage + index + 1}
                            </Typography>
                          </StyledCardContent>

                          <StyledCardContent
                            sx={{
                              flex: 2,
                              justifyContent: "center",
                              ...fontsTableBody,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {item.empName}
                            </Typography>
                          </StyledCardContent>
                          <StyledCardContent
                            sx={{
                              flex: 2,
                              justifyContent: "center",
                              ...fontsTableBody,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {item.empContact}
                            </Typography>
                          </StyledCardContent>


                          <StyledCardContent
                            sx={{
                              flex: 2,
                              justifyContent: "center",
                              ...fontsTableBody,
                            }}
                          >
                            <Typography variant="subtitle2">
                              {item.groupID}
                            </Typography>
                          </StyledCardContent>

                          <StyledCardContent
                            sx={{
                              flex: 1,
                              justifyContent: "center",
                              ...fontsTableBody,
                            }}
                          >
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
                          </StyledCardContent>
                        </EnquiryCardBody>
                      ))
                  )}
                  {/* {paginatedData.map((item, index) => ( */}

                  {/* // ))} */}
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

              {/* Page Navigation */}
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
                <Box><Box>{page}/ {Math.ceil(filteredEmployees.length / rowsPerPage)}</Box></Box>
                <Box
                  onClick={() =>
                    page < Math.ceil(filteredEmployees.length / rowsPerPage) &&
                    setPage(page + 1)
                  }
                  sx={{
                    cursor:
                      page < Math.ceil(employees.length / rowsPerPage)
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
            color="error"
            startIcon={<DeleteOutline />}
            onClick={async () => {
              if (selectedEmployee && selectedEmployee.fullData) {
                try {
                  await axios.delete(`${port}/admin_web/employee_delete/${selectedEmployee.fullData.emp_id}/`, {
                    headers: {
                      Authorization: `Bearer ${effectiveToken}`,
                    },
                  });

                  // Show success message
                  setShowDeleteAlert(true);
                  setTimeout(() => setShowDeleteAlert(false), 3000);

                  // Refresh employee list
                  await fetchEmployees();
                } catch (error) {
                  console.error("Error deleting employee:", error);
                  alert("Failed to delete employee");
                }
              }
              handleClose();
            }}
          >
            Delete
          </Button>

          <Button
            fullWidth
            variant="outlined"
            color="warning"
            startIcon={<EditOutlined />}
            onClick={async () => {
              if (selectedEmployee && selectedEmployee.fullData) {
                const empData = selectedEmployee.fullData;

                // First populate basic fields
                setEmpName(empData.emp_name);
                setEmpContact(empData.emp_contact_no);
                setEmpEmail(empData.emp_email);
                setEmpDOJ(empData.emp_doj);
                setEmpDOB(empData.emp_dob);
                setGroupId(empData.grp_id);

                // Set editing mode first
                setIsEditing(true);
                setEditingEmployeeId(empData.emp_id);

                // Then set location IDs in sequence to trigger dependent loading
                setSelectedStateId(empData.state_id);

                // Use setTimeout to ensure state is set before setting district
                setTimeout(() => {
                  setSelectedDistrictId(empData.dist_id);
                }, 100);

                setTimeout(() => {
                  setSelectedTehsilId(empData.tahsil_id);
                }, 200);

                setTimeout(() => {
                  setSelectedCityId(empData.city_id);
                }, 300);
              }
              handleClose();
            }}
          >
            Edit
          </Button>
        </Popover>

        <Grid item xs={12} md={4.9}>
          <Paper elevation={3} sx={{ padding: 2, borderRadius: 3, backgroundColor: bgColor, mt: 1, mb: 5 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >

              <Typography
                sx={{
                  color: labelColor,
                  fontWeight: 600,
                  fontSize: 18,
                  fontFamily,
                }}
              >
                {isEditing ? "Edit Employee" : "Add Employee"}
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddCircleOutline />}
                disabled={!isEditing} // Show only when in editing mode
                onClick={handleAddNewEmployee}
                sx={{
                  backgroundColor: "#5FECC8",
                  color: "#000",
                  fontWeight: 600,
                  fontFamily: "Roboto",
                  textTransform: "none",
                  "&:hover": {
                    backgroundColor: "#4ddbb6",
                  },
                }}
              >
                Add New Employee
              </Button>
            </Box>



            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* First TextField */}
              <TextField
                fullWidth
                value={empName}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || validateName(value)) {
                    setEmpName(value);
                    if (formErrors.empName) {
                      setFormErrors(prev => ({ ...prev, empName: '' }));
                    }
                  }
                }}
                placeholder="Employee Name"
              
                InputLabelProps={{ shrink: false }}
                sx={inputStyle}
              />
              {/* Second TextField */}
              <TextField
                fullWidth
                placeholder="Emp Contact No"
                value={empContact}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || validateContact(value)) {
                    setEmpContact(value);
                    if (formErrors.empContact) {
                      setFormErrors(prev => ({ ...prev, empContact: '' }));
                    }
                  }
                }}
            
                sx={inputStyle}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* First TextField */}
              <TextField
                fullWidth
                placeholder="Employee Email"
                value={empEmail}
                onChange={(e) => {
                  const value = e.target.value;
                  setEmpEmail(value);
                  if (formErrors.empEmail) {
                    setFormErrors(prev => ({ ...prev, empEmail: '' }));
                  }
                }}
             
                sx={inputStyle}
              />
              {/* Second TextField */}

              <TextField
                fullWidth
                type="date"
                value={empDOJ}
                onChange={(e) => setEmpDOJ(e.target.value)}
                sx={{
                  ...selectStyles,
                  "& input[type='date']::-webkit-calendar-picker-indicator": {
                    opacity: 0,
                    cursor: "pointer"
                  },
                  "& input[type='date']": {
                    color: empDOJ ? (darkMode ? "#9e9e9e" : "#000") : "transparent",
                    fontSize: "13px",
                  },
                  "& input[type='date']:focus": {
                    color: darkMode ? "#000" : "#000",
                  },
                  "& input[type='date']:before": {
                    content: empDOJ ? '""' : '"Employee DOJ"',
                    color: "#9e9e9e",
                    position: "absolute",
                    fontSize: "13px",
                  }
                }}
                InputProps={{
                  placeholder: "Employee DOJ"
                }}
                onFocus={(e) => {
                  e.target.showPicker();
                }}
              />
            </Box>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* First TextField */}


              <Select
                value={groupId}
                onChange={(e) => setGroupId(e.target.value)}
                fullWidth
                displayEmpty
                placeholder="Select Group"
                defaultValue=""
                inputProps={{
                  "aria-label": "Select Group",
                }}
                sx={selectStyles}
                IconComponent={KeyboardArrowDownIcon} // Use outlined dropdown arrow
              >
                <MenuItem value="" disabled sx={inputStyle}>
                  Group Name
                </MenuItem>


                {groupList.map((group) => (
                  <MenuItem key={group.grp_id} value={group.grp_id.toString()}>
                    {group.grp_name}
                  </MenuItem>
                ))}




                {/* Add more options as needed */}
              </Select>
              <Select
                value={selectedStateId}
                onChange={handleStateChange}
                fullWidth
                displayEmpty
                placeholder="Select State"
                defaultValue=""
                inputProps={{
                  "aria-label": "Select State",
                }}
                sx={selectStyles}
                IconComponent={KeyboardArrowDownIcon} // Use outlined dropdown arrow
              >
                <MenuItem value="" disabled sx={inputStyle}>
                  Select State
                </MenuItem>
                {states.map(state => (
                  <MenuItem key={state.state_id} value={state.state_id}>{state.state_name}</MenuItem>
                ))}


                {/* Add more options as needed */}
              </Select>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* First Dropdown */}
              <Select
                fullWidth
                displayEmpty
                placeholder="Select District"
                defaultValue=""
                value={selectedDistrictId}
                onChange={handleDistrictChange}
                inputProps={{
                  "aria-label": "Select Name",
                }}
                sx={selectStyles}
                IconComponent={KeyboardArrowDownIcon} // Use outlined dropdown arrow
              >
                <MenuItem value="" disabled>
                  Select District
                </MenuItem>
                {districts.map((district) => (
                  <MenuItem key={district.dis_id} value={district.dis_id}>
                    {district.dis_name}
                  </MenuItem>
                ))}
                {/* Add more options as needed */}
              </Select>

              {/* Second Dropdown */}
              <Select
                fullWidth
                value={selectedTehsilId}
                onChange={handleTehsilChange}
                displayEmpty
                placeholder="Select Tehsil"
                defaultValue=""
                inputProps={{
                  "aria-label": "Select Name",
                }}
                sx={selectStyles}
                IconComponent={KeyboardArrowDownIcon} // Use outlined dropdown arrow
              >
                <MenuItem value="" disabled>
                  Select Tehsil
                </MenuItem>
                {Tehsils.map((tehsil) => (
                  <MenuItem key={tehsil.tah_id} value={tehsil.tah_id}>
                    {tehsil.tah_name}
                  </MenuItem>
                ))}


                {/* Add more options as needed */}
              </Select>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              {/* First Dropdown */}
              <Select
                fullWidth
                displayEmpty
                value={selectedCityID}
                onChange={handleCityChange}
                placeholder="Select City"
                defaultValue=""
                inputProps={{
                  "aria-label": "Select Name",
                }}
                sx={selectStyles}
                IconComponent={KeyboardArrowDownIcon} // Use outlined dropdown arrow
              >
                <MenuItem value="" disabled>
                  Select City
                </MenuItem>

                {Citys.map((city) => (
                  <MenuItem key={city.cit_id} value={city.cit_id}>
                    {city.cit_name}
                  </MenuItem>
                ))}

                {/* Add more options as needed */}
              </Select>

              {/* Second Textfield */}


              <TextField
                fullWidth
                type="date"
                value={empDOB}
                onChange={(e) => setEmpDOB(e.target.value)}
                sx={{
                  ...selectStyles,
                  "& input[type='date']::-webkit-calendar-picker-indicator": {
                    opacity: 0,
                    cursor: "pointer"
                  },
                  "& input[type='date']": {
                    color: empDOB ? (darkMode ? "#9e9e9e" : "#000") : "transparent",
                    fontSize: "13px",
                  },
                  "& input[type='date']:focus": {
                    color: darkMode ? "#000" : "#000",
                  },
                  "& input[type='date']:before": {
                    content: empDOB ? '""' : '"Employee DOB"',
                    color: "#9e9e9e",
                    position: "absolute",
                    fontSize: "13px",
                  }
                }}
                InputProps={{
                  placeholder: "Employee DOB"
                }}
                onFocus={(e) => {
                  e.target.showPicker();
                }}
              />


            </Box>



            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 3, mb: 1 }}>
              {isEditing ? (
                <>
                  <Button
                    variant="contained"
                    onClick={handleUpdate}
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
                    Update
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleCancel}
                    disabled={loading}
                    sx={{
                      mt: 2,
                      width: "40%",
                      // backgroundColor: "#00f0c0",
                      color: "white",
                      fontWeight: "bold",
                      borderRadius: "12px",
                      "&:hover": {
                        backgroundColor: bgColor,
                        color: "white !important",
                      },
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button
                  variant="contained"
                  onClick={handleSubmit}
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
              )}
            </Box>

          </Paper>
        </Grid>
      </Grid>
    </div>
  )
}

export default Add_employee
