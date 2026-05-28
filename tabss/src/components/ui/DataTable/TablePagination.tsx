import {
  TablePagination as MuiTablePagination,
  type TablePaginationProps as MuiTablePaginationProps,
} from '@mui/material';
import React from 'react';
import { useTableContext } from './TableRoot';

export interface TablePaginationProps extends Omit<
  MuiTablePaginationProps,
  'count' | 'page' | 'rowsPerPage' | 'onPageChange' | 'onRowsPerPageChange'
> {
  rowsPerPageOptions?: number[];
}

export function TablePagination({
  rowsPerPageOptions = [5, 10, 25],
  ...props
}: TablePaginationProps) {
  const { page, setPage, rowsPerPage, setRowsPerPage, totalCount } =
    useTableContext();

  const handleChangePage = (
    _: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <MuiTablePagination
      component="div"
      count={totalCount}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
      rowsPerPageOptions={rowsPerPageOptions}
      sx={{ borderTop: '1px solid', borderColor: 'divider', ...props.sx }}
      {...props}
    />
  );
}
