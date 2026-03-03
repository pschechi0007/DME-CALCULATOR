export default async function handler(req, res) {
 if (req.method !== "POST") {
   return res.status(405).json({ error: "Method not allowed" });
 }
 const { question } = req.body;
 try {
   const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
     method: "POST",
     headers: {
       "Content-Type": "application/json",
       "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
     },
     body: JSON.stringify({
       model: "gpt-4.1-mini",
       messages: [
         { role: "system", content: "Give clear and short answers." },
         { role: "user", content: question }
       ]
     })
   });
   const data = await openaiResponse.json();
   console.log("OpenAI RAW:", data);
   if (!data.choices) {
     return res.status(500).json({ error: data });
   }
   return res.status(200).json({
     answer: data.choices[0].message.content
   });
 } catch (error) {
   return res.status(500).json({ error: "Server error" });
 }
}
