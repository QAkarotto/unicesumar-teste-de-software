
import { type Locator, type Page } from '@playwright/test';

export async function preencherCampo(
    page: Page,
    testId: string,
    seletorAlternativo: Locator,
    valor: string,
) {
    const campoTestId = page.getByTestId(testId);

    if (await campoTestId.count() > 0) {
        await campoTestId.fill(valor);
    } else {
        await seletorAlternativo.fill(valor);
    }
}
