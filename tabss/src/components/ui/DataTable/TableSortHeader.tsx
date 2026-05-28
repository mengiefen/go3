import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  UnfoldMore,
} from '@mui/icons-material';
import { type TableCellProps, TableSortLabel } from '@mui/material';
import React from 'react';
import { TableCell } from './Table'; // Our wrapped version
import { useTableContext } from './TableRoot';

export interface TableSortHeaderProps extends Omit<TableCellProps, 'id'> {
  id: string;
  children: React.ReactNode;
}

export function TableSortHeader({
  id,
  children,
  ...props
}: TableSortHeaderProps) {
  const { order, orderBy, onRequestSort } = useTableContext();
  const isActive = orderBy === id;

  return (
    <TableCell
      sortDirection={isActive ? order : false}
      {...props}
      sx={{ fontWeight: 600, ...props.sx }}
    >
      <TableSortLabel
        active={true} // Always force active so the icon renders, we control opacity manually
        direction={isActive ? order : 'asc'}
        onClick={() => onRequestSort(id)}
        IconComponent={() => {
          if (!isActive) {
            return <UnfoldMore sx={{ fontSize: 14, ml: 0.5, opacity: 0.3 }} />;
          }
          return order === 'desc' ? (
            <KeyboardArrowDown
              sx={{ fontSize: 14, ml: 0.5, color: 'primary.main' }}
            />
          ) : (
            <KeyboardArrowUp
              sx={{ fontSize: 14, ml: 0.5, color: 'primary.main' }}
            />
          );
        }}
      >
        {children}
      </TableSortLabel>
    </TableCell>
  );
}
