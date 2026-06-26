/**
 * Simple email validation utility
 * Reusable across all forms (members, auth, profile, etc.)
 */

/**
 * Check if email has valid format
 * @param email - Email string to validate
 * @returns boolean - true if email format is valid
 */
export const isValidEmail = (email: string): boolean => {
  if (!email) return false;
  // Simple but effective email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
