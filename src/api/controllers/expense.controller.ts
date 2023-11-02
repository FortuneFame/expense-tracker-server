import { Router, Request, Response, NextFunction } from 'express';
import passport from 'passport';
import ExpenseModule from '../modules/expense.module';
import ResponseHelper from '../helpers/response';

const ExpenseController: Router = Router();

ExpenseController.get("/", passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const expenseList = await ExpenseModule.getExpense({ user_id: req.user!.id }, next);
        ResponseHelper.sendResponse(res, expenseList);
    } catch (error) {
        next(error);
    }
});

ExpenseController.get("/sum", passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sum = await ExpenseModule.sumExpense({ id: req.user!.id }, next);
        ResponseHelper.sendResponse(res, sum);
    } catch (error) {
        next(error);
    }
});

ExpenseController.post("/", passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const createExpense = await ExpenseModule.createExpense({
            user_id: req.user!.id,
            ...req.body,
        }, next);
        ResponseHelper.sendResponse(res, createExpense);
    } catch (error) {
        next(error);
    }
});

ExpenseController.put("/:id", passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const updateExpense = await ExpenseModule.updateExpense(
            Number(req.params.id),
            req.body,
            next
        );
        ResponseHelper.sendResponse(res, updateExpense);
    } catch (error) {
        next(error);
    }
});

ExpenseController.delete("/:id", passport.authenticate('jwt', { session: false }), async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleteExpense = await ExpenseModule.deleteExpense(Number(req.params.id), next);
        ResponseHelper.sendResponse(res, deleteExpense);
    } catch (error) {
        next(error);
    }
});

export default ExpenseController;
