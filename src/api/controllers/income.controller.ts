import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import IncomeModule from '../modules/income.module';
import ResponseHelper from '../helpers/response';

const IncomeController: Router = Router();

IncomeController.get('/', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const incomeList = await IncomeModule.getIncome({ user_id: req.user!.id }, next);
    ResponseHelper.sendResponse(res, incomeList);
  } catch (error) {
    next(error);
  }
});

IncomeController.get('/sum', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const sumIncome = await IncomeModule.sumIncome({ id: req.user!.id }, next);
    ResponseHelper.sendResponse(res, sumIncome);
  } catch (error) {
    next(error);
  }
});

IncomeController.post('/', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const createIncome = await IncomeModule.createIncome({
      user_id: req.user!.id,
      ...req.body,
    }, next);
    ResponseHelper.sendResponse(res, createIncome);
  } catch (error) {
    next(error);
  }
});

IncomeController.put('/:id', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updateIncome = await IncomeModule.updateIncome(Number(req.params.id), req.body, next);
    ResponseHelper.sendResponse(res, updateIncome);
  } catch (error) {
    next(error);
  }
});

IncomeController.delete('/:id', passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deleteIncome = await IncomeModule.deleteIncome(Number(req.params.id), next);
    if (deleteIncome) {
      ResponseHelper.sendResponse(res, deleteIncome);
    }
  } catch (error) {
    next(error);
  }
});

export default IncomeController;
