'use client';

import * as React from 'react';
import AppTheme from '../../AppTheme';
import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import Header from '../../components/Header';
import SideMenu from '../../components/SideMenu';

export default function Layout({ children }: { children: React.ReactNode }) {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = React.useState<boolean>(true);

    const toggleDrawer = (state: boolean) => () => {
        setOpen(state);
    };

    React.useEffect(() => {
        setOpen(!isSmallScreen);
    }, [isSmallScreen])

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', width: "100%", height: "100%", padding: "24px" }}>
                <SideMenu open={open} toggleDrawer={toggleDrawer} />

                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', marginLeft: open && !isSmallScreen ? '260px' : 0, }}>
                    <Header open={open} toggleDrawer={toggleDrawer} />
                    {children}
                </Box>
            </Box>
        </AppTheme>
    );
}
