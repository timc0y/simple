const retained = new Map();

export function handleUpload(payload, requestId, now = Date.now()) {
  if (!requestId || typeof payload !== "object" || payload === null) {
    return { status: 400 };
  }
  retained.set(requestId, { payload, deleteAfter: now + 86_400_000 });
  return { status: 202 };
}

export function health() {
  return { status: 200, body: "ok" };
}
