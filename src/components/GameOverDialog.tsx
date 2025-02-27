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

interface GameOverDialogProps {
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

const StatBox = styled(Box)({
    padding: '12px',
    marginBottom: '12px',
    border: '2px solid #ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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

export const GameOverDialog: React.FC<GameOverDialogProps> = ({
    open,
    onClose
}) => {
    const { state } = useGame();
    const { company } = state;

    // 计算游戏统计数据
    const totalEmployees = company.employees.length;
    const totalAchievements = company.achievements.filter(a => a.isUnlocked).length;
    const averageEfficiency = company.employees.reduce((sum, emp) => sum + emp.efficiency, 0) / totalEmployees || 0;
    const totalProfit = company.capital - 10000; // 初始资金为10000

    return (
        <PixelDialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <PixelDialogTitle>
                游戏结束报告
            </PixelDialogTitle>
            <DialogContent>
                <StatBox>
                    <PixelText sx={{ fontSize: '14px', mb: 1 }}>
                        生存天数: {company.day} 天
                    </PixelText>
                </StatBox>
                <StatBox>
                    <PixelText sx={{ fontSize: '14px', mb: 1 }}>
                        最终资产: ¥{company.capital.toLocaleString()}
                    </PixelText>
                    <PixelText sx={{ fontSize: '12px', color: totalProfit >= 0 ? '#00ff00' : '#ff0000' }}>
                        总收益: ¥{totalProfit.toLocaleString()}
                    </PixelText>
                </StatBox>
                <StatBox>
                    <PixelText sx={{ fontSize: '14px', mb: 1 }}>
                        公司规模: {totalEmployees} 名员工
                    </PixelText>
                    <PixelText sx={{ fontSize: '12px' }}>
                        平均效率: {(averageEfficiency * 100).toFixed(1)}%
                    </PixelText>
                </StatBox>
                <StatBox>
                    <PixelText sx={{ fontSize: '14px', mb: 1 }}>
                        公司声誉: {company.reputation}
                    </PixelText>
                    <PixelText sx={{ fontSize: '12px' }}>
                        解锁成就: {totalAchievements} 个
                    </PixelText>
                </StatBox>
            </DialogContent>
            <DialogActions sx={{ padding: 2 }}>
                <PixelButton onClick={onClose}>
                    返回主菜单
                </PixelButton>
            </DialogActions>
        </PixelDialog>
    );
}; 