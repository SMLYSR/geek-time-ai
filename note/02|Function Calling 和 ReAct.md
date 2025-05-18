## Function Calling 和 ReAct
> function calling 是一种模型支持调用外部函数（方法的能力）；ReAct是一种AI Agent的实现架构方式。

这里使用DeepSeek-V3实现一个简单的天气查询的Demo，其中使用ReAct架构方式实现。

1. 首先获取Prompt
2. 使用openai客户端并嵌入Prompt模板
3. 调用DeepSeek-V3模型并传入Prompt
4. 执行ReAct流程
5. 最终获取结果并返回


```text

{instructions}

TOOLS:
------

You have access to the following tools:

{tools}

To use a tool, please use the following format:


Thought: Do I need to use a tool? Yes
Action: the action to take, should be one of [{tool_names}]
Action Input: the input to the action
Observation: the result of the action


When you have a response to say to the Human, or if you do not need to use a tool, you MUST use the format:


Thought: Do I need to use a tool? No
Final Answer: [your response here]


Begin!

Previous conversation history:
{chat_history}

New input: {input}
{agent_scratchpad}

```
