import { Google } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  Activity,
  ArrowLeft,
  Eye,
  EyeOff,
  Globe,
  Mail,
  Zap,
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useSignUpMutation } from '@/features/auth/authApi';
import { setUser } from '@/features/auth/authSlice';
import { timezones, locales } from '@/constants';
import { useLocale } from '@/hooks/shared/useLocale';
import type { LocaleCode } from '@/constants/locales';

export const Route = createFileRoute('/_auth/register')({
  component: RegisterPage,
});

type RegisterFormValues = {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  timezone: string;
  locale: LocaleCode;
};

function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [signUp, { isLoading }] = useSignUpMutation();

  const invitationEmail = useMemo(() => new URLSearchParams(window.location.search).get('email'), []);
  const invitationKey = useMemo(() => new URLSearchParams(window.location.search).get('invitation_key'), []);
  const defaultLocale = (new URLSearchParams(window.location.search).get('locale') || 'en') as LocaleCode;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    defaultValues: {
      first_name: '',
      last_name: '',
      email: invitationEmail || '',
      password: '',
      password_confirmation: '',
      timezone: 'UTC',
      locale: defaultLocale,
    },
  });

  const currentLocale = watch('locale');
  useLocale(currentLocale);

  const onSubmit = async (data: RegisterFormValues) => {
    setServerError(null);
    try {
      const { password_confirmation, ...userData } = data;
      const payload = invitationKey ? { ...userData, invitation_key: invitationKey } : userData;
      const result = await signUp(payload).unwrap();
      if (result.confirmed_at != null) {
        dispatch(setUser({
          id: result.id,
          email: result.email,
          first_name: result.first_name || '',
          last_name: result.last_name || '',
        }));
        navigate({ to: '/' });
      }
      setIsSuccess(true);
    } catch (err: any) {
      setServerError(err?.data?.error || 'Registration failed. Please try again.');
    }
  };

  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
  };

  const fieldSx = {
    '& .MuiInputBase-root': {
      bgcolor: 'background.paper',
      border: '1px solid',
      borderColor: 'divider',
      borderRadius: '8px',
      fontFamily: 'JetBrains Mono, monospace',
      fontSize: '16px',
      color: 'text.primary',
      '&:before, &:after': { display: 'none' },
      '&.Mui-focused': {
        border: '1px solid',
        borderColor: 'primary.main',
        bgcolor: 'action.hover',
      },
      '& input': { padding: '12px 16px' },
      '& .MuiSelect-select': { padding: '12px 16px' },
    },
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
        color: 'text.primary',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        '::selection': {
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
        },
      }}
    >
      {/* Left Panel - Neural Visualization (Desktop Only) */}
      <Box
        sx={{
          display: { xs: 'none', lg: 'flex' },
          width: '50%',
          position: 'relative',
          bgcolor: 'background.paper',
          overflow: 'hidden',
          alignItems: 'center',
          justifyContent: 'center',
          borderRight: '1px solid var(--mui-palette-divider)',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(circle at center, color-mix(in srgb, var(--mui-palette-primary-main) 15%, transparent) 0%, transparent 70%)',
          }}
        />

        {/* Abstract Grid Visualization */}
        <Box
          sx={{
            position: 'relative',
            width: '500px',
            height: '500px',
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gridTemplateRows: 'repeat(6, 1fr)',
            gap: 1,
            opacity: 0.3,
          }}
        >
          {Array.from({ length: 36 }).map((_, i) => (
            <Box
              key={i}
              sx={{
                border: '1px solid', borderColor: 'divider',
                bgcolor:
                  Math.random() > 0.7
                    ? 'action.hover'
                    : 'transparent',
                animation:
                  Math.random() > 0.7
                    ? 'pulse 1.5s ease-in-out infinite'
                    : 'none',
                animationDelay: `${Math.random() * 0.5}s`,
                '@keyframes pulse': {
                  '0%, 100%': {
                    opacity: 0.8,
                    backgroundColor: 'action.hover',
                  },
                  '50%': {
                    opacity: 0.3,
                    backgroundColor: 'transparent',
                  },
                },
              }}
            />
          ))}
        </Box>

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <Typography
            variant="h2"
            sx={{
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 700,
              fontSize: '3rem',
              letterSpacing: '-0.05em',
              mb: 2,
              background:
                'linear-gradient(to bottom, var(--mui-palette-text-primary), var(--mui-palette-primary-main))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            JOIN GO2
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 4 }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Activity
                size={20}
                style={{
                  color: 'primary.main',
                  marginBottom: 8,
                }}
              />
              <Typography
                sx={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                }}
              >
                Real-time
              </Typography>
            </Box>
            <Box
              sx={{
                width: '1px',
                height: '32px',
                bgcolor: 'rgba(255,255,255,0.1)',
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Globe
                size={20}
                style={{
                  color: 'primary.main',
                  marginBottom: 8,
                }}
              />
              <Typography
                sx={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                }}
              >
                Global
              </Typography>
            </Box>
            <Box
              sx={{
                width: '1px',
                height: '32px',
                bgcolor: 'divider',
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <Zap
                size={20}
                style={{
                  color: 'primary.main',
                  marginBottom: 8,
                }}
              />
              <Typography
                sx={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '10px',
                  color: 'text.secondary',
                  textTransform: 'uppercase',
                }}
              >
                Fluid
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Right Panel - Registration Terminal */}
      <Box
        sx={{
          width: { xs: '100%', lg: '50%' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 4, sm: 8, md: 12 },
          position: 'relative',
          bgcolor: 'background.default',
        }}
      >
        <Box sx={{ maxWidth: '448px', width: '100%', mx: 'auto' }}>
          <Box sx={{ mb: 6 }}>
            <Link
              to="/"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                color: 'primary.main',
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                textTransform: 'uppercase',
                marginBottom: '32px',
                textDecoration: 'none',
                transition: 'color 0.2s',
              }}
            >
              <ArrowLeft size={12} style={{ marginRight: 8 }} /> Return to
              Dashboard
            </Link>
            <Typography
              variant="h3"
              sx={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '2.5rem' },
                mb: 2,
                mt: 4,
              }}
            >
              Register
            </Typography>
            <Typography
              sx={{
                fontFamily: 'JetBrains Mono, monospace',
                color: 'text.secondary',
                fontSize: '14px',
              }}
            >
              Create your account to get started with GO2.
            </Typography>
          </Box>

          {isSuccess && (
            <Alert severity="success" sx={{ mb: 3, borderRadius: '8px' }}>
              Account created! Check your email to confirm your address.
            </Alert>
          )}

          {!isSuccess && (
          <form onSubmit={handleSubmit(onSubmit)}>
            {serverError && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: '8px' }}>{serverError}</Alert>
            )}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* First and Last Name */}
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography component="label" htmlFor="first_name" sx={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.15em', mb: 1 }}>
                    First Name
                  </Typography>
                  <Controller
                    name="first_name"
                    control={control}
                    rules={{ required: 'Required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="first_name"
                        fullWidth
                        error={!!errors.first_name}
                        helperText={errors.first_name?.message}
                        sx={fieldSx}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography component="label" htmlFor="last_name" sx={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.15em', mb: 1 }}>
                    Last Name
                  </Typography>
                  <Controller
                    name="last_name"
                    control={control}
                    rules={{ required: 'Required' }}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="last_name"
                        fullWidth
                        error={!!errors.last_name}
                        helperText={errors.last_name?.message}
                        sx={fieldSx}
                      />
                    )}
                  />
                </Box>
              </Box>

              {/* Email Field */}
              <Box>
                <Typography component="label" htmlFor="email" sx={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.15em', mb: 1 }}>
                  Email
                </Typography>
                <Controller
                  name="email"
                  control={control}
                  rules={{ required: 'Email is required', pattern: { value: /\S+@\S+\.\S+/, message: 'Invalid email' } }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="email"
                      type="email"
                      fullWidth
                      placeholder="entity@go2.net"
                      disabled={!!invitationEmail}
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <Box component="span" sx={{ display: 'flex', color: 'text.secondary' }}><Mail size={16} /></Box>
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={fieldSx}
                    />
                  )}
                />
              </Box>

              {/* Password Field */}
              <Box>
                <Typography component="label" htmlFor="password" sx={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.15em', mb: 1 }}>
                  Password
                </Typography>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small" sx={{ color: 'text.secondary' }}>
                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                      sx={fieldSx}
                    />
                  )}
                />
              </Box>

              {/* Confirm Password */}
              <Box>
                <Typography component="label" htmlFor="password_confirmation" sx={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.15em', mb: 1 }}>
                  Confirm Password
                </Typography>
                <Controller
                  name="password_confirmation"
                  control={control}
                  rules={{
                    required: 'Please confirm your password',
                    validate: (val) => val === watch('password') || 'Passwords do not match',
                  }}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="password_confirmation"
                      type={showPassword ? 'text' : 'password'}
                      fullWidth
                      error={!!errors.password_confirmation}
                      helperText={errors.password_confirmation?.message}
                      sx={fieldSx}
                    />
                  )}
                />
              </Box>

              {/* Timezone + Locale */}
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box sx={{ flex: 1 }}>
                  <Typography component="label" htmlFor="timezone" sx={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.15em', mb: 1 }}>
                    Timezone
                  </Typography>
                  <Controller
                    name="timezone"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} id="timezone" select fullWidth sx={fieldSx}>
                        {timezones.map((tz) => <MenuItem key={tz} value={tz}>{tz}</MenuItem>)}
                      </TextField>
                    )}
                  />
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography component="label" htmlFor="locale" sx={{ display: 'block', fontFamily: 'JetBrains Mono, monospace', fontSize: '10px', color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.15em', mb: 1 }}>
                    Language
                  </Typography>
                  <Controller
                    name="locale"
                    control={control}
                    render={({ field }) => (
                      <TextField {...field} id="locale" select fullWidth sx={fieldSx}>
                        {locales.map((loc) => <MenuItem key={loc.code} value={loc.code}>{loc.label}</MenuItem>)}
                      </TextField>
                    )}
                  />
                </Box>
              </Box>

              {/* Create Account Button */}
              <Box sx={{ pt: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                  sx={{
                    position: 'relative',
                    px: 3,
                    py: 1.5,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontWeight: 600,
                    fontSize: '15px',
                    letterSpacing: '0.02em',
                    borderRadius: '8px',
                    border: 'none',
                    overflow: 'hidden',
                    transition: 'all 0.2s',
                    '&:hover': { bgcolor: 'primary.dark', transform: 'translateY(-1px)' },
                    '&:disabled': { opacity: 0.5, cursor: 'not-allowed' },
                  }}
                >
                  <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'action.hover', transform: 'translateX(-100%)', transition: 'transform 0.3s', '.MuiButton-root:hover &': { transform: 'translateX(0)' } }} />
                  <Box component="span" sx={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
                    {isLoading ? 'Creating Account...' : 'Register'}
                  </Box>
                </Button>
              </Box>

              {/* Google Sign-Up Button */}
              <Button
                onClick={handleGoogleSignup}
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                sx={{
                  py: 1.5,
                  borderRadius: '8px',
                  border: '1px solid', borderColor: 'divider',
                  color: 'text.primary',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  fontSize: '14px',
                  textTransform: 'none',
                  letterSpacing: '0.01em',
                  fontWeight: 500,
                  '&:hover': { border: '1px solid', borderColor: 'primary.main', bgcolor: 'action.hover' },
                }}
              >
                Sign up with Google
              </Button>
            </Box>
          </form>
          )}

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography
              sx={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                color: 'text.secondary',
              }}
            >
              Already have an account?{' '}
              <Link
                to="/login"
                style={{
                  color: 'inherit',
                  textDecoration: 'underline',
                  marginLeft: 8,
                  transition: 'color 0.2s',
                }}
              >
                Sign In
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
