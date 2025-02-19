'use client';

import * as React from 'react';
import AppTheme from '../../AppTheme';
import { Box, CssBaseline, useTheme, useMediaQuery, CircularProgress } from '@mui/material';
import Header from '../../components/Header';
import SideMenu from '../../components/SideMenu';
import { useQuery } from '@tanstack/react-query';
import { TreeItems } from '../../utils/formateData';
import axios from 'axios';

const fetchFolder = async () => {
    const response = await axios.get('/api/folder/fetch');
    return response?.data;
}

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

    const { isLoading } = useQuery({
        queryKey: ['folders'],
        queryFn: fetchFolder,
        staleTime: 0,
        select: (data: TreeItems[]) => data || [],
    });

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', width: "100%", minHeight: "100vh", padding: "24px", justifyContent: 'center', alignItems: 'center' }}>
                {isLoading ?
                    <CircularProgress /> :
                    (
                        <>
                            <SideMenu open={open} toggleDrawer={toggleDrawer} />
                            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', marginLeft: open && !isSmallScreen ? '260px' : 0 }}>
                                <Header open={open} toggleDrawer={toggleDrawer} />
                                {children}
                            </Box>
                        </>
                    )
                }
            </Box>
        </AppTheme>
    );
}
