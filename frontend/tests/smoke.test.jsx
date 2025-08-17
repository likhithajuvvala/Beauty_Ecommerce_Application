import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import React from 'react'
import App from '../src/pages/App.jsx'

describe('App', () => {
  it('renders title', () => {
    render(<App />)
    expect(screen.getByText(/Beauty Shop/)).toBeTruthy()
  })
})
