import React from 'react'
import AreasActionSelect from './areasActionSelect'

describe('<AreasActionSelect />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AreasActionSelect />)
  })
})