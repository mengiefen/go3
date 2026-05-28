import { Close, Search } from '@mui/icons-material';
import { InputAdornment, TextField, type TextFieldProps } from '@mui/material';
import React from 'react';
import { useTableContext } from './TableRoot';

export interface TableGlobalSearchProps extends Omit<
  TextFieldProps,
  'value' | 'onChange'
> {
  placeholder?: string;
  debounceMs?: number;
}

export function TableGlobalSearch({
  placeholder = 'Search...',
  debounceMs = 300,
  ...props
}: TableGlobalSearchProps) {
  const { globalFilter, setGlobalFilter } = useTableContext();

  // Local state for instant typing, syncing to Context with debounce
  const [localValue, setLocalValue] = React.useState(globalFilter);

  React.useEffect(() => {
    setLocalValue(globalFilter);
  }, [globalFilter]);

  React.useEffect(() => {
    const handler = setTimeout(() => {
      if (globalFilter !== localValue) {
        setGlobalFilter(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(handler);
  }, [localValue, debounceMs, globalFilter, setGlobalFilter]);

  const handleClear = () => {
    setLocalValue('');
    setGlobalFilter('');
  };

  return (
    <TextField
      size="small"
      placeholder={placeholder}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <Search sx={{ fontSize: 18 }} />
          </InputAdornment>
        ),
        endAdornment: localValue ? (
          <InputAdornment
            position="end"
            sx={{ cursor: 'pointer' }}
            onClick={handleClear}
          >
            <Close sx={{ fontSize: 16 }} />
          </InputAdornment>
        ) : null,
      }}
      sx={{
        backgroundColor: 'background.paper',
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
        ...props.sx,
      }}
      {...props}
    />
  );
}
