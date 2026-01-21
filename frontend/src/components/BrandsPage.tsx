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
import { brandService } from '../services/brandService';
import { ExternalBrand, ExternalBrandCreate } from '../types';

const BrandsPage: React.FC = () => {
  const [brands, setBrands] = useState<ExternalBrand[]>([]);
  const [open, setOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<ExternalBrand | null>(null);
  const [formData, setFormData] = useState<ExternalBrandCreate>({ name: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      const data = await brandService.getAll();
      setBrands(data);
    } catch (error) {
      showSnackbar('Error loading brands', 'error');
    }
  };

  const handleOpen = (brand?: ExternalBrand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormData({ name: brand.name });
    } else {
      setEditingBrand(null);
      setFormData({ name: '' });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingBrand(null);
    setFormData({ name: '' });
  };

  const handleSubmit = async () => {
    try {
      if (editingBrand) {
        await brandService.update(editingBrand.id, formData);
        showSnackbar('Brand updated successfully', 'success');
      } else {
        await brandService.create(formData);
        showSnackbar('Brand created successfully', 'success');
      }
      handleClose();
      loadBrands();
    } catch (error) {
      showSnackbar('Error saving brand', 'error');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this brand?')) {
      try {
        await brandService.delete(id);
        showSnackbar('Brand deleted successfully', 'success');
        loadBrands();
      } catch (error) {
        showSnackbar('Error deleting brand', 'error');
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
          External Brands
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpen()}>
          Add Brand
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {brands.map((brand) => (
              <TableRow key={brand.id}>
                <TableCell>{brand.name}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpen(brand)} color="primary">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(brand.id)} color="error">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {brands.length === 0 && (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No brands found. Click "Add Brand" to create one.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingBrand ? 'Edit Brand' : 'Add Brand'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ name: e.target.value })}
              required
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!formData.name}>
            {editingBrand ? 'Update' : 'Create'}
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

export default BrandsPage;
