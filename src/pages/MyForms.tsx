import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  Menu,
  MenuItem,
} from '@mui/material';
import {
  Visibility,
  Delete,
  MoreVert,
  Add,
  DateRange,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { deleteForm, loadForm } from '../store/formSlice';
import dayjs from 'dayjs';

const MyForms: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { savedForms } = useAppSelector(state => state.form);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedFormId, setSelectedFormId] = React.useState<string | null>(null);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, formId: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedFormId(formId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedFormId(null);
  };

  const handlePreview = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/preview');
    handleMenuClose();
  };

  const handleEdit = (formId: string) => {
    dispatch(loadForm(formId));
    navigate('/create');
    handleMenuClose();
  };

  const handleDelete = (formId: string) => {
    if (window.confirm('Are you sure you want to delete this form?')) {
      dispatch(deleteForm(formId));
    }
    handleMenuClose();
  };

  const formatDate = (dateString: string) => {
    return dayjs(dateString).format('MMM DD, YYYY');
  };

  if (savedForms.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" gutterBottom>
          No Saved Forms
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          You haven't created any forms yet. Start building your first form!
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/create')}
          startIcon={<Add />}
          size="large"
        >
          Create New Form
        </Button>
      </Paper>
    );
  }

  return (
    <Box>
      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
              My Forms
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {savedForms.length} saved form{savedForms.length !== 1 ? 's' : ''}
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            onClick={() => navigate('/create')}
            startIcon={<Add />}
            size="large"
          >
            Create New Form
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {savedForms
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map((form) => (
            <Grid item xs={12} md={6} lg={4} key={form.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                      {form.name}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, form.id)}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <DateRange fontSize="small" color="action" />
                    <Typography variant="body2" color="text.secondary">
                      {formatDate(form.createdAt)}
                    </Typography>
                  </Box>
                  
                  <Chip
                    label={`${form.fields.length} fields`}
                    size="small"
                    variant="outlined"
                  />
                </CardContent>
                
                <CardActions sx={{ pt: 0 }}>
                  <Button
                    size="small"
                    onClick={() => handlePreview(form.id)}
                    startIcon={<Visibility />}
                  >
                    Preview
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleEdit(form.id)}
                  >
                    Edit
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
      </Grid>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={() => selectedFormId && handlePreview(selectedFormId)}>
          <Visibility fontSize="small" sx={{ mr: 1 }} />
          Preview
        </MenuItem>
        <MenuItem onClick={() => selectedFormId && handleEdit(selectedFormId)}>
          Edit
        </MenuItem>
        <MenuItem onClick={() => selectedFormId && handleDelete(selectedFormId)}>
          <Delete fontSize="small" sx={{ mr: 1 }} />
          Delete
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default MyForms;