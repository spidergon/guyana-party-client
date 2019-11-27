import React from 'react'
import { navigate } from 'gatsby'
import PropTypes from 'prop-types'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
import { setTab } from '../../lib/state'

const LogoutMenuItem = ({ logout }) => (
  <MenuItem
    className='logout'
    onClick={() => {
      logout()
      navigate('/')
    }}
  >
    Déconnexion
  </MenuItem>
)

LogoutMenuItem.propTypes = {
  logout: PropTypes.func.isRequired
}

function UserMenu ({ anchor, hide, isOpen, pathname, user }) {
  const goTo = (to, tab) => {
    if (typeof hide === 'function') hide()
    if (typeof tab === 'number') setTab(tab)
    navigate(to)
  }

  return (
    <>
      {(!pathname.match('dashboard') && (
        <Menu anchorEl={anchor} id='user-menu' onClose={hide} open={isOpen}>
          <MenuItem onClick={() => goTo('/dashboard', 1)} title='Mon compte'>
            {`${
              user.displayName
                ? `${user.displayName} (${user.email})`
                : `${user.email}`
            }`}
          </MenuItem>
          <Divider />
          {!pathname.match(/^\/+$/) && (
            <MenuItem onClick={() => goTo('/')}>Accueil</MenuItem>
          )}
          {!pathname.match('exploration') && (
            <MenuItem onClick={() => goTo('/exploration')}>
              Explorer la carte
            </MenuItem>
          )}
          <MenuItem onClick={() => goTo('/dashboard', 0)}>Mes Favoris</MenuItem>
          <Divider />
          <LogoutMenuItem logout={user.logout} />
        </Menu>
      )) || (
        <Menu anchorEl={anchor} id='user-menu' onClose={hide} open={isOpen}>
          <MenuItem onClick={() => goTo('/')}>Accueil</MenuItem>
          <MenuItem onClick={() => goTo('/exploration')}>
            Explorer la carte
          </MenuItem>
          <Divider />
          <LogoutMenuItem logout={user.logout} />
        </Menu>
      )}
    </>
  )
}

UserMenu.propTypes = {
  anchor: PropTypes.object,
  hide: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  pathname: PropTypes.string.isRequired,
  user: PropTypes.shape({
    displayName: PropTypes.string,
    email: PropTypes.string.isRequired,
    logout: PropTypes.func.isRequired
  })
}

export default UserMenu
