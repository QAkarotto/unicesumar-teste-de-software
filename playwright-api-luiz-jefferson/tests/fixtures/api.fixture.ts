import { test as base } from '@playwright/test';
import { createAuthenticatedUser } from '../helpers/auth';
import { deleteUser } from '../helpers/api';

type ApiFixtures = { admin: Awaited<ReturnType<typeof createAuthenticatedUser>> };
export const test = base.extend<ApiFixtures>({
  admin: async ({ request }, use) => {
    const admin = await createAuthenticatedUser(request, true);
    try { await use(admin); } finally { await deleteUser(request, admin.id); }
  },
});
export { expect } from '@playwright/test';
