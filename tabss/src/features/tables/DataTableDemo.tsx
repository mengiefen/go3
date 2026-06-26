import { GridView, Mail, MoreVert, ViewList } from '@mui/icons-material';
import {
  Avatar,
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableColumnSearch,
  TableContainer,
  TableGlobalSearch,
  TableHead,
  TablePagination,
  TableRoot,
  TableRow,
  TableSelectionCheckbox,
  TableSortHeader,
} from '@/components/ui/DataTable/index';

// Sample Data
const FIRST_NAMES = [
  'Alice',
  'Bob',
  'Charlie',
  'Diana',
  'Ethan',
  'Fiona',
  'George',
  'Hannah',
  'Ian',
  'Jane',
  'Kevin',
  'Laura',
  'Mike',
  'Nina',
  'Oscar',
  'Paula',
  'Quinn',
  'Rachel',
  'Sam',
  'Tina',
  'Uma',
  'Victor',
  'Wendy',
  'Xavier',
  'Yara',
  'Zack',
];
const ROLES = ['Admin', 'Editor', 'Viewer'];
const STATUSES = ['Active', 'Inactive'];

const USERS = Array.from({ length: 30 }, (_, i) => {
  const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
  const lastName = `User${i + 1}`;
  return {
    id: String(i + 1),
    name: `${firstName} ${lastName}`,
    role: ROLES[i % ROLES.length],
    status: STATUSES[(i + (i % 3)) % STATUSES.length], // slightly randomize status
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@go2.net`,
  };
});

export function DataTableDemo() {
  const [variant, setVariant] = React.useState<
    'default' | 'striped' | 'bordered'
  >('default');
  const [dense, setDense] = React.useState(false);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1000,
        mx: 'auto',
        p: 4,
        bgcolor: 'background.default',
      }}
    >
      {/* External Controls to demonstrate Context flexibility */}
      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button
          variant={variant === 'default' ? 'contained' : 'outlined'}
          onClick={() => setVariant('default')}
        >
          Default
        </Button>
        <Button
          variant={variant === 'striped' ? 'contained' : 'outlined'}
          onClick={() => setVariant('striped')}
        >
          Striped
        </Button>
        <Button
          variant={variant === 'bordered' ? 'contained' : 'outlined'}
          onClick={() => setVariant('bordered')}
        >
          Bordered
        </Button>
        <Button
          variant={dense ? 'contained' : 'outlined'}
          onClick={() => setDense(!dense)}
          color="secondary"
        >
          Dense Mode
        </Button>
      </Stack>

      <TableRoot
        data={USERS}
        defaultRowsPerPage={5}
        defaultOrderBy="name"
        variant={variant}
        dense={dense}
      >
        {({ selectedIds }) => (
          <>
            {/* Custom Toolbar - Fully placed outside the actual table! */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                py: 2,
                px: 3,
                bgcolor:
                  selectedIds.length > 0
                    ? 'action.selected'
                    : 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderBottom: 0,
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
              }}
            >
              {selectedIds.length > 0 ? (
                <Typography color="primary">
                  {selectedIds.length} users selected selected
                </Typography>
              ) : (
                <Typography variant="h6" fontWeight={600}>
                  System Users
                </Typography>
              )}

              <Stack direction="row" spacing={2} alignItems="center">
                <TableGlobalSearch
                  sx={{ minWidth: 250 }}
                  placeholder="Search globally..."
                />

                <Stack direction="row" spacing={1}>
                  {selectedIds.length > 0 && (
                    <Button color="error" size="small">
                      Delete Selected
                    </Button>
                  )}
                  <IconButton size="small">
                    <ViewList sx={{ fontSize: 20 }} />
                  </IconButton>
                  <IconButton size="small">
                    <GridView sx={{ fontSize: 20 }} />
                  </IconButton>
                </Stack>
              </Stack>
            </Box>

            <TableContainer
              sx={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
              }}
            >
              <Table>
                <TableHead>
                  <TableRow>
                    <TableSelectionCheckbox /> {/* Automatic Select All */}
                    <TableSortHeader id="name">User</TableSortHeader>
                    <TableSortHeader id="role">Role</TableSortHeader>
                    <TableSortHeader id="status">Status</TableSortHeader>
                    <TableCell align="right">Actions</TableCell>
                  </TableRow>
                  {/* Inline Column Filters Row */}
                  <TableRow>
                    <TableCell
                      padding="checkbox"
                      sx={{
                        bgcolor: 'action.hover',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                    <TableColumnSearch
                      columnId="name"
                      placeholder="Filter user..."
                    />
                    <TableColumnSearch
                      columnId="role"
                      placeholder="Filter role..."
                    />
                    <TableColumnSearch
                      columnId="status"
                      placeholder="Filter status..."
                    />
                    <TableCell
                      sx={{
                        bgcolor: 'action.hover',
                        borderBottom: '1px solid',
                        borderColor: 'divider',
                      }}
                    />
                  </TableRow>
                </TableHead>

                <TableBody>
                  {({ visibleData }) =>
                    visibleData.map((user) => (
                      <TableRow key={user.id} hover>
                        <TableSelectionCheckbox id={user.id} />

                        {/* Custom Rendered Cell! */}
                        <TableCell>
                          <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                          >
                            <Avatar
                              sx={{
                                width: 32,
                                height: 32,
                                bgcolor: 'primary.main',
                                fontSize: 14,
                              }}
                            >
                              {user.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" fontWeight={500}>
                                {user.name}
                              </Typography>
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 0.5,
                                  color: 'text.secondary',
                                }}
                              >
                                <Mail sx={{ fontSize: 14, mr: 0.5 }} />
                                <Typography variant="caption">
                                  {user.email}
                                </Typography>
                              </Box>
                            </Box>
                          </Stack>
                        </TableCell>

                        <TableCell>
                          <Typography
                            variant="body2"
                            fontFamily="JetBrains Mono, monospace"
                          >
                            {user.role}
                          </Typography>
                        </TableCell>

                        {/* Another Custom Rendered Cell */}
                        <TableCell>
                          <Chip
                            label={user.status}
                            size="small"
                            color={
                              user.status === 'Active' ? 'success' : 'default'
                            }
                            variant={
                              user.status === 'Active' ? 'filled' : 'outlined'
                            }
                          />
                        </TableCell>

                        <TableCell align="right">
                          <IconButton size="small">
                            <MoreVert sx={{ fontSize: 16 }} />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </TableContainer>

            <Box
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderTop: 0,
                borderBottomLeftRadius: 8,
                borderBottomRightRadius: 8,
                bgcolor: 'background.paper',
              }}
            >
              <TablePagination />
            </Box>
          </>
        )}
      </TableRoot>
    </Box>
  );
}
