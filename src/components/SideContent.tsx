'use client';

import * as React from 'react';
import { List, ListItem, ListItemButton, ListItemText, Stack } from '@mui/material';
import Image from 'next/image';
import ActiveFolderIcon from '../assets/folder_active.svg';
import InActiveFolderIcon from '../assets/folder_inactive.svg';
import ActiveMenuIcon from '../assets/menu_active.svg';
import InActiveMenuIcon from '../assets/menu_inactive.svg';
import FormateTreeData, { TreeItems } from '../utils/formateData';
import { useQueryClient } from '@tanstack/react-query';

export default function SideContent() {
    const queryClient = useQueryClient();
    const folderData = queryClient.getQueryData(['folders']) as TreeItems[] || [];
    const data = FormateTreeData(folderData);
    const [activeFolder, setActiveFolder] = React.useState<TreeItems>(data?.[0]);
    const [activeChildren, setActiveChildren] = React.useState<TreeItems>(activeFolder?.children?.[0] as TreeItems);

    const handleFolderClick = (folder: TreeItems) => {
        if (activeFolder?.id !== folder?.id) {
            setActiveFolder(folder);
            setActiveChildren({ id: "", label: "" });
        }
    };

    const handleChildrenClick = (children: TreeItems, folder: TreeItems) => {
        if (activeFolder?.id !== folder?.id) {
            setActiveFolder(folder);
            setActiveChildren(folder?.children ? folder?.children?.[0] : { id: "", label: "" });
        }
        setActiveChildren(children);
    };

    return (
        <Stack sx={{ flexGrow: 1, justifyContent: 'space-between' }}>
            <List dense>
                {data.map((folder, folderIndex) => {
                    const isFolderActive = activeFolder?.id === folder?.id;
                    return (
                        <ListItem
                            key={folderIndex}
                            disablePadding
                            sx={{
                                display: 'block',
                                fontSize: "14px",
                                fontWeight: 700,
                                borderRadius: "16px",
                                backgroundColor: isFolderActive ? '#1D2939' : 'transparent',
                                '&:hover': {
                                    backgroundColor: isFolderActive ? '#1D2939' : 'transparent',
                                },
                                color: isFolderActive ? '#FFFFFF' : '#667085',
                            }}>
                            <ListItemButton
                                onClick={() => handleFolderClick(folder)}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px",
                                    padding: "12px",
                                }}
                            >
                                <Image
                                    src={isFolderActive ? ActiveFolderIcon : InActiveFolderIcon}
                                    alt="Folder Icon"
                                    style={{ width: "24px", height: "24px" }}
                                />
                                <ListItemText primary={folder.label} />
                            </ListItemButton>

                            {folder.children?.map((children, childrenIndex) => {
                                const isChildrenActive = activeChildren?.id === children?.id;
                                return (
                                    <ListItem
                                        key={childrenIndex}
                                        disablePadding
                                        sx={{
                                            display: 'block',
                                            fontSize: "14px",
                                            fontWeight: 700,
                                            borderRadius: "16px",
                                            backgroundColor: isChildrenActive ? '#9FF443' : 'transparent',
                                            '&:hover': {
                                                backgroundColor: isChildrenActive ? '#9FF443' : 'transparent',
                                            },
                                            color: isChildrenActive ? '#101828' : '#667085',
                                        }}>
                                        <ListItemButton
                                            onClick={() => handleChildrenClick(children, folder)}
                                            sx={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: "16px",
                                                padding: "12px",
                                            }}
                                        >
                                            <Image
                                                src={isChildrenActive ? ActiveMenuIcon : InActiveMenuIcon}
                                                alt="Menu Icon"
                                                style={{ width: "24px", height: "24px" }}
                                            />
                                            <ListItemText primary={children.label} />
                                        </ListItemButton>
                                    </ListItem>
                                );
                            })}
                        </ListItem>
                    );
                })}
            </List>
        </Stack>
    );
}
