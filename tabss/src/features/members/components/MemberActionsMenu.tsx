import {
  AdminPanelSettings,
  Archive,
  Mail,
  MoreVert,
  PersonOff,
  Unarchive,
} from '@mui/icons-material';
import { Divider, IconButton, ListItemIcon, Menu, MenuItem, Tooltip } from '@mui/material';
import React, { useState } from 'react';
import {
  useArchiveMemberMutation,
  useRevokeAdminMutation,
  useSendInvitationMutation,
  useSetAsAdminMutation,
  useUnarchiveMemberMutation,
  useUninviteMemberMutation,
} from '../membersApi';
import type { Member } from '../types';

interface MemberActionsMenuProps {
  member: Member;
  orgId: string;
  onEdit: (member: Member) => void;
}

export function MemberActionsMenu({ member, orgId, onEdit }: MemberActionsMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const [sendInvitation, { isLoading: isSending }] = useSendInvitationMutation();
  const [archiveMember, { isLoading: isArchiving }] = useArchiveMemberMutation();
  const [unarchiveMember, { isLoading: isUnarchiving }] = useUnarchiveMemberMutation();
  const [uninviteMember, { isLoading: isUninviting }] = useUninviteMemberMutation();
  const [setAsAdmin, { isLoading: isSettingAdmin }] = useSetAsAdminMutation();
  const [revokeAdmin, { isLoading: isRevokingAdmin }] = useRevokeAdminMutation();

  const isLoading = isSending || isArchiving || isUnarchiving || isUninviting || isSettingAdmin || isRevokingAdmin;

  const handleOpen = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => setAnchorEl(null);

  const handle = (action: () => Promise<any>) => async () => {
    handleClose();
    await action();
  };

  return (
    <>
      <Tooltip title="Actions">
        <IconButton size="small" onClick={handleOpen} disabled={isLoading}>
          <MoreVert sx={{ fontSize: 16 }} />
        </IconButton>
      </Tooltip>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        slotProps={{ paper: { sx: { minWidth: 180 } } }}
      >
        <MenuItem onClick={() => { handleClose(); onEdit(member); }}>
          Edit member
        </MenuItem>

        {(member.status === 'not_invited') && (
          <MenuItem onClick={handle(() => sendInvitation({ orgId, memberId: member.id }))}>
            <ListItemIcon><Mail fontSize="small" /></ListItemIcon>
            Send invitation
          </MenuItem>
        )}

        {member.status === 'invited' && (
          <MenuItem onClick={handle(() => sendInvitation({ orgId, memberId: member.id }))}>
            <ListItemIcon><Mail fontSize="small" /></ListItemIcon>
            Resend invitation
          </MenuItem>
        )}

        {member.status === 'invited' && (
          <MenuItem onClick={handle(() => uninviteMember({ orgId, memberId: member.id }))}>
            <ListItemIcon><PersonOff fontSize="small" /></ListItemIcon>
            Uninvite
          </MenuItem>
        )}

        {member.status !== 'archived' && (
          <MenuItem
            onClick={handle(() => archiveMember({ orgId, memberId: member.id }))}
            sx={{ color: 'warning.main' }}
          >
            <ListItemIcon><Archive fontSize="small" color="warning" /></ListItemIcon>
            Archive
          </MenuItem>
        )}

        {member.status === 'archived' && (
          <MenuItem onClick={handle(() => unarchiveMember({ orgId, memberId: member.id }))}>
            <ListItemIcon><Unarchive fontSize="small" /></ListItemIcon>
            Unarchive
          </MenuItem>
        )}

        <Divider />

        {member.org_admin === false && member.status === 'joined' && (
          <MenuItem onClick={handle(() => setAsAdmin({ orgId, memberId: member.id }))}>
            <ListItemIcon><AdminPanelSettings fontSize="small" /></ListItemIcon>
            Set as admin
          </MenuItem>
        )}

        {member.org_admin === true && (
          <MenuItem
            onClick={handle(() => revokeAdmin({ orgId, memberId: member.id }))}
            sx={{ color: 'error.main' }}
          >
            <ListItemIcon><AdminPanelSettings fontSize="small" color="error" /></ListItemIcon>
            Revoke admin
          </MenuItem>
        )}
      </Menu>
    </>
  );
}
