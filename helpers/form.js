
async function preencherCampo(page, testId, valor) {
const campo = page.getByTestId(testId);

    await campo.waitFor({
    state: 'visible',
    });

    await campo.fill(String(valor));
}

async function clicarElemento(page, testId) {
const elemento = page.getByTestId(testId);

    await elemento.waitFor({
    state: 'visible',
    });

    await elemento.click();
}

module.exports = {
    preencherCampo,
    clicarElemento,
};
