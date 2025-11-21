import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
dotenv.config({
    path: path.join(__dirname, "../.env"),
});

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../../client/dist")));







const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
