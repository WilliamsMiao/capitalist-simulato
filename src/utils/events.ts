import { RandomEvent } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const EVENT_POOL: RandomEvent[] = [
    {
        id: 'market_boom',
        title: '市场繁荣',
        description: '市场突然出现增长机会，你要如何应对？',
        choices: [
            {
                text: '加大投资',
                effect: [
                    { type: 'capital', value: -5000 },
                    { type: 'reputation', value: 10 }
                ]
            },
            {
                text: '保持观望',
                effect: [
                    { type: 'reputation', value: -5 }
                ]
            }
        ]
    },
    {
        id: 'employee_conflict',
        title: '员工冲突',
        description: '部分员工之间出现矛盾，影响工作氛围',
        choices: [
            {
                text: '组织团建活动',
                effect: [
                    { type: 'capital', value: -1000 },
                    { type: 'happiness', value: 15 },
                    { type: 'efficiency', value: 0.1 }
                ]
            },
            {
                text: '置之不理',
                effect: [
                    { type: 'happiness', value: -10 },
                    { type: 'efficiency', value: -0.1 }
                ]
            }
        ]
    },
    {
        id: 'market_crisis',
        title: '市场危机',
        description: '行业遭遇寒冬，客户订单减少',
        choices: [
            {
                text: '裁员止损',
                effect: [
                    { type: 'layoff', value: 1 }, // 裁掉一名员工
                    { type: 'reputation', value: -20 },
                    { type: 'happiness', value: -30 }
                ]
            },
            {
                text: '坚持挺过难关',
                effect: [
                    { type: 'capital', value: -3000 },
                    { type: 'reputation', value: 10 }
                ]
            }
        ]
    },
    {
        id: 'tech_breakthrough',
        title: '技术突破',
        description: '新技术出现，是否投资升级？',
        choices: [
            {
                text: '投资新技术',
                effect: [
                    { type: 'capital', value: -8000 },
                    { type: 'efficiency', value: 0.2 },
                    { type: 'reputation', value: 15 }
                ]
            },
            {
                text: '继续使用现有技术',
                effect: [
                    { type: 'reputation', value: -10 },
                    { type: 'efficiency', value: -0.05 }
                ]
            }
        ]
    },
    {
        id: 'industry_winter',
        title: '行业寒冬',
        description: '行业遭遇寒冬，公司面临严重的经营压力',
        choices: [
            {
                text: '裁员减支',
                effect: [
                    { type: 'layoff', value: 1 }, // 裁掉一名员工
                    { type: 'happiness', value: -20 },
                    { type: 'reputation', value: -15 }
                ]
            },
            {
                text: '降低薪资',
                effect: [
                    { type: 'salary', value: -0.1 }, // 降低10%薪资
                    { type: 'happiness', value: -10 },
                    { type: 'efficiency', value: -0.05 }
                ]
            },
            {
                text: '坚持不裁员',
                effect: [
                    { type: 'capital', value: -10000 },
                    { type: 'reputation', value: 10 },
                    { type: 'happiness', value: 5 }
                ]
            }
        ]
    }
];

export const generateRandomEvent = (): RandomEvent => {
    const event = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
    return {
        ...event,
        id: uuidv4() // 确保每个事件实例都有唯一ID
    };
};

export const shouldTriggerEvent = (day: number): boolean => {
    // 每天有15%的概率触发事件
    return Math.random() < 0.15;
}; 