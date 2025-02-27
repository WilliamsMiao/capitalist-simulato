import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { useGame } from '../context/GameContext';

const PixelText = styled(Typography)({
    fontFamily: '"Press Start 2P", cursive',
    fontSize: '12px',
    color: '#ffffff',
    marginBottom: '8px',
    textShadow: '1px 1px #000000',
});

const StatusBox = styled(Box)({
    padding: '8px',
    border: '2px solid #ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: '8px',
});

export const CompanyStatus: React.FC = () => {
    const { state } = useGame();
    const { company } = state;

    return (
        <Box>
            <StatusBox>
                <PixelText>
                    资金: ¥{company.capital.toFixed(2)}
                </PixelText>
            </StatusBox>
            <StatusBox>
                <PixelText>
                    日收入: ¥{company.dailyIncome.toFixed(2)}
                </PixelText>
                <PixelText>
                    日支出: ¥{company.dailyExpenses.toFixed(2)}
                </PixelText>
            </StatusBox>
            <StatusBox>
                <PixelText>
                    员工数: {company.employees.length}
                </PixelText>
                <PixelText>
                    声誉: {company.reputation}%
                </PixelText>
            </StatusBox>
            <StatusBox>
                <PixelText>
                    游戏天数: {company.day}
                </PixelText>
            </StatusBox>
        </Box>
    );
}; 