import Joi from "joi";
import { NextFunction } from "express";
import prisma from "../helpers/database";

class Income {
    async getIncome(req: { user_id: number }, next: NextFunction): Promise<IncomeResponse | void> {
        try {
            const getIncome = await prisma.income.findMany({
                where: {
                    user_id: req.user_id,
                },
            });

            return {
                status: true,
                code: 200,
                message: "All Income Data",
                data: getIncome,
            };
        } catch (error) {
            console.error("getIncome module Error :", error);
            next(error);
        }
    }

    async sumIncome(body: { id: number }, next: NextFunction): Promise<IncomeResponse | void> {
        try {
            const income = await prisma.income.groupBy({
                by: ["user_id"],
                _sum: {
                    income: true,
                },
                where: {
                    user_id: body.id,
                },
            });

            return {
                status: true,
                code: 200,
                message: "Income successfully added up",
                data: income,
            };
        } catch (error) {
            console.error("Sum Income module Error :", error);
            next(error);
        }
    }

    async createIncome(body: { user_id: number; account_id: number; description: string; income: number; }, next: NextFunction): Promise<IncomeResponse | void> {
        try {
            const schema = Joi.object({
                user_id: Joi.number().required(),
                account_id: Joi.number().required(),
                description: Joi.string().required(),
                income: Joi.number().required(),
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

            const addIncome = await prisma.income.create({
                data: {
                    user_id: body.user_id,
                    account_id: body.account_id,
                    description: body.description,
                    income: body.income,
                },
            });

            await prisma.account.update({
                where: {
                    id: body.account_id,
                },
                data: {
                    balance: {
                        increment: body.income,
                    },
                },
            });

            return {
                status: true,
                code: 201,
                message: "Income Successfully Increased",
                data: addIncome,
            };
        } catch (error) {
            console.error("createIncome module Error :", error);
            next(error);
        }
    }

async updateIncome(id: number, body: { account_id: number; description: string; income: number }, next: NextFunction): Promise<IncomeResponse | void> {
    try {
        const incomeBeforeUpdate = await prisma.income.findUnique({
            where: {
                id: id,
            },
        });

        if (!incomeBeforeUpdate) {
            return {
                status: false,
                code: 404,
                message: "Income not found",
            };
        }

        const updateIncome = await prisma.income.update({
            where: {
                id: id,
            },
            data: {
                description: body.description,
                income: body.income,
            },
        });

        const incomeDifference = body.income - incomeBeforeUpdate.income;

        if (typeof body.account_id !== 'number') {
            return {
                status: false,
                code: 400,
                message: "Invalid account ID",
            };
        }

        await prisma.account.update({
            where: {
                id: body.account_id,
            },
            data: {
                balance: {
                    increment: incomeDifference,
                },
            },
        });

        return {
            status: true,
            code: 201,
            message: "Income Updated Successfully",
            data: updateIncome,
        };
    } catch (error) {
        console.error("updateIncome module Error :", error);
        next(error);
    }
}

    async deleteIncome(id: number, next: NextFunction): Promise<IncomeResponse | void> {
        try {
            const incomeToDelete = await prisma.income.findUnique({
                where: {
                    id: id,
                },
            });

            const deleteIncome = await prisma.income.delete({
                where: {
                    id: id,
                },
            });

            if (incomeToDelete) {
                await prisma.account.update({
                    where: {
                        id: incomeToDelete.account_id,
                    },
                    data: {
                        balance: {
                            decrement: incomeToDelete.income,
                        },
                    },
                });
            }

            return {
                status: true,
                code: 200,
                message: "Income Deleted Successfully",
                data: deleteIncome,
            };
        } catch (error) {
            console.error("deleteIncome module Error :", error);
            next(error);
        }
    }
}

export default new Income();
