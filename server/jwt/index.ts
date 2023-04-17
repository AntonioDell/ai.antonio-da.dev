import jwt, { type JwtPayload } from "jsonwebtoken";
import type {
  JWTValidationResult,
  JWTSubscriptionPayload,
  JWTAdminPayload,
} from "./types";

const expiresIn = 2 * 60 * 60;

function createJWT(payload: JWTSubscriptionPayload | JWTAdminPayload) {
  const { jwtSecret } = useRuntimeConfig();
  const token = jwt.sign(payload, jwtSecret, { expiresIn });
  return token;
}

function verifyJWT(token: string): JWTValidationResult {
  try {
    const { jwtSecret } = useRuntimeConfig();
    const { id, email } = jwt.verify(token, jwtSecret) as JwtPayload;
    return { isValid: true, id, email };
  } catch (error: any) {
    console.error("Error verifying JWT:", error);
    return { isValid: false };
  }
}
export { createJWT, expiresIn, verifyJWT };
