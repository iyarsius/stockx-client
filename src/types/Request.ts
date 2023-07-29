export interface IJWT {
    access_token: string,
    refresh_token: string,
    id_token: string,
    scope: string,
    expires_in: number,
    token_type: string
}