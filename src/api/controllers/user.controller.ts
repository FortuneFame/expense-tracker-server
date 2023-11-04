import { Router, Request, Response, NextFunction } from 'express';
import UserModule from '../modules/user.module';
import ResponseHelper from '../helpers/response';

const UserController: Router = Router();

UserController.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const list = await UserModule.listUser(next);
    ResponseHelper.sendResponse(res, list);
  } catch (error) {
    next(error);
  }
});

UserController.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserModule.getUserById(Number(req.params.id), next);
    ResponseHelper.sendResponse(res, user);
  } catch (error) {
    next(error);
  }
});

UserController.patch("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const update = await UserModule.updateUser(req.body, req, next);
    ResponseHelper.sendResponse(res, update);
  } catch (error) {
    next(error);
  }
});

UserController.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const del = await UserModule.deleteUser(Number(req.params.id), next);
    ResponseHelper.sendResponse(res, del);
  } catch (error) {
    next(error);
  }
});

export default UserController;
