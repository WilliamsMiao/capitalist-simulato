import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    styled
} from '@mui/material';
import { useGame } from '../context/GameContext';

interface AchievementListProps {
    open: boolean;
    onClose: () => void;
}

const PixelText = styled(Typography)({
    fontFamily: '"Press Start 2P", cursive',
    color: '#ffffff',
    textShadow: '1px 1px #000000',
});

const PixelDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        border: '4px solid #ffffff',
        boxShadow: 'inset -4px -4px 0px 0px #000000',
    }
});

const PixelDialogTitle = styled(DialogTitle)({
    fontFamily: '"Press Start 2P", cursive',
    color: '#ffffff',
    textShadow: '2px 2px #000000',
    textAlign: 'center',
    padding: '16px',
});

const AchievementCard = styled(Box)({
    padding: '12px',
    marginBottom: '12px',
    border: '2px solid #ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    '&.unlocked': {
        backgroundColor: 'rgba(0, 255, 0, 0.1)',
        borderColor: '#00ff00',
    }
});

const PixelButton = styled('button')({
    fontFamily: '"Press Start 2P", cursive',
    fontSize: '12px',
    padding: '8px 16px',
    border: '2px solid #ffffff',
    backgroundColor: '#4a4a4a',
    color: '#ffffff',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#6a6a6a',
    },
});

export const AchievementList: React.FC<AchievementListProps> = ({
    open,
    onClose
}) => {
    const { state } = useGame();
    const { achievements } = state.company;

    return (
        <PixelDialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <PixelDialogTitle>
                公司成就
            </PixelDialogTitle>
            <DialogContent>
                {achievements.map((achievement) => (
                    <AchievementCard
                        key={achievement.id}
                        className={achievement.isUnlocked ? 'unlocked' : ''}
                    >
                        <PixelText sx={{ fontSize: '14px', mb: 1 }}>
                            {achievement.name}
                        </PixelText>
                        <PixelText sx={{ fontSize: '12px', mb: 1, opacity: 0.8 }}>
                            {achievement.description}
                        </PixelText>
                        <PixelText sx={{ fontSize: '10px', color: achievement.isUnlocked ? '#00ff00' : '#ffffff' }}>
                            进度: {achievement.progress} / {achievement.target}
                        </PixelText>
                    </AchievementCard>
                ))}
            </DialogContent>
            <DialogActions sx={{ padding: 2 }}>
                <PixelButton onClick={onClose}>
                    关闭
                </PixelButton>
            </DialogActions>
        </PixelDialog>
    );
}; 