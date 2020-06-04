context('Actions', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/manage/#/login')
    })
    it('测试登录', () => {
        // https://on.cypress.io/type
        cy.get('body > div.app-wrapper > div > div > div > div > div.content-wrapper > div > form > div > div:nth-child(1) > div > div > div > div > div > input')
          .type('gtwj')
        cy.get('body > div.app-wrapper > div > div > div > div > div.content-wrapper > div > form > div > div:nth-child(2) > div > div > div > div > div > input')
          // Ignore error checking prior to type
          // like whether the input is visible or disabled
          .type("fengxue")
        cy.get('body > div.app-wrapper > div > div > div > div > div.content-wrapper > div > form > div > div:nth-child(3) > div > div > div > div.form-line > div > input')
        .type("113141")
        cy.get("body > div.app-wrapper > div > div > div > div > div.content-wrapper > div > form > div > div:nth-child(5) > div > div > div > label")
        .click()
        cy.get("body > div.app-wrapper > div > div > div > div > div.content-wrapper > div > form > div > div:nth-child(6) > button")
        .click()
      })
})