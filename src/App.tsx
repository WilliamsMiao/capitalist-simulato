import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    IconButton,
    Snackbar,
    Alert,
    useTheme,
    styled,
    Button,
    Paper
} from '@mui/material';
import { useGame } from './context/GameContext';
import { ACTIONS, initialState } from './context/GameContext';
import { GameProvider } from './context/GameContext';
import { CompanyStatus } from './components/CompanyStatus';
import { GameControls } from './components/GameControls';
import { ResumeList } from './components/ResumeList';
import { EmployeeList } from './components/EmployeeList';
import { TrainingDialog } from './components/TrainingDialog';
import { AchievementList } from './components/AchievementList';
import { SaveGameDialog } from './components/SaveGameDialog';
import { GameSummaryDialog } from './components/GameSummaryDialog';
import { LoadingOverlay } from './components/LoadingOverlay';

// 像素风格的按钮
const PixelButton = styled(Button)(({ theme }) => ({
    fontFamily: '"Press Start 2P", cursive',
    border: '4px solid #000',
    backgroundColor: '#999999',
    color: '#ffffff',
    textShadow: '2px 2px #000000',
    padding: '10px 20px',
    '&:hover': {
        backgroundColor: '#bbbbbb',
        border: '4px solid #000',
    },
    '&:active': {
        backgroundColor: '#777777',
        border: '4px solid #000',
    }
}));

// 像素风格的面板
const PixelPanel = styled(Paper)(({ theme }) => ({
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    border: '4px solid #ffffff',
    padding: theme.spacing(2),
    color: '#ffffff',
    boxShadow: 'inset -4px -4px 0px 0px #000000',
}));

// 像素风格的标题
const PixelTitle = styled(Typography)(({ theme }) => ({
    fontFamily: '"Press Start 2P", cursive',
    color: '#ffffff',
    textShadow: '2px 2px #000000',
    textAlign: 'center',
    padding: theme.spacing(2),
}));

// 像素风格的文本
const PixelText = styled(Typography)({
    fontFamily: '"Press Start 2P", cursive',
    color: '#ffffff',
    textShadow: '1px 1px #000000',
});

// 像素风格的事件卡片
const EventCard = styled(Box)(({ theme }) => ({
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    border: '2px solid #ff0000',
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    '& .MuiButton-root': {
        margin: theme.spacing(1),
        fontFamily: '"Press Start 2P", cursive',
        fontSize: '10px',
    }
}));

const GameApp: React.FC = () => {
    const { state, dispatch } = useGame();
    const theme = useTheme();
    const [showAchievements, setShowAchievements] = useState(false);
    const [showSaveDialog, setShowSaveDialog] = useState(false);
    const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
    const [showMenu, setShowMenu] = useState(true);
    const [showGameSummary, setShowGameSummary] = useState(false);

    // 监听游戏状态变化
    useEffect(() => {
        // 检查破产条件
        if (state.company.capital < 0 && state.isRunning) {
            dispatch({ type: ACTIONS.END_GAME });
            setShowGameSummary(true);
        }
        // 检查游戏结束条件（只在游戏状态从运行变为停止时触发）
        else if (!state.isRunning && !showGameSummary && state.company.capital >= 0) {
            setShowGameSummary(true);
        }
    }, [state.company.capital, state.isRunning, showGameSummary]);

    // 处理游戏结束报告关闭
    const handleGameSummaryClose = () => {
        setShowGameSummary(false);
        setShowMenu(true);
        // 重置游戏状态
        dispatch({ type: ACTIONS.LOAD_GAME, payload: initialState });
    };

    // 主菜单界面
    const MainMenu = () => (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 2,
                background: 'url("/minecraft-dirt.png")', // 需要添加背景图片
                backgroundSize: 'cover',
            }}
        >
            <PixelTitle variant="h2">
                资本家模拟器
            </PixelTitle>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <PixelButton onClick={() => setShowMenu(false)}>
                    开始游戏
                </PixelButton>
                <PixelButton onClick={() => setShowAchievements(true)}>
                    成就
                </PixelButton>
                <PixelButton onClick={() => setShowSaveDialog(true)}>
                    保存/读取
                </PixelButton>
            </Box>
        </Box>
    );

    // 游戏主界面
    const GameInterface = () => (
        <Box
            sx={{
                height: '100vh',
                display: 'flex',
                background: 'url("/minecraft-stone.png")',
                backgroundSize: 'cover',
                p: 2,
                gap: 2,
                overflow: 'auto'
            }}
        >
            {/* 左侧面板 */}
            <PixelPanel sx={{ width: 300, height: 'fit-content' }}>
                <PixelTitle variant="h6">公司状态</PixelTitle>
                <CompanyStatus />
                <GameControls />
                
                {/* 成就系统入口 */}
                <Box sx={{ mt: 2 }}>
                    <PixelButton 
                        onClick={() => setShowAchievements(true)} 
                        sx={{ width: '100%' }}
                    >
                        查看成就
                    </PixelButton>
                </Box>
            </PixelPanel>

            {/* 中间面板 */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* 事件显示 */}
                {state.company.activeEvents.length > 0 && (
                    <PixelPanel>
                        <PixelTitle variant="h6">公司事件</PixelTitle>
                        <EventCard>
                            <PixelText sx={{ fontSize: '14px', mb: 2 }}>
                                {state.company.activeEvents[0].title}
                            </PixelText>
                            <PixelText sx={{ fontSize: '12px', mb: 2 }}>
                                {state.company.activeEvents[0].description}
                            </PixelText>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                {state.company.activeEvents[0].choices.map((choice, index) => (
                                    <PixelButton
                                        key={index}
                                        onClick={() => dispatch({
                                            type: 'HANDLE_EVENT',
                                            payload: { eventId: state.company.activeEvents[0].id, choiceIndex: index }
                                        })}
                                    >
                                        {choice.text}
                                    </PixelButton>
                                ))}
                            </Box>
                        </EventCard>
                    </PixelPanel>
                )}
                
                <PixelPanel sx={{ flex: 1 }}>
                    <PixelTitle variant="h6">员工管理</PixelTitle>
                    <EmployeeList onTrainEmployee={setSelectedEmployee} />
                </PixelPanel>
            </Box>

            {/* 右侧面板 */}
            <PixelPanel sx={{ width: 300, height: 'fit-content' }}>
                <PixelTitle variant="h6">招聘中心</PixelTitle>
                <ResumeList />
            </PixelPanel>
        </Box>
    );

    return (
        <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <LoadingOverlay 
                isLoading={state.isProcessingDay} 
                message="正在处理新的一天..."
            />
            {showMenu ? <MainMenu /> : <GameInterface />}

            {/* 对话框和通知 */}
            <TrainingDialog
                open={selectedEmployee !== null}
                employeeId={selectedEmployee}
                onClose={() => setSelectedEmployee(null)}
            />
            <AchievementList
                open={showAchievements}
                onClose={() => setShowAchievements(false)}
            />
            <SaveGameDialog
                open={showSaveDialog}
                onClose={() => setShowSaveDialog(false)}
            />
            <GameSummaryDialog
                open={showGameSummary}
                onClose={handleGameSummaryClose}
            />
            <Snackbar
                open={state.notifications.length > 0}
                autoHideDuration={3000}
                onClose={() => dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: [] })}
            >
                <Alert severity={state.notifications[0]?.type || 'info'}>
                    {state.notifications[0]?.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

const App: React.FC = () => {
    return (
        <GameProvider>
            <GameApp />
        </GameProvider>
    );
};

export default App;
