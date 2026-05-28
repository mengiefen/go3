import type { LocalEvent } from '@/types/calendar';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { useEffect, useMemo, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  startDate: z.string(), // YYYY-MM-DD
  startTime: z.string(), // HH:mm
  endDate: z.string(),
  endTime: z.string(),
  allDay: z.boolean(),
  description: z.string().optional(),
  color: z.string(),
});

type FormValues = z.infer<typeof formSchema>;

// Generate time options in 30 min intervals
const timeOptions = (() => {
  const opts: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += 30) {
      opts.push(
        `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`,
      );
    }
  }
  return opts;
})();

const COLOR_OPTIONS = [
  { value: 'blue', label: 'Blue', hex: '#1976d2' },
  { value: 'green', label: 'Green', hex: '#2e7d32' },
  { value: 'red', label: 'Red', hex: '#d32f2f' },
  { value: 'purple', label: 'Purple', hex: '#7b1fa2' },
  { value: 'yellow', label: 'Yellow', hex: '#ed6c02' },
] as const;

interface EventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: LocalEvent | null;
  selectedRange?: { start: Date; end: Date } | null;
  onSave: (data: any) => Promise<{ success: boolean; message: string }>;
  onDelete?: (id: string) => Promise<{ success: boolean; message: string }>;
}

function toDateStr(d: Date) {
  return format(d, 'yyyy-MM-dd');
}
function toTimeStr(d: Date) {
  return format(d, 'HH:mm');
}

export default function EventDialog({
  open,
  onOpenChange,
  event,
  selectedRange,
  onSave,
  onDelete,
}: EventDialogProps) {
  const [isPending, startTransition] = useTransition();

  const defaults = useMemo(() => {
    const s = event
      ? new Date(event.start)
      : selectedRange?.start || new Date();
    const e = event
      ? new Date(event.end)
      : selectedRange?.end ||
        new Date(new Date().setHours(new Date().getHours() + 1));
    return {
      title: event?.title ?? '',
      startDate: toDateStr(s),
      startTime: toTimeStr(s),
      endDate: toDateStr(e),
      endTime: toTimeStr(e),
      allDay: event?.allDay ?? false,
      description: event?.description ?? '',
      color: event?.color ?? 'blue',
    };
  }, [event, selectedRange]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaults,
  });

  useEffect(() => {
    if (open) form.reset(defaults);
  }, [open, defaults, form]);

  const allDay = form.watch('allDay');

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      const startStr = values.allDay
        ? `${values.startDate}T00:00:00`
        : `${values.startDate}T${values.startTime}:00`;
      const endStr = values.allDay
        ? `${values.endDate}T23:59:59`
        : `${values.endDate}T${values.endTime}:00`;

      const payload = {
        title: values.title,
        start: new Date(startStr).toISOString(),
        end: new Date(endStr).toISOString(),
        allDay: values.allDay,
        description: values.description,
        color: values.color,
      };

      const result = await onSave(payload);
      if (result.success) {
        toast.success(result.message);
        onOpenChange(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  const handleDelete = () => {
    if (!event || !onDelete) return;
    if (confirm('Are you sure you want to delete this event?')) {
      startTransition(async () => {
        const result = await onDelete(event.id);
        if (result.success) {
          toast.success(result.message);
          onOpenChange(false);
        } else {
          toast.error(result.message);
        }
      });
    }
  };

  return (
    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { borderRadius: 3 } } }}
    >
      <DialogTitle sx={{ pb: 0.5 }}>
        {event ? 'Edit Event' : 'Create Event'}
        <Typography variant="body2" color="text.secondary">
          {event
            ? 'Make changes to your event here.'
            : 'Add a new event to your calendar.'}
        </Typography>
      </DialogTitle>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
          {/* Title */}
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Title"
                placeholder="Event title"
                fullWidth
                error={!!error}
                helperText={error?.message}
                size="small"
              />
            )}
          />

          {/* Start: Date + Time */}
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Controller
              name="startDate"
              control={form.control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Start Date"
                  type="date"
                  size="small"
                  sx={{ flex: 1 }}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              )}
            />
            {!allDay && (
              <Controller
                name="startTime"
                control={form.control}
                render={({ field }) => (
                  <FormControl size="small" sx={{ minWidth: 110 }}>
                    <InputLabel>Time</InputLabel>
                    <Select {...field} label="Time">
                      {timeOptions.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            )}
          </Stack>

          {/* End: Date + Time */}
          <Stack direction="row" spacing={1.5} alignItems="flex-start">
            <Controller
              name="endDate"
              control={form.control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="End Date"
                  type="date"
                  size="small"
                  sx={{ flex: 1 }}
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              )}
            />
            {!allDay && (
              <Controller
                name="endTime"
                control={form.control}
                render={({ field }) => (
                  <FormControl size="small" sx={{ minWidth: 110 }}>
                    <InputLabel>Time</InputLabel>
                    <Select {...field} label="Time">
                      {timeOptions.map((t) => (
                        <MenuItem key={t} value={t}>
                          {t}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            )}
          </Stack>

          {/* All Day — bordered card style */}
          <Box
            sx={{
              border: 1,
              borderColor: 'divider',
              borderRadius: 2,
              px: 2,
              py: 1,
            }}
          >
            <Controller
              name="allDay"
              control={form.control}
              render={({ field }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={field.value}
                      onChange={field.onChange}
                      size="small"
                    />
                  }
                  label="All Day"
                  sx={{ m: 0 }}
                />
              )}
            />
          </Box>

          {/* Color — with colored dots */}
          <Controller
            name="color"
            control={form.control}
            render={({ field }) => (
              <FormControl size="small" fullWidth>
                <InputLabel>Color</InputLabel>
                <Select
                  {...field}
                  label="Color"
                  renderValue={(val) => {
                    const opt = COLOR_OPTIONS.find((o) => o.value === val);
                    return (
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: opt?.hex,
                          }}
                        />
                        <span>{opt?.label}</span>
                      </Stack>
                    );
                  }}
                >
                  {COLOR_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      <ListItemIcon sx={{ minWidth: 28 }}>
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: '50%',
                            bgcolor: opt.hex,
                          }}
                        />
                      </ListItemIcon>
                      <ListItemText>{opt.label}</ListItemText>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          />

          {/* Description */}
          <Controller
            name="description"
            control={form.control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Description"
                placeholder="Details..."
                multiline
                rows={3}
                fullWidth
                size="small"
              />
            )}
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between', px: 3, pb: 3 }}>
          {event && onDelete ? (
            <Button
              color="error"
              variant="outlined"
              startIcon={<Trash2 size={16} />}
              onClick={handleDelete}
              disabled={isPending}
              size="small"
            >
              Delete
            </Button>
          ) : (
            <span />
          )}
          <Stack direction="row" spacing={1}>
            <Button
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              size="small"
              variant='outlined'
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isPending}
              size="small"
              startIcon={
                isPending ? <CircularProgress size={16} color="inherit" /> : null
              }
            >
              {event ? 'Save Changes' : 'Create Event'}
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
}
