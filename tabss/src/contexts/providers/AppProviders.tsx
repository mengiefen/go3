import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { ThemeProvider } from '../ThemeContext';
import { ToastProvider } from '../ToastContext';

export  const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </ThemeProvider>
    </Provider>
  );
};

