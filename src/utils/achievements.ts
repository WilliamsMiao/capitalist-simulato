import { Achievement, Company } from '../types';

export const ACHIEVEMENTS: Achievement[] = [
    {
        id: 'first_hire',
        name: '初次招聘',
        description: '雇佣第一名员工',
        isUnlocked: false,
        progress: 0,
        target: 1
    },
    {
        id: 'team_builder',
        name: '团队建设者',
        description: '拥有10名员工',
        isUnlocked: false,
        progress: 0,
        target: 10
    },
    {
        id: 'millionaire',
        name: '百万富翁',
        description: '公司资金达到1,000,000元',
        isUnlocked: false,
        progress: 0,
        target: 1000000
    },
    {
        id: 'training_master',
        name: '培训大师',
        description: '完成50次员工培训',
        isUnlocked: false,
        progress: 0,
        target: 50
    },
    {
        id: 'crisis_manager',
        name: '危机管理者',
        description: '成功处理10次公司危机',
        isUnlocked: false,
        progress: 0,
        target: 10
    }
];

export const checkAchievements = (company: Company): Achievement[] => {
    const updatedAchievements = company.achievements.map(achievement => {
        if (achievement.isUnlocked) {
            return achievement;
        }

        let progress = achievement.progress;

        switch (achievement.id) {
            case 'first_hire':
                progress = company.employees.length;
                break;
            case 'team_builder':
                progress = company.employees.length;
                break;
            case 'millionaire':
                progress = company.capital;
                break;
            case 'training_master':
                progress = company.trainingPrograms.reduce(
                    (total, program) => total + program.employeesEnrolled.length,
                    0
                );
                break;
            // 'crisis_manager' 进度会在事件处理时更新
        }

        return {
            ...achievement,
            progress,
            isUnlocked: progress >= achievement.target
        };
    });

    return updatedAchievements;
}; 