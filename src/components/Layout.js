import React from 'react'
import PropTypes from 'prop-types'
import { ThemeProvider } from 'styled-components'
import { theme, Style } from './Style'
import Header from './Header'
import '../assets/css/layout.css'
import '../lib/cookieconsent'

const Layout = ({ children, location: { pathname } }) => (
  <ThemeProvider theme={theme}>
    <>
      <Style />
      <Header pathname={pathname} />
      <main>{children}</main>
    </>
  </ThemeProvider>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
  location: PropTypes.object.isRequired
}

export default Layout
