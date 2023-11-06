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

            const userAccounts = await prisma.account.findMany({
                where: {
                    user_id: body.user_id,
                },
            });

            if (!userAccounts.length) {
                return {
                    status: false,
                    code: 404,
                    message: "No accounts found for the user",
                };
            }

            const primaryAccount = userAccounts[0];
            
            if (primaryAccount.balance < body.expense) {
                return {
                    status: false,
                    code: 401,
                    message: "Insufficient Balance",
                };
            }
            const addExpense = await prisma.expense.create({
                data: {
                    user_id: body.user_id,
                    account_id: primaryAccount.id, 
                    description: body.description,
                    expense: body.expense,
                },
            });

             await prisma.account.update({
                where: {
                    id: primaryAccount.id,
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

    async updateExpense(id: number, body: UpdateExpenseBody, next: NextFunction): Promise<ExpenseResponse | void> {
        try {
            const update = await prisma.expense.update({
                where: {
                    id: id,
                },
                data: body,
            });

            return {
                status: true,
                code: 201,
                message: "Expense Updated Successfully",
                data: update,
            };
        } catch (error) {
            console.log("updateExpense module Error:", error);
            next(error);
        }
    }

    async deleteExpense(id: number, next: NextFunction): Promise<ExpenseResponse | void> {
        try {
            const delExpense = await prisma.expense.delete({
                where: {
                    id: id,
                },
            });

            return {
                status: true,
                code: 200,
                message: "Expense Deleted Successfully",
                data: delExpense,
            };
        } catch (error) {
            console.log("deleteExpense module Error:", error);
            next(error);
        }
    }
}

export default new Expense();
