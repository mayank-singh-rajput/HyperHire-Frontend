import * as React from 'react';
import { drawerClasses } from '@mui/material/Drawer';
import { Box, Drawer, IconButton } from '@mui/material';
import SideContent from './SideContent';
import Image from 'next/image';
import AppIcon from '../assets/icon.svg';
import CloseIcon from '../assets/menu_close.svg';

type TreeViewProps = {
    id: string;
    label?: string;
    children?: TreeViewProps[];
};

interface SideMenuProps {
    open: boolean | undefined;
    toggleDrawer: (newOpen: boolean) => () => void;
    data: TreeViewProps[];
}

export default function SideMenu({ open, toggleDrawer, data }: SideMenuProps) {
    return (
        <Drawer
            open={open}
            onClose={toggleDrawer(false)}
            sx={{
                [`& .${drawerClasses.paper}`]: {
                    width: '240px',
                    borderRadius: "24px",
                    backgroundColor: '#101828',
                    paddingX: "16px",
                    paddingY: "10px",
                },
            }}
            ModalProps={{
                keepMounted: true,
            }}
            variant="persistent"
        >
            <Box
                sx={{
                    display: 'flex',
                    mt: 'calc(var(--template-frame-height, 0px) + 4px)',
                    p: 1.5,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                <Image src={AppIcon} alt="App Icon" />
                <IconButton onClick={toggleDrawer(false)} sx={{ width: 32, height: 32 }}>
                    <Image src={CloseIcon} alt="Close Icon" />
                </IconButton>
            </Box>
            <SideContent data={data} />
        </Drawer>
    );
}
