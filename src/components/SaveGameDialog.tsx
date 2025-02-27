import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Typography
} from '@mui/material';
import { Delete as DeleteIcon, Save as SaveIcon } from '@mui/icons-material';
import { useGame } from '../context/GameContext';
import { ACTIONS } from '../context/GameContext';
import { saveGame, loadGame, deleteSave } from '../utils/saveGame';

interface SaveGameDialogProps {
    open: boolean;
    onClose: () => void;
}

export const SaveGameDialog: React.FC<SaveGameDialogProps> = ({ open, onClose }) => {
    const { state, dispatch } = useGame();
    const [saveName, setSaveName] = useState('');

    const handleSave = () => {
        if (!saveName.trim()) return;

        const savedGame = saveGame(state, saveName);
        dispatch({
            type: ACTIONS.SAVE_GAME,
            payload: savedGame
        });
        dispatch({
            type: ACTIONS.ADD_NOTIFICATION,
            payload: {
                type: 'success',
                message: '游戏已保存'
            }
        });
        setSaveName('');
    };

    const handleLoad = (id: string) => {
        const loadedState = loadGame(id);
        if (loadedState) {
            dispatch({
                type: ACTIONS.LOAD_GAME,
                payload: loadedState
            });
            dispatch({
                type: ACTIONS.ADD_NOTIFICATION,
                payload: {
                    type: 'success',
                    message: '游戏已加载'
                }
            });
            onClose();
        }
    };

    const handleDelete = (id: string) => {
        deleteSave(id);
        dispatch({
            type: ACTIONS.ADD_NOTIFICATION,
            payload: {
                type: 'info',
                message: '存档已删除'
            }
        });
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle>游戏存档</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="存档名称"
                    value={saveName}
                    onChange={(e) => setSaveName(e.target.value)}
                    margin="normal"
                />
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSave}
                    disabled={!saveName.trim()}
                    startIcon={<SaveIcon />}
                    fullWidth
                    sx={{ mt: 1 }}
                >
                    保存游戏
                </Button>

                <Typography variant="h6" sx={{ mt: 3, mb: 1 }}>
                    存档列表
                </Typography>
                <List>
                    {state.savedGames.map((save) => (
                        <ListItem key={save.id}>
                            <ListItemText
                                primary={save.name}
                                secondary={new Date(save.date).toLocaleString()}
                            />
                            <ListItemSecondaryAction>
                                <Button
                                    onClick={() => handleLoad(save.id)}
                                    color="primary"
                                >
                                    加载
                                </Button>
                                <IconButton
                                    edge="end"
                                    onClick={() => handleDelete(save.id)}
                                    color="error"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>关闭</Button>
            </DialogActions>
        </Dialog>
    );
}; 