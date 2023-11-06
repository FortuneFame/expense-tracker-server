import joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from 'express';

import prisma from "../helpers/database";
import { addToBlacklist } from "../helpers/tokenBlacklist";

require('dotenv').config();

class Auth {
  public async register(body: UserInput, next: NextFunction): Promise<ResponseData | void> {
    try {
      const schema = joi.object({
        name: joi.string().required(),
        email: joi.string().required(),
        password: joi.string().required(),
      }).options({ abortEarly: false });

      const validation = schema.validate(body);

      if (validation.error) {
        const errorDetails = validation.error.details.map(detail => detail.message);
        return {
          status: false,
          code: 422,
          error: errorDetails.join(", "),
        };
      }

      const password = bcrypt.hashSync(body.password, 10);

      const add = await prisma.user.create({
        data: {
          name: body.name,
          email: body.email,
          password,
        },
      });

      return {
        status: true,
        code: 201,
        message: "User added successfully",
        data: add,
      };
    } catch (error) {
      console.error("createUser user module Error: ", error);
      next(error);
    }
  }

  public async login(body: LoginInput, next: NextFunction): Promise<ResponseData | void> {
    try {
      const schema = joi.object({
        email: joi.string().required(),
        password: joi.string().required(),
      });
    
      const validation = schema.validate(body);

      if (validation.error) {
        const errorDetails = validation.error.details.map(detail => detail.message);
        return {
          status: false,
          code: 422,
          error: errorDetails.join(", "),
        };
      }

      const user = await prisma.user.findFirst({
        where: {
          email: body.email,
        },
      });

      if (!user) {
        return {
          status: false,
          code: 404,
          error: "User not found",
        };
      }

      if (!bcrypt.compareSync(body.password, user.password)) {
        return {
          status: false,
          code: 401,
          error: "Password wrong",
        };
      }

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
      };

      const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: "8h" });

      return {
        status: true,
        code: 200,
        message: "Login successful",
        data: {
          token,
        },
      };
    } catch (error) {
      console.error("Login auth module Error: ", error);
      next(error);
    }
  }
  public async logout(token: string, next: NextFunction): Promise<ResponseData | void> {
    try {
      addToBlacklist(token);
      return {
        status: true,
        code: 200,
        message: "Logout successful"
      };
    } catch (error) {
  
      console.error("Logout auth module Error: ", error);
      next(error);
    }
  }
  public async getCurrentUser(req: Request, res: Response, next: NextFunction): Promise<ResponseData | void> {
    try {
      const token: string | undefined = (req.headers["authorization"] as any)?.split(" ")[1];
      if (!token) {
        res.status(400).send("No token");
        return;
      }

      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);
  
      const user = await prisma.user.findFirst({
        where: {
          id: decoded.id,
        },
      });

      if (!user) {
        return {
          status: false,
          code: 404,
          error: "User not found",
        };
      }

      return {
        status: true,
        code: 200,
        data: user,
      };
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).send({ message: "Token has expired", redirectTo: "/" });
        return;
      }
      next(new Error("No token"));
      return;
    }
  }
}

export default new Auth();
