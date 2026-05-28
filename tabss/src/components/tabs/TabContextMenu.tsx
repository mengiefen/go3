import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import {
  Copy,
  CopyPlus,
  Pin,
  PinOff,
  SplitSquareHorizontal,
  SplitSquareVertical,
  X,
  XCircle,
} from 'lucide-react';

export interface TabContextMenuProps {
  anchorPoint: { x: number; y: number } | null;
  tabId: string | null;
  isPinned?: boolean;
  onClose: () => void; // Close menu
  onUnpin: (id: string) => void; // Actually acts as menu close callback
  // Actions
  onCloseTab: (id: string) => void;
  onCloseOthers: (id: string) => void;
  onCloseAll: () => void;
  onDuplicate: (id: string) => void;
  onSplitRight: (id: string) => void;
  onSplitDown: (id: string) => void;
  onTogglePin: (id: string) => void;
  onCopyLink: () => void;
}

export function TabContextMenu({
  anchorPoint,
  tabId,
  isPinned,
  onClose,
  onCloseTab,
  onCloseOthers,
  onCloseAll,
  onDuplicate,
  onSplitRight,
  onSplitDown,
  onTogglePin,
  onCopyLink,
}: TabContextMenuProps) {
  const handleMenuClose = () => onClose();

  const action = (fn: () => void) => () => {
    fn();
    handleMenuClose();
  };

  if (!tabId) return null;

  return (
    <Menu
      open={!!anchorPoint}
      onClose={handleMenuClose}
      anchorReference="anchorPosition"
      anchorPosition={
        anchorPoint ? { top: anchorPoint.y, left: anchorPoint.x } : undefined
      }
      slotProps={{
        paper: {
          sx: {
            minWidth: 180,
          },
        },
      }}
    >
      <MenuItem onClick={action(() => onCloseTab(tabId))} disabled={isPinned}>
        <ListItemIcon>
          <X size={16} />
        </ListItemIcon>
        <ListItemText>Close Tab</ListItemText>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ ml: 2, fontSize: '0.75rem' }}
        >
          ⌘W
        </Typography>
      </MenuItem>
      <MenuItem onClick={action(() => onCloseOthers(tabId))}>
        <ListItemIcon>
          <XCircle size={16} />
        </ListItemIcon>
        <ListItemText>Close Others</ListItemText>
      </MenuItem>
      <MenuItem onClick={action(onCloseAll)}>
        <ListItemIcon>
          <XCircle size={16} />
        </ListItemIcon>
        <ListItemText>Close All</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={action(() => onSplitRight(tabId))}>
        <ListItemIcon>
          <SplitSquareHorizontal size={16} />
        </ListItemIcon>
        <ListItemText>Split Right</ListItemText>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ ml: 2, fontSize: '0.75rem' }}
        >
          ⌘\
        </Typography>
      </MenuItem>
      <MenuItem onClick={action(() => onSplitDown(tabId))}>
        <ListItemIcon>
          <SplitSquareVertical size={16} />
        </ListItemIcon>
        <ListItemText>Split Down</ListItemText>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ ml: 2, fontSize: '0.75rem' }}
        >
          ⌘⇧\
        </Typography>
      </MenuItem>
      <Divider />
      <MenuItem onClick={action(() => onDuplicate(tabId))}>
        <ListItemIcon>
          <CopyPlus size={16} />
        </ListItemIcon>
        <ListItemText>Duplicate</ListItemText>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ ml: 2, fontSize: '0.75rem' }}
        >
          ⌘⇧D
        </Typography>
      </MenuItem>
      <MenuItem onClick={action(() => onTogglePin(tabId))}>
        <ListItemIcon>
          {isPinned ? <PinOff size={16} /> : <Pin size={16} />}
        </ListItemIcon>
        <ListItemText>{isPinned ? 'Unpin Tab' : 'Pin Tab'}</ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem onClick={action(onCopyLink)}>
        <ListItemIcon>
          <Copy size={16} />
        </ListItemIcon>
        <ListItemText>Copy Link</ListItemText>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ ml: 2, fontSize: '0.75rem' }}
        >
          ⌘⇧L
        </Typography>
      </MenuItem>
    </Menu>
  );
}
