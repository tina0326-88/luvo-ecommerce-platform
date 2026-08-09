const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

/**
 * @param {string} path API 路徑，例如 "/products"
 * @param {RequestInit} options fetch 選項
 */
export async function request(path, options = {}) {
  if (!BASE_URL) {
    console.warn(
      `[api] 尚未設定 VITE_API_BASE_URL，呼叫 ${path} 會被忽略。目前資料來源皆為 stores 內建的 mock 資料。`,
    );
    return null;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API 請求失敗：${response.status} ${response.statusText}`);
  }

  return response.json();
}

export const api = {
  get: (path) => request(path, { method: "GET" }),
  post: (path, body) =>
    request(path, { method: "POST", body: JSON.stringify(body) }),
  put: (path, body) =>
    request(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: "DELETE" }),
};
