import React from 'react'
import { navigate } from 'gatsby'
import PropTypes from 'prop-types'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Divider from '@material-ui/core/Divider'

function UserMenu ({ anchor, hide, isOpen, pathname, user, signout }) {
  const goTo = to => {
    if (typeof hide === 'function') hide()
    navigate(to)
  }

  return (
    <Menu anchorEl={anchor} id='user-menu' onClose={hide} open={isOpen}>
      {!pathname.match(/^\/+$/) && (
        <MenuItem onClick={() => goTo('/')}>Accueil</MenuItem>
      )}
      {!pathname.match(/^\/+$/) && <Divider />}
      {!pathname.match(/^\/app\/?$/) && (
        <MenuItem onClick={() => goTo('/app')}>Tableau de bord</MenuItem>
      )}
      {!pathname.match('app/profile') && (
        <MenuItem onClick={() => goTo('/app/profile')}>Mon compte</MenuItem>
      )}
      {!pathname.match('app/newevent') && (
        <MenuItem onClick={() => goTo('/app/newevent')}>
          Créer un évènement
        </MenuItem>
      )}
      {!pathname.match('app/newgroup') && (
        <MenuItem onClick={() => goTo('/app/newgroup')}>
          Créer un groupe
        </MenuItem>
      )}
      <Divider />
      <MenuItem
        onClick={() => {
          hide()
          signout()
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

export default React.memo(UserMenu)
