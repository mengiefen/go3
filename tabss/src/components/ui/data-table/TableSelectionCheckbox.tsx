import { Checkbox, type CheckboxProps } from '@mui/material';
import { TableCell } from './Table';
import { useTableContext } from './TableRoot';

export interface TableSelectionCheckboxProps extends Omit<CheckboxProps, 'id'> {
  /**
   * The unique ID of the row.
   * If omitted, the checkbox acts as a "Select All" toggle for the header.
   */
  id?: string;
}

export function TableSelectionCheckbox({
  id,
  ...props
}: TableSelectionCheckboxProps) {
  const { data, selectedIds, isSelected, onSelectRow, onSelectAllClick } =
    useTableContext();

  if (id === undefined) {
    // Header "Select All" Mode
    const checked = data.length > 0 && selectedIds.length === data.length;
    const indeterminate =
      selectedIds.length > 0 && selectedIds.length < data.length;

    return (
      <TableCell padding="checkbox">
        <Checkbox
          color="primary"
          indeterminate={indeterminate}
          checked={checked}
          onChange={onSelectAllClick}
          slotProps={{ input: { 'aria-label': 'select all records' } }}
          {...props}
        />
      </TableCell>
    );
  }

  // Row "Select Specific" Mode
  const checked = isSelected(id);

  return (
    <TableCell padding="checkbox">
      <Checkbox
        color="primary"
        checked={checked}
        onClick={(e) => {
          e.stopPropagation();
          onSelectRow(id);
        }}
        slotProps={{ input: { 'aria-label': `select record ${id}` } }}
        {...props}
      />
    </TableCell>
  );
}
