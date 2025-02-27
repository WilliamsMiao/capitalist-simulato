import React from 'react';
import { Box, Typography, styled } from '@mui/material';
import { useGame } from '../context/GameContext';
import SchoolIcon from '@mui/icons-material/School';
import DeleteIcon from '@mui/icons-material/Delete';

interface EmployeeListProps {
    onTrainEmployee?: (employeeId: string) => void;
}

const PixelText = styled(Typography)({
    fontFamily: '"Press Start 2P", cursive',
    fontSize: '12px',
    color: '#ffffff',
    marginBottom: '6px',
    textShadow: '1px 1px #000000',
});

const EmployeeCard = styled(Box)({
    padding: '12px',
    border: '2px solid #ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginBottom: '12px',
    position: 'relative',
});

const PixelButton = styled('button')({
    fontFamily: '"Press Start 2P", cursive',
    fontSize: '12px',
    padding: '6px 12px',
    border: '2px solid #ffffff',
    backgroundColor: '#4a4a4a',
    color: '#ffffff',
    cursor: 'pointer',
    '&:hover': {
        backgroundColor: '#6a6a6a',
    },
    marginRight: '8px',
});

export const EmployeeList: React.FC<EmployeeListProps> = ({ onTrainEmployee }) => {
    const { state, dispatch } = useGame();
    const { company } = state;

    const handleFireEmployee = (employeeId: string) => {
        dispatch({ type: 'FIRE_EMPLOYEE', payload: employeeId });
    };

    const getEfficiencyColor = (efficiency: number) => {
        if (efficiency >= 80) return '#00ff00';
        if (efficiency >= 60) return '#ffff00';
        return '#ff0000';
    };

    const getSlackingColor = (slacking: number) => {
        if (slacking >= 70) return '#ff0000';
        if (slacking >= 40) return '#ffff00';
        return '#00ff00';
    };

    return (
        <Box>
            <PixelText sx={{ fontSize: '16px', marginBottom: '16px' }}>
                员工列表 ({company.employees.length})
            </PixelText>
            {company.employees.map((employee) => (
                <EmployeeCard key={employee.id}>
                    <PixelText>
                        {employee.name} - 工作{employee.daysEmployed}天
                    </PixelText>
                    <PixelText sx={{ color: getEfficiencyColor(employee.efficiency) }}>
                        效率: {employee.efficiency}%
                    </PixelText>
                    <PixelText>
                        心情: {employee.happiness}%
                    </PixelText>
                    <PixelText sx={{ color: getSlackingColor(employee.slacking) }}>
                        摸鱼倾向: {employee.slacking}%
                    </PixelText>
                    <Box sx={{ mt: 1 }}>
                        {onTrainEmployee && (
                            <PixelButton onClick={() => onTrainEmployee(employee.id)}>
                                培训
                            </PixelButton>
                        )}
                        <PixelButton onClick={() => handleFireEmployee(employee.id)}>
                            解雇
                        </PixelButton>
                    </Box>
                </EmployeeCard>
            ))}
        </Box>
    );
}; 