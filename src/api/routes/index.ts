import { Router, Express } from "express";
import UserController from "../controllers/user.controller";
import AuthController from "../controllers/auth.controller";
import IncomeController from "../controllers/income.controller";
import ExpenseController from "../controllers/expense.controller";
import BalanceController from "../controllers/balance.controller";
import AccountController from "../controllers/account.controller";

const Routes: [string, Router][] = [
  ['users', UserController],
  ['', AuthController],
  ['account', AccountController],
  ['income', IncomeController],
  ['expense', ExpenseController],
  ['balance', BalanceController],
];

const routes = (app: Express) => {
  Routes.forEach((route) => {
    const [url, controller] = route;
    app.use(`/api/${url}`, controller);
  });
};

export default routes;