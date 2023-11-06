import { NextFunction } from "express";
import prisma from "../helpers/database";

interface Body {
  id: number;
};

class Balance {
  public async getBalance(body: Body, next: NextFunction): Promise<BalanceResponse | void> {
    try {
      const accounts = await prisma.account.findMany({
        where: {
          user_id: body.id,
        },
        select: {
          balance: true,
        },
      });
      
      console.log("module accounts", accounts);
      if (!accounts.length) {
        return {
          status: false,
          code: 404,
          message: "User not found or no accounts available",
        };
      }
      
      const totalBalance = accounts.reduce((acc, account) => acc + account.balance, 0);
      
      return {
        status: true,
        code: 200,
        message: "Total Balance",
        data: {
          totalBalance: totalBalance,
        },
      };
    } catch (error) {
      console.log("Get Balance module Error :", error);
      next(error);
    }
  }
}

export default new Balance();