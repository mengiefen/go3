type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

function getCsrfToken(): string | null {
  const meta = document.querySelector<HTMLMetaElement>(
    'meta[name="csrf-token"]'
  );
  return meta?.content ?? null;
}

export async function apiClient<T>(
  url: string,
  method: HttpMethod = "GET",
  body?: unknown
): Promise<T> {
  const headers: HeadersInit = {
    Accept: "application/json",
  };

  if (body) {
    headers["Content-Type"] = "application/json";
  }

  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers["X-CSRF-Token"] = csrfToken;
  }

  const response = await fetch(url, {
    method,
    headers,
    credentials: "same-origin",
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw {
      status: response.status,
      body: errorBody,
    };
  }

  return response.json();
}
