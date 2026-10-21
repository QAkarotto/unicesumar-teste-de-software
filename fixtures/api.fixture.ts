import { test as base } from '@playwright/test';
import { getAuthToken } from '../helpers/auth';

type APIFixtures = {
  authToken: string;
};

export const test = base.extend<APIFixtures>({
  authToken: async ({ request }, use) => {
    const token = await getAuthToken(request);
    await use(token);
  },
});

export { expect } from '@playwright/test';