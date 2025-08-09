import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tabs,
  Tab,
  Box,
  Paper,
} from '@mui/material';
import { SettingsApplications } from '@mui/icons-material';

const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleTabChange = (_: React.SyntheticEvent, newValue: string) => {
    navigate(newValue);
  };

  const getTabValue = () => {
    if (location.pathname === '/') return '/create';
    return location.pathname;
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" elevation={0} sx={{ backgroundColor: '#1976d2' }}>
        <Toolbar>
          <SettingsApplications sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Form Builder Pro
          </Typography>
        </Toolbar>
      </AppBar>

      <Paper square elevation={1} sx={{ borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Tabs
            value={getTabValue()}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 500,
              },
            }}
          >
            <Tab label="Create Form" value="/create" />
            <Tab label="Preview" value="/preview" />
            <Tab label="My Forms" value="/myforms" />
          </Tabs>
        </Container>
      </Paper>

      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        <Outlet />
      </Container>
    </Box>
  );
};

export default Layout;