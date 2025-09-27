import { Api } from "@/shared/apis/lib";
import z, { ZodType } from "zod";

export async function callApi<Args extends ZodType, Result extends ZodType>(
  api: Api<Args, Result>,
  args: z.input<Args>,
): Promise<z.infer<Result>> {
  const res = await fetch(`/api${api.path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error ${res.status} calling /api${api.path}: ${text}`);
  }

  const json = await res.json();

  return api.resultSchema.parse(json);
}
