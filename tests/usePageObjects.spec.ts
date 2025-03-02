import {test, expect} from "@playwright/test";
import {PageManager } from '../page-objects/pageManager';
import {faker} from '@faker-js/faker' 



    test.beforeEach(async({page}) => {
        await page.goto('/');

});

test('Navigate to form page', async ({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage(); // navigateTo() devient une méthode avec le pageManager
    await pm.navigateTo().datePickerPage();
    await pm.navigateTo().smartTablePage();
    await pm.navigateTo().toastrPage();
    await pm.navigateTo().tooltipPage();
})

test('Submit Using The Grid Form', async ({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().formLayoutsPage()
    await pm.onFormLayoutsPage().submitUsingTheGridFormWithCredentialsAndSelectOption("tom.pcheg@gmail.com", "Welcome1", "Option 1");
})

test('Submit Inline Form', async ({page}) => {
    const pm = new PageManager(page)
    const randomFullName = faker.person.fullName()
    const randomEmail = `${randomFullName.replace(' ', '')}${faker.number.int(1000)}@test.com` // 

    await pm.navigateTo().formLayoutsPage(); //Cela permet d'utiliser ses méthodes dans le test, comme formLayoutsPage() qui vous dirige vers la page du formulaire de mise en page.
    await pm.onFormLayoutsPage().submitInlineFormWithCredentials(randomFullName, randomEmail, false);
})

test('Date Picker Page', async ({page}) => {
    const pm = new PageManager(page)
    await pm.navigateTo().datePickerPage();
    await pm.onDatePickerPage().selectCommonDatePickerDateFromToday(5)
    await pm.onDatePickerPage().selectDatePickerWithRangeFromToday(10,15);
})
