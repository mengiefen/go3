import { FilterList } from '@mui/icons-material';
import { Box, IconButton, Popover, TextField, Typography } from '@mui/material';
import React from 'react';
import { useTableContext } from './TableRoot';

export interface TableColumnFilterProps {
  columnId: string;
  label: string;
}

export function TableColumnFilter({ columnId, label }: TableColumnFilterProps) {
  const { columnFilters, setColumnFilter } = useTableContext();
  const currentValue = columnFilters[columnId] || '';

  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null,
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? `filter-popover-${columnId}` : undefined;

  const isActive = Boolean(currentValue);

  return (
    <>
      <IconButton
        size="small"
        onClick={handleClick}
        sx={{
          ml: 0.5,
          color: isActive ? 'primary.main' : 'text.secondary',
          bgcolor: isActive ? 'primary.light' : 'transparent',
        }}
        aria-label={`Filter ${label}`}
      >
        <FilterList sx={{ fontSize: 14 }} />
      </IconButton>

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="body2" sx={{ mb: 1.5, fontWeight: 500 }}>
            Filter {label}
          </Typography>
          <TextField
            autoFocus
            size="small"
            fullWidth
            placeholder={`Search ${label.toLowerCase()}...`}
            value={currentValue}
            onChange={(e) => setColumnFilter(columnId, e.target.value)}
          />
        </Box>
      </Popover>
    </>
  );
}
