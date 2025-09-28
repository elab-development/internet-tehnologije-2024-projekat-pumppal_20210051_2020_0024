import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';
import App from './App';

const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          navy:   { value: '#0F1D33' },
          yellow: { value: '#F5B400' },
          light:  { value: '#E6EDF5' },
          gray:   { value: '#A7B0BA' },
          panel:  { value: '#13243F' },
        },
      },
    },
    globalCss: {
      body: { background: '{colors.brand.navy}', color: 'white' },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider value={system}>
    <App />
  </ChakraProvider>
);
