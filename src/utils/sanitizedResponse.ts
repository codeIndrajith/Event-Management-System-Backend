export const sanitizeResponse = <T>(data: T): T => {
  // null or non-object data
  if (!data || typeof data !== "object") {
    return data;
  }

  // arrays
  if (Array.isArray(data)) {
    return data.map((item) => sanitizeResponse(item)) as T;
  }

  // objects
  return Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      value === null || value === undefined ? "" : value,
    ])
  ) as T;
};
