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


interface TrackerRequestBody {
    id: number;
};

interface TrackerResponse {
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
