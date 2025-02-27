import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Box,
    Button,
    styled
} from '@mui/material';
import { useGame } from '../context/GameContext';

// 像素风格的文本
const PixelText = styled(Typography)({
    fontFamily: '"Press Start 2P", cursive',
    color: '#ffffff',
    textShadow: '1px 1px #000000',
    marginBottom: '10px'
});

// 像素风格的按钮
const PixelButton = styled(Button)({
    fontFamily: '"Press Start 2P", cursive',
    border: '4px solid #000',
    backgroundColor: '#999999',
    color: '#ffffff',
    textShadow: '2px 2px #000000',
    padding: '10px 20px',
    '&:hover': {
        backgroundColor: '#bbbbbb',
        border: '4px solid #000',
    }
});

// 像素风格的对话框
const PixelDialog = styled(Dialog)({
    '& .MuiDialog-paper': {
        backgroundColor: '#333333',
        border: '4px solid #ffffff',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
    }
});

interface GameSummaryDialogProps {
    open: boolean;
    onClose: () => void;
}

export const GameSummaryDialog: React.FC<GameSummaryDialogProps> = ({ open, onClose }) => {
    const { state } = useGame();
    
    // 计算游戏分数
    const calculateScore = () => {
        const { company } = state;
        let score = 0;
        
        // 1. 存活天数得分 (每天1分，最高100分)
        const survivalScore = Math.min(100, company.day);
        
        // 2. 资金得分 (每1000元1分，最高100分)
        const capitalScore = Math.min(100, Math.floor(company.capital / 1000));
        
        // 3. 员工数量得分 (每个员工10分，最高100分)
        const employeeScore = Math.min(100, company.employees.length * 10);
        
        // 4. 声誉得分 (直接使用声誉值，最高100分)
        const reputationScore = company.reputation;
        
        // 5. 成就得分 (每个成就20分)
        const achievementScore = Math.min(100, 
            company.achievements.filter(a => a.isUnlocked).length * 20
        );
        
        // 计算总分 (总分500分)
        score = survivalScore + capitalScore + employeeScore + reputationScore + achievementScore;
        
        return {
            total: score,
            breakdown: {
                survival: survivalScore,
                capital: capitalScore,
                employee: employeeScore,
                reputation: reputationScore,
                achievement: achievementScore
            }
        };
    };

    const score = calculateScore();

    return (
        <PixelDialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>
                <PixelText variant="h5" align="center">
                    游戏结束总结
                </PixelText>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <PixelText variant="h6" color="primary">
                        最终得分: {score.total}
                    </PixelText>
                    
                    <Box sx={{ mt: 3 }}>
                        <PixelText>
                            存活天数: {state.company.day} 天 (+{score.breakdown.survival}分)
                        </PixelText>
                        <PixelText>
                            最终资金: ¥{state.company.capital.toFixed(0)} (+{score.breakdown.capital}分)
                        </PixelText>
                        <PixelText>
                            员工数量: {state.company.employees.length} 人 (+{score.breakdown.employee}分)
                        </PixelText>
                        <PixelText>
                            公司声誉: {state.company.reputation.toFixed(0)} (+{score.breakdown.reputation}分)
                        </PixelText>
                        <PixelText>
                            解锁成就: {state.company.achievements.filter(a => a.isUnlocked).length} 个 (+{score.breakdown.achievement}分)
                        </PixelText>
                    </Box>

                    <Box sx={{ mt: 4 }}>
                        <PixelText variant="body2" color="secondary">
                            {score.total >= 400 ? '太厉害了！你是最棒的企业家！' :
                             score.total >= 300 ? '干得不错！你是一位优秀的管理者！' :
                             score.total >= 200 ? '还不错，继续努力！' :
                             '这只是开始，再接再厉！'}
                        </PixelText>
                    </Box>
                </Box>
            </DialogContent>
            <DialogActions>
                <PixelButton onClick={onClose}>
                    返回主菜单
                </PixelButton>
            </DialogActions>
        </PixelDialog>
    );
}; 