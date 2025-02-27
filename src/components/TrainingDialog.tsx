import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemSecondaryAction
} from '@mui/material';
import { useGame } from '../context/GameContext';
import { ACTIONS } from '../context/GameContext';
import { Employee, TrainingProgram } from '../types';
import { TRAINING_PROGRAMS } from '../utils/training';

interface TrainingDialogProps {
    open: boolean;
    employeeId: string | null;
    onClose: () => void;
}

export const TrainingDialog: React.FC<TrainingDialogProps> = ({
    open,
    employeeId,
    onClose
}) => {
    const { state, dispatch } = useGame();
    const employee = employeeId ? state.company.employees.find(e => e.id === employeeId) : null;

    if (!employee) return null;

    const handleStartTraining = (program: TrainingProgram) => {
        dispatch({
            type: ACTIONS.START_TRAINING,
            payload: {
                employeeId: employee.id,
                programTemplate: program
            }
        });
        onClose();
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>培训员工: {employee.name}</DialogTitle>
            <DialogContent>
                <List>
                    {TRAINING_PROGRAMS.map((program) => (
                        <ListItem key={program.name}>
                            <ListItemText
                                primary={program.name}
                                secondary={`费用: ¥${program.cost} | 时长: ${program.duration}天 | 效率提升: ${program.efficiencyBonus * 100}%`}
                            />
                            <Button
                                variant="contained"
                                onClick={() => handleStartTraining(program)}
                                disabled={state.company.capital < program.cost}
                            >
                                开始培训
                            </Button>
                        </ListItem>
                    ))}
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>取消</Button>
            </DialogActions>
        </Dialog>
    );
}; 