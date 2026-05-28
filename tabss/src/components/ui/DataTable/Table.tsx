import {
  Table as MuiTable,
  TableBody as MuiTableBody,
  type TableBodyProps as MuiTableBodyProps,
  TableCell as MuiTableCell,
  type TableCellProps as MuiTableCellProps,
  TableContainer as MuiTableContainer,
  type TableContainerProps as MuiTableContainerProps,
  TableHead as MuiTableHead,
  type TableHeadProps as MuiTableHeadProps,
  type TableProps as MuiTableProps,
  TableRow as MuiTableRow,
  type TableRowProps as MuiTableRowProps,
  Paper,
} from '@mui/material';
import React from 'react';
import { useTableContext } from './TableRoot';

// ----------------------------------------------------------------------
// Wrappers around MUI primitives that automatically hook into variants
// ----------------------------------------------------------------------

export function TableContainer(props: MuiTableContainerProps) {
  return (
    <MuiTableContainer
      component={Paper}
      elevation={0}
      variant="outlined"
      sx={{ borderRadius: 2, ...props.sx }}
      {...props}
    />
  );
}

export function Table(props: MuiTableProps) {
  const { dense } = useTableContext();
  return (
    <MuiTable
      size={dense ? 'small' : 'medium'}
      sx={{ minWidth: 650, ...props.sx }}
      {...props}
    />
  );
}

export function TableHead(props: MuiTableHeadProps) {
  return (
    <MuiTableHead
      {...props}
      sx={{
        bgcolor: 'action.hover', // Distinct background for the header
        borderBottom: '1px solid',
        borderColor: 'divider',
        ...props.sx,
      }}
    />
  );
}

interface CustomTableBodyProps<T = any> extends Omit<
  MuiTableBodyProps,
  'children'
> {
  children:
    | React.ReactNode
    | ((context: { visibleData: T[] }) => React.ReactNode);
}

export function TableBody<T = any>({
  children,
  ...props
}: CustomTableBodyProps<T>) {
  const { visibleData } = useTableContext<T>();

  return (
    <MuiTableBody {...props}>
      {typeof children === 'function' ? children({ visibleData }) : children}
    </MuiTableBody>
  );
}

export function TableRow(props: MuiTableRowProps) {
  const { variant } = useTableContext();

  return (
    <MuiTableRow
      {...props}
      sx={{
        ...(variant === 'striped' && {
          'tbody &:nth-of-type(odd)': {
            bgcolor: 'action.hover',
          },
        }),
        '&:last-child td, &:last-child th': {
          border: variant !== 'bordered' ? 0 : undefined,
        },
        ...props.sx,
      }}
    />
  );
}

export function TableCell(props: MuiTableCellProps) {
  const { variant } = useTableContext();

  return (
    <MuiTableCell
      {...props}
      sx={{
        ...(variant === 'bordered' && {
          borderRight: '1px solid',
          borderColor: 'divider',
          '&:last-child': {
            borderRight: 0,
          },
        }),
        ...props.sx,
      }}
    />
  );
}
