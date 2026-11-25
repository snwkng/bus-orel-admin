describe('Авторизация', () => {
	it('редиректит неавторизованного пользователя на /login', () => {
		cy.visit('/');
		cy.url().should('include', '/login');
	});

	it('показывает форму входа', () => {
		cy.visit('/login');
		cy.contains('h1', 'Вход в панель управления');
		cy.get('input#username').should('be.visible');
		cy.get('input#password').should('be.visible');
		cy.contains('button', 'Войти').should('be.visible');
	});
});
