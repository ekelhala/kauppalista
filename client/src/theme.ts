import { createTheme as createMuiTheme, type ThemeOptions } from '@mui/material/styles';

const brandColors = [
  '#e9f5ee',
  '#d6eadf',
  '#bedfcd',
  '#a4d4ba',
  '#8ac9a6',
  '#70be92',
  '#58b37f',
  '#40916c',
  '#2d6a4f',
  '#1b4332',
] as const;

const baseOptions: ThemeOptions = {
  palette: {
    primary: {
      light: brandColors[0],
      main: brandColors[8],
      dark: brandColors[9],
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 150ms ease, color 150ms ease',
        },
      },
    },
  },
};

export function createThemeBase() {
  return createMuiTheme(baseOptions);
}

export function getTheme(mode: 'light' | 'dark') {
  return createMuiTheme({
    ...baseOptions,
    palette: {
      ...baseOptions.palette,
      mode,
    },
    components: {
      ...baseOptions.components,
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            ...(mode === 'light'
              ? { backgroundColor: '#f4f1e8', color: '#1b4332' }
              : { backgroundColor: '#112f26', color: '#e9f5ee' }),
            transition: 'background-color 150ms ease, color 150ms ease',
          },
        },
      },
    },
  });
}
