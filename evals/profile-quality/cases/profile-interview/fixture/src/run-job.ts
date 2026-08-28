export async function runInvoiceJob(job, store, provider) {
  const result = await provider.send(job);
  await store.write(result);
}
