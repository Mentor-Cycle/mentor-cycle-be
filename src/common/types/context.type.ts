import { Request } from 'express';

export type Role = 'USER' | 'MENTOR' | 'SANDBOX';

export interface JUser {
  iss: string;
  email: string;
  id: string;
  role: Role;
  /**
   * User Id
   */
  sub: string;
  iat: number;
  exp: number;
}

export interface Context {
  req: Request;
  user?: JUser | null;
}
