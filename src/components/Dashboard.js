import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import IconButton from '@mui/material/IconButton';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';


const Dashboard = () => {
    const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });
    const [details, setDetails] = useState([]);
    const [viewDialogOpen, setViewDialogOpen] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [editDetail, setEditDetail] = useState(null);


    const setFormValues = (detail) => {
        formik.setValues({
            name: detail.name,
            email: detail.email,
            age: detail.age,
            phone: detail.phone,
            city: detail.city,
            idNumber: detail.idNumber,
        });
        setEditDetail(detail);
    };


    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            age: '',
            phone: '',
            city: '',
            idNumber: ''
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            age: Yup.number().required('Required').positive('Must be a positive number').integer('Must be an integer'),
            phone: Yup.string().required('Required'),
            city: Yup.string().required('Required'),
            idNumber: Yup.string().required('Required'),
        }),
        
        onSubmit: async (values) => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                if (response.ok) {
                    setAlert({ open: true, severity: 'success', message: 'User details added successfully' });
                } else {
                    setAlert({ open: true, severity: 'error', message: 'Failed to added details' });
                }
            } catch (error) {
                setAlert({ open: true, severity: 'error', message: `Error occurred: ${error.message}` });
            }
        },


    });



    const fetchDetails = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/details');
            if (response.ok) {
                const data = await response.json();
                setDetails(data);
            } else {
                console.error('Failed to fetch details');
            }
        } catch (error) {
            console.error(`Error occurred while fetching details: ${error.message}`);
        }
    };

    //delete
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/details/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setAlert({ open: true, severity: 'success', message: 'User details deleted successfully' });
                fetchDetails();
            } else {
                setAlert({ open: true, severity: 'error', message: 'Failed to delete details' });
            }
        } catch (error) {
            setAlert({ open: true, severity: 'error', message: `Error occurred: ${error.message}` });
        }
    };

    //update
    const handleUpdate = async () => {
        try {
            if (!editDetail) {
                return;
            }

            const response = await fetch(`http://127.0.0.1:8000/api/details/${editDetail.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formik.values),
                
            });

            if (response.ok) {
                setAlert({ open: true, severity: 'success', message: 'User details updated successfully' });
                fetchDetails();
            } else {
                setAlert({ open: true, severity: 'error', message: 'Failed to update details' });
            }
        } catch (error) {
            setAlert({ open: true, severity: 'error', message: `Error occurred: ${error.message}` });
        }
    };


    useEffect(() => {
        fetchDetails();
    }, []);

  
    const handleClear = () => {
        formik.resetForm();
    };

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };


    const handleRefresh = () => {
        fetchDetails();
    };


    const handleEdit = (detail) => {
        setFormValues(detail);
    };

        const handleView = (detail) => {
        setSelectedDetail(detail);
        setViewDialogOpen(true);
    };

    const handleCloseViewDialog = () => {
        setViewDialogOpen(false);
    };

    return (
        <Box
            sx={{
                maxWidth: 1000,
                margin: 'auto',
                mt: 10,
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '20px',
            }}
        >

            <Snackbar
                open={alert.open}
                autoHideDuration={6000}
                onClose={handleCloseAlert}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseAlert} severity={alert.severity} sx={{ width: '100%' }}>
                    <AlertTitle>{alert.severity === 'success' ? 'Success' : 'Error'}</AlertTitle>
                    {alert.message}
                </Alert>
            </Snackbar>

            <Typography variant="h2" align="center" sx={{ marginTop: '10px', marginBottom: '10px', fontFamily: 'Raleway, Arial', fontSize: '2rem' }}>
                Add User Details
            </Typography>

            <form onSubmit={formik.handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="name"
                            name="name"
                            label="Username"
                            type="text"
                            variant="outlined"
                            margin="normal"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.name}
                            error={formik.touched.name && Boolean(formik.errors.name)}
                            helperText={formik.touched.name && formik.errors.name}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="email"
                            name="email"
                            label="Email"
                            type="text"
                            variant="outlined"
                            margin="normal"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.email}
                            error={formik.touched.email && Boolean(formik.errors.email)}
                            helperText={formik.touched.email && formik.errors.email}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="age"
                            name="age"
                            label="Age"
                            type="number"
                            variant="outlined"
                            margin="normal"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.age}
                            error={formik.touched.age && Boolean(formik.errors.age)}
                            helperText={formik.touched.age && formik.errors.age}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="phone"
                            name="phone"
                            label="Phone"
                            type="text"
                            variant="outlined"
                            margin="normal"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.phone}
                            error={formik.touched.phone && Boolean(formik.errors.phone)}
                            helperText={formik.touched.phone && formik.errors.phone}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="city"
                            name="city"
                            label="City"
                            type="text"
                            variant="outlined"
                            margin="normal"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.city}
                            error={formik.touched.city && Boolean(formik.errors.city)}
                            helperText={formik.touched.city && formik.errors.city}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            id="idNumber"
                            name="idNumber"
                            label="ID Number"
                            type="text"
                            variant="outlined"
                            margin="normal"
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            value={formik.values.idNumber}
                            error={formik.touched.idNumber && Boolean(formik.errors.idNumber)}
                            helperText={formik.touched.idNumber && formik.errors.idNumber}
                        />
                    </Grid>
                </Grid>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
    <Button type="button" variant="contained" color="primary" onClick={handleClear} sx={{ width: 100, margin: '0 10px' }}>
        Clear
    </Button>
    {!editDetail ? (
        <Button type="submit" variant="contained" color="primary" sx={{ width: 100, margin: '0 10px' }}>
            Add
        </Button>
    ) : (
        <Button type="button" variant="contained" color="primary" onClick={handleUpdate} sx={{ width: 100, margin: '0 10px' }}>
            Update
        </Button>
    )}
</div>
            </form>

            <IconButton
                onClick={handleRefresh}
                sx={{
                    marginleft: 'auto', // Align to the right
                }}
            >
                <RefreshIcon />
            </IconButton>

            <TableContainer component={Paper} sx={{ marginTop: '20px' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Age</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>City</TableCell>
                            <TableCell>ID Number</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {details.map((detail, index) => (
                            <TableRow key={index}>
                                <TableCell>{detail.name}</TableCell>
                                <TableCell>{detail.email}</TableCell>
                                <TableCell>{detail.age}</TableCell>
                                <TableCell>{detail.phone}</TableCell>
                                <TableCell>{detail.city}</TableCell>
                                <TableCell>{detail.idNumber}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleView(detail)} sx={{ marginleft: 'auto' }} color="info">
                                        <VisibilityIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleEdit(detail)} sx={{ marginleft: 'auto' }} color="info">
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(detail.id)} sx={{ marginleft: 'auto', }} color="error">
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog
                open={viewDialogOpen}
                onClose={handleCloseViewDialog}
                fullWidth
                maxWidth="md" // Adjust the size as needed
                sx={{
                    '& .MuiPaper-root': {
                        borderRadius: '16px', // Add rounded corners
                        boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Add a subtle shadow
                    },
                }}
            >
                <DialogTitle>View Details</DialogTitle>
                <DialogContent>
                    {selectedDetail && (
                        <div>
                            <Typography>Name: {selectedDetail.name}</Typography>
                            <Typography>Email: {selectedDetail.email}</Typography>
                            <Typography>Age: {selectedDetail.age}</Typography>
                            <Typography>Phone: {selectedDetail.phone}</Typography>
                            <Typography>City: {selectedDetail.city}</Typography>
                            <Typography>ID Number: {selectedDetail.idNumber}</Typography>
                        </div>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseViewDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Dashboard;
