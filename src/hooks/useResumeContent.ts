import { useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { generateResumeContent } from '../services/ollamaService';
import { ACTIONS } from '../context/GameContext';
import { v4 as uuidv4 } from 'uuid';

export const useResumeContent = () => {
    const { dispatch, state } = useGame();

    const generateContent = useCallback(async (
        resumeId: string,
        experienceLevel: string,
        education: string,
        fee: number
    ) => {
        try {
            // 获取现有简历
            const existingResume = state.availableResumes.find(r => r.id === resumeId);
            
            // 如果简历已经有内容，就直接使用现有内容
            if (existingResume?.skills?.length && existingResume?.personality) {
                dispatch({
                    type: ACTIONS.UPDATE_RESUME_CONTENT,
                    payload: {
                        resumeId,
                        content: {
                            name: existingResume.name,
                            skills: existingResume.skills,
                            personality: existingResume.personality
                        },
                        fee
                    }
                });
            } else {
                // 只有在没有内容时才生成新内容
                const content = await generateResumeContent(
                    experienceLevel, 
                    education,
                    existingResume?.name
                );
                
                if (content) {
                    dispatch({
                        type: ACTIONS.UPDATE_RESUME_CONTENT,
                        payload: {
                            resumeId,
                            content,
                            fee
                        }
                    });
                }
            }

            dispatch({
                type: ACTIONS.ADD_NOTIFICATION,
                payload: {
                    id: uuidv4(),
                    type: 'success' as const,
                    message: '简历查看成功',
                    timestamp: Date.now()
                }
            });
        } catch (error) {
            console.error('生成简历内容失败:', error);
            dispatch({
                type: ACTIONS.ADD_NOTIFICATION,
                payload: {
                    id: uuidv4(),
                    type: 'error' as const,
                    message: '生成简历内容失败',
                    timestamp: Date.now()
                }
            });
        }
    }, [dispatch, state.availableResumes]);

    return { generateContent };
}; 