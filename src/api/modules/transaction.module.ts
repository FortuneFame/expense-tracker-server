
// import { NextFunction } from "express";
// import prisma from "../helpers/database";

// interface Body {
//   user_id: number;
// };

// class Transaction {
//   public async getTransactionHistory(body: Body, next: NextFunction): Promise<TransactionResponse | void> {
//     try {
//       const transactions = await prisma.transaction.findMany({
//         where: {
//           account: {
//             user_id: body.user_id,
//           },
//         },
//         select: {
//           id: true,
//           account_id: true,
//           amount: true,
//           transaction_type: true,
//           created_at: true,
//           updated_at: true
//         },
//       });
//       if (!transactions.length) {
//         return {
//           status: false,
//           code: 404,
//           message: "No transactions found for the user",
//         };
//       }

//       return {
//         status: true,
//         code: 200,
//         message: "Transactions fetched successfully",
//         data: transactions,
//       };
//     } catch (error) {
//       console.error("Get TransactionHistory module Error:", error);
//       next(error);
//     }
//   }
// }

// export default new Transaction();