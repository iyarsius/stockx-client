export interface ILoginData {
    username: string;
    password: string;
};

export interface IUser {
    id: string;
    username: string;
    email: string;
    hasHyperwalletPayoutMethod: boolean;
}