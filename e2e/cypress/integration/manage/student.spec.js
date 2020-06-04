context('Actions', () => {
   require("./login.spec.js");
    beforeEach(() => {
        cy.visit('http://localhost:8080/manage/#/studentList')
    })
    it('新增学员', () => {
        // https://on.cypress.io/type
        cy.get('body > div.app-wrapper > div > div > section > div.app-wrap > div.content-wrap > div > div > div > div > div:nth-child(1) > div > div > div.over_hide > div > button:nth-child(1)')
          .click()
        cy.get('.body > div.app-wrapper > div > div > section > div.app-wrap > div.content-wrap > div.content_table > div > div > form > div:nth-child(2) > div.el-col.el-col-8 > div.campusbranchbar > form > div.el-form-item.is-success.is-required.el-form-item--medium > div > div > div > div > div').select('河北省')
      })
})