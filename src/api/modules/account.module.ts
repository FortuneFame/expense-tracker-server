import Joi from 'joi';
import { NextFunction } from 'express';
import prisma from "../helpers/database";

const createAccountSchema = Joi.object({
  user_id: Joi.number().required(),
  name: Joi.string().min(1).max(50).required(),
  balance: Joi.number().required(),
}).options({ abortEarly: false });

const updateAccountSchema = Joi.object({
  name: Joi.string().min(1).max(50),
  balance: Joi.number(),
}).min(1).options({ abortEarly: false });

class AccountModule {
  static async getAccount(req: CustomRequest, next: NextFunction): Promise<ResponseData | void> {
    try {
      console.log("Fetching accounts for user:", req.user_id);
      const accounts = await prisma.account.findMany({
        where: {
          user_id: req.user_id
        },
      });
      return {
        status: true,
        code: 200,
        message: "Account Data",
        data: accounts,
      };
    } catch (error) {
      console.error("getAccount Error: ", error);
      next(error);
    }
  }

  static async createAccount(data: any, next: NextFunction): Promise<ResponseData | void> {
    try {
      const validationResult = createAccountSchema.validate(data);
      if (validationResult.error) {
        const errorDetails = validationResult.error.details.map(detail => detail.message);
        return {
          status: false,
          code: 422,
          error: errorDetails.join(", "),
        };
      }
      const newAccount = await prisma.account.create({ data: data });
      return {
        status: true,
        code: 201,
        message: "Account created successfully",
        data: newAccount,
      };
    } catch (error) {
      console.error("createAccount Error: ", error);
      next(error);
    }
  }

  static async updateAccount(id: number, data: any, next: NextFunction): Promise<ResponseData | void> {
    try {
      const validationResult = updateAccountSchema.validate(data);
      if (validationResult.error) {
        const errorDetails = validationResult.error.details.map(detail => detail.message);
        return {
          status: false,
          code: 422,
          error: errorDetails.join(", "),
        };
      }
      const updatedAccount = await prisma.account.update({
        where: { id: id },
        data: data
      });
      return {
        status: true,
        code: 200,
        message: "Account updated successfully",
        data: updatedAccount,
      };
    } catch (error) {
      console.error("updateAccount Error: ", error);
      next(error);
    }
  }

  static async deleteAccount(id: number, next: NextFunction): Promise<ResponseData | void> {
    try {
      const accountToDelete = await prisma.account.findUnique({
        where: { id: id },
      });
      if (!accountToDelete) {
        return {
          status: false,
          code: 404,
          error: "Account not found",
        };
      }
      await prisma.account.delete({ where: { id: id } });
      return {
        status: true,
        code: 200,
        message: 'Account deleted successfully'
      };
    } catch (error) {
      console.error("deleteAccount Error: ", error);
      next(error);
    }
  }
}

export default AccountModule;
