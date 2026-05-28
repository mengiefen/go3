import React, { createContext, useContext, useMemo, useState } from 'react';

export type Order = 'asc' | 'desc';

export interface TableContextValue<T = any> {
  // Data State
  data: T[];
  visibleData: T[];

  // Filter State
  globalFilter: string;
  setGlobalFilter: (filter: string) => void;
  columnFilters: Record<string, string>;
  setColumnFilter: (columnId: string, filter: string) => void;

  // Sorting State
  order: Order;
  orderBy: string;
  setOrder: (order: Order) => void;
  setOrderBy: (property: string) => void;
  onRequestSort: (property: string) => void;

  // Pagination State
  page: number;
  rowsPerPage: number;
  setPage: (page: number) => void;
  setRowsPerPage: (rowsPerPage: number) => void;
  totalCount: number;

  // Selection State
  selectedIds: string[];
  setSelectedIds: Omit<React.Dispatch<React.SetStateAction<string[]>>, ''>;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectRow: (id: string) => void;
  isSelected: (id: string) => boolean;

  // Utilities
  getRowId: (row: T) => string;

  // Visual Variants
  variant: 'default' | 'striped' | 'bordered';
  dense: boolean;
}

const TableContext = createContext<TableContextValue | undefined>(undefined);

export function useTableContext<T = any>() {
  const context = useContext(TableContext);
  if (!context) {
    throw new Error(
      'Table components must be used within a TableRoot provider',
    );
  }
  return context as TableContextValue<T>;
}

export interface TableRootProps<T> {
  children:
    | React.ReactNode
    | ((context: TableContextValue<T>) => React.ReactNode);
  data: T[];

  // Optional controlled state
  defaultOrderBy?: keyof T | string;
  defaultOrder?: Order;

  defaultPage?: number;
  defaultRowsPerPage?: number;
  totalCount?: number; // Enable Server-side pagination if provided

  defaultSelectedIds?: string[];

  getRowId?: (row: T) => string;

  variant?: 'default' | 'striped' | 'bordered';
  dense?: boolean;
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T | string) {
  if (b[orderBy as keyof T] < a[orderBy as keyof T]) {
    return -1;
  }
  if (b[orderBy as keyof T] > a[orderBy as keyof T]) {
    return 1;
  }
  return 0;
}

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: any, b: any) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number,
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export function TableRoot<T extends Record<string, any>>({
  children,
  data,
  defaultOrderBy = '',
  defaultOrder = 'asc',
  defaultPage = 0,
  defaultRowsPerPage = 10,
  totalCount,
  defaultSelectedIds = [],
  getRowId = (row) => (row.id ? String(row.id) : JSON.stringify(row)),
  variant = 'default',
  dense = false,
}: TableRootProps<T>) {
  // State
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = useState<string>(String(defaultOrderBy));
  const [page, setPage] = useState(defaultPage);
  const [rowsPerPage, setRowsPerPage] = useState(defaultRowsPerPage);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultSelectedIds);

  const [globalFilter, setGlobalFilter] = useState('');
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>(
    {},
  );

  const setColumnFilter = (columnId: string, filter: string) => {
    setColumnFilters((prev) => ({
      ...prev,
      [columnId]: filter,
    }));
    setPage(0); // Reset page on filter
  };

  const isServerSidePagination = totalCount !== undefined;

  const onRequestSort = (property: string) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
    // Reset to first page when sorting changes
    setPage(0);
  };

  const onSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => getRowId(n));
      setSelectedIds(newSelecteds);
      return;
    }
    setSelectedIds([]);
  };

  const onSelectRow = (id: string) => {
    const selectedIndex = selectedIds.indexOf(id);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedIds, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedIds.slice(1));
    } else if (selectedIndex === selectedIds.length - 1) {
      newSelected = newSelected.concat(selectedIds.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedIds.slice(0, selectedIndex),
        selectedIds.slice(selectedIndex + 1),
      );
    }

    setSelectedIds(newSelected);
  };

  const isSelected = (id: string) => selectedIds.indexOf(id) !== -1;

  const processedData = useMemo(() => {
    if (isServerSidePagination) {
      return data;
    }

    // 1. Apply Filters
    let result = data;

    if (globalFilter) {
      const lowerFilter = globalFilter.toLowerCase();
      result = result.filter((row) => {
        return Object.values(row).some((val) =>
          String(val).toLowerCase().includes(lowerFilter),
        );
      });
    }

    if (Object.keys(columnFilters).length > 0) {
      result = result.filter((row) => {
        return Object.entries(columnFilters).every(([colId, filterVal]) => {
          if (!filterVal) return true;
          const rowVal = row[colId];
          return String(rowVal).toLowerCase().includes(filterVal.toLowerCase());
        });
      });
    }

    // 2. Client-side Sort
    return stableSort(result, getComparator(order, orderBy));
  }, [
    data,
    order,
    orderBy,
    isServerSidePagination,
    globalFilter,
    columnFilters,
  ]);

  const visibleData = useMemo(() => {
    if (isServerSidePagination) {
      return data;
    }

    // 3. Client-side Pagination
    if (rowsPerPage > 0) {
      return processedData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      );
    }

    return processedData;
  }, [processedData, page, rowsPerPage, isServerSidePagination]);

  const value: TableContextValue<T> = {
    data,
    visibleData,
    globalFilter,
    setGlobalFilter: (val) => {
      setGlobalFilter(val);
      setPage(0);
    },
    columnFilters,
    setColumnFilter,
    order,
    orderBy,
    setOrder,
    setOrderBy,
    onRequestSort,
    page,
    rowsPerPage,
    setPage,
    setRowsPerPage,
    totalCount: isServerSidePagination ? totalCount : processedData.length,
    selectedIds,
    setSelectedIds,
    onSelectAllClick,
    onSelectRow,
    isSelected,
    getRowId,
    variant,
    dense,
  };

  return (
    <TableContext.Provider value={value}>
      {typeof children === 'function' ? children(value) : children}
    </TableContext.Provider>
  );
}
