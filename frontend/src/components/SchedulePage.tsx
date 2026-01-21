import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Chip,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
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
import { scheduleService } from '../services/scheduleService';
import { brandService } from '../services/brandService';
import { storeService } from '../services/storeService';
import { riderService } from '../services/riderService';
import { ScheduleAssignment, ExternalBrand, PanpayaStore, Rider } from '../types';

const SchedulePage: React.FC = () => {
  const [assignments, setAssignments] = useState<ScheduleAssignment[]>([]);
  const [brands, setBrands] = useState<ExternalBrand[]>([]);
  const [stores, setStores] = useState<PanpayaStore[]>([]);
  const [riders, setRiders] = useState<Rider[]>([]);
  const [startDate, setStartDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [days, setDays] = useState(7);
  const [filters, setFilters] = useState({ store: 'all', brand: 'all', type: 'all', riderType: 'all' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadReferenceData();
  }, []);

  useEffect(() => {
    loadAssignments();
  }, [startDate, days]);

  const loadReferenceData = async () => {
    try {
      const [brandData, storeData, riderData] = await Promise.all([
        brandService.getAll(),
        storeService.getAll(),
        riderService.getAll(false),
      ]);
      setBrands(brandData);
      setStores(storeData);
      setRiders(riderData);
    } catch (error) {
      showSnackbar('Error loading reference data', 'error');
    }
  };

  const loadAssignments = async () => {
    try {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + days - 1);
      const data = await scheduleService.getAll(startDate, endDate.toISOString().slice(0, 10));
      setAssignments(data);
    } catch (error) {
      showSnackbar('Error loading schedule', 'error');
    }
  };

  const handleGenerate = async () => {
    try {
      const data = await scheduleService.generate(startDate, days);
      setAssignments(data);
      showSnackbar('Schedule generated successfully', 'success');
    } catch (error) {
      showSnackbar('Error generating schedule', 'error');
    }
  };

  const handleExport = () => {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + days - 1);
    window.open(scheduleService.export(startDate, endDate.toISOString().slice(0, 10)), '_blank');
  };

  const handleQuickUpdate = async (assignmentId: number, shiftType: string) => {
    try {
      await scheduleService.update(assignmentId, { shift_type: shiftType, manual_override: true });
      await loadAssignments();
    } catch (error) {
      showSnackbar('Error updating assignment', 'error');
    }
  };

  const handleCreateAvailable = async (rider: Rider) => {
    try {
      const existing = assignments.find(
        (assignment) => assignment.rider_id === rider.id && assignment.shift_date === startDate,
      );
      if (existing) {
        showSnackbar('Rider already has an assignment for this date', 'error');
        return;
      }
      await scheduleService.create({
        rider_id: rider.id,
        shift_date: startDate,
        shift_type: 'DISPONIBLE',
        manual_override: true,
      });
      await loadAssignments();
      showSnackbar('Manual assignment created', 'success');
    } catch (error) {
      showSnackbar('Error creating manual assignment', 'error');
    }
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      if (filters.store !== 'all' && String(assignment.store_id) !== filters.store) {
        return false;
      }
      if (filters.brand !== 'all' && String(assignment.external_brand_id) !== filters.brand) {
        return false;
      }
      if (filters.type !== 'all' && assignment.shift_type !== filters.type) {
        return false;
      }
      if (filters.riderType !== 'all' && assignment.rider?.rider_type !== filters.riderType) {
        return false;
      }
      return true;
    });
  }, [assignments, filters]);

  const shiftOptions = ['AM', 'PM', 'AM Y PM', 'DESCANSO', 'DISPONIBLE', 'EXTERNO'];

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1">
          Scheduling Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={handleExport}>
            Export to Excel
          </Button>
          <Button variant="contained" onClick={handleGenerate}>
            Generate Schedule
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Days"
            type="number"
            value={days}
            onChange={(e) => setDays(Number(e.target.value))}
            inputProps={{ min: 1, max: 31 }}
          />
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Store</InputLabel>
            <Select
              value={filters.store}
              label="Store"
              onChange={(e) => setFilters({ ...filters, store: e.target.value })}
            >
              <MenuItem value="all">All</MenuItem>
              {stores.map((store) => (
                <MenuItem key={store.id} value={String(store.id)}>
                  {store.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Brand</InputLabel>
            <Select
              value={filters.brand}
              label="Brand"
              onChange={(e) => setFilters({ ...filters, brand: e.target.value })}
            >
              <MenuItem value="all">All</MenuItem>
              {brands.map((brand) => (
                <MenuItem key={brand.id} value={String(brand.id)}>
                  {brand.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Shift Type</InputLabel>
            <Select
              value={filters.type}
              label="Shift Type"
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <MenuItem value="all">All</MenuItem>
              {shiftOptions.map((shift) => (
                <MenuItem key={shift} value={shift}>
                  {shift}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Rider Type</InputLabel>
            <Select
              value={filters.riderType}
              label="Rider Type"
              onChange={(e) => setFilters({ ...filters, riderType: e.target.value })}
            >
              <MenuItem value="all">All</MenuItem>
              <MenuItem value="PANPAYA">PANPAYA</MenuItem>
              <MenuItem value="TC">TC</MenuItem>
              <MenuItem value="FDS">FDS</MenuItem>
              <MenuItem value="EXTERNO">EXTERNO</MenuItem>
              <MenuItem value="DISPONIBLE">DISPONIBLE</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Rider</TableCell>
              <TableCell>Store</TableCell>
              <TableCell>Brand</TableCell>
              <TableCell>Shift</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Quick Edit</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell>{assignment.shift_date}</TableCell>
                <TableCell>{assignment.rider?.full_name || '-'}</TableCell>
                <TableCell>{assignment.store?.name || '-'}</TableCell>
                <TableCell>{assignment.external_brand?.name || '-'}</TableCell>
                <TableCell>
                  <Chip label={assignment.shift_type} color={assignment.manual_override ? 'warning' : 'primary'} />
                </TableCell>
                <TableCell>{assignment.manual_override ? 'Manual' : 'Auto'}</TableCell>
                <TableCell align="right">
                  <Select
                    size="small"
                    value={assignment.shift_type}
                    onChange={(e) => handleQuickUpdate(assignment.id, e.target.value)}
                  >
                    {shiftOptions.map((shift) => (
                      <MenuItem key={shift} value={shift}>
                        {shift}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
              </TableRow>
            ))}
            {filteredAssignments.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No assignments found. Generate a schedule or adjust filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>
          Available Riders (TC/FDS)
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Click a rider to create a manual DISPONIBLE assignment for the selected start date.
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {riders
            .filter((rider) => ['TC', 'FDS', 'EXTERNO'].includes(rider.rider_type))
            .map((rider) => (
              <Chip
                key={rider.id}
                label={rider.full_name}
                color="success"
                onClick={() => handleCreateAvailable(rider)}
                clickable
              />
            ))}
        </Box>
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

export default SchedulePage;
