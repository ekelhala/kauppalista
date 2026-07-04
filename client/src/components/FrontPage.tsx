import { Box, Typography, Button } from '@mui/material';
import { useAuth } from 'react-oidc-context';
import userManager from '../authConfig';

export default function FrontPage() {
  const auth = useAuth();

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
      <Typography variant="h4">Kauppalista</Typography>
      <Button variant="contained" sx={{ mt: 2 }} onClick={startSignin}>Kirjaudu</Button>
    </Box>
  );
}
