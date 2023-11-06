import { Router, Request, Response, NextFunction } from 'express';

import passport from '../passport/passport.config';
import AccountModule from '../modules/account.module';
import ResponseHelper from '../helpers/response';

const AccountController: Router = Router();

AccountController.get('/', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  console.log("GET /account");
  try {
    const accountInfo = await AccountModule.getAccount({ user_id: req.user!.id }, next);
    console.log("Sending accounts:", accountInfo);
    ResponseHelper.sendResponse(res, accountInfo);
  } catch (error) {
    next(error);
  }
});

AccountController.post('/', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createAccount = await AccountModule.createAccount({
      user_id: req.user!.id,
      ...req.body,
    }, next);
    ResponseHelper.sendResponse(res, createAccount);
  } catch (error) {
    next(error);
  }
});

AccountController.put('/:id', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateAccount = await AccountModule.updateAccount(Number(req.params.id), req.body, next);
    ResponseHelper.sendResponse(res, updateAccount);
  } catch (error) {
    next(error);
  }
});

AccountController.delete('/:id', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleteAccount = await AccountModule.deleteAccount(Number(req.params.id), next);
    ResponseHelper.sendResponse(res, deleteAccount);
  } catch (error) {
    next(error);
  }
});
export default AccountController;