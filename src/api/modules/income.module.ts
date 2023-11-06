import Joi from 'joi';
import { NextFunction } from 'express';
import prisma from '../helpers/database';

class Income {

    async getIncome(req: CustomRequest, next: NextFunction): Promise<IncomeResponse | void> {
        try {
            const getIncome = await prisma.income.findMany({
                where: {
                    user_id: req.user_id,
                },
            });
            console.log(getIncome);

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
                by: ['user_id'],
                _sum: {
                    income: true,
                },
                where: {
                    user_id: body.id,
                },
            });
            console.log("Sum", income);
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

    async createIncome(body: { user_id: number; description: string; account_id: number; income: number }, next: NextFunction): Promise<IncomeResponse | void> {
        try {
            const schema = Joi.object({
                user_id: Joi.number().required(),
                description: Joi.string().required(),
                income: Joi.number().required(),
            }).options({ abortEarly: false });

            const validation = schema.validate(body);
            const userAccounts = await prisma.account.findMany({
                where: {
                    user_id: body.user_id,
                },
            });
            const primaryAccount = userAccounts[0];

            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );

                return {
                    status: false,
                    code: 422,
                    error: errorDetails.join(", "),
                };
            }

            if (!userAccounts) {
                return {
                    status: false,
                    code: 404,
                    message: "User not found",
                };
            }

            const add = await prisma.income.create({
                data: {
                    user_id: body.user_id,
                    account_id: body.account_id,
                    description: body.description,
                    income: body.income,
                },
            });

            await prisma.tracker.create({
                data: {
                    user_id: body.user_id,
                    status: 'Admission fee',
                    balance: body.income,
                },
            });

            await prisma.account.update({
                where: {
                    id: primaryAccount.id,
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
                data: add,
            };
        } catch (error) {
            console.error("createIncome module Error :", error);
            next(error);
        }
    }

    async updateIncome(id: number, body: { description: string; income: number }, next: NextFunction): Promise<IncomeResponse | void> {
        try {
            const update = await prisma.income.update({
                where: {
                    id: id,
                },
                data: {
                    description: body.description,
                    income: body.income,
                },
            });

            return {
                status: true,
                code: 201,
                message: "Income Updated Successfully",
                data: update,
            };
        } catch (error) {
            console.error("update Income module Error :", error);
            next(error);
        }
    }

    async deleteIncome(id: number, next: NextFunction): Promise<IncomeResponse | void> {
        try {
            const delIncome = await prisma.income.delete({
                where: {
                    id: id,
                },
            });

            return {
                status: true,
                code: 200,
                message: "Income Deleted Successfully",
                data: delIncome,
            };
        } catch (error) {
            console.error("deleteIncome module Error :", error);
            next(error);
        }
    }
};

export default new Income();
