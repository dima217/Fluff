export const normalizeApiArray = <T>(response: unknown): T[] => {
  if (!response) return [];

  if (Array.isArray(response)) {
    return response;
  }

  if (typeof response === "object" && response !== null && "data" in response) {
    return Array.isArray(response.data) ? response.data : [];
  }

  return [];
};
