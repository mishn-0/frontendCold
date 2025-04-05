import React from 'react';
import {
  TextField,
  MenuItem,
  Grid,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import * as ReactHookForm from 'react-hook-form';
import { Warehouse } from '../../services/warehouseService';
import { useTranslation } from 'react-i18next';

interface WarehouseFormProps {
  warehouse?: Warehouse | null;
  onSubmit: (data: Omit<Warehouse, 'warehouseId' | 'createdAt' | 'updatedAt' | 'deletedAt'>) => void;
}

interface FieldProps {
  field: {
    value: any;
    onChange: (value: any) => void;
    name: string;
  };
}

const WarehouseForm: React.FC<WarehouseFormProps> = ({ warehouse, onSubmit }) => {
  const { t } = useTranslation();
  const { control, handleSubmit, formState: { errors } } = ReactHookForm.useForm({
    defaultValues: warehouse || {
      name: '',
      ownerId: 1, // This should come from the authenticated user
      status: 'active',
      location: {
        x: 0,
        y: 0
      },
      address: '',
      operatingHours: {
        weekdays: [
          { day: 'Monday', open: '09:00', close: '17:00' },
          { day: 'Tuesday', open: '09:00', close: '17:00' },
          { day: 'Wednesday', open: '09:00', close: '17:00' },
          { day: 'Thursday', open: '09:00', close: '17:00' },
          { day: 'Friday', open: '09:00', close: '17:00' },
          { day: 'Saturday', open: '09:00', close: '13:00' },
          { day: 'Sunday', open: '09:00', close: '13:00' }
        ]
      },
      amenities: [],
    },
  });

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const commonAmenities = [
    { type: 'seguridad', description: 'Security' },
    { type: 'climatizado', description: 'Climate Controlled' },
    { type: 'carga', description: 'Loading Dock' },
    { type: 'descarga', description: 'Unloading Dock' },
    { type: 'almacenamiento', description: 'Storage' }
  ];

  const handleFormSubmit = (data: any) => {
    // Convert location to GeoJSON format for the API
    const formData = {
      ...data,
      location: {
        type: 'Point',
        coordinates: [parseFloat(data.location.x), parseFloat(data.location.y)]
      }
    };
    onSubmit(formData);
  };

  return (
    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <ReactHookForm.Controller
            name="name"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }: FieldProps) => (
              <TextField
                {...field}
                fullWidth
                label={t('warehouse.name')}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <ReactHookForm.Controller
            name="status"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }: FieldProps) => (
              <TextField
                {...field}
                select
                fullWidth
                label={t('warehouse.status')}
                error={!!errors.status}
                helperText={errors.status?.message}
              >
                <MenuItem value="active">{t('warehouse.statusTypes.active')}</MenuItem>
                <MenuItem value="maintenance">{t('warehouse.statusTypes.maintenance')}</MenuItem>
                <MenuItem value="closed">{t('warehouse.statusTypes.closed')}</MenuItem>
              </TextField>
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <ReactHookForm.Controller
            name="address"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }: FieldProps) => (
              <TextField
                {...field}
                fullWidth
                label={t('warehouse.address')}
                error={!!errors.address}
                helperText={errors.address?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <ReactHookForm.Controller
            name="location.x"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }: FieldProps) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                label={t('warehouse.latitude')}
                error={!!errors.location?.x}
                helperText={errors.location?.x?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <ReactHookForm.Controller
            name="location.y"
            control={control}
            rules={{ required: t('validation.required') }}
            render={({ field }: FieldProps) => (
              <TextField
                {...field}
                fullWidth
                type="number"
                label={t('warehouse.longitude')}
                error={!!errors.location?.y}
                helperText={errors.location?.y?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('warehouse.operatingHours')}
          </Typography>
          <Grid container spacing={2}>
            {days.map((day) => (
              <Grid item xs={12} sm={6} key={day}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <ReactHookForm.Controller
                    name={`operatingHours.weekdays.${days.indexOf(day)}.open`}
                    control={control}
                    rules={{ required: t('validation.required') }}
                    render={({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        type="time"
                        label={t(`days.${day.toLowerCase()}`)}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.operatingHours?.weekdays?.[days.indexOf(day)]?.open}
                        helperText={errors.operatingHours?.weekdays?.[days.indexOf(day)]?.open?.message}
                      />
                    )}
                  />
                  <ReactHookForm.Controller
                    name={`operatingHours.weekdays.${days.indexOf(day)}.close`}
                    control={control}
                    rules={{ required: t('validation.required') }}
                    render={({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        type="time"
                        label={t('warehouse.close')}
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.operatingHours?.weekdays?.[days.indexOf(day)]?.close}
                        helperText={errors.operatingHours?.weekdays?.[days.indexOf(day)]?.close?.message}
                      />
                    )}
                  />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="subtitle1" gutterBottom>
            {t('warehouse.amenities')}
          </Typography>
          <FormGroup>
            <ReactHookForm.Controller
              name="amenities"
              control={control}
              render={({ field }) => (
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                  {commonAmenities.map((amenity) => (
                    <FormControlLabel
                      key={amenity.type}
                      control={
                        <Checkbox
                          checked={field.value?.some((a: any) => a.type === amenity.type) || false}
                          onChange={(e) => {
                            const currentAmenities = field.value || [];
                            if (e.target.checked) {
                              field.onChange([...currentAmenities, { type: amenity.type, available: true, description: amenity.description }]);
                            } else {
                              field.onChange(currentAmenities.filter((a: any) => a.type !== amenity.type));
                            }
                          }}
                        />
                      }
                      label={t(`warehouse.amenitiesTypes.${amenity.type}`)}
                    />
                  ))}
                </Box>
              )}
            />
          </FormGroup>
        </Grid>

        <Grid item xs={12}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
          >
            {warehouse ? t('common.save') : t('common.create')}
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WarehouseForm; 