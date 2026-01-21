import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  Paper,
  Typography,
  Alert,
  Snackbar,
  Stack,
} from '@mui/material';
import { importService } from '../services/importService';

const ImportsPage: React.FC = () => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [loading, setLoading] = useState(false);

  const handleUpload = async (
    file: File | null,
    action: (file: File) => Promise<{ created: number; updated: number }>,
    label: string,
  ) => {
    if (!file) {
      return;
    }
    try {
      setLoading(true);
      const result = await action(file);
      setSnackbar({
        open: true,
        message: `${label}: ${result.created} created, ${result.updated} updated`,
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({ open: true, message: `Error importing ${label}`, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Data Imports
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Upload Excel files for riders, stores, and external brands. Required columns are validated automatically.
      </Typography>
      <Paper sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6">Riders (Base Personal)</Typography>
            <Button
              variant="contained"
              component="label"
              disabled={loading}
              sx={{ mt: 1 }}
            >
              Upload Riders Excel
              <input
                type="file"
                hidden
                accept=".xlsx,.xlsm,.xltx,.xltm"
                onChange={(e) => handleUpload(e.target.files?.[0] ?? null, importService.importRiders, 'Riders')}
              />
            </Button>
          </Box>
          <Box>
            <Typography variant="h6">Stores (Sucursales)</Typography>
            <Button
              variant="contained"
              component="label"
              disabled={loading}
              sx={{ mt: 1 }}
            >
              Upload Stores Excel
              <input
                type="file"
                hidden
                accept=".xlsx,.xlsm,.xltx,.xltm"
                onChange={(e) => handleUpload(e.target.files?.[0] ?? null, importService.importStores, 'Stores')}
              />
            </Button>
          </Box>
          <Box>
            <Typography variant="h6">External Brands</Typography>
            <Button
              variant="contained"
              component="label"
              disabled={loading}
              sx={{ mt: 1 }}
            >
              Upload Brands Excel
              <input
                type="file"
                hidden
                accept=".xlsx,.xlsm,.xltx,.xltm"
                onChange={(e) => handleUpload(e.target.files?.[0] ?? null, importService.importBrands, 'Brands')}
              />
            </Button>
          </Box>
        </Stack>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ImportsPage;
