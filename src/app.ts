import * as dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

import express, { NextFunction, Request, Response } from "express";
import config from "config";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { AppDataSource } from "./utils/data-source";
import AppError from "./utils/appError";
import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import salonRouter from "./routes/salon.routes";
import profileRouter from "./routes/profile.routes";
import validateEnv from "./utils/validateEnv";
import redisClient from "./utils/connectRedis";

// import nodemailer from 'nodemailer';
// (async function () {
//   const credentials = await nodemailer.createTestAccount();
//   console.log(credentials);
// })();
AppDataSource.initialize()
  .then(async () => {
    // VALIDATE ENV
    validateEnv();

    const app = express();

    // TEMPLATE ENGINE
    app.set("view engine", "pug");
    app.set("views", `${__dirname}/views`);
    // MIDDLEWARE

    // 1. Body parser
    app.use(express.json({ limit: "10kb" }));

    // 2. Logger
    if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

    // 3. Cookie Parser
    app.use(cookieParser());

    // 4. Cors
    app.use(
      cors({
        origin: config.get<string>("origin"), //add
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"], //ADD
      })
    );
    app.use(cors());

    // ROUTES
    app.use("/api/auth", authRouter);
    app.use("/api/users", userRouter);
    app.use("/api/profile", profileRouter);
    app.use("/api/salon", salonRouter);

    // HEALTH CHECKER
    app.get("/api/healthchecker", async (_, res: Response) => {
      console.log("asdsa");
      const message = await redisClient.get("try");

      res.status(200).json({
        status: "success",
        message,
      });
    });

    // UNHANDLED ROUTE
    app.all("*", (req: Request, res: Response, next: NextFunction) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
      next();
      // next(new AppError(404, `Route ${req.originalUrl} not found`));
    });

    // GLOBAL ERROR HANDLER
    app.use(
      (error: AppError, req: Request, res: Response, next: NextFunction) => {
        error.status = error.status || "error";
        error.statusCode = error.statusCode || 500;

        res.status(error.statusCode).json({
          status: error.status,
          message: error.message,
        });
      }
    );

    const port = config.get<number>("port");
    app.listen(port);

    console.log(`Server started on port: ${port}`);
  })
  .catch((error) => console.log(error));
