export async function upload(fetcher, payload, requestId) {
  const options = {
    method: "POST",
    headers: { "Idempotency-Key": requestId },
    body: JSON.stringify(payload)
  };
  try {
    return await fetcher("/upload", options);
  } catch {
    return fetcher("/upload", options);
  }
}
