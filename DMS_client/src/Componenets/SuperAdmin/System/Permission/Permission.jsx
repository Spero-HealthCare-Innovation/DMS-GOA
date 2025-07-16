import React, { useState, useEffect } from 'react';
import {
    Box, Grid, Select, MenuItem, InputLabel, FormControl, Checkbox,
    FormControlLabel, Button, Snackbar, Alert, Typography, Paper
} from '@mui/material';
import axios from 'axios';

const Permission = () => {
    const permission = localStorage.getItem('permissions');
    const usergrp = localStorage.getItem('usergrp');
    const Port = import.meta.env.VITE_APP_API_KEY3;
    const accessToken = localStorage.getItem('token');

    const [source, setSource] = useState([]);
    const [role, setRole] = useState([]);
    const [moduleSubmodule, setModuleSubmodule] = useState([]);
    const [moduleCheckboxes, setModuleCheckboxes] = useState({});
    const [submoduleCheckboxes, setSubmoduleCheckboxes] = useState({});
    const [sourceid, setSourceid] = useState('');
    const [roleid, setRoleid] = useState('');
    const [permission_list, setPermission_list] = useState([]);
    const [perId, setPerId] = useState('');
    const [allPermissionChecked, setAllPermissionChecked] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    useEffect(() => {
        const fetchUserSourceDropdown = async () => {
            try {
                const response = await axios.get(`${Port}/Screening/source_GET/`, {
                    headers: { Authorization: `Bearer ${accessToken}` }
                });
                setSource(response.data);
            } catch (error) {
                console.log('Error while fetching source', error);
            }
        };
        fetchModuleSubmodule();
        fetchUserSourceDropdown();
    }, []);

    const fetchRole = async (id) => {
        try {
            const response = await axios.get(`${Port}/Screening/agg_role_info_get/${id}`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const roles = usergrp === 'UG-ADMIN'
                ? response.data.filter(role => role.grp_name !== 'UG-ADMIN' && role.grp_name !== 'UG-SUPERADMIN')
                : response.data;
            setRole(roles);
        } catch (error) {
            console.log('Error while fetching roles', error);
        }
    };

    const fetchModuleSubmodule = async (id) => {
        setSourceid(id);
        try {
            const response = await axios.get(`${Port}/Screening/combined/`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            setModuleSubmodule(response.data);
        } catch (error) {
            console.log('Error while fetching modules/submodules', error);
        }
    };

    const fetchRoleid = async (id) => {
        setRoleid(id);
        try {
            const response = await axios.get(`${Port}/Screening/permissions/${sourceid}/${id}/`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            const data = response.data;
            if (data.length === 0) {
                setPermission_list([]);
                setModuleCheckboxes({});
                setSubmoduleCheckboxes({});
                return;
            }
            setPermission_list(data);
            setPerId(data[0].id);

            const moduleCheck = {};
            const submoduleCheck = {};
            data.forEach(roleData => {
                roleData.modules_submodule.forEach(mod => {
                    moduleCheck[mod.moduleId] = true;
                    mod.selectedSubmodules.forEach(sub => {
                        submoduleCheck[sub.submoduleId] = true;
                    });
                });
            });

            setModuleCheckboxes(moduleCheck);
            setSubmoduleCheckboxes(submoduleCheck);
        } catch (error) {
            console.log('Error while fetching role permissions', error);
        }
    };

    const handleAllPermissionChange = (event) => {
        const checked = event.target.checked;
        setAllPermissionChecked(checked);
        const updatedModules = {};
        const updatedSubmodules = {};
        moduleSubmodule.forEach(module => {
            updatedModules[module.module_id] = checked;
            module.submodules.forEach(sub => {
                updatedSubmodules[sub.Permission_id] = checked;
            });
        });
        setModuleCheckboxes(updatedModules);
        setSubmoduleCheckboxes(updatedSubmodules);
    };

    const handleModuleChange = (moduleId, checked) => {
        setModuleCheckboxes(prev => ({ ...prev, [moduleId]: checked }));
        const module = moduleSubmodule.find(mod => mod.module_id === moduleId);
        if (module) {
            const updatedSub = { ...submoduleCheckboxes };
            module.submodules.forEach(sub => {
                updatedSub[sub.Permission_id] = checked;
            });
            setSubmoduleCheckboxes(updatedSub);
        }
    };

    const handleSubmoduleChange = (subId, checked) => {
        const updated = { ...submoduleCheckboxes, [subId]: checked };
        setSubmoduleCheckboxes(updated);

        moduleSubmodule.forEach(module => {
            const allChecked = module.submodules.every(sub => updated[sub.Permission_id]);
            const noneChecked = module.submodules.every(sub => !updated[sub.Permission_id]);
            setModuleCheckboxes(prev => ({
                ...prev,
                [module.module_id]: allChecked ? true : noneChecked ? false : prev[module.module_id]
            }));
        });
    };

    const handleSubmit = () => {
        const selectedData = {
            source: sourceid,
            role: roleid,
            modules_submodule: [],
            permission_status: 1
        };

        moduleSubmodule.forEach(module => {
            if (moduleCheckboxes[module.module_id]) {
                const selectedSub = module.submodules
                    .filter(sub => submoduleCheckboxes[sub.Permission_id])
                    .map(sub => ({ submoduleId: sub.Permission_id, submoduleName: sub.name }));
                if (selectedSub.length > 0) {
                    selectedData.modules_submodule.push({
                        moduleId: module.module_id,
                        moduleName: module.name,
                        selectedSubmodules: selectedSub
                    });
                }
            }
        });

        if (selectedData.modules_submodule.length === 0) {
            console.error("Select at least one module and submodule.");
            return;
        }

        const apiCall = permission_list.length === 0
            ? axios.post(`${Port}/Screening/permissions/`, selectedData, { headers: { Authorization: `Bearer ${accessToken}` } })
            : axios.put(`${Port}/Screening/permissions/${perId}/`, selectedData, { headers: { Authorization: `Bearer ${accessToken}` } });

        apiCall
            .then(() => setSnackbarOpen(true))
            .catch(err => console.error("Error while saving permissions", err));
    };

    return (
        <Box p={3}>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert severity="success" variant="filled" onClose={handleSnackbarClose}>
                    Data saved successfully!
                </Alert>
            </Snackbar>

            <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>Source</InputLabel>
                        <Select
                            value={sourceid}
                            label="Source"
                            onChange={(e) => {
                                fetchRole(e.target.value);
                                fetchModuleSubmodule(e.target.value);
                            }}
                        >
                            {source.map(item => (
                                <MenuItem key={item.source_pk_id} value={item.source_pk_id}>
                                    {item.source}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                    <FormControl fullWidth>
                        <InputLabel>User Roles</InputLabel>
                        <Select
                            value={roleid}
                            label="User Roles"
                            onChange={(e) => fetchRoleid(e.target.value)}
                        >
                            {role.map(item => (
                                <MenuItem key={item.Group_id} value={item.Group_id}>
                                    {item.grp_name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>

                <Grid item xs={12} md={4} alignSelf="center">
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={allPermissionChecked}
                                onChange={handleAllPermissionChange}
                            />
                        }
                        label="All Permissions"
                    />
                </Grid>
            </Grid>

            <Box mt={3}>
                {moduleSubmodule.map((module) => (
                    <Paper key={module.module_id} sx={{ p: 2, mb: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={3}>
                                <FormControlLabel
                                    control={
                                        <Checkbox
                                            checked={moduleCheckboxes[module.module_id] || false}
                                            onChange={(e) =>
                                                handleModuleChange(module.module_id, e.target.checked)
                                            }
                                        />
                                    }
                                    label={<Typography fontWeight="bold">{module.name}</Typography>}
                                />
                            </Grid>
                            <Grid item xs={12} md={9}>
                                <Grid container spacing={1}>
                                    {module.submodules.map(sub => (
                                        <Grid item key={sub.Permission_id}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        checked={submoduleCheckboxes[sub.Permission_id] || false}
                                                        onChange={(e) =>
                                                            handleSubmoduleChange(sub.Permission_id, e.target.checked)
                                                        }
                                                    />
                                                }
                                                label={sub.name}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </Grid>
                        </Grid>
                    </Paper>
                ))}
            </Box>

            <Box textAlign="center" mt={4}>
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                    Submit
                </Button>
            </Box>
        </Box>
    );
};

export default Permission;
