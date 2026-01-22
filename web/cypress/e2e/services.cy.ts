it('visit services page and check each services', function () {
  // cy.login(process.env.NEXT_ID, process.env.NEXT_PW)

  // cy.wait(1000)
  cy.visit('/services')

  const services = ['GitHub', 'Discord', 'Spotify', 'OpenWeather', 'NASA', 'Gmail', 'TMDB']

  services.forEach((service) => {
    cy.contains(service).should('be.visible')
  })
})