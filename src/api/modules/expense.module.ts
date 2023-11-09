import Joi from "joi";
import { NextFunction } from "express";
import prisma from "../helpers/database";

class Expense {
    async getExpense(req: { user_id: number }, next: NextFunction): Promise<ExpenseResponse | void> {
        try {
            const getExpense = await prisma.expense.findMany({
                where: {
                    user_id: req.user_id,
                },
            });

            return {
                status: true,
                code: 200,
                message: "All Expense Data",
                data: getExpense,
            };
        } catch (error) {
            console.log("getExpense module Error :", error);
            next(error);
        }
    }

    async sumExpense(body: { id: number }, next: NextFunction): Promise<ExpenseResponse | void> {
        try {
            const expense = await prisma.expense.groupBy({
                by: ["user_id"],
                _sum: {
                    expense: true,
                },
                where: {
                    user_id: body.id,
                },
            });

            return {
                status: true,
                code: 200,
                message: "Expenses successfully calculated",
                data: expense,
            };
        } catch (error) {
            console.log("Sum Expense module Error:", error);
            next(error);
        }
    }

    async createExpense(body: CreateExpenseBody, next: NextFunction): Promise<ExpenseResponse | void> {
        try {
            const schema = Joi.object({
                user_id: Joi.number().required(),
                account_id: Joi.number().required(),
                description: Joi.string().required(),
                expense: Joi.number().required(),
            }).options({ abortEarly: false });

            const validation = schema.validate(body);
            if (validation.error) {
                const errorDetails = validation.error.details.map((detail) => detail.message);
                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            const userAccount = await prisma.account.findUnique({
                where: {
                    id: body.account_id,
                },
            });

            if (!userAccount) {
                return {
                    status: false,
                    code: 404,
                    message: "Account not found",
                };
            }
    
            if (userAccount.balance < body.expense) {
                return {
                    status: false,
                    code: 401,
                    message: "Insufficient Balance",
                };
            }

            const addExpense = await prisma.expense.create({
                data: {
                    user_id: body.user_id,
                    account_id: body.account_id,
                    description: body.description,
                    expense: body.expense,
                },
            });

            await prisma.account.update({
                where: {
                    id: body.account_id,
                },
                data: {
                    balance: {
                        decrement: body.expense,
                    },
                },
            });

            return {
                status: true,
                code: 201,
                message: "Expense Successfully Added",
                data: addExpense,
            };
        } catch (error) {
            console.log("createExpense module Error:", error);
            next(error);
        }
    }

async updateExpense(id: number, body: ExpenseUpdateBody, next: NextFunction): Promise<ExpenseResponse | void> {
  try {
    console.log('Update request received for expense ID:', id);
    console.log('Request body:', body);

    const expenseBeforeUpdate = await prisma.expense.findUnique({
      where: { id: id },
    });

    if (!expenseBeforeUpdate) {
      return {
        status: false,
        code: 404,
        message: "Expense not found",
      };
    }

    const updateData: Partial<ExpenseUpdateBody> = {};
    if (body.description) updateData.description = body.description;
    if (body.expense !== undefined) updateData.expense = body.expense;

    const expenseDifference = body.expense !== undefined ? expenseBeforeUpdate.expense - body.expense : 0;

    const updatedExpense = await prisma.expense.update({
      where: { id: id },
      data: updateData,
    });

    if (expenseDifference !== 0) {
      await prisma.account.update({
        where: { id: expenseBeforeUpdate.account_id },
        data: {
          balance: {
            increment: expenseDifference,
          },
        },
      });
    }

    console.log('Updated expense:', updatedExpense);

    return {
      status: true,
      code: 200,
      message: "Expense Updated Successfully",
      data: updatedExpense,
    };
  } catch (error) {
    console.error("updateExpense module Error: ", error);
    next(error);
  }
}
    async deleteExpense(id: number, next: NextFunction): Promise<ExpenseResponse | void> {
    try {
        const delExpense = await prisma.expense.findUnique({
            where: {
                id: id,
            },
        });

        const deletedExpense = await prisma.expense.delete({
            where: {
                id: id,
            },
        });

        if (delExpense) {
            await prisma.account.update({
                where: {
                    id: delExpense.account_id,
                },
                data: {
                    balance: {
                        increment: delExpense.expense,
                    },
                },
            });
        }

        return {
            status: true,
            code: 200,
            message: "Expense Deleted Successfully",
            data: deletedExpense,
        };
    } catch (error) {
        console.log("deleteExpense module Error:", error);
        next(error);
    }
}

};

export default new Expense();
