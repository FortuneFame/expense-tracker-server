import Joi from "joi";
import bcrypt from "bcrypt";
import { NextFunction } from "express";
import prisma from "../helpers/database";

interface UserUpdateBody {
  id: number;
  name?: string;
  email?: string;
  password?: string;
}

interface UserResponse {
  status: boolean;
  code: number;
  message?: string;
  data?: any;
  error?: string | unknown;
}

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

    async updateUser(body: UserUpdateBody, next: NextFunction): Promise<UserResponse | void> {
        try {
            const schema = Joi.object({
                id: Joi.number().required(),
                name: Joi.string(),
                email: Joi.string(),
                password: Joi.string(),
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
                body.password = bcrypt.hashSync(body.password, 10);
            }

            const update = await prisma.user.update({
                where: {
                    id: body.id,
                },
                data: {
                    name: body.name,
                    email: body.email,
                    password: body.password,
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
    }

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
}

export default new User();
