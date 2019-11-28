import React, { useEffect } from 'react'
import { useAuth } from '../../lib/services/authService'
import { showSnack } from '../../lib/state'
import { navigate } from 'gatsby'

function Dashboard () {
  const { loading, user, hasSignedOut } = useAuth()

  useEffect(() => {
    if (!loading && !user && !hasSignedOut) {
      showSnack('Veuillez vous connecter pour accéder à cette page.', 'error')
      navigate('/connexion')
    }
  }, [hasSignedOut, loading, user])

  return <p>Dashboard</p>
}

export default Dashboard
