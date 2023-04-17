import { Admin, Subscription } from "@prisma/client";

type JWTSubscriptionPayload = Pick<Subscription, "id" | "email">;
type JWTAdminPayload = Pick<Admin, "id">;

type JWTValidationResult =
  | ({ isValid: true } & JWTSubscriptionPayload)
  | { isValid: false };

export type { JWTValidationResult, JWTSubscriptionPayload, JWTAdminPayload };
