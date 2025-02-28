import React from 'react';
import {
    Box,
    Button,
    Typography,
    styled,
    Divider,
    Stack,
    Chip
} from '@mui/material';
import { useGame } from '../context/GameContext';
import { ACTIONS } from '../context/GameContext';
import { HEADHUNTING_FEE } from '../utils/gameLogic';
import { Employee } from '../types';
import { useResumeContent } from '../hooks/useResumeContent';
import { v4 as uuidv4 } from 'uuid';

// 像素风格的文本
const PixelText = styled(Typography)({
    fontFamily: '"Press Start 2P", cursive',
    color: '#ffffff',
    textShadow: '1px 1px #000000',
    fontSize: '12px',
    marginBottom: '8px'
});

// 像素风格的按钮
const PixelButton = styled(Button)({
    fontFamily: '"Press Start 2P", cursive',
    fontSize: '10px',
    border: '2px solid #ffffff',
    margin: '4px',
    color: '#ffffff',
    textShadow: '1px 1px #000000',
    '&.Mui-disabled': {
        color: '#666666',
        border: '2px solid #666666',
    }
});

// 像素风格的简历卡片
const ResumeCard = styled(Box)({
    border: '2px solid #ffffff',
    padding: '12px',
    marginBottom: '16px',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
});

export const ResumeList: React.FC = () => {
    const context = useGame();
    if (!context) {
        throw new Error('ResumeList must be used within a GameProvider');
    }
    const { state, dispatch } = context;
    const { generateContent } = useResumeContent();

    const handleRevealResume = async (resume: Employee) => {
        const fee = HEADHUNTING_FEE[resume.experienceLevel];
        if (state.company.capital >= fee) {
            dispatch({
                type: ACTIONS.REVEAL_RESUME,
                payload: {
                    resumeId: resume.id,
                    fee: fee
                }
            });

            // 生成简历内容
            await generateContent(
                resume.id,
                resume.experienceLevel,
                resume.education,
                fee
            );
        } else {
            dispatch({
                type: ACTIONS.ADD_NOTIFICATION,
                payload: {
                    type: 'error' as const,
                    message: '资金不足，无法支付猎头费用！',
                    id: uuidv4(),
                    timestamp: Date.now()
                }
            });
        }
    };

    const handleHire = (resume: Employee) => {
        if (!resume.isRevealed) {
            dispatch({
                type: ACTIONS.ADD_NOTIFICATION,
                payload: {
                    type: 'warning' as const,
                    message: '请先查看简历详情！',
                    id: uuidv4(),
                    timestamp: Date.now()
                }
            });
            return;
        }

        dispatch({
            type: ACTIONS.HIRE_EMPLOYEE,
            payload: resume
        });
    };

    return (
        <Box>
            {state.availableResumes.map((resume: Employee) => (
                <ResumeCard key={resume.id}>
                    {/* 基本信息（始终显示） */}
                    <PixelText>
                        姓名: {resume.name}
                    </PixelText>
                    <PixelText>
                        经验: {resume.experienceLevel}
                    </PixelText>
                    <PixelText>
                        学历: {resume.education}
                    </PixelText>

                    {/* 详细信息（仅在查看后显示） */}
                    {resume.isRevealed ? (
                        <>
                            <Divider sx={{ my: 1, borderColor: '#ffffff' }} />
                            <PixelText>
                                期望薪资: ¥{resume.salary.toFixed(0)}
                            </PixelText>
                            <PixelText>
                                技能:
                            </PixelText>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {resume.skills.map((skill: string, index: number) => (
                                    <Chip
                                        key={index}
                                        label={skill}
                                        size="small"
                                        sx={{
                                            fontFamily: '"Press Start 2P", cursive',
                                            fontSize: '8px',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                            color: '#ffffff',
                                            border: '1px solid #ffffff'
                                        }}
                                    />
                                ))}
                            </Box>
                            <PixelText>
                                工作效率: {(resume.efficiency * 100).toFixed(0)}%
                            </PixelText>
                            {resume.personality && (
                                <>
                                    <PixelText>
                                        性格特点: {resume.personality.traits.join(', ')}
                                    </PixelText>
                                    <PixelText>
                                        工作态度: {resume.personality.workAttitude}
                                    </PixelText>
                                    <PixelText>
                                        职业规划: {resume.personality.careerPlan}
                                    </PixelText>
                                </>
                            )}
                            <PixelButton
                                variant="contained"
                                color="primary"
                                onClick={() => handleHire(resume)}
                                fullWidth
                            >
                                雇佣
                            </PixelButton>
                        </>
                    ) : (
                        <>
                            <Divider sx={{ my: 1, borderColor: '#ffffff' }} />
                            <PixelText sx={{ color: '#ffff00' }}>
                                猎头费: ¥{HEADHUNTING_FEE[resume.experienceLevel]}
                            </PixelText>
                            <PixelButton
                                variant="contained"
                                color="secondary"
                                onClick={() => handleRevealResume(resume)}
                                fullWidth
                            >
                                查看详情
                            </PixelButton>
                        </>
                    )}
                </ResumeCard>
            ))}
        </Box>
    );
}; 