describe('Happy paths for Airbrb', () => {
  const name = 'sampleName';
  const email = 'sampleEmail@gmail.com';
  const password = 'samplePassword';

  beforeEach(() => {
    cy.visit('localhost:3000/');

    // We should register and make sure the account is active
    // Registering and logging out (database is constant, so it will deny future registeration attempts)
    cy.get('button').contains('Register')
      .click();
    cy.get('input[type="email"]')
      .focus()
      .type(email);
    cy.get('input[type="name"]')
      .focus()
      .type(name);
    cy.get('input[type="password"]')
      .focus()
      .type(password);
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click();
    cy.reload();
  });

  it('Happy path of a user creating, registering and booking a listing', () => {
    // Login
    cy.get('button').contains('Login')
      .click();
    cy.get('input[type="email"]')
      .focus()
      .type(email);
    cy.get('input[type="password"]')
      .focus()
      .type(password);
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click();

    // Create new listing successfully
    cy.get('button[aria-label="toggle-menu-button"]')
      .click();
    cy.get('a[aria-label="link-to-hosted"]')
      .click();
    cy.get('button[aria-label="create-listing-button"]')
      .click();

    // Update thumbnail and title

    // Publish listing

    // Logout

    // Register as new user

    // Make booking successfully


  });
});