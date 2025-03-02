import { test, expect } from "@playwright/test";
test.beforeEach(async({page}) => {
    await page.goto('/');

});
test.describe('Form Layouts page', ()=> {
    test.describe.configure({retries:2})
    test.beforeEach(async({page}) => {
        await page.getByText('Forms').click();
        await page.getByText('Form Layouts').click();
    })

        test('Input Fields', async ({page}) => {

            const usingTheGridEmailInput = page.locator('nb-card', {hasText: "Using The Grid"}).getByRole('textbox', {name: "Email"})

            await usingTheGridEmailInput.fill('test@test.com')
            await usingTheGridEmailInput.clear()
            await usingTheGridEmailInput.pressSequentially('test2@test.com')

            const inputValue = await usingTheGridEmailInput.inputValue()
            expect(inputValue).toEqual('test2@test.com')

            await expect(usingTheGridEmailInput).toHaveValue("test2@test.com")
        })
        
        test('Boutons de sélection', async ({page}) => {

            const selectBouton = page.locator('nb-card', {hasText: "Using The Grid"});
            
            await selectBouton.getByLabel("Option 1").check({force: true});
            await selectBouton.getByRole("radio", {name:"Option 1"}).check({force: true});

            const radioStatus = await selectBouton.getByRole("radio", {name:"Option 1"}).isChecked()
            expect(radioStatus).toBeTruthy()

            await expect(selectBouton.getByRole("radio", {name:"Option 1"})).toBeChecked();

            await selectBouton.getByRole("radio", {name:"Option 2"}).check({force: true}); 
            expect(await selectBouton.getByRole("radio", {name:"Option 1"}).isChecked()).toBeFalsy
            expect(await selectBouton.getByRole("radio", {name:"Option 2"}).isChecked()).toBeTruthy
        })
})


test('checkboxes', async ({page}) => {
    await page.getByTitle("Modal & Overlays").click();
    await page.getByTitle('Toastr').click();

    await page.getByRole('checkbox', {name:"Hide on click"}).uncheck({force: true})
    await page.getByRole('checkbox', {name: "Prevent arising of duplicate toast"}).check({force: true});

    const allBoxes = page.getByRole('checkbox')
    for(const box of await allBoxes.all()){
        await box.uncheck({force: true})
        expect(await box.isChecked()).toBeFalsy();
    }
})

test('list and dropdown', async ({page}) => {

    const dropDownMenu = page.locator('ngx-header nb-select')
    await dropDownMenu.click()
    page.getByRole('list') // when the list has a UL tag
    page.getByRole('listitem') // when the list has LI tag

    const optionList = page.getByRole('list').locator('nb-option') //1ère approche
    const optionList1 = page.locator('nb-option-list nb-option') // 2ème approche (Localiser la liste)
    await expect(optionList1).toHaveText(["Light", "Dark", "Cosmic", "Corporate"])
    await optionList1.filter({hasText : "Cosmic"}).click() // on clique sur l'élément Cosmic de la liste

    //Assertion changement de couleur du BG
    const header = page.locator('nb-layout-header')
    await expect(header).toHaveCSS('background-color', 'rgb(50, 50, 89)')

    //Assertion sur un par un vérification des couleurs
    const colors = {
        "Light": "rgb(255, 255, 255)",
        "Dark": "rgb(34, 43, 69)",
        "Cosmic": "rgb(50, 50, 89)",
        "Corporate": "rgb(255, 255, 255)"
    };
    await dropDownMenu.click() // Cliquer sur le menu
         for (const color in colors) { // Parcourir les noms des couleurs dans l'objet `colors`
              await optionList1.filter({ hasText: color }).click() // Cliquer sur l'option correspondante au nom de la couleur
              await expect(header).toHaveCSS('background-color', colors[color]) // Vérifier que la couleur du fond du header correspond
              if(color != "Corporate") // Pour clore la boucle à la fin
                await dropDownMenu.click() // Rouvrir le menu pour la prochaine itération
    }
})

test('tooltips', async ({page}) => {
    await page.getByTitle("Modal & Overlays").click();
    await page.getByTitle('Tooltip').click();

    const toolTipCard = await page.locator('nb-card', {hasText:"Tooltip Placements"});
    await toolTipCard.getByRole('button', {name: "Top"}).hover()

    page.getByRole('tooltip') // if you have a role tooltip created
    const tooltip = await page.locator('nb-tooltip').textContent()
    expect(tooltip).toEqual('This is a tooltip')
});

test('dialog box', async ({page}) => {
    await page.getByTitle("Tables & Data").click();
    await page.getByTitle('Smart Table').click();

    page.on('dialog', dialog => {
        expect(dialog.message()).toEqual('Are you sure you want to delete?')
        dialog.accept()
    })

    await page.getByRole('table').locator('tr', {hasText: "mdo@gmail.com"}).locator('.nb-trash').click()
    //playwright à identifier la dialog box mais il a par défaut cancel la dialog box. On créer un listener avec page.on
    await expect(page.locator('table tr').first()).not.toHaveText('mdo@gmail.com')

})

test('Web Tables', async ({page}) => {
    await page.getByTitle("Tables & Data").click();
    await page.getByTitle('Smart Table').click();

    //1- Get the row by any text in this row
    const targetRow = page.getByRole('row', {name: "twitter@outlook.com"}) //On utilise name lorsqu'on a du texte dans le DOM
    await targetRow.locator('.nb-edit').click()
    // Le problème est lorsqu'on edit la ligne du tableau , le texte du DOM devient une propriété InputValue donc on localise par une autre propriété
    await page.locator('input-editor').getByPlaceholder('Age').clear()
    await page.locator('input-editor').getByPlaceholder('Age').fill('35')
    await page.locator('.nb-checkmark').click()

    //2- Get the row based on the value in the specific column
    await page.locator('.ng2-smart-pagination-nav').getByText('2').click()
    const targetRowById = page.getByRole('row', {name: "11"}).filter({has: page.locator('td').nth(1).getByText('11')})// Le filtre réduit le résultat en vérifiant que la 2ᵉ cellule (index nth(1)) contient le texte "11".
    await targetRowById.locator('.nb-edit').click()

    await page.locator('input-editor').getByPlaceholder('E-mail').clear()
    await page.locator('input-editor').getByPlaceholder('E-mail').fill('test@test.com')
    await page.locator('.nb-checkmark').click()
    await expect(targetRowById.locator('td').nth(5)).toHaveText('test@test.com') //Une fois la ligne cible identifiée, cela sélectionne la 6ᵉ cellule (nth(5)) de cette ligne. 
    //l'objectif est d'aller sur la page 2, filter la sélection par ID = 11 , cliquer sur edit , localiser l'Email et mettre test@test.com et
    // écrire une assertion

    //3 test filter of the table
    const ages = ["20", "30", "40", "200"]

    for(let age of ages){
    await page.locator('input-filter').getByPlaceholder('Age').clear()
    await page.locator('input-filter').getByPlaceholder('Age').fill(age)
    await page.waitForTimeout(500);
    const ageRows = page.locator('tbbody tr') // On cherche toutes les lignes du résultat

        for(let row of await ageRows.all()){ // On va parcourir avec row toutes les lignes du résultat
            const cellValue = await row.locator('td').last().textContent() // On localise la dernière crécupère le texte contenu dans cette derière cellule

            if(age == "200"){
                expect(await page.getByRole('table').textContent()).toContain('No data found')
            }else {
                expect(cellValue).toEqual(age) //À chaque itération, la variable age contient une seule valeur du tableau (par exemple, "20", "30", etc.
            }
        }
    }

})

test('Date Picker', async ({page}) => {

    // Accéder à la section "Forms" dans l'application
    await page.getByText('Forms').click();

    // Cliquer sur "Datepicker" pour ouvrir la page correspondante
    await page.getByText('Datepicker').click();

    // Localiser le champ d'entrée pour le calendrier
    const calendarInputField = page.getByPlaceholder('Form Picker');
    await calendarInputField.click(); // Ouvrir le calendrier

    // Calculer la date +7 jours (si aujourd'hui est le 7 janvier 2025)
    let date = new Date();
    date.setDate(date.getDate() + 7); // Date dans 7 jours, soit le 14 janvier 2025

    // Extraire les composants de la date pour l'utiliser dans la logique
    const expectedDate = date.getDate().toString(); // "14"
    const expectedMonthShot = date.toLocaleString('en-US', {month: 'short'}); // "Jan"
    const expectedMonthLong = date.toLocaleString('en-US', {month: 'long'}); // "January"
    const expectedYear = date.getFullYear(); // "2025"

    // Construire la date au format attendu
    const dateToAssert = `${expectedMonthShot} ${expectedDate}, ${expectedYear}`; // "Jan 14, 2025"

    // Obtenir le texte actuel du mois/année dans l'en-tête du calendrier
    let calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent(); // Ex. "January 2025"
    const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`; // "January 2025"

    // Naviguer dans le calendrier jusqu'à afficher le bon mois et la bonne année
    while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
        await page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click(); // Aller au mois suivant
        calendarMonthAndYear = await page.locator('nb-calendar-view-mode').textContent(); // Mettre à jour le texte affiché
    }

    // Sélectionner le jour attendu (ici, "14")
    await page.locator('[class="day-cell ng-star-inserted"]').getByText(expectedDate, {exact: true}).click();

    // Vérifier que la date sélectionnée correspond à celle attendue
    await expect(calendarInputField).toHaveValue(dateToAssert); // Valide que la valeur sélectionnée est "Jan 14, 2025"
});


test('sliders', async ({page}) => {
    //Update attribute
    const tempGauge = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger circle')
    await tempGauge.evaluate( node => {
        node.setAttribute('cx', '232.630')
        node.setAttribute('cy', '232.630')
    })
    await tempGauge.click()

// Mouse movement
        const tempBox = page.locator('[tabtitle="Temperature"] ngx-temperature-dragger')
        await tempBox.scrollIntoViewIfNeeded()

        const box = await tempBox.boundingBox()
        const x = box.x + box.width / 2
        const y = box.y + box.height / 2
        await page.mouse.move(x, y)
        await page.mouse.down()
        await page.mouse.move(x - 100, y)
        await page.mouse.move(x - 100, y + 100)
        await page.mouse.up()
        await expect(tempBox).toContainText('12')
    })






