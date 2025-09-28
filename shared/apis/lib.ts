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

export const standardAuthErrors = [
  "not-authenticated",
  "invalid-token",
  "insufficient-permissions",
] as const;
export type StandardAuthError = (typeof standardAuthErrors)[number];

export type AuthProtectedData<T> =
  | { data?: undefined; error: StandardAuthError }
  | { data: T; error?: undefined };

export function buildAuthProtectedResultSchema<T extends z.ZodType>(schema: T) {
  return z.union([
    z.object({ error: standardAuthErrors }),
    z.object({ data: schema }),
  ]);
}
