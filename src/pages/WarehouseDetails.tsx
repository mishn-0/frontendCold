import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Chip,
} from '@mui/material';
import {
  LocationOn as LocationIcon,
  Storage as StorageIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { warehouseService, Warehouse } from '../services/warehouseService';
import { storageUnitService } from '../services/storageUnitService';
import { StorageUnit } from '../types';
import StorageUnitForm from '../components/storageUnit/StorageUnitForm';
import AddStorageUnitCard from '../components/storageUnit/AddStorageUnitCard';

const WarehouseHeader: React.FC<{ warehouse: Warehouse }> = ({ warehouse }) => {
  return (
    <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)' }}>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ color: 'white' }}>
            {warehouse.name}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, color: 'white' }}>
            <LocationIcon />
            <Typography variant="body1">{warehouse.address}</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
              <StorageIcon />
              <Typography variant="body1">
                Total Units: {warehouse.totalUnits || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
              <StorageIcon />
              <Typography variant="body1">
                Available Units: {warehouse.availableUnits || 0}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
              <StorageIcon />
              <Typography variant="body1">
                Occupancy Rate: {warehouse.occupancyRate || 0}%
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
              <StorageIcon />
              <Typography variant="body1">
                Average Temperature: {warehouse.averageTemperature || 0}°C
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'white' }}>
              <StorageIcon />
              <Typography variant="body1">
                Average Humidity: {warehouse.averageHumidity || 0}%
              </Typography>
            </Box>
            <Chip 
              label={warehouse.status} 
              color={warehouse.status === 'active' ? 'success' : 'default'}
              sx={{ alignSelf: 'flex-start', mt: 1 }}
            />
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

const StorageUnitCard: React.FC<{ unit: StorageUnit }> = ({ unit }) => {
  const getStatusColor = (status: StorageUnit['status']) => {
    switch (status) {
      case 'available':
        return 'success';
      case 'occupied':
        return 'primary';
      case 'maintenance':
        return 'warning';
      case 'reserved':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <Card sx={{ height: '100%', transition: 'transform 0.3s', '&:hover': { transform: 'scale(1.02)' } }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <StorageIcon sx={{ mr: 1, color: 'primary.main' }} />
          <Typography variant="h6">{unit.name}</Typography>
        </Box>
        <Chip 
          label={unit.status} 
          color={getStatusColor(unit.status)}
          size="small"
          sx={{ mb: 2 }}
        />
        <Typography variant="body2" color="text.secondary">
          Temperature Range: {unit.minTemp}°C - {unit.maxTemp}°C
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Humidity Range: {unit.minHumidity}% - {unit.maxHumidity}%
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Cost: ${unit.costPerHour}/hour
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Dimensions: {unit.width}m × {unit.height}m × {unit.depth}m
        </Typography>
      </CardContent>
    </Card>
  );
};

const WarehouseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [warehouse, setWarehouse] = useState<Warehouse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [storageUnits, setStorageUnits] = useState<StorageUnit[]>([]);
  const [isStorageUnitFormOpen, setIsStorageUnitFormOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const warehouseData = await warehouseService.getById(Number(id));
        setWarehouse(warehouseData);

        try {
          const units = await storageUnitService.getByWarehouseId(Number(id));
          setStorageUnits(units);
        } catch (err: any) {
          if (err.response?.status === 404) {
            setStorageUnits([]);
          } else {
            console.error('Error fetching storage units:', err);
            setError('Could not load storage units. Please try again.');
          }
        }
      } catch (err) {
        console.error('Error fetching warehouse:', err);
        setError('Could not load warehouse information. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddStorageUnit = () => {
    setIsStorageUnitFormOpen(true);
  };

  const handleStorageUnitFormSubmit = async (data: Omit<StorageUnit, 'unitId' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => {
    try {
      const newStorageUnit = await storageUnitService.create({
        ...data,
        warehouseId: Number(id),
      });
      setStorageUnits([...storageUnits, newStorageUnit]);
      setIsStorageUnitFormOpen(false);
    } catch (err) {
      console.error('Error creating storage unit:', err);
      setError('Failed to create storage unit. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!warehouse) {
    return <Container><Alert severity="error">Warehouse not found.</Alert></Container>;
  }

  return (
    <Container>
      <WarehouseHeader warehouse={warehouse} />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <StorageIcon color="primary" />
          Storage Units
        </Typography>
        
        {storageUnits.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', mb: 3 }}>
            <Typography variant="body1" color="text.secondary" gutterBottom>
              This warehouse currently has no storage units assigned.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              onClick={handleAddStorageUnit}
              sx={{ mt: 2 }}
            >
              Add First Storage Unit
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {storageUnits.map((unit) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={unit.unitId}>
                <StorageUnitCard unit={unit} />
              </Grid>
            ))}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <AddStorageUnitCard onClick={handleAddStorageUnit} />
            </Grid>
          </Grid>
        )}
      </Box>

      <StorageUnitForm
        open={isStorageUnitFormOpen}
        onClose={() => setIsStorageUnitFormOpen(false)}
        onSubmit={handleStorageUnitFormSubmit}
        warehouses={[warehouse]}
        initialData={undefined}
      />
    </Container>
  );
};

export default WarehouseDetails;
