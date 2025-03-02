import {test,expect} from '@playwright/test'


test('Drag and Drop', async ({page}) => {
    await page.goto(process.env.URL)
    await page.getByRole('button', {name: 'Consent'});
    const frame = page.frameLocator('[rel-title="Photo Manager"] iframe') // rel-title et attribut iframe
    await frame.locator('li', {hasText: "High Tatras 2"}).dragTo(frame.locator('#trash'));// On ne peut pas cliquer car il est contenu dans un iframe. donc on créer un const frame

    //More precise control
    await frame.locator('li', { hasText: "High Tatras 4" }).hover()
    await page.mouse.down()
    await frame.locator('#trash').hover()
    await page.mouse.up()

    //assertions
    await expect(frame.locator('#trash li h5')).toHaveText(["High Tatras 2", "High Tatras 4"])
})