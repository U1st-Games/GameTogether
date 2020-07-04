describe('Should load checker game', () =>{
    it ('Visits the checker game page', ()=>{
        cy.visit('/')
        cy.get(':nth-child(2) > .MuiCardActions-root > .MuiButtonBase-root')
            .click()
        cy.url().should('include', '/checkers')
    })
})