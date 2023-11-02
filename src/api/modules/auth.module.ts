import joi from "joi";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction } from "express";
import prisma from "../helpers/database";

interface UserInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface ResponseData {
  status: boolean;
  code?: number;
  message?: string;
  data?: any;
  error?: string | unknown;
}

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
        email: user.email,
      };

      const token = jwt.sign(payload, "jwt-secret-code", { expiresIn: "8h" });

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
}

export default new Auth();
