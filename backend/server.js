require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const app = express();
const authRoute = require("./routes/authRoute");
const sessionRoute = require("./routes/sessionRoute");
const questionRoute = require("./routes/questionRoute");
const {generateInterviewQuestions,generateConceptExplanation} = require('./controllers/aiController')
const {protect} = require('./middlewares/authMiddleware')
app.use(
    cors({
        origin:"*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
)
connectDB();

app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(express.json());


app.use("/api/auth",authRoute)
app.use("/api/Session",sessionRoute)
app.use("/api/questions",questionRoute)

app.use("/api/ai/generate-questions",protect,generateInterviewQuestions);
app.use("/api/ai/generate-explanation",protect,generateConceptExplanation);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});