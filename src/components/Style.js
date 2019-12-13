import { createGlobalStyle } from 'styled-components'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

export const theme = {
  headerHeight: '44px',
  linkColor: '#0078a8',
  // black: 'rgb(72, 72, 72)',
  borderColor: 'rgba(151, 151, 151, 0.2)',
  errorColor: 'rgb(248, 99, 73)',
  errorBorderColor: 'rgb(248, 187, 73)',
  errorBgColor: 'rgb(254, 245, 231)',
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

  form {
    margin: 0;
    font-size: 15px;
    input {
      position: relative;
      width: 100%;
      height: 50px;
      background-color: transparent;
      padding: 0 15px;
      border: 1px solid rgb(206, 210, 217);
      border-radius: 4px;
      font-size: 16px;
      margin-bottom: 1rem;
    }
    button {
      margin-top: 1.5rem;
    }
    .error {
      label {
        color: rgb(248, 99, 73);
        font-weight: 600;
      }
      input {
        background-color: rgb(254, 245, 231);
        border-color: rgb(248, 187, 73);
      }
    }
  }

  .desc-content {
    h2,
    h3,
    h4 {
      margin-top: 1rem;
    }
    p {
      margin: 0.5rem 0;
    }
  }
`
