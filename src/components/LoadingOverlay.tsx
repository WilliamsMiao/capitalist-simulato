import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { PixelText } from './PixelText';

interface LoadingOverlayProps {
    isLoading: boolean;
    message: string;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isLoading, message }) => {
    if (!isLoading) return null;

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                backdropFilter: 'blur(3px)'
            }}
        >
            <CircularProgress size={60} sx={{ color: '#fff', mb: 2 }} />
            <PixelText variant="h6" sx={{ color: '#fff', textAlign: 'center' }}>
                {message}
            </PixelText>
            <Typography variant="body2" sx={{ color: '#fff', mt: 1, opacity: 0.8 }}>
                请稍等片刻...
            </Typography>
        </Box>
    );
}; 