describe('Logowanie nauczyciela', () => {
  it('Przejscie do aplikacji', () => {
    cy.visit('http://54.37.232.57/')
  })
  it('Wprowadzenie adresu e-mail', () => {
    cy.get('input').eq(0).click().type('jan@uwm.pl')
  })
  it('Wprowadzenie hasła', () => {
    cy.get('input').eq(1).click().type('jan')
  })
  it('Zatwierdzenie formularza', () => {
    cy.get('button').click()
  })
  it('Sprawdzenie czy nauczyciel został zalogowany', () => {
    cy.contains('jan@uwm.pl')
  })
})

describe('Test nawigacji', () => {
  it('Przejście do podstrony: testy', () => {
    cy.get('div').contains('Testy').click()
  })
  it('Przejście do podstrony: studenci', () => {
    cy.get('div').contains('Studenci').click()
  })
  it('Przejście do podstrony: pytania', () => {
    cy.get('div').contains('Pytania').click()
  })
  it('Przejście do podstrony: wyniki', () => {
    cy.get('div').contains('Wyniki').click()
  })
  it('Przejście do podstrony: statystyki', () => {
    cy.get('div').contains('Statystyki').click()
  })
  it('Przejście do podstrony: dziennik interakcji', () => {
    cy.get('div').contains('Dziennik interakcji').click()
  })
  it('Przejście do podstrony: w trakcie wypełniania', () => {
    cy.get('div').contains('W trakcie wypełniania').click()
  })
})

describe('Testowanie podstrony: testy', () => {
  it('Przejscie do testów', () => {
    cy.get('div').contains('Testy').click()
  })
  it('Tworzenie testu', () => {
    cy.get('button').contains('Stworz nowy test').click()
    cy.get('input').eq(0).click().type('cypress test')
    cy.get('input').eq(1).click().type('4')
    cy.get('input').eq(2).click().type('2022-11-09T23:00')
    cy.get('input').eq(3).click().type('2022-11-09T23:30')
    cy.get('button').contains('Zapisz').click()
    cy.contains('cypress test')
  })
})

describe('Testowanie podstrony: studenci', () => {
  it('Przejscie do studentów', () => {
    cy.get('div').contains('Studenci').click()
  })
  it('Wybranie testu', () => {
    cy.get('select').select('cypress test')
  })
  it('Tworzenie studenta', () => {
    cy.get('button').contains('Dodaj studenta').click()
    cy.get('input').eq(0).click().type('cypressUser')
    cy.get('input').eq(1).click().type('cypressPassword')
    cy.get('button').contains('Zapisz').click()
    cy.contains('cypressUser')
  })
})

describe('Testowanie podstrony: pytania', () => {
  it('Przejscie do pytań', () => {
    cy.get('div').contains('Pytania').click()
  })
  it('Wybranie testu', () => {
    cy.get('select').select('cypress test')
  })
  it('Tworzenie pytania', () => {
    cy.get('button').contains('Dodaj pytanie').click()
    cy.get('input').eq(0).click().type('cypress pytanie')
    cy.get('button').contains('Zapisz').click()
    cy.contains('cypress pytanie')
  })
  it('Dodawanie odpowiedzi niepoprawnej', () => {
    cy.get('button').contains('Dodaj odpowiedź').click()
    cy.get('input').eq(0).click().type('cypress odpowiedź niepoprawna')
    cy.get('button').contains('Zapisz').click()
    cy.contains('cypress odpowiedź niepoprawna')
  })
  it('Dodawanie odpowiedzi poprawnej', () => {
    cy.get('button').contains('Dodaj odpowiedź').click()
    cy.get('input').eq(0).click().type('cypress odpowiedź poprawna')
    cy.get('input').eq(1).click()
    cy.get('button').contains('Zapisz').click()
    cy.contains('cypress odpowiedź poprawna')
  })
})

describe('Czyszczenie danych po testach', () => {
  it('Przejscie do testów', () => {
    cy.get('div').contains('Testy').click()
  })
  it('Usuwanie testu', () => {
    cy.get('tr').contains('cypress test').parent().find('button').contains('Usuń').click()
    cy.get('button').contains('Usuń').click()
    cy.get('button').contains('cypress test').should('not.exist')
  })
})

describe('wylogowywanie', () => {
  it('czy wylogowalo', () => {
    cy.get('div').contains('Wyloguj się').click()
    cy.contains('Zaloguj się')
  })
})

export { }
