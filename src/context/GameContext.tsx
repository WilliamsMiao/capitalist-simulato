import React, { createContext, useContext, useReducer, ReactNode, Dispatch, useCallback, useEffect } from 'react';
import { Employee, RandomEvent, TrainingProgram, RandomEventEffect, Notification, SavedGame, Company } from '../types';
import { generateMultipleResumes, calculateDailyExpenses, calculateDailyIncome, calculateResumeScore, calculateRefreshProbability, BASE_SALARY, EDUCATION_BONUS } from '../utils/gameLogic';
import { ACHIEVEMENTS } from '../utils/achievements';
import { generateRandomEvent, shouldTriggerEvent } from '../utils/events';
import { TRAINING_PROGRAMS } from '../utils/training';
import { v4 as uuidv4 } from 'uuid';
import { generateResumeContent } from '../services/ollamaService';

// 定义 GameContext 的类型
type GameContextType = {
    state: GameState;
    dispatch: Dispatch<GameAction>;
};

// 创建 GameContext 时指定类型
const GameContext = createContext<GameContextType | null>(null);

// 修改 GameState 类型
export interface GameState {
    company: Company;
    availableResumes: Employee[];
    isRunning: boolean;
    gameSpeed: number;
    notifications: Notification[];
    savedGames: SavedGame[];
    isProcessingDay: boolean;
}

// 添加 GameAction 类型
export interface GameAction {
    type: string;
    payload?: any;
}

// 修改初始状态
export const initialState: GameState = {
    company: {
        capital: 10000,
        employees: [],
        day: 1,
        dailyExpenses: 0,
        dailyIncome: 0,
        reputation: 50,
        achievements: ACHIEVEMENTS,
        activeEvents: [],
        trainingPrograms: []
    },
    availableResumes: [],
    isRunning: true,
    gameSpeed: 1,
    notifications: [],
    savedGames: [],
    isProcessingDay: false // 初始化加载状态
};

// Action Types
export const ACTIONS = {
    HIRE_EMPLOYEE: 'HIRE_EMPLOYEE',
    FIRE_EMPLOYEE: 'FIRE_EMPLOYEE',
    PROCESS_DAY: 'PROCESS_DAY',
    START_TRAINING: 'START_TRAINING',
    HANDLE_EVENT: 'HANDLE_EVENT',
    SAVE_GAME: 'SAVE_GAME',
    LOAD_GAME: 'LOAD_GAME',
    END_GAME: 'END_GAME',
    SET_GAME_SPEED: 'SET_GAME_SPEED',
    ADD_NOTIFICATION: 'ADD_NOTIFICATION',
    REVEAL_RESUME: 'REVEAL_RESUME',
    UPDATE_RESUME_CONTENT: 'UPDATE_RESUME_CONTENT',
    PROCESS_DAY_COMPLETE: 'PROCESS_DAY_COMPLETE'
} as const;

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case ACTIONS.HIRE_EMPLOYEE: {
            const employee = action.payload as Employee;
            if (state.company.capital < employee.salary) {
                return {
                    ...state,
                    notifications: [
                        ...state.notifications,
                        {
                            id: uuidv4(),
                            type: 'error' as const,
                            message: '资金不足，无法雇佣',
                            timestamp: Date.now()
                        }
                    ].slice(-5)
                };
            }

            const newEmployees = [...state.company.employees, {
                ...employee,
                trainingProgress: {},
                happiness: 80,
                daysEmployed: 0
            }];
            
            const newAvailableResumes = state.availableResumes.filter(
                resume => resume.id !== employee.id
            );

            return {
                ...state,
                company: {
                    ...state.company,
                    employees: newEmployees
                },
                availableResumes: newAvailableResumes,
                notifications: [
                    ...state.notifications,
                    {
                        id: uuidv4(),
                        type: 'success' as const,
                        message: `成功雇佣${employee.name}`,
                        timestamp: Date.now()
                    }
                ].slice(-5)
            };
        }

        case ACTIONS.FIRE_EMPLOYEE: {
            const employeeId = action.payload as string;
            const newEmployees = state.company.employees.filter(
                emp => emp.id !== employeeId
            );

            return {
                ...state,
                company: {
                    ...state.company,
                    employees: newEmployees,
                    reputation: Math.max(0, state.company.reputation - 5)
                }
            };
        }

        case ACTIONS.PROCESS_DAY: {
            const newCompany = { ...state.company };
            
            // 更新基本数据
            newCompany.dailyExpenses = calculateDailyExpenses(newCompany);
            newCompany.dailyIncome = calculateDailyIncome(newCompany);
            newCompany.capital += (newCompany.dailyIncome - newCompany.dailyExpenses);
            newCompany.day += 1;

            // 更新员工数据
            newCompany.employees = newCompany.employees.map(emp => {
                const currentHappiness = typeof emp.happiness === 'number' ? emp.happiness : 50;
                const currentSlacking = typeof emp.slacking === 'number' ? emp.slacking : 0;
                const currentDaysEmployed = typeof emp.daysEmployed === 'number' ? emp.daysEmployed : 0;

                // 基础更新
                const baseUpdate = {
                    ...emp,
                    daysEmployed: currentDaysEmployed + 1,
                    // 加大心情波动
                    happiness: Math.max(0, Math.min(100, currentHappiness + (Math.random() * 4 - 2.5)))
                };

                // 更新摸鱼值
                let slackingChange = 0;
                
                // 1. 加大心情对摸鱼的影响
                if (baseUpdate.happiness < 60) {
                    slackingChange += 3;
                } else if (baseUpdate.happiness > 85) {
                    slackingChange -= 1;
                }

                // 2. 工作时间对摸鱼的影响更显著
                if (baseUpdate.daysEmployed > 20) {  // 缩短周期
                    slackingChange += 1.5;
                }
                if (baseUpdate.daysEmployed > 40) {
                    slackingChange += 1.5;
                }

                // 3. 增加随机波动
                slackingChange += Math.floor(Math.random() * 4) - 1;

                // 4. 根据工资满意度调整摸鱼倾向
                const marketSalary = BASE_SALARY[emp.experienceLevel] * EDUCATION_BONUS[emp.education];
                if (emp.salary < marketSalary * 0.9) {
                    slackingChange += 2;
                }

                const newSlacking = Math.max(0, Math.min(100, currentSlacking + slackingChange));

                // 5. 效率会随时间缓慢下降
                const efficiencyChange = -0.001 - (Math.random() * 0.002);
                const newEfficiency = Math.max(0.3, Math.min(1, emp.efficiency + efficiencyChange));

                return {
                    ...baseUpdate,
                    slacking: isNaN(newSlacking) ? currentSlacking : newSlacking,
                    efficiency: newEfficiency
                };
            });

            // 增加事件触发概率
            if (shouldTriggerEvent(newCompany.day) && newCompany.activeEvents.length === 0) {
                const shouldGenerateEvent = Math.random() < 0.25;
                if (shouldGenerateEvent) {
                    newCompany.activeEvents = [generateRandomEvent()];
                }
            }

            // 处理简历池更新
            const shouldAddNewResumes = Math.random() < 0.5;
            const newAvailableResumes = state.availableResumes
                .map(resume => ({
                    ...resume,
                    daysInPool: resume.daysInPool + 1
                }))
                .filter(resume => {
                    if (resume.daysInPool >= 2) return false;
                    const score = calculateResumeScore(resume);
                    return Math.random() >= 0.3;
                });

            // 返回带有加载状态的中间状态
            return {
                ...state,
                company: newCompany,
                availableResumes: newAvailableResumes,
                isProcessingDay: true, // 设置加载状态
                notifications: [
                    ...state.notifications,
                    {
                        id: uuidv4(),
                        type: 'info' as const,
                        message: '正在处理新的一天...',
                        timestamp: Date.now()
                    }
                ].slice(-5)
            };
        }

        case ACTIONS.START_TRAINING: {
            const { employeeId, programTemplate } = action.payload;
            const program: TrainingProgram = {
                ...programTemplate,
                id: uuidv4(),
                employeesEnrolled: [employeeId]
            };

            return {
                ...state,
                company: {
                    ...state.company,
                    capital: state.company.capital - program.cost,
                    trainingPrograms: [...state.company.trainingPrograms, program]
                }
            };
        }

        case ACTIONS.HANDLE_EVENT: {
            const { eventId, choiceIndex } = action.payload;
            const event = state.company.activeEvents[0]; // 直接获取第一个事件
            
            if (!event || event.id !== eventId) return state;

            const choice = event.choices[choiceIndex];
            const newCompany = { ...state.company };
            let newState = { ...state };

            // 应用选择的效果
            choice.effect.forEach(effect => {
                switch (effect.type) {
                    case 'capital':
                        newCompany.capital += effect.value;
                        break;
                    case 'efficiency':
                        newCompany.employees = newCompany.employees.map(emp => ({
                            ...emp,
                            efficiency: Math.max(0, Math.min(1, emp.efficiency + effect.value))
                        }));
                        break;
                    case 'happiness':
                        newCompany.employees = newCompany.employees.map(emp => ({
                            ...emp,
                            happiness: Math.max(0, Math.min(100, emp.happiness + effect.value))
                        }));
                        break;
                    case 'reputation':
                        newCompany.reputation = Math.max(0, Math.min(100, newCompany.reputation + effect.value));
                        break;
                    case 'layoff':
                        // 随机选择一名员工裁员
                        const randomIndex = Math.floor(Math.random() * newCompany.employees.length);
                        const firedEmployee = newCompany.employees[randomIndex];
                        newCompany.employees = newCompany.employees.filter((_, index) => index !== randomIndex);
                        
                        // 更新公司声誉
                        newCompany.reputation = Math.max(0, newCompany.reputation - 5);

                        // 剩余员工士气受到影响
                        newCompany.employees = newCompany.employees.map(emp => ({
                            ...emp,
                            happiness: Math.max(0, emp.happiness - 10)
                        }));

                        // 添加通知
                        newState = {
                            ...newState,
                            notifications: [
                                ...newState.notifications,
                                {
                                    id: uuidv4(),
                                    type: 'success' as const,
                                    message: '优化成功',
                                    timestamp: Date.now()
                                }
                            ].slice(-5)
                        };
                        break;
                    case 'salary':
                        newCompany.employees = newCompany.employees.map(emp => ({
                            ...emp,
                            salary: emp.salary * (1 + effect.value)
                        }));
                        break;
                }
            });

            // 清空事件列表
            newCompany.activeEvents = [];

            // 返回最终状态
            return {
                ...newState,
                company: newCompany
            };
        }

        case ACTIONS.SAVE_GAME:
            return {
                ...state,
                savedGames: [...state.savedGames, action.payload]
            };

        case ACTIONS.LOAD_GAME:
            return action.payload;

        case ACTIONS.END_GAME: {
            const gameOverState = {
                ...state,
                isRunning: false,
                notifications: [
                    ...state.notifications,
                    {
                        id: uuidv4(),
                        type: 'info' as const,
                        message: state.company.capital < 0 ? '公司破产！游戏结束' : '游戏结束',
                        timestamp: Date.now()
                    }
                ].slice(-5)
            };

            // 自动保存最终游戏状态
            const finalSave = {
                id: uuidv4(),
                name: `游戏结束存档 - 第${state.company.day}天`,
                date: Date.now(),
                state: gameOverState
            };

            return {
                ...gameOverState,
                savedGames: [...state.savedGames, finalSave]
            };
        }

        case ACTIONS.SET_GAME_SPEED:
            return {
                ...state,
                gameSpeed: action.payload
            };

        case ACTIONS.ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [
                    ...state.notifications,
                    {
                        id: uuidv4(),
                        timestamp: Date.now(),
                        ...action.payload
                    }
                ].slice(-5) // 只保留最近的5条通知
            };

        case ACTIONS.REVEAL_RESUME: {
            const { resumeId, fee } = action.payload;
            const resume = state.availableResumes.find(r => r.id === resumeId);
            
            if (!resume) {
                return {
                    ...state,
                    notifications: [
                        ...state.notifications,
                        {
                            id: uuidv4(),
                            type: 'error' as const,
                            message: '简历不存在',
                            timestamp: Date.now()
                        }
                    ].slice(-5)
                };
            }

            if (state.company.capital < fee) {
                return {
                    ...state,
                    notifications: [
                        ...state.notifications,
                        {
                            id: uuidv4(),
                            type: 'error' as const,
                            message: '资金不足，无法支付猎头费用',
                            timestamp: Date.now()
                        }
                    ].slice(-5)
                };
            }

            // 立即返回状态更新
            return {
                ...state,
                company: {
                    ...state.company,
                    capital: state.company.capital - fee
                },
                availableResumes: state.availableResumes.map(r =>
                    r.id === resumeId ? { ...r, isRevealed: true } : r
                ),
                notifications: [
                    ...state.notifications,
                    {
                        id: uuidv4(),
                        type: 'info' as const,
                        message: '正在生成简历内容...',
                        timestamp: Date.now()
                    }
                ].slice(-5)
            };
        }

        case ACTIONS.UPDATE_RESUME_CONTENT: {
            const { resumeId, content, fee } = action.payload;
            return {
                ...state,
                availableResumes: state.availableResumes.map(resume =>
                    resume.id === resumeId
                        ? { ...resume, ...content }
                        : resume
                )
            };
        }

        case ACTIONS.PROCESS_DAY_COMPLETE: {
            const { company, availableResumes } = action.payload;
            return {
                ...state,
                company,
                availableResumes,
                isProcessingDay: false, // 重置加载状态
                notifications: [
                    ...state.notifications,
                    {
                        id: uuidv4(),
                        type: 'success' as const,
                        message: '新的一天开始了！',
                        timestamp: Date.now()
                    }
                ].slice(-5)
            };
        }

        default:
            return state;
    }
}

// Provider Component
export function GameProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(gameReducer, initialState);

    // 监听状态变化，处理新的一天
    useEffect(() => {
        if (state.company.day > 1 && state.isProcessingDay) {
            const shouldAddNewResumes = Math.random() < 0.5;
            
            if (shouldAddNewResumes) {
                const count = Math.floor(Math.random() * 2) + 1;
                const newResumes = generateMultipleResumes(count);
                
                Promise.all(
                    newResumes.map(async (resume) => {
                        try {
                            const content = await generateResumeContent(
                                resume.experienceLevel,
                                resume.education
                            );
                            return { ...resume, ...content };
                        } catch (error) {
                            console.error('生成简历内容失败:', error);
                            return resume;
                        }
                    })
                ).then(completedResumes => {
                    const combinedResumes = [...state.availableResumes, ...completedResumes].slice(0, 3);
                    dispatch({
                        type: ACTIONS.PROCESS_DAY_COMPLETE,
                        payload: {
                            company: state.company,
                            availableResumes: combinedResumes
                        }
                    });
                }).catch(error => {
                    console.error('处理新简历失败:', error);
                    dispatch({
                        type: ACTIONS.PROCESS_DAY_COMPLETE,
                        payload: {
                            company: state.company,
                            availableResumes: state.availableResumes
                        }
                    });
                });
            } else {
                dispatch({
                    type: ACTIONS.PROCESS_DAY_COMPLETE,
                    payload: {
                        company: state.company,
                        availableResumes: state.availableResumes
                    }
                });
            }
        }
    }, [state.company.day, state.isProcessingDay]);

    return (
        <GameContext.Provider value={{ state, dispatch }}>
            {children}
        </GameContext.Provider>
    );
}

// Custom Hook
export function useGame(): GameContextType {
    const context = useContext(GameContext);
    if (!context) {
        throw new Error('useGame must be used within a GameProvider');
    }
    return context;
} 