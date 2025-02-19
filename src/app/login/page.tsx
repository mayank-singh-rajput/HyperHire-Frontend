'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Typography, CircularProgress, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { z } from 'zod';
import axios from 'axios';
import toast from 'react-hot-toast';

const AuthValidation = z.object({
    email: z.string()
        .min(1, { message: "Email is required" })
        .email("Invalid email address"),
    name: z.string()
        .min(3, { message: "Name must contain a minimum of 3 letters" })
        .max(100, { message: "Name can have a maximum of 100 letters" })
});
type AuthValidationInterface = z.infer<typeof AuthValidation>;

export default function Login() {
    const router = useRouter();

    const { control, handleSubmit } = useForm<AuthValidationInterface>({
        resolver: zodResolver(AuthValidation),
        defaultValues: { email: '', name: '' },
    });

    const loginMutation = useMutation({
        mutationFn: async (data: AuthValidationInterface) => {
            await axios.post('/api/login', data);
        },
        onSuccess: () => {
            toast.success('Login Successfully.', {
                style: { borderRadius: '10px', background: '#333', color: '#fff' },
            });
            router.push('/dashboard');
        },
        onError: (error: Error) => {
            const errorMessage = error?.message || 'An unexpected error occurred.';
            toast(errorMessage, {
                icon: '❌',
                style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                },
            });
        },
    });

    const onSubmit = async (data: AuthValidationInterface) => {
        await loginMutation.mutateAsync(data);
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    maxWidth: '500px',
                    width: '100%',
                    padding: 4,
                    boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.05), 0px 15px 35px -5px rgba(0, 0, 0, 0.05)',
                    backgroundColor: '#fff',
                    borderRadius: 8,
                }}
            >
                <Typography variant="h4" fontWeight={800} align="center" color="#101828" letterSpacing="-4%">
                    Sign in
                </Typography>

                <Box component="form">
                    <Controller
                        name="email"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                placeholder="Enter your email..."
                                fullWidth
                                margin="normal"
                                disabled={loginMutation.isPending}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                sx={{
                                    '& .MuiInputBase-root': { height: '52px', backgroundColor: '#F9FAFB', borderRadius: "16px" },
                                }}
                            />
                        )}
                    />

                    <Controller
                        name="name"
                        control={control}
                        render={({ field, fieldState }) => (
                            <TextField
                                {...field}
                                placeholder="Enter your name..."
                                fullWidth
                                margin="normal"
                                disabled={loginMutation.isPending}
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                sx={{
                                    '& .MuiInputBase-root': { backgroundColor: '#F9FAFB', height: '52px', borderRadius: "16px" },
                                }}
                            />
                        )}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        onClick={handleSubmit(onSubmit)}
                        disabled={loginMutation.isPending}
                        sx={{ backgroundColor: "#253BFF", height: '52px', borderRadius: "48px", marginTop: 4 }}
                    >
                        {loginMutation.isPending ? <CircularProgress size={24} /> : 'Login'}
                    </Button>
                </Box>
            </Box>

        </Box>
    );
}
