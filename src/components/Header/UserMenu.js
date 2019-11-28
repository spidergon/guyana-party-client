import React from 'react'
import { navigate } from 'gatsby'
import PropTypes from 'prop-types'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
import { If } from '../addons'

const LogoutMenuItem = ({ signout, hide }) => (
  <MenuItem
    onClick={() => {
      hide()
      signout()
      navigate('/')
    }}
  >
    Déconnexion
  </MenuItem>
)

LogoutMenuItem.propTypes = {
  signout: PropTypes.func.isRequired,
  hide: PropTypes.func.isRequired
}

function UserMenu ({ anchor, hide, isOpen, pathname, user, signout }) {
  const goTo = to => {
    if (typeof hide === 'function') hide()
    navigate(to)
  }

  return (
    <If
      condition={!pathname.match('app')}
      otherwise={
        <Menu anchorEl={anchor} id='user-menu' onClose={hide} open={isOpen}>
          <MenuItem onClick={() => goTo('/')}>Accueil</MenuItem>
          <Divider />
          <LogoutMenuItem hide={hide} signout={signout} />
        </Menu>
      }
    >
      <Menu anchorEl={anchor} id='user-menu' onClose={hide} open={isOpen}>
        <MenuItem onClick={() => goTo('/app/profile')} title='Mon compte'>
          {`${user.name ? `${user.name} (${user.email})` : `${user.email}`}`}
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => goTo('/app')}>Tableau de bord</MenuItem>
        <If condition={!pathname.match(/^\/+$/)}>
          <MenuItem onClick={() => goTo('/')}>Accueil</MenuItem>
        </If>
        <Divider />
        <LogoutMenuItem hide={hide} signout={signout} />
      </Menu>
    </If>
  )
}

UserMenu.propTypes = {
  anchor: PropTypes.object,
  hide: PropTypes.func.isRequired,
  isOpen: PropTypes.bool,
  pathname: PropTypes.string.isRequired,
  user: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string.isRequired
  }),
  signout: PropTypes.func.isRequired
}

export default React.memo(UserMenu)
