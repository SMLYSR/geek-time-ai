import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://openrouter.ai/api/v1"
})

const bailian = new OpenAI({
  baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  apiKey: "sk-310514eac1bf408c8a74198d13189d5a",
})

async function main() {
  // 记录开始时间
  const startTime = new Date();
  console.log(`开始请求时间: ${startTime.toLocaleString()}`);
  
  const completion = await bailian.chat.completions.create({
    // model: 'deepseek/deepseek-chat:free',
    model: 'deepseek-v3',
    messages: [
      {
        role: "user",
        content: "生命的意义是什么？"
      },
    ],
  });

  // 记录结束时间
  const endTime = new Date();
  console.log(`结束请求时间: ${endTime.toLocaleString()}`);
  
  // 计算耗时（毫秒）
  const responseTime = endTime - startTime;
  console.log(`API响应耗时: ${responseTime}毫秒 (${(responseTime/1000).toFixed(2)}秒)`);
  
  console.log(completion.choices[0].message);
}

main();