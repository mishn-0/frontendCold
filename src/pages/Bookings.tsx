import React, { useEffect, useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { bookingService } from '../services/bookingService';
import { Booking } from '../types';
import { useTheme } from '@mui/material/styles';
import EditIcon from '@mui/icons-material/Edit';
import BookingForm from '../components/BookingForm';
//
const Bookings: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | undefined>(undefined);
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getAll();
      setBookings(data);
    } catch (err) {
      setError('Failed to fetch bookings');
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleAddBooking = () => {
    setSelectedBooking(undefined);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleEditBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setSelectedBooking(undefined);
  };

  const handleFormSuccess = () => {
    fetchBookings();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>{t('booking.title')}</Typography>
      <Button 
        variant="contained" 
        onClick={handleAddBooking} 
        sx={{ mb: 2 }}
        color="primary"
      >
        Add Booking
      </Button>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: theme.palette.primary.main, color: theme.palette.common.white }}>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.common.white }}>Booking ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.common.white }}>Customer ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.common.white }}>Warehouse ID</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.common.white }}>Start Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.common.white }}>End Date</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.common.white }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.common.white }}>Notes</TableCell>
              <TableCell sx={{ fontWeight: 'bold', color: theme.palette.common.white }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((booking, index) => (
              <TableRow 
                key={booking.bookingId} 
                sx={{ 
                  backgroundColor: index % 2 === 0 ? theme.palette.action.hover : theme.palette.background.paper, 
                  '&:hover': { backgroundColor: theme.palette.action.selected } 
                }}
              >
                <TableCell>{booking.bookingId}</TableCell>
                <TableCell>{booking.customerId}</TableCell>
                <TableCell>{booking.warehouseId}</TableCell>
                <TableCell>{formatDate(booking.startDate)}</TableCell>
                <TableCell>{formatDate(booking.endDate)}</TableCell>
                <TableCell>
                  <Box 
                    sx={{ 
                      display: 'inline-block',
                      px: 1,
                      py: 0.5,
                      borderRadius: 1,
                      backgroundColor: 
                        booking.status === 'pending' ? theme.palette.warning.light :
                        booking.status === 'confirmed' ? theme.palette.info.light :
                        booking.status === 'cancelled' ? theme.palette.error.light :
                        theme.palette.success.light,
                      
                      textTransform: 'capitalize',
                      fontWeight: 'medium'
                    }}
                  >
                    {booking.status}
                  </Box>
                </TableCell>
                <TableCell>{booking.notes || '-'}</TableCell>
                <TableCell>
                  <Tooltip title="Edit Booking">
                    <IconButton 
                      size="small" 
                      onClick={() => handleEditBooking(booking)}
                      color="primary"
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <BookingForm
        open={isFormOpen}
        onClose={handleCloseForm}
        onSuccess={handleFormSuccess}
        booking={selectedBooking}
        mode={formMode}
      />
    </Box>
  );
};

export default Bookings; 