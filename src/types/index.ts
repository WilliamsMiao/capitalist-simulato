export interface Employee {
    id: string;
    name: string;
    skills: string[];
    experienceLevel: '初级' | '中级' | '高级';
    education: '本科' | '硕士' | '博士';
    salary: number;
    efficiency: number;
    trainingProgress: {
        [key: string]: number; // 技能培训进度 (0-100)
    };
    happiness: number; // 员工满意度 (0-100)
    daysEmployed: number; // 入职天数
    slacking: number; // 摸鱼倾向 (0-100)
    daysInPool: number; // 简历在候选池中的天数
    isRevealed: boolean; // 是否已查看简历
    personality?: {
        traits: string[];
        workAttitude: string;
        careerPlan: string;
    };
}

export interface Achievement {
    id: string;
    name: string;
    description: string;
    isUnlocked: boolean;
    progress: number;
    target: number;
}

export interface RandomEventEffect {
    type: 'capital' | 'efficiency' | 'happiness' | 'reputation' | 'layoff' | 'salary';
    value: number;
}

export interface RandomEventChoice {
    text: string;
    effect: RandomEventEffect[];
}

export interface RandomEvent {
    id: string;
    title: string;
    description: string;
    choices: RandomEventChoice[];
}

export interface EventChoice {
    text: string;
    effect: {
        type: 'capital' | 'efficiency' | 'happiness' | 'reputation';
        value: number;
    }[];
}

export interface Company {
    capital: number;
    employees: Employee[];
    day: number;
    dailyExpenses: number;
    dailyIncome: number;
    reputation: number; // 公司声誉 (0-100)
    achievements: Achievement[];
    activeEvents: RandomEvent[];
    trainingPrograms: TrainingProgram[];
}

export interface TrainingProgram {
    id: string;
    name: string;
    skill: string;
    duration: number; // 培训所需天数
    cost: number;
    efficiencyBonus: number;
    employeesEnrolled: string[]; // 员工ID列表
}

export interface GameState {
    company: Company;
    availableResumes: Employee[];
    isRunning: boolean;
    gameSpeed: number; // 游戏速度倍率
    notifications: Notification[];
    savedGames: SavedGame[];
}

export interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    message: string;
    timestamp: number;
}

export interface SavedGame {
    id: string;
    name: string;
    date: number;
    state: GameState;
}

export interface GameAction {
    type: string;
    payload?: any;
} 