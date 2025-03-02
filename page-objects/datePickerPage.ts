import { Page, expect } from "@playwright/test";

export class DatePickerPage {

    readonly page : Page

    constructor(page:Page) {
        this.page = page   
    }

    async selectCommonDatePickerDateFromToday(numberOfDaysFromToday: number){
        
        const calendarInputField = this.page.getByPlaceholder('Form Picker');
        await calendarInputField.click(); 
        const dateToAssert = await this.selectDateInTheCalendar(numberOfDaysFromToday)
        await expect(calendarInputField).toHaveValue(dateToAssert); // 
    };

    async selectDatePickerWithRangeFromToday(startDayFromToday: number, endDayFromToday: number){
        const calendarInputField = this.page.getByPlaceholder('Range Picker');
        await calendarInputField.click(); 
        const dateToAssertStart = await this.selectDateInTheCalendar(startDayFromToday)
        const dateToAssertEnd = await this.selectDateInTheCalendar(endDayFromToday)
        const dateToAssert = `${dateToAssertStart} - ${dateToAssertEnd}`; 
        await expect(calendarInputField).toHaveValue(dateToAssert); // 
    }

 // Afin d'éviter de dupliquer le code pour le test avec calendrier avec range et le common calendrier, on va créer une fonction private avec le code à l'intérieur 
 //Ce qui changera entre les deux ce sera les paramètres et l'assertion

    private async selectDateInTheCalendar(numberOfDaysFromToday: number){

        let date = new Date();
        date.setDate(date.getDate() + numberOfDaysFromToday); // Date actuelle + nombre de jours définit en paramètres par le user

        const expectedDate = date.getDate().toString(); 
        const expectedMonthShot = date.toLocaleString('en-US', {month: 'short'}); 
        const expectedMonthLong = date.toLocaleString('en-US', {month: 'long'}); 
        const expectedYear = date.getFullYear(); 

        const dateToAssert = `${expectedMonthShot} ${expectedDate}, ${expectedYear}`; 

        let calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent(); 
        const expectedMonthAndYear = `${expectedMonthLong} ${expectedYear}`; 

        while (!calendarMonthAndYear.includes(expectedMonthAndYear)) {
            await this.page.locator('nb-calendar-pageable-navigation [data-name="chevron-right"]').click(); 
            calendarMonthAndYear = await this.page.locator('nb-calendar-view-mode').textContent(); 
        }
        await this.page.locator('.day-cell.ng-star-inserted').getByText(expectedDate, {exact: true}).click();
        return dateToAssert // return permet de retourner la valeure à l'appelant

    }

}