// BharatQuest – Mock Cloud Sync
// Per TDD §9: fake sync server — local setTimeout only

export async function mockCloudSync(): Promise<"success"> {
  return new Promise<"success">((resolve) => {
    setTimeout(() => resolve("success"), 2400);
  });
}
