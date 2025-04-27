export interface Profile {
    id: number,
    username: string,
    avatarUrl: string | null,
    subscribtionsAmount: number,
    firstName: string,
    isActiv: boolean,
    stack: string[],
    city: string,
}