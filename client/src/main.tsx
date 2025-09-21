import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import '@mantine/core/styles.css';
import {AuthProvider} from 'react-oidc-context'
import { MantineProvider } from '@mantine/core';

import userManager from './authConfig.ts';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <AuthProvider userManager={userManager}>
      <App />
      </AuthProvider>
    </MantineProvider>
  </StrictMode>,
)
