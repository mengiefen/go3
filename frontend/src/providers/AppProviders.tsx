import React from 'react';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { ThemeProvider } from './ThemeProvider';

export const AppProviders: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Provider store={store}>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </Provider>
  );
};