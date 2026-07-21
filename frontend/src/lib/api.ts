const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export async function fetchAPI<T>(endpoint: string): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url);
  const data = await response.json();

  if (!response.ok || !data.success) {
    const error = new Error(data.error || `API error: ${response.statusText}`) as any;
    error.response = {
      status: response.status,
      data: data
    };
    throw error;
  }

  return data.data;
}

export async function postAPI<T>(endpoint: string, body: any): Promise<T> {
  const url = `${API_URL}${endpoint}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  const data = await response.json();

  if (!data.success) {
    throw new Error(data.error || "API returned an error");
  }

  return data.data;
}
