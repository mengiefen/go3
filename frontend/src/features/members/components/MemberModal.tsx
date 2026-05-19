import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useCreateMemberMutation, useUpdateMemberMutation, useSendInvitationMutation } from '../membersApi';
import type { Member, MemberStatus, MemberFormData } from '../types';
import ColorPicker from '../../../components/ColorPicker';
import { isValidEmail } from '../../../utils/validators';

interface MemberModalProps {
  open: boolean;
  onClose: () => void;
  organizationId: number;
  member?: Member | null;  // If provided, we're in edit mode
  status?: MemberStatus;
}

const generateInitials = (name: string): string => {
  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

export const MemberModal = ({ open, onClose, organizationId, member, status }: MemberModalProps) => {
  const { t } = useTranslation('shared');
  const { t: tMembers } = useTranslation('members');
  const { i18n } = useTranslation();
  const currentLocale = i18n.language;
  
  const [createMember, { isLoading: isCreating }] = useCreateMemberMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();
  const [sendInvitation, { isLoading: isSending }] = useSendInvitationMutation();
  
  const isLoading = isCreating || isUpdating || isSending;
  
  // Get member name in current locale
  const getMemberName = (member: Member): string => {
    if (currentLocale === 'fa' && member.translations?.name?.fa) {
      return member.translations.name.fa;
    }
    return member.name;
  };
  
  const [formData, setFormData] = useState<MemberFormData>({
    email: '',
    name: '',
    initial: '',
    color: '#4F46E5',
  });
  
  const [errors, setErrors] = useState<{ email?: string; name?: string }>({});

  // Populate form when editing
  useEffect(() => {
    if (member) {
      setFormData({
        email: member.email,
        name: getMemberName(member),
        initial: member.initial,
        color: member.color || '#4F46E5',
      });
    } else {
      setFormData({
        email: '',
        name: '',
        initial: '',
        color: '#4F46E5',
      });
    }
  }, [member, open, currentLocale]);

  const validateForm = (requireEmail: boolean = false): boolean => {
    const newErrors: { email?: string; name?: string } = {};
    
    if (!formData.name) {
      newErrors.name = t('validations.required');
    }
    
    if (requireEmail && !formData.email) {
      newErrors.email = t('validations.required');
    } else if (formData.email && !isValidEmail(formData.email)) {
      newErrors.email = t('validations.invalidFormat');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      return newData;
    });
    
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSaveOnly = async () => {
    if (!validateForm(false)) return;
    
    try {
      if (member) {
        // Update existing member
        await updateMember({
          organizationId,
          memberId: member.id,
          data: {
            name_en: currentLocale === 'en' ? formData.name : undefined,
            name_fa: currentLocale === 'fa' ? formData.name : undefined,
            initial: formData.initial,
            color: formData.color,
          },
        }).unwrap();
      } else {
        // Create new member without invitation
        await createMember({
          organizationId,
          data: {
            email: formData.email,
            name_en: formData.name,
            name_fa: formData.name,
            initial: formData.initial,
            color: formData.color,
            invite: false,
          },
        }).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save member:', error);
    }
  };

  const handleSaveAndInvite = async () => {
    if (!validateForm(true)) return;
    
    try {
      if (member) {
        // Update and resend invitation
        await updateMember({
          organizationId,
          memberId: member.id,
          data: {
            name_en: currentLocale === 'en' ? formData.name : undefined,
            name_fa: currentLocale === 'fa' ? formData.name : undefined,
            initial: formData.initial,
            color: formData.color,
          },
        }).unwrap();
        
        await sendInvitation({
          organizationId,
          memberId: member.id,
        }).unwrap();
      } else {
        // Create and send invitation
        await createMember({
          organizationId,
          data: {
            email: formData.email,
            name_en: formData.name,
            name_fa: formData.name,
            initial: formData.initial,
            color: formData.color,
            invite: true,
          },
        }).unwrap();
      }
      onClose();
    } catch (error) {
      console.error('Failed to save and invite member:', error);
    }
  };

  // Determine button text and visibility
  const isEditMode = !!member;
  const canSendInvitation = status === 'invited' || status === 'not_invited';
  const showInviteButton = !isEditMode || canSendInvitation;
  
  let inviteButtonText = tMembers('createAndSendInvitation');
  if (isEditMode) {
    if (status === 'invited') {
      inviteButtonText = tMembers('updateAndResendInvitation');
    } else if (status !== 'joined' && status !== 'archived') {
      inviteButtonText = tMembers('updateAndSendInvitation');
    }
  }

  const handleNameBlur = () => {
    // Generate initials from name only if initials field is empty
    if (!formData.initial && formData.name) {
      setFormData(prev => ({
        ...prev,
        initial: generateInitials(prev.name)
      }));
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {member ? tMembers('editMember') : tMembers('addMember')}
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4, mt: 1 }}>
          <TextField
            label={tMembers('fullName')}
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleNameBlur}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
            autoFocus
            size="small"
          />
          
          <TextField
            label={tMembers('initials')}
            name="initial"
            value={formData.initial}
            onChange={handleChange}
            helperText="Maximum 2 characters"
            fullWidth
            inputProps={{ maxLength: 2 }}
            size="small"
          />
          
          <TextField
            label={t('email')}
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
            disabled={!!member && status === 'joined'}
            size="small"
          />
          
          <Box>
            <ColorPicker
              value={formData.color}
              onChange={(newColor) => setFormData(prev => ({ ...prev, color: newColor }))}
            />
          </Box>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
        <Button onClick={onClose} disabled={isLoading}>
          {t('commonActions.cancel')}
        </Button>
                
        <Button
          onClick={handleSaveOnly}
          variant="contained"
          startIcon={isLoading ? <CircularProgress size={20} /> : null}
        >
          {member ? t('commonActions.update') : t('commonActions.create')}
        </Button>

        {showInviteButton && (
          <Button
            onClick={handleSaveAndInvite}
            variant="contained"
            startIcon={isLoading ? <CircularProgress size={20} /> : null}
          >
            {inviteButtonText}
          </Button>
        )}

      </DialogActions>
    </Dialog>
  );
};