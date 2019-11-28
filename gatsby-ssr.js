/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

/* eslint-disable react/prop-types */

import React from 'react'
import { GlobalStateProvider } from './src/lib/state'
import { AuthProvider } from './src/lib/services/authService'
import Layout from './src/components/Layout'

export const wrapRootElement = ({ element }) => {
  return (
    <GlobalStateProvider>
      <AuthProvider>{element}</AuthProvider>
    </GlobalStateProvider>
  )
}

export const wrapPageElement = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>
}
