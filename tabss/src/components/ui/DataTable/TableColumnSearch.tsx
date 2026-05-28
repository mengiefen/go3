import { TextField } from '@mui/material';
import { TableCell } from './Table';
import { useTableContext } from './TableRoot';

export interface TableColumnSearchProps {
  columnId: string;
  placeholder?: string;
}

export function TableColumnSearch({
  columnId,
  placeholder = 'Filter...',
}: TableColumnSearchProps) {
  const { columnFilters, setColumnFilter } = useTableContext();
  const currentValue = columnFilters[columnId] || '';

  return (
    <TableCell
      sx={{
        p: 1,
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'action.hover',
      }}
    >
      <TextField
        fullWidth
        size="small"
        placeholder={placeholder}
        value={currentValue}
        onChange={(e) => setColumnFilter(columnId, e.target.value)}
        sx={{
          '& .MuiInputBase-root': {
            fontSize: '0.75rem',
            height: 28,
            backgroundColor: 'background.paper',
            borderRadius: 1,
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
            transition: 'all 0.2s ease',
            '& fieldset': {
              borderColor: 'divider',
            },
            '&:hover fieldset': {
              borderColor: 'text.secondary',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              borderWidth: '1px',
            },
            '&.Mui-focused': {
              boxShadow:
                '0 0 0 2px rgba(var(--mui-palette-primary-mainChannel), 0.2)',
            },
          },
          '& .MuiInputBase-input': {
            p: '0 8px',
            '&::placeholder': {
              color: 'text.disabled',
              opacity: 1,
            },
          },
        }}
      />
    </TableCell>
  );
}
