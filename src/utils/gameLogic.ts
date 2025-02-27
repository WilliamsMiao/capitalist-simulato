import { Employee, Company } from '../types';
import { v4 as uuidv4 } from 'uuid';

// 简历评分系统
const RESUME_SCORE = {
    education: {
        "本科": 60,
        "硕士": 80,
        "博士": 100
    },
    experienceLevel: {
        "初级": 60,
        "中级": 80,
        "高级": 100
    }
};

// 计算简历分数
export const calculateResumeScore = (resume: Employee): number => {
    try {
        let score = 0;
        
        // 1. 教育分数 (权重: 25%)
        const educationScore = RESUME_SCORE.education[resume.education] || 60;
        score += educationScore * 0.25;
        
        // 2. 经验分数 (权重: 25%)
        const experienceScore = RESUME_SCORE.experienceLevel[resume.experienceLevel] || 60;
        score += experienceScore * 0.25;
        
        // 3. 效率分数 (权重: 20%)
        const efficiency = Math.min(1, Math.max(0, typeof resume.efficiency === 'number' ? resume.efficiency : 0.6));
        score += efficiency * 100 * 0.2;
        
        // 4. 技能数量分数 (权重: 15%)
        const skillsCount = Array.isArray(resume.skills) ? resume.skills.length : 0;
        score += (Math.min(3, skillsCount) / 3) * 100 * 0.15;
        
        // 5. 摸鱼倾向反向分数 (权重: 15%)
        const slacking = Math.min(100, Math.max(0, typeof resume.slacking === 'number' ? resume.slacking : 30));
        score += (100 - slacking) * 0.15;
        
        // 确保分数在 0-100 之间
        return Math.min(100, Math.max(0, Math.round(score)));
    } catch (error) {
        console.error('Error calculating resume score:', error);
        return 60; // 返回默认分数
    }
};

// 计算简历刷新概率
export const calculateRefreshProbability = (score: number): number => {
    // 分数越高，刷新概率越低
    // 90分以上：20%概率刷新
    // 75-90分：40%概率刷新
    // 60-75分：60%概率刷新
    // 60分以下：80%概率刷新
    if (score >= 90) return 0.2;
    if (score >= 75) return 0.4;
    if (score >= 60) return 0.6;
    return 0.8;
};

const SKILLS = [
    "编程", "设计", "市场营销", "销售", "客户服务",
    "项目管理", "数据分析", "人力资源", "财务", "运营"
];

const EXPERIENCE_LEVELS = ["初级", "中级", "高级"] as const;
const EDUCATION_LEVELS = ["本科", "硕士", "博士"] as const;

export const BASE_SALARY = {
    "初级": 8000,    // 提高基础工资
    "中级": 15000,
    "高级": 30000
};

export const EDUCATION_BONUS = {
    "本科": 1.0,
    "硕士": 1.3,    // 提高学历加成
    "博士": 1.8
};

function generateChineseName(): string {
    const surnames = ["张", "王", "李", "赵", "陈", "刘", "杨", "黄", "周", "吴"];
    const names = ["伟", "芳", "娜", "秀英", "敏", "静", "丽", "强", "磊", "军"];
    
    const surname = surnames[Math.floor(Math.random() * surnames.length)];
    const name = names[Math.floor(Math.random() * names.length)];
    
    return surname + name;
}

// 生成经验等级，高级经验出现概率较低
function generateExperienceLevel(): Employee['experienceLevel'] {
    const rand = Math.random();
    if (rand < 0.5) return "初级";     // 50%
    if (rand < 0.85) return "中级";    // 35%
    return "高级";                     // 15%
}

// 生成教育程度，高学历出现概率较低
function generateEducation(): Employee['education'] {
    const rand = Math.random();
    if (rand < 0.6) return "本科";     // 60%
    if (rand < 0.9) return "硕士";     // 30%
    return "博士";                     // 10%
}

// 猎头费用配置
export const HEADHUNTING_FEE = {
    "初级": 1000,
    "中级": 2000,
    "高级": 4000
};

export const generateResume = (): Employee => {
    const numSkills = Math.floor(Math.random() * 3) + 1;
    const skills = [...SKILLS].sort(() => Math.random() - 0.5).slice(0, numSkills);
    const experienceLevel = generateExperienceLevel();
    const education = generateEducation();
    
    const base = BASE_SALARY[experienceLevel];
    const educationMultiplier = EDUCATION_BONUS[education];
    const salary = base * educationMultiplier * (0.9 + Math.random() * 0.2);
    
    const efficiency = 0.6 + Math.pow(Math.random(), 2) * 0.4;
    const slacking = Math.floor(20 + Math.pow(Math.random(), 2) * 40);

    return {
        id: uuidv4(),
        name: generateChineseName(),
        skills,
        experienceLevel,
        education,
        salary,
        efficiency,
        trainingProgress: {},
        happiness: 100,
        daysEmployed: 0,
        slacking,
        daysInPool: 0,
        isRevealed: false // 默认未查看
    };
};

export const generateMultipleResumes = (count: number): Employee[] => {
    return Array.from({ length: count }, () => generateResume());
};

export const calculateDailyExpenses = (company: Company): number => {
    // 基础支出（员工薪资）
    const baseSalaryExpense = company.employees.reduce((total, emp) => {
        const salary = Math.max(0, typeof emp.salary === 'number' ? emp.salary : 0);
        return total + salary / 30;
    }, 0);
    
    // 培训支出
    const trainingExpense = company.trainingPrograms.reduce((total, program) => {
        const cost = Math.max(0, typeof program.cost === 'number' ? program.cost : 0);
        const duration = Math.max(1, typeof program.duration === 'number' ? program.duration : 1);
        return total + (cost / duration);
    }, 0);

    const totalExpenses = baseSalaryExpense + trainingExpense;
    return isNaN(totalExpenses) || totalExpenses < 0 ? 0 : totalExpenses;
};

export const calculateDailyIncome = (company: Company): number => {
    const baseIncome = 800;  // 降低基础收入
    
    const employeeContribution = company.employees.reduce((total, emp) => {
        const salary = Math.max(0, typeof emp.salary === 'number' ? emp.salary : 0);
        const efficiency = Math.min(1, Math.max(0, typeof emp.efficiency === 'number' ? emp.efficiency : 0.6));
        const happiness = Math.min(100, Math.max(0, typeof emp.happiness === 'number' ? emp.happiness : 50));
        const slacking = Math.min(100, Math.max(0, typeof emp.slacking === 'number' ? emp.slacking : 0));
        
        // 降低基础贡献
        let contribution = salary * 0.08 * efficiency;
        
        // 加大满意度影响 (0.3-1.0)
        const happinessMultiplier = 0.3 + (happiness / 143);
        contribution *= happinessMultiplier;

        // 加大摸鱼影响 (0.3-1.0)
        const slackingMultiplier = 1 - (slacking / 143);
        contribution *= slackingMultiplier;
        
        // 调整经验等级影响
        const expMultiplier = {
            "初级": 0.7,
            "中级": 1.0,
            "高级": 1.4
        }[emp.experienceLevel] || 1.0;
        
        contribution *= expMultiplier;
        
        return isNaN(contribution) || contribution < 0 ? total : total + contribution;
    }, 0);

    // 加大声誉影响 (0.3-1.1)
    const reputation = Math.min(100, Math.max(0, typeof company.reputation === 'number' ? company.reputation : 50));
    const reputationMultiplier = 0.3 + (reputation / 125);

    const finalIncome = (baseIncome + Math.max(0, employeeContribution)) * reputationMultiplier;
    
    // 降低最低收入保障
    return Math.max(baseIncome * 0.3, isNaN(finalIncome) ? baseIncome : finalIncome);
}; 