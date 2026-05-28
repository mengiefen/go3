import { Google } from '@mui/icons-material';
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import { createFileRoute, Link } from '@tanstack/react-router';
import {
  Activity,
  ArrowLeft,
  Eye,
  EyeOff,
  Globe,
  Mail,
  Zap,
} from 'lucide-react';
import React, { useState } from 'react';

export const Route = createFileRoute('/_auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Implement actual login logic
    setTimeout(() => setLoading(false), 2000);
  };

  const handleGoogleLogin = () => {
    // TODO: Implement Google OAuth
    console.log('Google login clicked');
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
            WELCOME TO GO2
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

      {/* Right Panel - Login Terminal */}
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
              SIGN IN TO GO2
            </Typography>
            <Typography
              sx={{
                fontFamily: 'JetBrains Mono, monospace',
                color: 'text.secondary',
                fontSize: '14px',
              }}
            >
              Sign in to access GO2 features.
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Email Field */}
              <Box>
                <Typography
                  component="label"
                  htmlFor="email"
                  sx={{
                    display: 'block',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '10px',
                    color: 'text.secondary',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    mb: 1,
                    transition: 'color 0.2s',
                    '&:has(+ .Mui-focused)': {
                      color: 'primary.main',
                    },
                  }}
                >
                  Email
                </Typography>
                <TextField
                  id="email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="entity@go2.net"
                  required
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <Box component="span" sx={{ display: 'flex', color: 'text.secondary' }}><Mail size={16} /></Box>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      bgcolor: 'background.paper',
                      border: '1px solid', borderColor: 'divider',
                      borderRadius: '8px',
                      ...('borderTopRightRadius' in {} ? {} : {}), // removing old rules nicely
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '16px',
                      color: 'text.primary',
                      '&:before, &:after': { display: 'none' },
                      '&.Mui-focused': {
                        border: '1px solid', borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                      },
                      '& input': {
                        padding: '12px 16px',
                        '&::placeholder': {
                          color: 'text.secondary',
                          opacity: 0.7,
                        },
                      },
                    },
                    '& .MuiInputAdornment-root': {
                      '& svg': {
                        transition: 'color 0.2s',
                      },
                    },
                    '& .Mui-focused .MuiInputAdornment-root svg': {
                      color: 'primary.main',
                    },
                  }}
                />
              </Box>

              {/* Password Field */}
              <Box>
                <Typography
                  component="label"
                  htmlFor="password"
                  sx={{
                    display: 'block',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '10px',
                    color: 'var(--md-sys-color-on-surface-variant)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    mb: 1,
                  }}
                >
                  Password
                </Typography>
                <TextField
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  slotProps={{
                    input: {
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                            size="small"
                            sx={{
                              color: 'text.secondary',
                            }}
                          >
                            {showPassword ? (
                              <EyeOff size={16} />
                            ) : (
                              <Eye size={16} />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                  sx={{
                    '& .MuiInputBase-root': {
                      bgcolor: 'background.paper',
                      border: '1px solid', borderColor: 'divider',
                      borderRadius: '8px',
                      fontFamily: 'JetBrains Mono, monospace',
                      fontSize: '16px',
                      color: 'text.primary',
                      '&:before, &:after': { display: 'none' },
                      '&.Mui-focused': {
                        border: '1px solid', borderColor: 'primary.main',
                        bgcolor: 'action.hover',
                      },
                      '& input': {
                        padding: '12px 16px',
                        '&::placeholder': {
                          color: 'text.secondary',
                          opacity: 0.7,
                        },
                      },
                    },
                  }}
                />
              </Box>

              {/* Sign In Button */}
              <Box sx={{ pt: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  disabled={loading}
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
                    '&:hover': {
                      bgcolor: 'primary.dark',
                      transform: 'translateY(-1px)',
                    },
                    '&:disabled': {
                      opacity: 0.5,
                      cursor: 'not-allowed',
                    },
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      bgcolor: 'action.hover',
                      transform: 'translateX(-100%)',
                      transition: 'transform 0.3s',
                      '.MuiButton-root:hover &': {
                        transform: 'translateX(0)',
                      },
                    }}
                  />
                  <Box
                    component="span"
                    sx={{
                      position: 'relative',
                      zIndex: 10,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 1.5,
                    }}
                  >
                    {loading ? 'Signing In...' : 'Sign In'}
                  </Box>
                </Button>
              </Box>

              {/* Google Sign-In Button */}
              <Button
                onClick={handleGoogleLogin}
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
                  '&:hover': {
                    border: '1px solid', borderColor: 'primary.main',
                    bgcolor: 'action.hover',
                  },
                }}
              >
                Sign in with Google
              </Button>
            </Box>
          </form>

          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Typography
              sx={{
                fontFamily: 'JetBrains Mono, monospace',
                fontSize: '12px',
                color: 'text.secondary',
              }}
            >
              New to GO2?{' '}
              <Link
                to="/register"
                style={{
                  color: 'primary.main',
                  textDecoration: 'none',
                  marginLeft: 8,
                  transition: 'color 0.2s',
                }}
              >
                Register
              </Link>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
