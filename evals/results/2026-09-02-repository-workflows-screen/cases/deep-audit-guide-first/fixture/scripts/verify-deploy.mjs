const response = await fetch(`${process.env.SERVICE_URL}/health`);
if (!response.ok) throw new Error(`health failed: ${response.status}`);
console.log("deployment verified");
