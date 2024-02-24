import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { Link as RouterLink } from 'react-router-dom';
import Typography from '@mui/material/Typography';



const Signup = () => {
    const [alert, setAlert] = useState({ open: false, severity: 'success', message: '' });

    // Formik configuration
    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('Required'),
            email: Yup.string().email('Invalid email address').required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: async (values) => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/auth/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                if (response.ok) {
                    setAlert({ open: true, severity: 'success', message: 'User registered successfully' });
                } else {
                    setAlert({ open: true, severity: 'error', message: 'Failed to register' });
                }
            } catch (error) {
                setAlert({ open: true, severity: 'error', message: `Error occurred: ${error.message}` });
            }
        },
    });

    const handleCloseAlert = () => {
        setAlert({ ...alert, open: false });
    };

    return (
        <Box
            sx={{
                maxWidth: 400,
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
                Sign up
            </Typography>
            <form onSubmit={formik.handleSubmit}>
                <div>
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
                </div>

                <div>
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
                </div>

                <div>
                    <TextField
                        fullWidth
                        id="password"
                        name="password"
                        label="Password"
                        type="password"
                        variant="outlined"
                        margin="normal"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                    <Button type="submit" variant="contained" color="primary" sx={{ width: 400 }}>
                        Sign up
                    </Button>
                </div>

                <Typography variant="h1" align="center" sx={{ marginTop: '25px', marginBottom: '10px', fontFamily: 'Raleway, Arial', fontSize: '1rem' }}>
                    Already have an account?{' '}
                    <RouterLink to="/" style={{ textDecoration: 'none' }}>
                        Sign in Here
                    </RouterLink>
                </Typography>
            </form>
        </Box>
    );
};

export default Signup;
