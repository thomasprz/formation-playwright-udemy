import { Page } from '@playwright/test'
import { HelperBase } from './helperBase'

// Vous définissez la classe NavigationPage, qui regroupe les actions spécifiques à une section du site web.
export class NavigationPage extends HelperBase { 
    
    // Le constructeur initialise la classe avec une instance de Page et l'associe à la propriété `this.page`.
    constructor(page: Page) { 
        super(page)
    }

    // Navigue à la page "Form Layouts".
    async formLayoutsPage() { 
        await this.selectGroupMenuItem('Forms') // Ouvre le groupe "Forms" si nécessaire.
        await this.page.getByText('Form Layouts').click() // Clic sur l'élément "Form Layouts".
        await this.waitForNumberOfSeconds(2)
    }

    // Navigue à la page "Datepicker".
    async datePickerPage() { 
        await this.selectGroupMenuItem('Forms') // Ouvre le groupe "Forms" si nécessaire.
        await this.page.waitForTimeout(1000) // Attend une seconde (facultatif, pour éviter des erreurs de timing).
        await this.page.getByText('Datepicker').click() // Clic sur l'élément "Datepicker".
    }

    // Navigue à la page "Smart Table".
    async smartTablePage() { 
        await this.selectGroupMenuItem('Tables & Data') // Ouvre le groupe "Tables & Data" si nécessaire.
        await this.page.getByText('Smart Table').click() // Clic sur l'élément "Smart Table".
    }

    // Navigue à la page "Toastr".
    async toastrPage() { 
        await this.selectGroupMenuItem('Modal & Overlays') // Ouvre le groupe "Modal & Overlays" si nécessaire.
        await this.page.getByText('Toastr').click() // Clic sur l'élément "Toastr".
    }

    // Navigue à la page "Tooltip".
    async tooltipPage() { 
        await this.selectGroupMenuItem('Modal & Overlays') // Ouvre le groupe "Modal & Overlays" si nécessaire.
        await this.page.getByTitle('Tooltip').click() // Clic sur l'élément "Tooltip".
    }

    // Méthode privée pour sélectionner un groupe de menu en vérifiant son état.
    private async selectGroupMenuItem(groupItemTitle: string) {
        const groupMenuItem = this.page.getByTitle(groupItemTitle) // Localise le groupe par son attribut "title".
        const expandedState = await groupMenuItem.getAttribute('aria-expanded') // Vérifie si le groupe est déjà ouvert.
        if (expandedState == "false") // Si fermé...
            await groupMenuItem.click() // ... clic pour ouvrir.
    }
}