import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { useCreateMemberMutation, useUpdateMemberMutation } from '../membersApi';
import type { CreateMemberRequest, Member, UpdateMemberRequest } from '../types';

interface MemberModalProps {
  open: boolean;
  onClose: () => void;
  orgId: string;
  member?: Member | null;
}

interface FormValues {
  name_en: string;
  name_fa: string;
  email: string;
  initial: string;
  color: string;
}

const AVATAR_COLORS = [
  '#5C6BC0', '#42A5F5', '#26A69A', '#66BB6A',
  '#FFA726', '#EF5350', '#AB47BC', '#EC407A',
  '#78909C', '#8D6E63',
];

export function MemberModal({ open, onClose, orgId, member }: MemberModalProps) {
  const isEdit = Boolean(member);
  const [createMember, { isLoading: isCreating }] = useCreateMemberMutation();
  const [updateMember, { isLoading: isUpdating }] = useUpdateMemberMutation();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name_en: member?.translations?.name?.en ?? '',
      name_fa: member?.translations?.name?.fa ?? '',
      email: member?.email ?? '',
      initial: member?.initial ?? '',
      color: member?.color ?? AVATAR_COLORS[0],
    },
  });

  const selectedColor = watch('color');
  const nameEn = watch('name_en');

  const handleNameChange = (value: string, onChange: (v: string) => void) => {
    onChange(value);
    const currentInitial = watch('initial');
    if (!currentInitial || currentInitial === nameEn.charAt(0).toUpperCase()) {
      setValue('initial', value.charAt(0).toUpperCase());
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = async (data: FormValues, invite = false) => {
    if (isEdit && member) {
      const payload: UpdateMemberRequest = {
        name_en: data.name_en,
        name_fa: data.name_fa || undefined,
        initial: data.initial,
        color: data.color,
      };
      await updateMember({ orgId, memberId: member.id, data: payload });
    } else {
      const payload: CreateMemberRequest = {
        name_en: data.name_en,
        name_fa: data.name_fa || undefined,
        email: data.email,
        initial: data.initial,
        color: data.color,
        invite,
      };
      await createMember({ orgId, data: payload });
    }
    handleClose();
  };

  const fieldSx = {
    '& .MuiInputBase-root': { borderRadius: 1.5 },
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" fontWeight={600}>
            {isEdit ? 'Edit Member' : 'Add Member'}
          </Typography>
          <IconButton size="small" onClick={handleClose}>
            <Close fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          {/* Avatar preview */}
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Box
              sx={{
                width: 72,
                height: 72,
                borderRadius: '50%',
                bgcolor: selectedColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 28,
                fontWeight: 700,
                color: '#fff',
                boxShadow: 2,
              }}
            >
              {watch('initial') || '?'}
            </Box>
          </Box>

          {/* Color picker */}
          <Box>
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
              Color
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap">
              {AVATAR_COLORS.map((color) => (
                <Box
                  key={color}
                  onClick={() => setValue('color', color)}
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: color,
                    cursor: 'pointer',
                    border: selectedColor === color ? '2.5px solid' : '2px solid transparent',
                    borderColor: selectedColor === color ? 'primary.main' : 'transparent',
                    outline: selectedColor === color ? '2px solid' : 'none',
                    outlineColor: color,
                    outlineOffset: 2,
                    transition: 'transform 0.1s',
                    '&:hover': { transform: 'scale(1.15)' },
                  }}
                />
              ))}
            </Stack>
          </Box>

          <Controller
            name="name_en"
            control={control}
            rules={{ required: 'Name is required' }}
            render={({ field: { onChange, ...rest } }) => (
              <TextField
                {...rest}
                label="Full Name"
                fullWidth
                error={Boolean(errors.name_en)}
                helperText={errors.name_en?.message}
                onChange={(e) => handleNameChange(e.target.value, onChange)}
                sx={fieldSx}
              />
            )}
          />

          <Controller
            name="initial"
            control={control}
            rules={{ required: 'Initial is required', maxLength: { value: 2, message: 'Max 2 characters' } }}
            render={({ field }) => (
              <TextField
                {...field}
                label="Initial"
                fullWidth
                inputProps={{ maxLength: 2 }}
                error={Boolean(errors.initial)}
                helperText={errors.initial?.message}
                sx={fieldSx}
              />
            )}
          />

          {!isEdit && (
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email address' },
              }}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  sx={fieldSx}
                />
              )}
            />
          )}
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
          {!isEdit && (
            <Button
              variant="outlined"
              color="primary"
              disabled={isCreating}
              onClick={handleSubmit((data) => onSubmit(data, false))}
            >
              Save Only
            </Button>
          )}
          <Button
            variant="contained"
            disabled={isCreating || isUpdating}
            onClick={handleSubmit((data) => onSubmit(data, !isEdit))}
          >
            {isEdit ? 'Save Changes' : 'Save & Invite'}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
