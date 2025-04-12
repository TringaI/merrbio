const crypto = require('crypto');

/**
 * Generate a random salt
 * @param {number} length - The length of the salt
 * @returns {string} - The generated salt
 */
const generateSalt = (length = 16) => {
  return crypto.randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length);
};

/**
 * Hash a password with salt using SHA-256
 * @param {string} password - The password to hash
 * @param {string} salt - The salt to use (optional)
 * @returns {Object} - Object containing the hashed password and salt
 */
const hashPassword = (password, existingSalt = null) => {
  const salt = existingSalt || generateSalt();
  const hash = crypto
    .createHmac('sha256', salt)
    .update(password)
    .digest('hex');
  
  return {
    hash,
    salt
  };
};

/**
 * Verify a password against a stored hash and salt
 * @param {string} password - The password to verify
 * @param {string} hash - The stored hash
 * @param {string} salt - The stored salt
 * @returns {boolean} - True if the password matches
 */
const comparePassword = (password, hash, salt) => {
  const passwordData = hashPassword(password, salt);
  return passwordData.hash === hash;
};

module.exports = {
  generateSalt,
  hashPassword,
  comparePassword
};