import { TrainingProgram } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const TRAINING_PROGRAMS: TrainingProgram[] = [
    {
        id: 'basic_programming',
        name: '基础编程培训',
        skill: '编程',
        duration: 5,
        cost: 2000,
        efficiencyBonus: 0.1,
        employeesEnrolled: []
    },
    {
        id: 'advanced_design',
        name: '高级设计课程',
        skill: '设计',
        duration: 7,
        cost: 3000,
        efficiencyBonus: 0.15,
        employeesEnrolled: []
    },
    {
        id: 'marketing_strategy',
        name: '市场营销策略',
        skill: '市场营销',
        duration: 4,
        cost: 1500,
        efficiencyBonus: 0.08,
        employeesEnrolled: []
    },
    {
        id: 'leadership',
        name: '领导力培训',
        skill: '项目管理',
        duration: 6,
        cost: 4000,
        efficiencyBonus: 0.2,
        employeesEnrolled: []
    }
];

export const createTrainingProgram = (template: TrainingProgram): TrainingProgram => {
    return {
        ...template,
        id: uuidv4(),
        employeesEnrolled: []
    };
};

export const calculateTrainingProgress = (currentProgress: number, efficiency: number): number => {
    // 根据员工效率计算每天的培训进度
    const baseProgress = 100 / 30; // 基础进度：每天增加总进度的1/30
    const actualProgress = baseProgress * (1 + efficiency);
    return Math.min(100, currentProgress + actualProgress);
}; 