export class AuthUser {
  id: string;
  email: string;
  sub: string;
  iat: number | undefined;
  exp: number | undefined;
}
