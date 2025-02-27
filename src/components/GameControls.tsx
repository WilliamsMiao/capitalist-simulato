import React from 'react';
import { Button, Stack } from '@mui/material';
import { useGame } from '../context/GameContext';
import { ACTIONS } from '../context/GameContext';

export const GameControls: React.FC = () => {
    const { dispatch } = useGame();

    const handleNextDay = () => {
        dispatch({ type: ACTIONS.PROCESS_DAY });
    };

    const handleEndGame = () => {
        dispatch({ type: ACTIONS.END_GAME });
    };

    return (
        <Stack direction="row" spacing={2} sx={{ my: 2 }}>
            <Button
                variant="contained"
                color="primary"
                onClick={handleNextDay}
            >
                进入下一天
            </Button>
            <Button
                variant="contained"
                color="error"
                onClick={handleEndGame}
            >
                结束游戏
            </Button>
        </Stack>
    );
}; 