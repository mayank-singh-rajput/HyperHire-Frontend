'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { Typography, IconButton } from '@mui/material';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import Image from 'next/image';
import FolderIcon from '../assets/folder.svg';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
    margin: theme.spacing(1, 0),
    [`& .${breadcrumbsClasses.separator}`]: {
        color: theme.palette.action.disabled,
        margin: 1,
    },
    [`& .${breadcrumbsClasses.ol}`]: {
        alignItems: 'center',
    },
}));

export default function NavbarBreadcrumbs() {
    const pathname = usePathname();
    const path = pathname.split('/dashboard/')?.[1]?.split('/').map((word) => word.charAt(0).toUpperCase() + word.slice(1)) || 'Menu';

    return (
        <StyledBreadcrumbs aria-label="breadcrumb" separator={<NavigateNextRoundedIcon fontSize="small" />} sx={{ paddingTop: 0 }}>
            <IconButton>
                <Image src={FolderIcon} alt="Folder Icon" />
            </IconButton>
            <Typography variant="body1" sx={{ color: '#101828', fontWeight: 500, fontSize: "14px", letterSpacing: "-2%" }}>
                {path}
            </Typography>
        </StyledBreadcrumbs>
    );
}
