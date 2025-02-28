// 有趣的名字生成器
const FUN_NAMES = {
    patterns: [
        ["开", "心", "果"],
        ["乐", "不", "思"],
        ["摸", "鱼", "王"],
        ["卷", "不", "动"],
        ["躺", "平", "安"],
        ["干", "饭", "人"],
        ["秃", "发", "强"],
        ["内", "卷", "王"],
        ["摆", "烂", "哥"],
        ["卷", "王", "座"]
    ],
    surnames: ["李", "王", "张", "刘", "赵", "钱", "孙", "周", "吴", "郑"],
    generateName: () => {
        const pattern = FUN_NAMES.patterns[Math.floor(Math.random() * FUN_NAMES.patterns.length)];
        const surname = FUN_NAMES.surnames[Math.floor(Math.random() * FUN_NAMES.surnames.length)];
        return surname + pattern.join("");
    }
} as const;

// 有趣的技能生成器
const SKILLS = {
    professional: [
        "Java开发", "Python编程", "数据分析", "UI设计", "产品规划",
        "项目管理", "市场营销", "客户服务", "人力资源", "财务管理"
    ],
    funny: [
        "精通假装在工作", "资深划水技术", "专业摸鱼20年", "办公室政治专家",
        "会议室午睡达人", "沟通能力MAX", "PPT美化大师", "deadline冲刺王",
        "键盘声音调优师", "咖啡续命专家", "团建带气氛", "八卦传播官"
    ],
    generateSkills: (experienceLevel: string) => {
        const professionalCount = experienceLevel === "高级" ? 2 : 1;
        const funnyCount = 2;
        
        const professional = [...SKILLS.professional]
            .sort(() => Math.random() - 0.5)
            .slice(0, professionalCount);
            
        const funny = [...SKILLS.funny]
            .sort(() => Math.random() - 0.5)
            .slice(0, funnyCount);
            
        return [...professional, ...funny];
    }
} as const;

// 有趣的性格特点生成器
const PERSONALITY = {
    traits: [
        "打工人本人", "摸鱼界扛把子", "内卷小能手", "职场社交达人",
        "办公室醋王", "团建恐惧症", "咖啡成瘾者", "键盘侠战士",
        "发呆冠军", "摸鱼界扛把子", "划水技术顾问", "职场生存大师"
    ],
    workAttitudes: [
        "不摸鱼则已，一摸惊人", "干啥啥不行，摸鱼第一名",
        "早九晚五，不加班", "能划就不卷，能摆就不干",
        "看起来很忙，实际很闲", "专业假装在工作",
        "上班只为下班", "混日子就是混日子"
    ],
    careerPlans: [
        "先赚他个一个亿，再考虑理想", "混到退休就算成功",
        "找到一个能摸鱼的好工作", "成为一个不用加班的人",
        "赚钱养猫，提前退休", "躺平是一种态度",
        "走一步看一步", "混到升职加薪，实现财务自由"
    ],
    generate: () => ({
        traits: [PERSONALITY.traits[Math.floor(Math.random() * PERSONALITY.traits.length)]],
        workAttitude: PERSONALITY.workAttitudes[Math.floor(Math.random() * PERSONALITY.workAttitudes.length)],
        careerPlan: PERSONALITY.careerPlans[Math.floor(Math.random() * PERSONALITY.careerPlans.length)]
    })
} as const;

// 导出生成器
export { FUN_NAMES, SKILLS, PERSONALITY }; 