'use client';

import * as React from 'react';
import AppTheme from '../../AppTheme';
import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Header from '../../components/Header';
import SideMenu from '../../components/SideMenu';
import Dashboard from './page';

type TreeItemProps = {
    id: string;
    name?: string;
    label?: string;
    parentId?: string;
};

type TreeViewBase<T> = {
    id: string;
    label?: string;
    parentId?: string;
    children?: TreeViewBase<T>[];
};

function FormateTreeData(data: TreeItemProps[]) {
    const map = new Map<string, TreeViewBase<TreeItemProps>>();
    const result: TreeViewBase<TreeItemProps>[] = [];

    data?.forEach(item => {
        const treeItem: TreeViewBaseItem<TreeItemProps> = {
            id: item.id,
            label: item.name,
            parentId: item.parentId,
            children: [],
        };
        map.set(item.id, treeItem);
    });

    data?.forEach(item => {
        const treeItem = map.get(item.id);

        if (item.parentId) {
            const parentItem = map.get(item.parentId);
            if (parentItem) {
                parentItem.children?.push(treeItem!);
            }
        } else {
            result.push(treeItem!);
        }
    });

    return result;
}

const fetchFolder = async () => {
    const response = await axios.get('/api/folder/fetch');
    return response?.data;
}

export default function Layout() {
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
    const [open, setOpen] = React.useState<boolean>(true);

    const toggleDrawer = (state: boolean) => () => {
        setOpen(state);
    };

    React.useEffect(() => {
        setOpen(!isSmallScreen);
    }, [isSmallScreen])

    const { data: folderData } = useQuery({
        queryKey: ['folders'],
        queryFn: fetchFolder,
        select: (data) => data
    })

    const data = FormateTreeData(folderData);

    return (
        <AppTheme>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex', width: "100%", height: "100%", padding: "24px" }}>
                <SideMenu open={open} toggleDrawer={toggleDrawer} data={data} />

                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', marginLeft: open && !isSmallScreen ? '260px' : 0, }}>
                    <Header open={open} toggleDrawer={toggleDrawer} />
                    <Dashboard data={data} />
                </Box>
            </Box>
        </AppTheme>
    );
}
