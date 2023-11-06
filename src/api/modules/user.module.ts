import Joi from "joi";
import bcrypt from "bcrypt";
import { NextFunction, Request } from "express";
import prisma from "../helpers/database";

class User {
    async listUser(next: NextFunction): Promise<UserResponse | void> {
        try {
            const list = await prisma.user.findMany();
            console.log(list);

            return {
                status: true,
                code: 200,
                message: "list of all users",
                data: list,
            };
        } catch (error) {
            console.error("listUser user module Error: ", error);
            next(error);
        }
    }

    async updateUser(body: UserUpdateBody, req: Request, next: NextFunction): Promise<UserResponse | void> {
        try {
            console.log("Received data:", req.body);
            const schema = Joi.object({
                id: Joi.number().required(),
                name: Joi.string(),
                email: Joi.string(),
                password: Joi.string(),
                confirmPassword: Joi.string().valid(Joi.ref('password')).messages({ 'any.only': 'Пароли не совпадают' })
            }).options({ abortEarly: false });

            const validation = schema.validate(body);

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
            if (body.password) {
                if (body.password !== body.confirmPassword) {
                    return {
                        status: false,
                        code: 422,
                        error: "Пароли не совпадают",
                    };
                }
                body.password = bcrypt.hashSync(body.password, 10);
            }
            const update = await prisma.user.update({
                where: {
                    id: body.id,
                },
                data: {
                    name: body.name,
                    email: body.email,
                },
            });

            return {
                status: true,
                code: 201,
                message: "User updated successfully",
                data: update,
            };
        } catch (error) {
            console.error("updateUser user module Error: ", error);
            next(error);
        }
    };

    async deleteUser(id: number, next: NextFunction): Promise<UserResponse | void> {
        try {
            const schema = Joi.number().required();

            const validation = schema.validate(id);

            if (validation.error) {
                const errorDetails = validation.error.details.map(
                    (detail) => detail.message
                );

                return {
                    status: false,
                    code: 422,
                    error: errorDetails,
                };
            }

            const del = await prisma.user.delete({
                where: {
                    id: id,
                },
            });

            return {
                status: true,
                code: 200,
                message: "User has been successfully deleted",
                data: del,
            };
        } catch (error) {
            console.error("deleteUser user module Error: ", error);
            next(error);
        }
    }

    async getUserById(id: number, next: NextFunction): Promise<UserResponse | void> {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: id,
                },
            });

            if (!user) {
                return {
                    status: false,
                    code: 404,
                    message: "User not found",
                };
            }

            return {
                status: true,
                code: 200,
                data: user,
            };
        } catch (error) {
            console.error("getUserById user module Error: ", error);
            next(error);
        }
    }
}

export default new User();
