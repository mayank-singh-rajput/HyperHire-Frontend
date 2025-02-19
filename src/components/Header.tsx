import * as React from 'react';
import { Stack, IconButton } from '@mui/material';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import Image from 'next/image';
import OpenIcon from '../assets/menu_open.svg';

interface HeaderProps {
    open: boolean | undefined;
    toggleDrawer: (newOpen: boolean) => () => void;
}

export default function Header({ open, toggleDrawer }: HeaderProps) {
    return (
        <Stack
            direction="column"
            sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
            }}
        >
            <IconButton onClick={toggleDrawer(true)} sx={{ width: 32, height: 32 }}>
                {!open && <Image src={OpenIcon} alt="Open Icon" />}
            </IconButton>

            <NavbarBreadcrumbs />
        </Stack>
    );
}
