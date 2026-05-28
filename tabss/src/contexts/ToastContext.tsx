import React, { createContext, useContext, useState, useCallback } from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';
import type { AlertColor } from '@mui/material';

interface ToastOptions {
  message: string;
  severity?: AlertColor;
  duration?: number;
}

interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextType {
  showToast: (options: ToastOptions) => void;
  showSuccess: (message: string, duration?: number) => void;
  showError: (message: string, duration?: number) => void;
  showInfo: (message: string, duration?: number) => void;
  showWarning: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

// Unique ID generator
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const showToast = useCallback((options: ToastOptions) => {
    const id = generateId();
    const { duration = 4000, ...rest } = options;
    
    setToasts(prev => [...prev, { id, ...rest, duration }]);
    
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration);
    }
  }, [removeToast]);

  const showSuccess = useCallback((message: string, duration?: number) => {
    showToast({ message, severity: 'success', duration });
  }, [showToast]);

  const showError = useCallback((message: string, duration?: number) => {
    showToast({ message, severity: 'error', duration });
  }, [showToast]);

  const showInfo = useCallback((message: string, duration?: number) => {
    showToast({ message, severity: 'info', duration });
  }, [showToast]);

  const showWarning = useCallback((message: string, duration?: number) => {
    showToast({ message, severity: 'warning', duration });
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, showSuccess, showError, showInfo, showWarning }}>
      {children}
      {/* Toast container - only one place in the entire app */}
      <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999 }}>
        {toasts.map((toast, index) => (
          <Snackbar
            key={toast.id}
            open={true}
            anchorOrigin={{ vertical: 'top', horizontal: 'right'}}
            TransitionComponent={Slide}
            sx={{ mb: index * 7 }} // Stacked offset
          >
            <Alert
              severity={toast.severity}
              variant="filled"
              sx={{ width: '100%', minWidth: 300, color: 'white' }}
              onClose={() => removeToast(toast.id)}
            >
              {toast.message}
            </Alert>
          </Snackbar>
        ))}
      </div>
    </ToastContext.Provider>
  );
};