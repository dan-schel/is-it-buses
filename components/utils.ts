import { Api } from "@/shared/apis/lib";
import React from "react";
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

/** @knipignore */
export function useQuery<Args extends ZodType, Result extends ZodType>(
  api: Api<Args, Result>,
  args: z.input<Args>,
) {
  const [data, setData] = React.useState<z.infer<Result> | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<unknown>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        const result = await callApi(api, args);
        if (!cancelled) setData(result);
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [api, args]);

  return { data, loading, error };
}

export function useMutation<Args extends ZodType, Result extends ZodType>(
  api: Api<Args, Result>,
) {
  const [loading, setLoading] = React.useState(false);

  async function call(args: z.input<Args>) {
    try {
      setLoading(true);
      return await callApi(api, args);
    } finally {
      setLoading(false);
    }
  }

  return { call, loading };
}
