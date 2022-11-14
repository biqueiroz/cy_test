const user = {
    firstName: 'Ayla Larissa',
    lastName: 'Fogaça',
    email: 'aylalarissafogaca@roche.com',
    password: 'Abc1234#',
    phoneNumber: '8327068026',
    address: {
        country: 'BR',
        streetAddress: 'Rua Catolé do Rocha, 830',
        zipCode: '58302085',
        city: 'Santa Rita',
        state: '1494',
    }
}

const product = {
    url: '/carina-cardigan.html',
    color: 'Peach',
    size: 'M',
    quantity: 2,
    name: 'Carina Cardigan',
}

describe('Fluxo de compra completo', () => {
    it('should register a user', () => {
        cy.visit('/');
        cy.get('[aria-label="Toggle My Account Menu"]').click({ force: true });
        cy.contains('Create an Account').click({ force: true });
        cy.contains('Create an Account').parent('form').get('#firstName').type(user.firstName);
        cy.contains('Create an Account').parent('form').get('#lastName').type(user.lastName);
        cy.contains('Create an Account').parent('form').get('#Email').type(user.email);
        cy.contains('Create an Account').parent('form').get('#Password').type(user.password);
        cy.contains('Create an Account').parent('form').submit();
        cy.get('[aria-label="Toggle My Account Menu"]').contains('Hi, ' + user.firstName);
    })

    it('should login', () => {
        cy.visit('/');
        cy.get('[aria-label="Toggle My Account Menu"]').click({ force: true });
        cy.contains('Sign-in to Your Account').siblings('form').first().get('#email').type(user.email);
        cy.contains('Sign-in to Your Account').siblings('form').first().get('#Password').type(user.password);
        cy.contains('Sign-in to Your Account').siblings('form').first().submit();
        cy.get('[aria-label="Toggle My Account Menu"]').contains('Hi, ' + user.firstName);
    })

    it('should add product to cart', () => {
        cy.visit(product.url);
        cy.get('[title="' + product.color + '"]').click();
        cy.get('[title="' + product.size + '"]').click();
        cy.get('[name="quantity"]').clear().type(product.quantity);
        cy.contains('button', 'Add to Cart').click();
        cy.get('*[class^="cartTrigger"]').first().click();
        cy.contains(product.quantity + ' Items');
        cy.contains(product.name);
    })

    it('should buy a product', () => {
        // Adiciona produto ao carrinho
        cy.visit(product.url);
        cy.get('[title="' + product.color + '"]').click();
        cy.get('[title="' + product.size + '"]').click();
        cy.get('[name="quantity"]').clear().type(product.quantity);
        cy.contains('button', 'Add to Cart').click();
        cy.get('*[class^="cartTrigger"]').first().click();
        cy.contains(product.quantity + ' Items');
        cy.contains(product.name);

        // Informação de envio
        cy.contains('button', 'CHECKOUT').click();
        cy.get('*[class^="guestForm"]').get('#email').type(user.email);
        cy.get('*[class^="guestForm"]').get('#firstname').type(user.firstName);
        cy.get('*[class^="guestForm"]').get('#lastname').type(user.lastName);
        cy.get('*[class^="guestForm"]').get('[name="country"]').select(user.address.country, { force: true });
        cy.get('*[class^="guestForm"]').get('#street0').type(user.address.streetAddress);
        cy.get('*[class^="guestForm"]').get('#city').type(user.address.city);
        cy.get('*[class^="guestForm"]').get('[name="region[region_id]"]').select(user.address.state, { force: true });
        cy.get('*[class^="guestForm"]').get('[name="postcode"]').type(user.address.zipCode);
        cy.get('*[class^="guestForm"]').get('#telephone').type(user.phoneNumber);
        cy.get('*[class^="guestForm"]').contains('button', 'Continue to Shipping Method').click();

        // Forma de envio

        cy.get('*[class^="shippingMethod"]').get('[type="radio"]').first().check();
        cy.get('*[class^="shippingMethod"]').contains('button', 'Continue to Payment Information').click();

        // Pagamento
        cy.get('*[class^="paymentMethods"]').get('[type="radio"]').check('checkmo');
        cy.contains('button', 'Review Order').click();

        // Finaliza pagamento
        cy.contains('button', 'Place Order').click();
        cy.contains('Thank you for your order!').should('be.visible')
    })

})