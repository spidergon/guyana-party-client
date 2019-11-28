import React from 'react'
import { navigate } from 'gatsby'
import PropTypes from 'prop-types'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'
import { If } from '../addons'

function UserMenu ({ anchor, hide, isOpen, pathname, user, signout }) {
  const goTo = to => {
    if (typeof hide === 'function') hide()
    navigate(to)
  }

  return (
    <Menu anchorEl={anchor} id='user-menu' onClose={hide} open={isOpen}>
      <If condition={!pathname.match(/^\/+$/)}>
        <MenuItem onClick={() => goTo('/')}>Accueil</MenuItem>
        <Divider />
      </If>
      <If condition={!pathname.match('app')}>
        <MenuItem onClick={() => goTo('/app')}>Tableau de bord</MenuItem>
      </If>
      <MenuItem onClick={() => goTo('/app/profile')}>Mon compte</MenuItem>
      <MenuItem onClick={() => goTo('/app/newevent')}>
        Créer un évènement
      </MenuItem>
      <MenuItem onClick={() => goTo('/app/newgroup')}>Créer un groupe</MenuItem>
      <Divider />
      <MenuItem
        onClick={() => {
          hide()
          signout()
          navigate('/')
        }}
      >
        Déconnexion
      </MenuItem>
    </Menu>
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

export default UserMenu
