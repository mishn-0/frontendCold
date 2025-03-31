import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  styled,
  IconButton,
  AppBar,
  Toolbar,
  Collapse,
} from '@mui/material';
import {
  Home as HomeIcon,
  Warehouse as WarehouseIcon,
  EventNote as BookingIcon,
  Sensors as SensorsIcon,
  Assessment as ReportsIcon,
  Settings as SettingsIcon,
  Person as ProfileIcon,
  Menu as MenuIcon,
  People as UsersIcon,
  Storage as StorageUnitIcon,
  Payment as PaymentIcon,
  Build as MaintenanceIcon,
  Notifications as NotificationIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const drawerWidth = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
  color: theme.palette.primary.contrastText,
}));

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));


// AQUI se le mueve a los nombres de la sidebar
const navigationItems = [
  { path: '/', icon: <HomeIcon />, translationKey: 'Home' },
  { path: '/warehouses', icon: <WarehouseIcon />, translationKey: 'Warehouses' },
  { path: '/storage-units', icon: <StorageUnitIcon />, translationKey: 'Storage Units' },
  { path: '/bookings', icon: <BookingIcon />, translationKey: 'Bookings' },
  { path: '/payments', icon: <PaymentIcon />, translationKey: 'Payments' },
  { path: '/users', icon: <UsersIcon />, translationKey: 'Users' },
  { path: '/sensors', icon: <SensorsIcon />, translationKey: 'Sensors' },
  { path: '/maintenance', icon: <MaintenanceIcon />, translationKey: 'Maintenance' },
  { path: '/notifications', icon: <NotificationIcon />, translationKey: 'Notifications' },
  { path: '/reports', icon: <ReportsIcon />, translationKey: 'Reports' },
  { path: '/settings', icon: <SettingsIcon />, translationKey: 'Settings' },
  { path: '/profile', icon: <ProfileIcon />, translationKey: 'Profile' },
];

const Sidebar: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <StyledAppBar position="fixed">
        <Toolbar>
          <MenuButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </MenuButton>
        </Toolbar>
      </StyledAppBar>
      <StyledDrawer
        variant="temporary"
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerToggle}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <List>
          {navigationItems.map((item) => (
            <ListItem
              button
              key={item.path}
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                handleDrawerToggle();
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={t(item.translationKey)} />
            </ListItem>
          ))}
        </List>
      </StyledDrawer>
    </>
  );
};

export default Sidebar; 