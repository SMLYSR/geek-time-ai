// 天气查询演示 - 使用OpenAI API
require('dotenv').config();
const { OpenAI } = require('openai');
const axios = require('axios');

// 初始化OpenAI客户端
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 天气查询函数
async function getWeatherInfo(location) {
  try {
    // 使用OpenAI API进行天气查询
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo-1106",
      messages: [
        { role: "system", content: "你是一个天气助手，请根据用户提供的位置，生成一个获取天气信息的函数调用。" },
        { role: "user", content: `请查询${location}的天气情况` }
      ],
      functions: [
        {
          name: "get_weather",
          description: "获取指定位置的天气信息",
          parameters: {
            type: "object",
            properties: {
              location: {
                type: "string",
                description: "城市名称，如北京、上海等"
              },
              unit: {
                type: "string",
                enum: ["celsius", "fahrenheit"],
                description: "温度单位"
              }
            },
            required: ["location"]
          }
        }
      ],
      function_call: "auto"
    });

    const responseMessage = completion.choices[0].message;
    
    // 检查是否有函数调用
    if (responseMessage.function_call) {
      console.log("AI决定调用函数:", responseMessage.function_call.name);
      
      // 解析函数参数
      const functionArgs = JSON.parse(responseMessage.function_call.arguments);
      console.log("函数参数:", functionArgs);
      
      // 模拟获取天气数据
      // 在实际应用中，这里应该调用真实的天气API
      const weatherData = await simulateWeatherAPI(functionArgs.location, functionArgs.unit || "celsius");
      
      // 将天气数据返回给AI继续对话
      const secondResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo-1106",
        messages: [
          { role: "system", content: "你是一个天气助手，请根据天气数据提供友好的天气报告。" },
          { role: "user", content: `请查询${location}的天气情况` },
          responseMessage,
          { 
            role: "function", 
            name: "get_weather", 
            content: JSON.stringify(weatherData)
          }
        ]
      });
      
      return secondResponse.choices[0].message.content;
    } else {
      return responseMessage.content;
    }
  } catch (error) {
    console.error("获取天气信息时出错:", error);
    return `获取天气信息失败: ${error.message}`;
  }
}

// 模拟天气API
async function simulateWeatherAPI(location, unit) {
  console.log(`模拟获取${location}的天气数据，单位: ${unit}`);
  
  // 随机生成天气数据
  const conditions = ["晴朗", "多云", "小雨", "大雨", "雷雨", "小雪", "大雪"];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  // 随机温度 (摄氏度)
  const tempC = Math.floor(Math.random() * 35) - 5;
  const tempF = unit === "fahrenheit" ? Math.round(tempC * 9/5 + 32) : tempC;
  
  // 随机湿度
  const humidity = Math.floor(Math.random() * 100);
  
  // 随机风速
  const windSpeed = Math.floor(Math.random() * 30);
  
  return {
    location: location,
    current: {
      temp_c: tempC,
      temp_f: tempF,
      condition: randomCondition,
      humidity: humidity,
      wind_kph: windSpeed,
      last_updated: new Date().toLocaleString()
    }
  };
}

// 主函数
async function main() {
  const location = process.argv[2] || "北京";
  console.log(`正在查询${location}的天气情况...`);
  
  const weatherReport = await getWeatherInfo(location);
  console.log("\n天气报告:");
  console.log(weatherReport);
}

// 执行主函数
main().catch(console.error);