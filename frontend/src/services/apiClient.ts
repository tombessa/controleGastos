import { setupAPIClient } from './api'

export type PeriodProps = {
    id: string;
    month: number;
    year: number;
}

export type ListPeriodProps = {
    periods: PeriodProps[];
}

export type AccountProps = {
    id: string;
    name: string;
    type: string;
}

export type ListAccountProps = {
    accounts: AccountProps[];
}

export type SumProps = {
    _sum: {value: number}
}

export type CategoryProps = {
    id: string
    name: string
    expense: boolean
    includeGoal: boolean
    priority: number
}

export type ExtratoProps ={
    id: string
    date: Date
    description: string
    value: number
    category_id: string
    goal_period_id: string
    bank_id: string
    category: CategoryProps;
}

export type AccountResumeProps = {
    accountReturn : AccountProps[];
    totalEarnsLastPeriod: SumProps;
    totalEarns: SumProps;
    totalExpensesLastPeriod: SumProps;
    totalExpenses: SumProps;
    extrato: ExtratoProps;
}

export const api = setupAPIClient();