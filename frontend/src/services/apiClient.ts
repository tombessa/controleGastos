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

export const api = setupAPIClient();