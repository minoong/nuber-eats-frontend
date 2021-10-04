import { render, waitFor } from '../../test-utils'
import React from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter as Router } from 'react-router-dom'
import NotFound from '../errors/404'

describe('<NotFound />', () => {
 it('renders OK', async () => {
  render(<NotFound />)

  await waitFor(() => {
   expect(document.title).toBe('Not Found | Nuber Eats')
  })
 })
})
