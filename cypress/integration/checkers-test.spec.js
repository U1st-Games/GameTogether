describe('Should load checker game', () =>{
    it ('Visits the checker game page', ()=>{
        let canvasBlank = undefined;

        cy.visit('/')
        cy.get(':nth-child(2) > .MuiCardActions-root > .MuiButtonBase-root')
            .click()

        cy.wait(1000)

        getIframeBody().find('canvas',{timeout: 5000}).then(($canvas)=> {
            canvasBlank =  isCanvasBlank($canvas[0]);
            assert.isFalse(canvasBlank, 'canvas loaded with visuals')
         })

        cy.url().should('include', '/checkers')
    })
})

const getIframeBody = () => {
    // get the document
    return cy
        .get('#gameIframe')
        // automatically retries until content and body is loaded even when they are updated
        .its('0.contentDocument.body')
        .should('not.be.empty')
        .should('be.visible')
        // wraps "body" DOM element to allow
        // chaining more Cypress commands, like ".find(...)"
        .then(cy.wrap)
}

const isCanvasBlank = (canvas) => {
    return !canvas.getContext('2d')
        .getImageData(0, 0, canvas.width, canvas.height).data
        .some(channel => channel !== 0);
}