import { AI_CONFIG, RESUME_PROMPTS } from '../config/aiConfig';
import { Employee } from '../types';
import { FUN_NAMES, SKILLS, PERSONALITY } from './generators';

interface OllamaResponse {
    model: string;
    response: string;
    done: boolean;
}

// 重试配置
const RETRY_CONFIG = {
    MAX_RETRIES: 3,
    INITIAL_DELAY: 1000,
    MAX_DELAY: 5000
};

// 指数退避重试
async function retryWithExponentialBackoff<T>(
    operation: () => Promise<T>,
    retryCount = 0
): Promise<T> {
    try {
        return await operation();
    } catch (error) {
        if (retryCount >= RETRY_CONFIG.MAX_RETRIES) {
            throw error;
        }
        
        const delay = Math.min(
            RETRY_CONFIG.INITIAL_DELAY * Math.pow(2, retryCount),
            RETRY_CONFIG.MAX_DELAY
        );
        
        await new Promise(resolve => setTimeout(resolve, delay));
        return retryWithExponentialBackoff(operation, retryCount + 1);
    }
}

// 调用 Ollama API
async function callOllama(prompt: string): Promise<string> {
    try {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: AI_CONFIG.MODEL,
                prompt: RESUME_PROMPTS.SYSTEM_PROMPT + "\n\n" + prompt,
                stream: false
            }),
        });

        if (!response.ok) {
            throw new Error('API调用失败');
        }

        const data: OllamaResponse = await response.json();
        return data.response;
    } catch (error) {
        console.error('调用AI服务失败:', error);
        throw error;
    }
}

// 解析JSON响应
function parseJsonResponse(response: string): any {
    try {
        // 尝试从响应中提取JSON部分
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }
        throw new Error('无法解析JSON响应');
    } catch (error) {
        console.error('解析JSON响应失败:', error);
        return {};
    }
}

// 生成简历内容
export async function generateResumeContent(
    experienceLevel: string,
    education: string,
    existingName?: string // 添加现有名字参数
): Promise<Partial<Employee>> {
    try {
        const prompt = RESUME_PROMPTS.BASIC_INFO
            .replace('{experienceLevel}', experienceLevel)
            .replace('{education}', education);

        const response = await callOllama(prompt);
        const aiData = parseJsonResponse(response);

        // 验证必要字段并使用生成器补充或替换内容
        const result: Partial<Employee> = {
            // 如果有现有名字就使用现有名字，否则才生成新名字
            name: existingName || ((Math.random() < 0.5 && aiData.name) ? aiData.name : FUN_NAMES.generateName()),
            
            // 合并AI生成的技能和我们的有趣技能
            skills: (Array.isArray(aiData.skills) && aiData.skills.length > 0)
                ? [...aiData.skills.slice(0, 1), ...SKILLS.generateSkills(experienceLevel).slice(0, 2)]
                : SKILLS.generateSkills(experienceLevel),
            
            // 合并AI生成的性格特点和我们的有趣特点
            personality: {
                traits: (aiData.personality?.traits?.length > 0)
                    ? [aiData.personality.traits[0], PERSONALITY.traits[Math.floor(Math.random() * PERSONALITY.traits.length)]]
                    : [PERSONALITY.traits[Math.floor(Math.random() * PERSONALITY.traits.length)]],
                workAttitude: (Math.random() < 0.5 && aiData.personality?.workAttitude)
                    ? aiData.personality.workAttitude
                    : PERSONALITY.workAttitudes[Math.floor(Math.random() * PERSONALITY.workAttitudes.length)],
                careerPlan: (Math.random() < 0.5 && aiData.personality?.careerPlan)
                    ? aiData.personality.careerPlan
                    : PERSONALITY.careerPlans[Math.floor(Math.random() * PERSONALITY.careerPlans.length)]
            }
        };

        return result;
    } catch (error) {
        console.error('生成简历失败:', error);
        // 使用有趣的默认值生成器，同样保持现有名字
        return {
            name: existingName || FUN_NAMES.generateName(),
            skills: SKILLS.generateSkills(experienceLevel),
            personality: PERSONALITY.generate()
        };
    }
}

// 生成面试反馈
export async function generateInterviewFeedback(employee: Employee): Promise<string> {
    try {
        const prompt = `Human: 作为面试官，请对以下候选人生成一份简短的面试反馈（100字以内）：
姓名：${employee.name}
技能：${employee.skills.join(', ')}
工作经验：${employee.experienceLevel}
教育背景：${employee.education}`;

        const response = await callOllama(prompt);
        return response.trim();
    } catch (error) {
        console.error('生成面试反馈失败:', error);
        return '候选人整体表现良好，建议考虑录用。';
    }
}

// 生成工作表现评价
export async function generatePerformanceReview(employee: Employee): Promise<string> {
    try {
        const prompt = `Human: 作为直属主管，请根据以下员工信息生成一份简短的工作表现评价（100字以内）：
姓名：${employee.name}
在职天数：${employee.daysEmployed}
效率：${(employee.efficiency * 100).toFixed(0)}%
心情：${employee.happiness}/100
摸鱼指数：${employee.slacking}/100`;

        const response = await callOllama(prompt);
        return response.trim();
    } catch (error) {
        console.error('生成工作表现评价失败:', error);
        return '员工工作认真，表现良好。';
    }
} 