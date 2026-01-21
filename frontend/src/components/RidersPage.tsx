import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Snackbar,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { riderService } from '../services/riderService';
import { Rider, RiderCreate, PanpayaStore } from '../types';
import { storeService } from '../services/storeService';

const RidersPage: React.FC = () => {
  const [riders, setRiders] = useState<Rider[]>([]);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingRider, setEditingRider] = useState<Rider | null>(null);
  const [formData, setFormData] = useState<RiderCreate>({
    full_name: '',
    active: true,
    rider_type: 'PANPAYA',
    identification: '',
    store_id: undefined,
    observation: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [stores, setStores] = useState<PanpayaStore[]>([]);

  useEffect(() => {
    loadRiders();
    loadStores();
  }, [showActiveOnly]);

  const loadRiders = async () => {
    try {
      const data = await riderService.getAll(showActiveOnly);
      setRiders(data);
    } catch (error) {
      showSnackbar('Error loading riders', 'error');
    }
  };

  const loadStores = async () => {
    try {
      const data = await storeService.getAll();
      setStores(data);
    } catch (error) {
      showSnackbar('Error loading stores', 'error');
    }
  };

  const handleOpen = (rider?: Rider) => {
    if (rider) {
      setEditingRider(rider);
      setFormData({
        full_name: rider.full_name,
        active: rider.active,
        rider_type: rider.rider_type,
        identification: rider.identification || '',
        store_id: rider.store_id ?? undefined,
        observation: rider.observation || '',
      });
    } else {
      setEditingRider(null);
      setFormData({
        full_name: '',
        active: true,
        rider_type: 'PANPAYA',
        identification: '',
        store_id: undefined,
        observation: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingRider(null);
    setFormData({
      full_name: '',
      active: true,
      rider_type: 'PANPAYA',
      identification: '',
      store_id: undefined,
      observation: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingRider) {
        await riderService.update(editingRider.id, formData);
        showSnackbar('Rider updated successfully', 'success');
      } else {
        await riderService.create(formData);
        showSnackbar('Rider created successfully', 'success');
      }
      handleClose();
      loadRiders();
    } catch (error) {
      showSnackbar('Error saving rider', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this rider?')) {
      try {
        await riderService.delete(id);
        showSnackbar('Rider deleted successfully', 'success');
        loadRiders();
      } catch (error) {
        showSnackbar('Error deleting rider', 'error');
      }
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Delivery Riders
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControlLabel
            control={
              <Switch
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
              />
            }
            label="Active only"
          />
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
            Add Rider
          </Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Store</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {riders.map((rider) => (
              <TableRow key={rider.id}>
                <TableCell>{rider.full_name}</TableCell>
                <TableCell>{rider.rider_type}</TableCell>
                <TableCell>
                  {stores.find((store) => store.id === rider.store_id)?.name || '-'}
                </TableCell>
                <TableCell>
                  <Chip
                    label={rider.active ? 'Active' : 'Inactive'}
                    color={rider.active ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(rider)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(rider.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {riders.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No riders found. Click "Add Rider" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingRider ? 'Edit Rider' : 'Add Rider'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Full Name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Identification"
              value={formData.identification || ''}
              onChange={(e) => setFormData({ ...formData, identification: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth required>
              <InputLabel>Rider Type</InputLabel>
              <Select
                value={formData.rider_type}
                label="Rider Type"
                onChange={(e) => setFormData({ ...formData, rider_type: e.target.value })}
              >
                <MenuItem value="PANPAYA">PANPAYA</MenuItem>
                <MenuItem value="TC">TC</MenuItem>
                <MenuItem value="FDS">FDS</MenuItem>
                <MenuItem value="EXTERNO">EXTERNO</MenuItem>
                <MenuItem value="DISPONIBLE">DISPONIBLE</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel>Store</InputLabel>
              <Select
                value={(formData.store_id ?? '') as string | number}
                label="Store"
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    store_id: e.target.value === '' ? undefined : Number(e.target.value),
                  })
                }
              >
                <MenuItem value="">None</MenuItem>
                {stores.map((store) => (
                  <MenuItem key={store.id} value={store.id}>
                    {store.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Observation"
              value={formData.observation || ''}
              onChange={(e) => setFormData({ ...formData, observation: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                />
              }
              label="Active"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.full_name}>
            {editingRider ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

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

export default RidersPage;
