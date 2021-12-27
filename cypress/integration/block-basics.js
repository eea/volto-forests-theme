import { setupBeforeEach, tearDownAfterEach } from '../support';

describe('Blocks Tests', () => {
  beforeEach(setupBeforeEach);
  afterEach(tearDownAfterEach);

  it('Add Block: Empty', () => {
    // Change page title
    cy.get('.documentFirstHeading > .public-DraftStyleDefault-block')
      .clear()
      .type('My Add-on Page')
      .get('.documentFirstHeading span[data-text]')
      .contains('My Add-on Page');

    cy.get('.documentFirstHeading > .public-DraftStyleDefault-block').type(
      '{enter}',
    );

    // Add block
    cy.get('.ui.basic.icon.button.block-add-button').first().click();
    //cy.get('.blocks-chooser .title').contains('Common Blocks').click();
    cy.get('.content.active.common_blocks .button.image')
      .contains('Image')
      .click();

    // Save
    cy.get('#toolbar-save').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/cypress/my-page');

    // then the page view should contain our changes
    cy.contains('My Page');
    cy.get('.block.image');

    // header
    cy.get('.header-wrapper');
    cy.get('.header-image-wrapper').contains('My Add-on Page');

    // footer
    cy.get('.footerWrapper .footerLinkBar').contains('About us').click();

    // navigation
    cy.get('.navigation').contains('Countries').click();
    cy.get('.menu.transition.Countries--section').contains('Austria', {force:true}).click({force:true});
    cy.get('.header-image-wrapper').contains('Austria');


    // search
    cy.get('.navigation .search-widget').first().click();
    cy.get('.navigation .search-widget form').type('News {enter}');

    //news 
    cy.get('.ui.container').contains("News");
    cy.get('.highlight').contains('News').first().click();
    cy.get('.expanded.article-body');
    cy.get('.article-header');
    cy.get('.article-content');
    cy.get('.format-text').contains('Published');

    // check unauthorized
    cy.visit('/logout');
    cy.visit('/edit');
    cy.get('.header-image-wrapper').contains('Unauthorized');

    // check not found
    cy.visit('/something');
    cy.get('.header-image-wrapper').contains('This page does not seem to exist');

    // loader
    cy.get('.header .logo a').click();
    cy.get('.header-wrapper .ui.loader');
  });
});
