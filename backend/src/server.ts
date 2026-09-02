import express, { NextFunction, Request, Response } from "express";

const app = express();
const port = 3000;

app.use((request: Request, response: Response, next: NextFunction) => {
  response.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (request.method === "OPTIONS") {
    response.sendStatus(204);
    return;
  }

  next();
});

app.use(express.json());

app.post("/api/hello", (request: Request, response: Response) => {
  console.log("收到请求：", request.method, request.path);
  console.log("后端收到的数据 req.body：", request.body);

  const rawName = request.body?.name;
  const name = typeof rawName === "string" ? rawName.trim() : "";

  if (!name) {
    const errorResponse = {
      error: "name is required",
      received: request.body
    };

    console.log("后端返回的数据：", errorResponse);
    response.status(400).json(errorResponse);
    return;
  }

  const successResponse = {
    message: `你好，${name}`,
    receivedName: name
  };

  console.log("后端返回的数据：", successResponse);
  response.json(successResponse);
});

app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
