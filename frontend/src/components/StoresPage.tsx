import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
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
import { storeService } from '../services/storeService';
import { PanpayaStore, PanpayaStoreCreate } from '../types';

const StoresPage: React.FC = () => {
  const [stores, setStores] = useState<PanpayaStore[]>([]);
  const [open, setOpen] = useState(false);
  const [editingStore, setEditingStore] = useState<PanpayaStore | null>(null);
  const [formData, setFormData] = useState<PanpayaStoreCreate>({
    code: '',
    name: '',
    zone: '',
    address: '',
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      const data = await storeService.getAll();
      setStores(data);
    } catch (error) {
      showSnackbar('Error loading stores', 'error');
    }
  };

  const handleOpen = (store?: PanpayaStore) => {
    if (store) {
      setEditingStore(store);
      setFormData({
        code: store.code,
        name: store.name,
        zone: store.zone || '',
        address: store.address || '',
      });
    } else {
      setEditingStore(null);
      setFormData({ code: '', name: '', zone: '', address: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingStore(null);
    setFormData({ code: '', name: '', zone: '', address: '' });
  };

  const handleSubmit = async () => {
    try {
      if (editingStore) {
        await storeService.update(editingStore.id, formData);
        showSnackbar('Store updated successfully', 'success');
      } else {
        await storeService.create(formData);
        showSnackbar('Store created successfully', 'success');
      }
      handleClose();
      loadStores();
    } catch (error) {
      showSnackbar('Error saving store', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this store?')) {
      try {
        await storeService.delete(id);
        showSnackbar('Store deleted successfully', 'success');
        loadStores();
      } catch (error) {
        showSnackbar('Error deleting store', 'error');
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
          Panpaya Branches
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Branch
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Code</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Zone</TableCell>
              <TableCell>Address</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stores.map((store) => (
              <TableRow key={store.id}>
                <TableCell>{store.code}</TableCell>
                <TableCell>{store.name}</TableCell>
                <TableCell>{store.zone || '-'}</TableCell>
                <TableCell>{store.address || '-'}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(store)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(store.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {stores.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No branches found. Click "Add Branch" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingStore ? 'Edit Branch' : 'Add Branch'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              fullWidth
            />
            <TextField
              label="Zone"
              value={formData.zone}
              onChange={(e) => setFormData({ ...formData, zone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.code || !formData.name}>
            {editingStore ? 'Update' : 'Create'}
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

export default StoresPage;
