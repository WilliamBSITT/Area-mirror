import React from 'react'
import { AreasDeletionDialog } from './areasDeletion'

describe('<AreasDeletionDialog />', () => {
  it('renders', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AreasDeletionDialog />)
  })
})