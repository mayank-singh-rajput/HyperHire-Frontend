import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

interface AppThemeProps {
    children: React.ReactNode;
}

export default function AppTheme(props: AppThemeProps) {
    const { children } = props;
    const theme = React.useMemo(() => {
        return createTheme({
            cssVariables: {
                colorSchemeSelector: 'data-mui-color-scheme',
                cssVarPrefix: 'template',
            }
        });
    }, []);
    return (
        <ThemeProvider theme={theme} disableTransitionOnChange>
            {children}
        </ThemeProvider>
    );
}
