import crypto from "crypto";
import { promisify } from "util";

// converts callback-based functions to promise-based
const pbkdf2 = promisify(crypto.pbkdf2);

export const cryptoUtils = {
  /**
   * Hashes password using PBKDF2 with a random salt
   * @param password - plain text password
   * @returns Promise resolving to the hashed password
   */
  hash: async (password: string): Promise<string> => {
    const salt = crypto.randomBytes(16).toString("hex");
    const iterations = 10000;
    const keylen = 64;
    const digest = "sha512";

    const derivedKey = await pbkdf2(password, salt, iterations, keylen, digest);
    return `${salt}:${iterations}:${keylen}:${digest}:${derivedKey.toString(
      "hex"
    )}`;
  },

  /**
   * Verify a password against the stored hash
   * @param candidatePassword to be verified
   * @param storedHash - stored password hash with parameters
   * @returns Promise resolving to boolean indicating match
   */
  compare: async (
    candidatePassword: string,
    storedHash: string
  ): Promise<boolean> => {
    const [salt, iterationsStr, keylenStr, digest, hash] =
      storedHash.split(":");
    const iterations = parseInt(iterationsStr, 10);
    const keylen = parseInt(keylenStr, 10);

    const derivedKey = await pbkdf2(
      candidatePassword,
      salt,
      iterations,
      keylen,
      digest
    );

    // Constant-time comparison to prevent timing attacks
    const candidateHash = derivedKey.toString("hex");
    return crypto.timingSafeEqual(
      Buffer.from(hash, "hex"),
      Buffer.from(candidateHash, "hex")
    );
  },
};
export const hash = cryptoUtils.hash;
export const compare = cryptoUtils.compare;
