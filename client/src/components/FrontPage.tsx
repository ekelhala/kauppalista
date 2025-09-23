import { Center, Title, Button } from '@mantine/core';
import { useAuth } from 'react-oidc-context';
import userManager from '../authConfig';

export default function FrontPage() {
  const auth = useAuth();

  const startSignin = async () => {
    try {
      auth.signinRedirect();
    } catch {
      // If redirect fails (popup blocked or other issue), fallback to a
      // non-interactive sign-in that just clears the user and shows the
      // sign-in button again.
      try { await auth.removeUser(); } catch (err) { console.error('Signin redirect failed', err); }
      try { await userManager.clearStaleState(); } catch (err) { console.error('Clearing stale state failed', err); }
    }
  };

  return (
    <Center style={{ height: '60vh', flexDirection: 'column' }}>
      <Title order={1}>Kauppalista</Title>
      <Button mt="lg" onClick={startSignin}>Kirjaudu</Button>
    </Center>
  );
}
