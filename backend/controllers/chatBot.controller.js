// import { Configuration, OpenAIApi } from 'openai';

// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const openai = new OpenAIApi(configuration);

// export const getChatResponse = async (req, res, next) => {
//   try {
//     const { message } = req.body;
    
//     const response = await openai.createChatCompletion({
//       model: "gpt-3.5-turbo",
//       messages: [
//         {
//           role: "system",
//           content: `You are a wellness assistant. Provide helpful, evidence-based advice about fitness, nutrition, and stress management. 
//           Keep responses concise (1-2 paragraphs max). Be supportive and non-judgmental.`
//         },
//         {
//           role: "user",
//           content: message
//         }
//       ],
//       temperature: 0.7,
//       max_tokens: 150
//     });

//     res.json({ reply: response.data.choices[0].message.content });
//   } catch (err) {
//     console.error('OpenAI Error:', err.response?.data || err.message);
//     res.status(500).json({ error: 'Error processing your request' });
//   }
// };