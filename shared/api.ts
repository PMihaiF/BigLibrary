/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Article type for the admin dashboard
 */
export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  author: string;
  createdAt: string;
  updatedAt?: string;
}

/**
 * User role types
 */
export type UserRole = "admin" | "student";

/**
 * User data type
 */
export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  createdAt: string;
}
