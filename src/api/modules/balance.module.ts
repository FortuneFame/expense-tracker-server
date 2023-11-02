import prisma from "../helpers/database";
import { NextFunction } from "express";

interface BalanceResponse {
  status: boolean;
  code?: number;
  message?: string;
  data?: any;
  error?: string | unknown;
}

interface Body {
  id: number;
}

class Balance {
  public async getBalance(body: Body, next: NextFunction): Promise<BalanceResponse | void> {
    try {
      const uBalance = await prisma.user.findUnique({
        where: {
          id: body.id,
        },
        select: {
          name: true,
          balance: true,
        },
      });

      console.log("module balance", uBalance);
      if (!uBalance) {
        return {
          status: false,
          code: 404,
          message: "User not found",
        };
      }

      return {
        status: true,
        code: 200,
        message: "Data Balance",
        data: uBalance,
      };
    } catch (error) {
      console.log("Get Balance module Error :", error);
      next(error);
    }
  }
}

export default new Balance();