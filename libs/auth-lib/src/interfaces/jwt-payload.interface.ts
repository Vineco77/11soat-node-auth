export interface JwtPayload {
  sub: string; 
  cpf: string;
  user_type: 'cliente' | 'funcionario';
  name?: string;
  email?: string
  iat?: number;
  exp?: number;
}