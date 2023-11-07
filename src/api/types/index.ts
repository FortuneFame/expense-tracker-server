interface UserInput {
    name: string;
    email: string;
    password: string;
};

interface LoginInput {
    email: string;
    password: string;
};

interface ResponseData {
    status: boolean;
    code?: number;
    message?: string;
    data?: any;
    error?: string | unknown;
};

interface BalanceResponse {
    status: boolean;
    code?: number;
    message?: string;
    data?: any;
    error?: string | unknown;
};

interface ExpenseResponse {
    status: boolean;
    code: number;
    message?: string;
    data?: any;
    error?: string | unknown;
};

interface CreateExpenseBody {
    user_id: number;
    account_id: number;
    description: string;
    expense: number;
};

interface UpdateExpenseBody {
    description?: string;
    expense?: number;
};

interface CustomRequest {
    user_id: number;
};

interface IncomeResponse {
    status: boolean;
    code: number;
    message?: string;
    data?: any;
    error?: string | unknown;
};



interface UserUpdateBody {
    id: number;
    name?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
};

interface UserResponse {
    status: boolean;
    code: number;
    message?: string;
    data?: any;
    error?: string | unknown;
};

interface TrackerRequestBody {
  id: number; 

}

interface TrackerResponse {
  status: boolean; 
  code: number;    
  message: string; 
  data: any;       
}

// interface TrackerRequestBody {
//     id: number;
// };

// interface TrackerResponse {
//     status: boolean;
//     code: number;
//     message?: string;
//     data?: any;
//     error?: string | unknown;
// };


interface TransactionResponse {
  status: boolean;
  code: number;
  message: string;
  data?: any; 
}

interface AccountReference {
  id: number;
  name: string;
}

interface Income {
  id: number;
  description: string;
  amount: number; // This should match the name of the field in the database if it's different than `income`.
  createdAt: Date;
  account: AccountReference;
}

interface Expense {
  id: number;
  description: string;
  amount: number; // This should match the name of the field in the database if it's different than `expense`.
  createdAt: Date;
  account: AccountReference;
}

interface AccountSummaryResponse {
  status: boolean;
  code: number;
  message: string;
  data: {
    incomes: Income[];
    expenses: Expense[];
  };
  error?: string | unknown;
}
