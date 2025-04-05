import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  useTheme,
  Chip,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { Warehouse } from '../../services/warehouseService';
import { useTranslation } from 'react-i18next';

interface WarehouseTableProps {
  warehouses: Warehouse[];
  onEdit?: (warehouse: Warehouse) => void;
  onDelete?: (id: number) => void;
}

// Define types for amenities
type AmenityObject = {
  type: string;
  available: boolean;
  description: string;
};

type AmenityString = string;

const WarehouseTable: React.FC<WarehouseTableProps> = ({
  warehouses,
  onEdit,
  onDelete,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

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

  // Improved function to handle different amenity formats
  const renderAmenities = (warehouse: Warehouse) => {
    if (!warehouse.amenities || warehouse.amenities.length === 0) {
      return <span>No amenities</span>;
    }

    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
        {Array.isArray(warehouse.amenities) && warehouse.amenities.map((amenity, idx) => {
          // Check if amenity is a string or an object
          const isStringAmenity = typeof amenity === 'string';
          
          if (isStringAmenity) {
            // Handle string amenity
            return (
              <Chip
                key={`${warehouse.warehouseId}-amenity-${idx}`}
                label={amenity as string}
                size="small"
                color="primary"
                icon={<CheckIcon fontSize="small" />}
                sx={{
                  textTransform: 'capitalize',
                  m: 0.2
                }}
              />
            );
          } else {
            // Handle object amenity
            const amenityObj = amenity as AmenityObject;
            return (
              <Chip
                key={`${warehouse.warehouseId}-amenity-${idx}`}
                label={amenityObj.type}
                title={amenityObj.description}
                size="small"
                color={amenityObj.available ? "success" : "default"}
                icon={amenityObj.available ? <CheckIcon fontSize="small" /> : undefined}
                sx={{
                  textTransform: 'capitalize',
                  m: 0.2
                }}
              />
            );
          }
        })}
      </Box>
    );
  };

  // Function to format operating hours correctly
  const renderOperatingHours = (warehouse: Warehouse) => {
    const operatingHours = warehouse.operatingHours;

    // Check if operatingHours has weekdays array format
    if (operatingHours?.weekdays && Array.isArray(operatingHours.weekdays)) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          {operatingHours.weekdays.map((day, index) => (
            <Box
              key={index}
              sx={{
                fontSize: '0.75rem',
                color: theme.palette.text.secondary
              }}
            >
              {day.day}: {day.open && day.close ? `${day.open} - ${day.close}` : 'Closed'}
            </Box>
          ))}
        </Box>
      );
    }

    return null; // Return null if no operating hours are available
  };

  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.common.white }}>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.common.white }}>{t('warehouse.name')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.common.white }}>{t('warehouse.status')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.common.white }}>{t('warehouse.address')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.common.white }}>{t('warehouse.amenities')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.common.white }}>{t('warehouse.operatingHours')}</TableCell>
            <TableCell sx={{ fontWeight: 'bold', color: theme.palette.common.white }} align="right">{t('common.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {warehouses.map((warehouse, index) => (
            <TableRow 
              key={warehouse.warehouseId}
              sx={{ 
                backgroundColor: index % 2 === 0 ? theme.palette.action.hover : theme.palette.background.paper,
                '&:hover': { backgroundColor: theme.palette.action.selected }
              }}
            >
              <TableCell>{warehouse.name}</TableCell>
              <TableCell>
                <Box 
                  sx={{ 
                    display: 'inline-block',
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                    backgroundColor: 
                      warehouse.status === 'active' ? theme.palette.success.light :
                      warehouse.status === 'maintenance' ? theme.palette.warning.light :
                      theme.palette.error.light,
                    textTransform: 'capitalize',
                    fontWeight: 'medium'
                  }}
                >
                  {t(`warehouse.statusTypes.${warehouse.status}`)}
                </Box>
              </TableCell>
              <TableCell>{warehouse.address}</TableCell>
              <TableCell>
                {renderAmenities(warehouse)}
              </TableCell>
              <TableCell>
                {renderOperatingHours(warehouse)}
              </TableCell>
              <TableCell align="right">
                <IconButton
                  size="small"
                  onClick={() => onEdit?.(warehouse)}
                  title={t('common.edit')}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete?.(warehouse.warehouseId)}
                  title={t('common.delete')}
                >
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default WarehouseTable;