import { useEffect, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import { Center, Text, Button, Stack, Code } from '@mantine/core';

export default function AuthError() {
    const auth = useAuth();
    const [visible, setVisible] = useState(false);
    const [dismissed, setDismissed] = useState(false);

    const handleRestart = () => {
        setDismissed(true);
        window.location.reload();
    }

  useEffect(() => {
    // Reset dismissal when a new error arrives
    setDismissed(false);

    let timer: number | undefined;
    // Only show the error UI if an error is present and the user is not
    // authenticated. Wait briefly so transient errors that clear quickly
    // (e.g. during background renew) don't flash to the user.
    if (auth.error && !auth.isAuthenticated) {
      timer = window.setTimeout(() => setVisible(true), 700);
    } else {
      setVisible(false);
    }

    return () => { if (timer) window.clearTimeout(timer); };
  }, [auth.error, auth.isAuthenticated]);

  if (!auth.error || auth.isAuthenticated || !visible || dismissed) return null;

  return (
    <Center style={{ height: '50vh', flexDirection: 'column' }}>
      <Stack align="center">
        <Text c="red">Autentikaatiovirhe: {auth.error.name}</Text>
        <Code style={{ whiteSpace: 'break-spaces' }}>{auth.error.message}</Code>
        <Text size="sm">Yritä kirjautua uudelleen tai sulje ja avaa sovellus uudelleen.</Text>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button onClick={() => auth.signinRedirect()}>Kirjaudu uudelleen</Button>
          <Button variant="subtle" onClick={handleRestart}>Sulje</Button>
        </div>
      </Stack>
    </Center>
  );
}
