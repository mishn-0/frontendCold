// src/components/warehouse/WarehouseCard.tsx
import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Grid,
  Divider,
} from '@mui/material';
import { Warehouse, warehouseService } from '../../services/warehouseService';
import { useTranslation } from 'react-i18next';
import {
  AccessTime as TimeIcon,
  LocationOn as LocationIcon,
  CalendarToday as DateIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

interface WarehouseCardProps {
  warehouse: Warehouse;
  onEdit?: (warehouse: Warehouse) => void;
  onDelete?: (id: number) => void;
  index?: number;
}

const WarehouseCard: React.FC<WarehouseCardProps> = ({ warehouse, onEdit, onDelete, index = 0 }) => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (onDelete) {
      setLoading(true);
      try {
        await warehouseService.delete(warehouse.warehouseId);
        onDelete(warehouse.warehouseId);
      } catch (error) {
        console.error('Error deleting warehouse:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'maintenance':
        return 'warning';
      case 'closed':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        ease: [0.6, 0.05, -0.01, 0.9]
      }}
      whileHover={{ 
        y: -10,
        boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
        transition: { duration: 0.3 }
      }}
    >
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flexGrow: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" component="h2">
              {warehouse.name}
            </Typography>
            <Chip
              label={t(`warehouse.statusTypes.${warehouse.status}`)}
              color={getStatusColor(warehouse.status)}
              size="small"
            />
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <LocationIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {warehouse.address}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TimeIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {Object.entries(warehouse.operatingHours).map(([day, hours]) => (
                    <span key={day}>
                      {t(`days.${day}`)}: {hours.open}-{hours.close}
                    </span>
                  ))}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <DateIcon color="action" fontSize="small" />
                <Typography variant="body2" color="text.secondary">
                  {t('warehouse.created')}: {formatDate(warehouse.createdAt)}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 1 }} />
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('warehouse.amenities')}:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {warehouse.amenities.map((amenity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 * index }}
                  >
                    <Chip 
                      label={t(`warehouse.amenitiesTypes.${amenity}`)} 
                      size="small" 
                    />
                  </motion.div>
                ))}
              </Box>
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="small"
              onClick={() => onEdit?.(warehouse)}
              disabled={loading}
            >
              {t('common.edit')}
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="small"
              color="error"
              onClick={handleDelete}
              disabled={loading}
            >
              {t('common.delete')}
            </Button>
          </motion.div>
        </CardActions>
      </Card>
    </motion.div>
  );
};

export default WarehouseCard;