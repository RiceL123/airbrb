import 'cypress-plugin-tab';

describe('Happy paths for Airbrb', () => {
  // The mian user is meant to interact with listings as a host
  const name = 'sampleName';
  const email = 'sampleEmail@gmail.com';
  const password = 'samplePassword';

  // The dummy user is meant to interact with listings as a client
  const nameDummy = 'dummyName';
  const emailDummy = 'dummyEmail@gmail.com';
  const passwordDummy = 'dummyPassword';

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

    cy.get('button').contains('Register')
      .click();
    cy.get('input[type="email"]')
      .focus()
      .type(emailDummy);
    cy.get('input[type="name"]')
      .focus()
      .type(nameDummy);
    cy.get('input[type="password"]')
      .focus()
      .type(passwordDummy);
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
    const listingName = "Room 101";
    const addressStreet = "Burwood Road";
    const addressCity = "Sydney";
    const addressState = "NSW";
    const price = "100";
    const numBathrooms = "3";

    cy.get('button[aria-label="toggle-menu-button"]')
      .click();
    cy.get('a[aria-label="link-to-hosted"]')
      .click();
    cy.get('button[aria-label="create-listing-button"]')
      .click();
    cy.get('input[name="title"]')
      .focus()
      .type(listingName);
    cy.get('input[name="street"]')
      .focus()
      .type(addressStreet);
    cy.get('input[name="city"]')
      .focus()
      .type(addressCity);
    cy.get('input[name="state"]')
      .focus()
      .type(addressState);
    cy.get('input[name="price"]')
      .focus()
      .type('{backspace}')
      .type(price);
    cy.get('input[name="numberBathrooms"]')
      .focus()
      .type('{backspace}')
      .type(numBathrooms);
    cy.get('button[aria-label="create-listing-button"]')
      .click();

    // Update title
    cy.get('button').contains('Edit / Publish')
      .click();
    cy.get('input[name="title"]')
      .focus()
      .type('New Room!');
    cy.get('button').contains('Submit')
      .click();

    // Publish listing
    cy.get('input[inputmode="text"]').eq(0)
      .click()
      .type('11012023')
      .click()
      .tab()
      .type('11092023');
    cy.get('button').contains('Publish!')
      .click();

    // Logout as host and login as client
    cy.reload();
    cy.get('button').contains('Login')
      .click();
    cy.get('input[type="email"]')
      .focus()
      .type(emailDummy);
    cy.get('input[type="password"]')
      .focus()
      .type(passwordDummy);
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click();

    // Make booking successfully
    cy.get('a')
      .filter((index, element) => element.href.includes('/selectedListing/')).eq(0)
      .click();
    cy.get('input[inputmode="text"]').eq(0)
      .click()
      .type('11012023')
      .click()
      .tab()
      .type('11092023');
    cy.get('button').contains('Send in booking')
      .click();
    cy.reload();
  });

  it('Happy path of a user creating multiple listings and using the search filters', () => {
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
    const listingName = "Room 101";
    const addressStreet = "Burwood Road";
    const addressCity = "Sydney";
    const addressState = "NSW";
    const price = "100";
    const numBathrooms = "3";

    cy.get('button[aria-label="toggle-menu-button"]')
      .click();
    cy.get('a[aria-label="link-to-hosted"]')
      .click();
    
    // Create Room
    cy.get('button[aria-label="create-listing-button"]')
      .click();
    cy.get('input[name="title"]')
      .focus()  
      .type(listingName);
    cy.get('input[name="street"]')
      .focus()
      .type(addressStreet);
    cy.get('input[name="city"]')
      .focus()
      .type(addressCity);
    cy.get('input[name="state"]')
      .focus()
      .type(addressState);
    cy.get('input[name="price"]')
      .focus()
      .type('{backspace}')
      .type(price);
    cy.get('input[name="numberBathrooms"]')
      .focus()
      .type('{backspace}')
      .type(numBathrooms);
    cy.get('button[aria-label="create-listing-button"]')
      .click();
    
    // Publish listing 
    cy.get('button[aria-label="toggle-menu-button"]')
      .click();
    cy.get('a[aria-label="link-to-hosted"]')
      .click();
    cy.get('button').contains('Edit / Publish').eq(0)
      .click();

    // Publish listing
    cy.get('input[inputmode="text"]').eq(0)
      .click()
      .type('10012023')
      .click()
      .tab()
      .tab()
      .type('11092023');
    cy.get('button').contains('Publish!')
      .click();
    cy.get('button').contains('Submit')
      .click();

    // Login as client
    cy.reload();
    cy.get('button').contains('Login')
      .click();
    cy.get('input[type="email"]')
      .focus()
      .type(emailDummy);
    cy.get('input[type="password"]')
      .focus()
      .type(passwordDummy);
    cy.get('button[type="submit"]')
      .should('be.visible')
      .click();
    
    // Use search bar
    cy.get('h6').contains(listingName)
      .should('be.visible');

    cy.get('input[type="text"]')
      .focus()
      .type('blahblah');
    cy.get('button').contains('Search')
      .click();
    
    cy.get('h6').contains(listingName)
      .should('not.exist');
  });
});