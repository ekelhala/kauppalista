import { Box, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'react-oidc-context';
import userManager from '../authConfig';

export default function FrontPage() {
  const auth = useAuth();
  const { t } = useTranslation();

  const startSignin = async () => {
    try {
      auth.signinRedirect();
    } catch {
      try { await auth.removeUser(); } catch (err) { console.error('Signin redirect failed', err); }
      try { await userManager.clearStaleState(); } catch (err) { console.error('Clearing stale state failed', err); }
    }
  };

  return (
    <Box sx={{ height: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <Typography variant="h4">{t('auth.appName')}</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={startSignin}>{t('auth.login')}</Button>
    </Box>
  );
}
