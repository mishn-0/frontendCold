// src/pages/Warehouses.tsx
import React, { useEffect, useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import WarehouseTable from '../components/warehouse/WarehouseTable';
import { Warehouse, warehouseService } from '../services/warehouseService';
import WarehouseForm from '../components/warehouse/WarehouseForm';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedContainer from '../components/animations/AnimatedContainer';

const Warehouses: React.FC = () => {
  const { t } = useTranslation();
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<Warehouse | null>(null);

  const fetchWarehouses = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await warehouseService.getAll();
      setWarehouses(data);
    } catch (err) {
      console.error('Error fetching warehouses:', err);
      setError(t('warehouse.error.fetch'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const handleCreate = () => {
    setSelectedWarehouse(null);
    setOpenDialog(true);
  };

  const handleEdit = (warehouse: Warehouse) => {
    setSelectedWarehouse(warehouse);
    setOpenDialog(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await warehouseService.delete(id);
      setWarehouses(warehouses.filter(w => w.warehouseId !== id));
    } catch (err) {
      console.error('Error deleting warehouse:', err);
      setError(t('warehouse.error.delete'));
    }
  };

  const handleSubmit = async (data: Omit<Warehouse, 'warehouseId' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => {
    try {
      if (selectedWarehouse) {
        await warehouseService.update(selectedWarehouse.warehouseId, data);
        setWarehouses(warehouses.map(w => 
          w.warehouseId === selectedWarehouse.warehouseId ? { ...w, ...data } : w
        ));
      } else {
        const newWarehouse = await warehouseService.create(data);
        setWarehouses([...warehouses, newWarehouse]);
      }
      setOpenDialog(false);
      setError(null);
    } catch (err) {
      console.error('Error saving warehouse:', err);
      setError(t('warehouse.error.save'));
    }
  };

  if (loading) {
    return (
      <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        >
          <CircularProgress />
        </motion.div>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <AnimatedContainer>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1">
            {t('warehouse.title')}
          </Typography>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleCreate}
            >
              {t('warehouse.add')}
            </Button>
          </motion.div>
        </Box>
      </AnimatedContainer>

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatedContainer delay={0.2}>
        <WarehouseTable
          warehouses={warehouses}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </AnimatedContainer>

      // Add this to the Warehouses.tsx file to create a card grid view
// Inside the return statement, after the WarehouseTable component:

<Box sx={{ mt: 4 }}>
  <Typography variant="h5" component="h2" gutterBottom>
    {t('warehouse.cardView')}
  </Typography>
  <motion.div
    variants={{
      hidden: { opacity: 0 },
      visible: { 
        opacity: 1,
        transition: { staggerChildren: 0.1 }
      }
    }}
    initial="hidden"
    animate="visible"
  >
    <Grid container spacing={3}>
      {warehouses.map((warehouse, index) => (
        <Grid item xs={12} sm={6} md={4} key={warehouse.warehouseId}>
          <WarehouseCard 
            warehouse={warehouse} 
            onEdit={handleEdit} 
            onDelete={handleDelete}
            index={index}
          />
        </Grid>
      ))}
    </Grid>
  </motion.div>
</Box>

      <AnimatePresence>
        {openDialog && (
          <Dialog 
            open={openDialog} 
            onClose={() => setOpenDialog(false)} 
            maxWidth="md" 
            fullWidth
            PaperComponent={motion.div}
            PaperProps={{
              initial: { y: 100, opacity: 0 },
              animate: { y: 0, opacity: 1 },
              exit: { y: 100, opacity: 0 },
              transition: { duration: 0.3 }
            }}
          >
            <DialogTitle>
              {selectedWarehouse ? t('warehouse.edit') : t('warehouse.create')}
            </DialogTitle>
            <DialogContent>
              <WarehouseForm
                warehouse={selectedWarehouse}
                onSubmit={handleSubmit}
              />
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Warehouses;