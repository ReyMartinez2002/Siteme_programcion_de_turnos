import React from 'react';
import {
  AppBar,
  Box,
  Container,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Store as StoreIcon,
  DirectionsBike as BikeIcon,
  Home as HomeIcon,
  CalendarMonth as CalendarIcon,
  Factory as FactoryIcon,
  UploadFile as UploadIcon,
} from '@mui/icons-material';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import StoresPage from './components/StoresPage';
import RidersPage from './components/RidersPage';
import BrandsPage from './components/BrandsPage';
import SchedulePage from './components/SchedulePage';
import ImportsPage from './components/ImportsPage';

const drawerWidth = 240;

const HomePage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom>
        Welcome to Siteme
      </Typography>
      <Typography variant="h6" color="text.secondary" paragraph>
        Local/Offline Scheduling System for PanPaYa Delivery Riders
      </Typography>
      <Typography variant="body1" paragraph>
        This system helps manage:
      </Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        <li>
          <Typography variant="body1">Panpaya branches (stores) with codes, zones, and addresses</Typography>
        </li>
        <li>
          <Typography variant="body1">Delivery riders (domiciliarios) with types, stores, and observations</Typography>
        </li>
        <li>
          <Typography variant="body1">External brands, schedule generation, and manual adjustments</Typography>
        </li>
        <li>
          <Typography variant="body1">Excel import/export for operational data</Typography>
        </li>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
        Version 0.2.0 - Scheduling Engine
      </Typography>
    </Container>
  );
};

const AppContent: React.FC = () => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Branches', icon: <StoreIcon />, path: '/stores' },
    { text: 'Riders', icon: <BikeIcon />, path: '/riders' },
    { text: 'Brands', icon: <FactoryIcon />, path: '/brands' },
    { text: 'Schedule', icon: <CalendarIcon />, path: '/schedule' },
    { text: 'Imports', icon: <UploadIcon />, path: '/imports' },
  ];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Siteme
        </Typography>
      </Toolbar>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Panpaya Shift Scheduling
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/riders" element={<RidersPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/imports" element={<ImportsPage />} />
        </Routes>
      </Box>
    </Box>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
