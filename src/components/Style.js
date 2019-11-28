import { createGlobalStyle } from 'styled-components'

export const theme = {
  headerHeight: '44px',
  linkColor: '#0078a8',
  // black: 'rgb(72, 72, 72)',
  borderColor: 'rgba(151, 151, 151, 0.2)',
  black: '#000',
  gray: '#dadce0',
  xl: '1680px',
  lg: '1280px',
  md: '980px',
  sm: '736px',
  xs: '480px'
}

/** Global style for components */
export const Style = createGlobalStyle`
  a {
    text-decoration: none;
    color: ${props => props.theme.black};
  }
  .grid {
    display: -ms-grid;
    display: grid;
  }
  .flex {
    display: flex;
  }
  .center {
    text-align: center;
  }
  img.cover {
    object-fit: cover;
    width: 100%;
  }
  .text-wrap {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`
