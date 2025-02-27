import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box
} from '@mui/material';
import { useGame } from '../context/GameContext';
import { ACTIONS } from '../context/GameContext';
import { RandomEvent } from '../types';

interface EventDialogProps {
    event: RandomEvent;
    onClose: () => void;
}

export const EventDialog: React.FC<EventDialogProps> = ({ event, onClose }) => {
    const { dispatch } = useGame();

    const handleChoice = (choiceIndex: number) => {
        dispatch({
            type: ACTIONS.HANDLE_EVENT,
            payload: { eventId: event.id, choiceIndex }
        });
        onClose();
    };

    return (
        <Dialog open={true} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>{event.title}</DialogTitle>
            <DialogContent>
                <Typography variant="body1" gutterBottom>
                    {event.description}
                </Typography>
                <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                        可选操作：
                    </Typography>
                    {event.choices.map((choice, index) => (
                        <Box key={index} sx={{ mb: 2 }}>
                            <Typography variant="body2" gutterBottom>
                                {choice.text}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                影响：
                                {choice.effect.map((effect, i) => (
                                    <span key={i}>
                                        {effect.type === 'capital' && `资金 ${effect.value > 0 ? '+' : ''}${effect.value}`}
                                        {effect.type === 'efficiency' && `效率 ${effect.value > 0 ? '+' : ''}${(effect.value * 100).toFixed(0)}%`}
                                        {effect.type === 'happiness' && `满意度 ${effect.value > 0 ? '+' : ''}${effect.value}`}
                                        {effect.type === 'reputation' && `声誉 ${effect.value > 0 ? '+' : ''}${effect.value}`}
                                        {i < choice.effect.length - 1 ? '，' : ''}
                                    </span>
                                ))}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </DialogContent>
            <DialogActions>
                {event.choices.map((choice, index) => (
                    <Button
                        key={index}
                        onClick={() => handleChoice(index)}
                        variant="contained"
                        color={index === 0 ? 'primary' : 'secondary'}
                    >
                        {choice.text}
                    </Button>
                ))}
            </DialogActions>
        </Dialog>
    );
}; 