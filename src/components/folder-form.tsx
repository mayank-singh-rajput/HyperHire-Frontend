'use client';

import * as React from 'react';
import { Box, Button, CircularProgress, TextField, MenuItem, Select, InputLabel, FormControl, Typography } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';
import { v4 as uuidv4 } from 'uuid';
import { TreeItems } from '../utils/formateData';

const FolderValidation = z.object({
    id: z.string()
        .min(3, { message: "Id must contain a minimum of 3 letters" })
        .max(100, { message: "Id can have a maximum of 100 letters" }),
    name: z.string()
        .min(3, { message: "Name must contain a minimum of 3 letters" })
        .max(100, { message: "Name can have a maximum of 100 letters" }),
    parentId: z.string().optional(),
});
type FolderValidationInterface = z.infer<typeof FolderValidation>;

export default function FolderForm() {
    const queryClient = useQueryClient();
    const folderData = queryClient.getQueryData(['folders']) as TreeItems[] || [];

    const { control, reset, handleSubmit } = useForm<FolderValidationInterface>({
        resolver: zodResolver(FolderValidation),
        defaultValues: { id: uuidv4(), name: '', parentId: '' },
    });

    const folderMutation = useMutation({
        mutationFn: async (data: FolderValidationInterface) => {
            await axios.post('/api/folder/create', data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders'] }).then(() => {
                reset({ id: uuidv4(), name: '', parentId: '' });
                toast.success('Folder Created.', {
                    style: { borderRadius: '10px', background: '#333', color: '#fff' },
                });
            });            
        },
        onError: (error: Error) => {
            const errorMessage = error?.message || 'An unexpected error occurred.';
            toast.error(errorMessage, {
                style: { borderRadius: '10px', background: '#333', color: '#fff' },
            });
        },
    });

    const onSubmit = async (data: FolderValidationInterface) => {
        await folderMutation.mutateAsync(data);
    };

    return (
        <Box component="form">
            <InputLabel
                htmlFor="id"
                sx={{
                    position: "relative",
                    fontSize: "14px",
                    fontWeight: 400,
                    letterSpacing: "-2%",
                    lineHeight: "14px",
                    color: "#475467",
                    margin: 1
                }}
            >
                Menu ID
            </InputLabel>
            <Controller
                name="id"
                control={control}
                render={({ field, fieldState }) => (
                    <TextField
                        {...field}
                        fullWidth
                        margin="normal"
                        disabled
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        sx={{
                            '& .MuiInputBase-root': { height: '52px', backgroundColor: '#F9FAFB', borderRadius: "16px" },
                            margin: 0
                        }}
                    />
                )}
            />

            <InputLabel
                htmlFor="name"
                sx={{
                    position: "relative",
                    fontSize: "14px",
                    fontWeight: 400,
                    letterSpacing: "-2%",
                    lineHeight: "14px",
                    color: "#475467",
                    margin: 1
                }}
            >
                Name
            </InputLabel>
            <Controller
                name="name"
                control={control}
                render={({ field, fieldState }) => (
                    <TextField
                        {...field}
                        margin="normal"
                        disabled={folderMutation.isPending}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                        sx={{
                            '& .MuiInputBase-root': { backgroundColor: '#F9FAFB', height: '52px', borderRadius: "16px" },
                            width: "50%",
                            margin: 0
                        }}
                    />
                )}
            />

            <InputLabel
                htmlFor="parentId"
                sx={{
                    position: "relative",
                    fontSize: "14px",
                    fontWeight: 400,
                    letterSpacing: "-2%",
                    lineHeight: "14px",
                    color: "#475467",
                    margin: 1
                }}
            >
                Parent Data
            </InputLabel>
            <Controller
                name="parentId"
                control={control}
                render={({ field, fieldState }) => (
                    <FormControl fullWidth margin="none" disabled={folderMutation.isPending}>
                        <Select
                            {...field}
                            error={!!fieldState.error}
                            sx={{
                                backgroundColor: '#F9FAFB',
                                height: '52px',
                                borderRadius: '16px',
                                width: "50%",
                                margin: 0,
                                '& .MuiInputBase-root': {
                                    padding: '0 16px',
                                },
                                '& .MuiInputLabel-root': {
                                    display: 'none',
                                },
                                '& .MuiSelect-icon': {
                                    right: '12px',
                                },
                            }}
                            displayEmpty
                        >
                            {folderData && folderData?.map((folder) => (
                                <MenuItem key={folder.id} value={folder.id}>
                                    {folder.name}
                                </MenuItem>
                            ))}
                        </Select>
                        {fieldState?.error?.message && (
                            <Typography variant="body2" color="error">
                                {fieldState.error.message}
                            </Typography>
                        )}
                    </FormControl>
                )}
            />

            <Button
                type="submit"
                variant="contained"
                onClick={handleSubmit(onSubmit)}
                disabled={folderMutation.isPending}
                sx={{ backgroundColor: "#253BFF", height: '52px', borderRadius: "48px", marginTop: 4, width: "50%" }}
            >
                {folderMutation.isPending ? <CircularProgress size={24} /> : 'Save'}
            </Button>
        </Box>
    );
}
