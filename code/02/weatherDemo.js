import { readFile } from "fs/promises";
import path from "path";
import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: "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",
  baseURL: "https://openrouter.ai/api/v1"
  // baseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
  // apiKey: "sk-310514eac1bf408c8a74198d13189d5a",
})

async function send_message(message) {
  let response = openai.chat.completions.create({
    // model: 'deepseek-v3',
    model: 'deepseek/deepseek-chat:free',
    messages: message
  });
  return response;
}

const tools = [
  {
    name: "get_weather",
    description: "获取天气信息",
    parameters: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "城市名称",
        },
      },
      required: ["city"],
    },
  }
]

// 定义一个函数，用于模拟查询股票价格
function get_weather(city) {
  if (city === "上海") {
      return "24℃";
  } else if (city === "北京") {
      return "22℃";
  } else {
      return "无法获取当前城市的天气";
  }
}

async function promptUtil(pathStr) {
  try {
    const prompt = await readFile(path.resolve(pathStr), 'utf-8');
    // console.log(`获取到Prompt String: ${prompt}`); // 输出文件内容到控制台
    return prompt;
  } catch (err) {
    console.error(`Error reading file from path: ${path}`);
  }
}

async function main() {
  const instructions = '你是一个天气助手，可以根据用户提问来获取天气的相关信息';

  const query = '北京和上海的气温是多少？';

  const REACT_PROMPT = await promptUtil('./prompt/LangChain-ReAct-Prompt');

  const prompt = REACT_PROMPT.replace('{instructions}', instructions).replace('{tools}', JSON.stringify(tools)).replace('{tool_names}', tools.map(t => t.name).join(', ')).replace('{input}', query);

  console.log("格式化后的Prompt：", prompt);

  const messages = [
    {
      role: "user",
      content: prompt
    }
  ]

  while (true) {
    let response = await send_message(messages);
    let responseText = response.choices[0].message.content;

    console.log("大模型回复：");
    console.log(responseText);

    let finalAnswerMatch = responseText.match(/Final Answer: \s*(.*)/);
    if (finalAnswerMatch) {
      let finalAnswer = finalAnswerMatch[1].trim()
      console.log("最终答案：", finalAnswer);
      break;
    }

    messages.push(response.choices[0].message);
    console.log("messages：", messages);

    let actionMatch = responseText.match(/Action: \s*(\w+)/);
    let actionInputMatch = responseText.match(/Action Input:\s*({.*?}|".*?")/s);
    
    console.log("actionMatch:", actionMatch);
    console.log("actionInputMatch:", actionInputMatch);
    if (actionMatch && actionInputMatch) {
      let toolName = actionMatch[1];
      let rawInput = actionInputMatch[1];
      let params = JSON.parse(rawInput);

      if (toolName === 'get_weather') {
        console.log("开始调用本地工具: 参数为：", toolName, params.city);
        let observation = get_weather(params.city);
        console.log("人类的回复：observation:", observation);

        messages.push({
          role: "user",
          content: `Observation: ${observation}`
        })
      }
    }
  }
}

main();