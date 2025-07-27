import React from 'react';
import { AppRegistry } from 'react-native';
import App from './App';

// Listen for props from Expo WebView
if (typeof window !== 'undefined') {
  window.addEventListener('ExpoProps', (e: any) => {
    (window as any).__EXPO_PROPS__ = e.detail;
    console.log('Received ExpoProps:', e.detail);
  });
}

// Defer real bootstrap until shared modules are ready
import('./bootstrap');
