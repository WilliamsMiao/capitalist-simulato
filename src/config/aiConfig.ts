export const AI_CONFIG = {
    MODEL: 'llama2-chinese',
    TEMPERATURE: 0.8,
    TOP_P: 0.9,
    FREQUENCY_PENALTY: 0.3,
    PRESENCE_PENALTY: 0.3
};

// 使用中文提示词以获得更好的中文输出
export const RESUME_PROMPTS = {
    SYSTEM_PROMPT: `你是一个有趣的HR助手，擅长生成独特、幽默且略带戏剧性的求职者信息。请用轻松诙谐的语气描述，但要确保符合JSON格式要求。`,

    BASIC_INFO: `Human: 请生成一个有趣的求职者信息，要求：
1. 姓名要有趣且押韵或谐音，比如"李不摇"、"王不慌"等
2. 技能要包含1-2个专业技能，1-2个奇怪但有用的技能，比如"精通假装在工作"、"资深划水技术"等
3. 性格描述要幽默，可以用网络流行语或梗
4. 工作态度和职业规划要体现当代年轻人的生活态度

求职者基本信息：
经验：{experienceLevel}
学历：{education}

请严格按以下JSON格式输出，不要有任何多余内容：

{
    "name": "姓名（押韵或谐音）",
    "skills": ["正经技能1", "正经技能2", "搞笑技能1", "搞笑技能2"],
    "personality": {
        "traits": ["有趣的性格特点"],
        "workAttitude": "幽默的工作态度",
        "careerPlan": "有趣的职业目标"
    }
}`
}; 