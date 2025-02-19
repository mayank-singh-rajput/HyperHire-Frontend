'use client';

import * as React from 'react';
import { Box, MenuItem, Select, Stack, Typography } from '@mui/material';
import Image from 'next/image';
import TitleIcon from '../../assets/icon-title.svg';
import FolderTreeView from '@/components/folder-tree';
import FolderForm from '@/components/folder-form';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import FormateTreeData from '../../utils/formateData';

const fetchFolder = async () => {
    const response = await axios.get('/api/folder/fetch');
    return response?.data;
}

export default function Dashboard() {
    const { data: folderData } = useQuery({
        queryKey: ['folders'],
        queryFn: fetchFolder,
        select: (data) => data
    })

    const data = FormateTreeData(folderData);

    return (
        <Stack display="column">
            <Box
                sx={{
                    display: { xs: 'none', sm: 'flex' },
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <Image src={TitleIcon} alt="Title Icon" style={{ width: "48px", height: "48px" }} />
                <Typography variant="h4" fontWeight={800} fontSize="32px" color="#101828" letterSpacing="-4%"> Menus </Typography>
            </Box>

            <Box sx={{ width: { xs: '100%', sm: "25%" }, mb: 2 }}>
                <Typography variant="body1" sx={{ color: '#475467', fontWeight: 400, fontSize: "14px", letterSpacing: "-2%", marginY: 2 }}>Menu</Typography>

                <Select
                    displayEmpty
                    sx={{
                        backgroundColor: '#F9FAFB',
                        height: '52px',
                        borderRadius: '16px',
                        width: "100%",
                        '& .MuiInputBase-root': {
                            padding: '0 16px',
                        },
                        '& .MuiInputLabel-root': {
                            display: "none"
                        },
                        '& .MuiSelect-icon': {
                            right: '12px',
                        },
                    }}
                    value=""
                >
                    <MenuItem value="" disabled>Select Parent Folder</MenuItem>
                    {data && data?.map((folder) => (
                        <MenuItem key={folder.id} value={folder.id}>
                            {folder.label}
                        </MenuItem>
                    ))}
                </Select>
            </Box>

            <Box sx={{
                display: 'flex',
                width: '100%',
                flexDirection: { xs: 'column', sm: 'row' },
                gap: 4
            }}>
                <Box sx={{ flex: 1 }}>
                    <FolderTreeView data={data} />
                </Box>
                <Box sx={{ flex: 1 }}>
                    <FolderForm />
                </Box>
            </Box>
        </Stack>
    );
}
