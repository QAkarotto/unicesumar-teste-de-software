
import { test as base, expect } from '@playwright/test';
import { criarUsuarioAutenticado } from '../helpers/auth';

type Fixtures = {
    usuarioAdmin: Awaited<
        ReturnType<typeof criarUsuarioAutenticado>
    >;
};

export const test = base.extend<Fixtures>({
    usuarioAdmin: async ({ request }, use) => {
        const admin = await criarUsuarioAutenticado(request);

        try {
            await use(admin);
        } finally {
            await request.delete(`/usuarios/${admin.usuarioId}`);
        }
    },
});

export { expect };
