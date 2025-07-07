import jwt from 'jsonwebtoken'

interface UserPayload {
  userId: string;
  email: string;
  [key: string]: any;
}

// Helper to get current user from token
export function getCurrentUser(token?: string): UserPayload | null {
  if (!token) return null
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as UserPayload
  } catch {
    return null
  }
}

// Verify token from string
export async function verifyToken(token: string): Promise<UserPayload> {
  if (!token) {
    throw new Error('No token provided')
  }

  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined')
  }

  try {
    return jwt.verify(token, process.env.JWT_SECRET) as UserPayload
  } catch (error) {
    throw new Error('Invalid token')
  }
}