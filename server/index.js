import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Simple manual info
const myInfo = {
  name: "George Adriel Kurniawan",
  skills: "JavaScript, React, Node.js",
  hobbies: "Coding, Gaming, Design, Photography",
};

// POST /api/ask
app.post("/api/ask", (req, res) => {
  const question = (req.body.question || "").toLowerCase();

  let answer = "I don’t have info about that yet.";

  if (question.includes("name")) answer = `My name is ${myInfo.name}.`;
  if (question.includes("skills")) answer = `My skills: ${myInfo.skills}.`;
  if (question.includes("hobbies")) answer = `My hobbies: ${myInfo.hobbies}.`;

  res.json({ answer });
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
