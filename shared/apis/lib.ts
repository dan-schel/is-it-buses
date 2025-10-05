import z from "zod";

export type Api<Args extends z.ZodType, Result extends z.ZodType> = {
  path: string;
  argsSchema: Args;
  resultSchema: Result;
};

export type ArgsOf<ApiType> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ApiType extends Api<infer Args, any> ? z.infer<Args> : never;

export type ResultOf<ApiType> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ApiType extends Api<any, infer Result> ? z.input<Result> : never;

export type Failable<T, E extends string> = { data: T } | { error: E };
export type AuthErrorResult = { error: StandardAuthError };
export type AuthProtectedData<T, E extends string = never> = Failable<
  T,
  E | StandardAuthError
>;

const standardAuthErrors = [
  "not-authenticated",
  "invalid-token",
  "insufficient-permissions",
] as const;
export type StandardAuthError = (typeof standardAuthErrors)[number];

export const standardAuthErrorDisplayStrings = {
  "not-authenticated": "You must be logged in to view this.",
  "invalid-token": "Your session expired. Please log in again.",
  "insufficient-permissions": "You don't have permission to view this.",
} as const;

export function buildAuthProtectedResultSchema<
  SchemaType extends z.ZodType,
  ErrorType extends string,
>(schema: SchemaType, customErrorTypes: ErrorType[] = []) {
  const errorTypes = [...standardAuthErrors, ...customErrorTypes];
  return z.union([
    z.object({ error: z.enum(errorTypes) }),
    z.object({ data: schema }),
  ]);
}
