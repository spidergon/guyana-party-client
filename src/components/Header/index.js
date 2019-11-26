import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Logo from './Logo'
import LinkMenu from './LinkMenu'
import { If, Link } from '../addons'

const Wrapper = styled.header`
  position: sticky;
  top: 0;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  padding: 0 24px 0 12px;
  width: 100%;
  height: ${({ theme }) => theme.headerHeight};
  background-color: rgba(255, 255, 255, 0.3);
  transition: background-color 0.4s ease !important;
  z-index: 10;
  border-bottom: 1px solid rgba(151, 151, 151, 0.2) !important;
  &.opaque {
    background-color: #fff;
  }
  nav {
    &.logo {
      a {
        display: block;
        .gatsby-image-wrapper {
          vertical-align: middle;
          border-radius: 50%;
        }
      }
    }
    &.navs {
      justify-self: end;
      input {
        width: 120px;
        margin-right: 16px;
        padding-left: 40px;
        border-color: transparent;
        border-radius: 4px;
        background-color: rgb(239, 239, 239);
        transition: width 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
        &:focus {
          width: 200px;
        }
      }
    }
  }
`

function Header ({ pathname }) {
  const [mainClass, setMainClass] = useState('')
  const [scrollDown, setScrollDown] = useState(false)

  useEffect(() => scrollEffect(pathname, setScrollDown), [pathname])

  useEffect(() => opaqueEffect(pathname, scrollDown, setMainClass), [
    pathname,
    scrollDown
  ])

  return (
    <Wrapper className={`grid ${mainClass}`}>
      <nav className='logo'>
        <Link className='nav' to='/'>
          <Logo />
        </Link>
      </nav>
      <nav className='navs'>
        <If condition={pathname.match(/^\/+$/)}>
          <input aria-label='filtrer' placeholder='Filtrer...' type='search' />
        </If>
      </nav>
      <nav className='profile flex'>
        <If condition={!pathname.match('connexion')}>
          <LinkMenu name='Connexion' to='/connexion' />
        </If>
      </nav>
    </Wrapper>
  )
}

function scrollEffect (pathname, setScrollDown) {
  if (pathname.match(/^\/+$/)) {
    let down = false
    window.addEventListener(
      'scroll',
      () => {
        if (!down && window.scrollY > 0) {
          down = true
          setScrollDown(true)
        } else if (down && window.scrollY === 0) {
          down = false
          setScrollDown(false)
        }
      },
      { passive: true }
    )
  }
}

function opaqueEffect (pathname, scrollDown, setMainClass) {
  const opaque = !pathname.match(/^\/+$/) || scrollDown ? 'opaque' : ''
  const app = pathname.match('app') ? ' app' : ''
  setMainClass(opaque + app)
}

Header.propTypes = {
  pathname: PropTypes.string.isRequired
}

export default Header
