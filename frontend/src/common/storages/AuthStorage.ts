import { Tokens, AuthUser } from '../types/auth.type';

export class AuthStorage {
  private static instance: AuthStorage | null = null;

  private constructor() {}

  public static getInstance(): AuthStorage {
    if (!AuthStorage.instance) {
      AuthStorage.instance = new AuthStorage();
    }
    return AuthStorage.instance;
  }

  public saveTokens(tokens: Tokens): void {
    localStorage.setItem('tokens', JSON.stringify(tokens));
  }

  public saveAuthUser(authUser: AuthUser): void {
    localStorage.setItem('authUser', JSON.stringify(authUser));
  }

  public getToken(): Tokens | null {
    const data = localStorage.getItem('tokens');
    if (!data) return null;
    try {
      return JSON.parse(data) as Tokens;
    } catch {
      return null;
    }
  }

  public getAuthUser(): AuthUser | null {
    const data = localStorage.getItem('authUser');
    if (!data) return null;
    try {
      return JSON.parse(data) as AuthUser;
    } catch {
      return null;
    }
  }

  public clear(): void {
    localStorage.removeItem('tokens');
    localStorage.removeItem('authUser');
  }
}

export const authStorage = AuthStorage.getInstance();
export default authStorage;
