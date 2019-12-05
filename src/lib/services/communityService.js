import Cookies from 'js-cookie'
import { navigate } from 'gatsby'
import { showSnack } from '../../components/Snack'
import { axiosPut, reload } from '../utils'

export const confirmMember = (community, role) => {
  const userId = Cookies.get('gp_userId')
  if (!userId || !community) return false
  if (role) {
    return (
      undefined !==
      community.find(o => o.user._id === userId && o.role === role)
    )
  } else return undefined !== community.find(o => o.user._id === userId)
}

export const isAdmin = community => confirmMember(community, 'admin')

export const isMember = community => confirmMember(community, 'member')

export const countAdmins = community => {
  return community.filter(o => o.role === 'admin').length
}

const getUserId = slug => {
  const userId = Cookies.get('gp_userId')
  if (!userId) {
    showSnack(
      "Veuillez vous connecter pour faire votre demande d'adhésion",
      'info'
    )
    navigate(`/connexion?redirect=/group/${slug}`)
  }
  return userId
}

const pendingRequestMember = (group, action, role) => {
  const userId = getUserId(group.slug)
  axiosPut(
    `${process.env.API}/groups/${group._id}`,
    { [action]: { community: { user: userId, ...role } } },
    ({ data: res }) => {
      if (res.status === 200 && res.data) {
        showSnack('Action effectuée !')
        reload()
      } else {
        showSnack('Une erreur interne est survenue', 'error')
      }
    },
    error => {
      console.log(error)
      showSnack('Une erreur interne est survenue', 'error')
    }
  )
}

export const addPendingRequest = group => {
  pendingRequestMember(group, '$push', { role: 'pending_request' })
}

export const removePendingRequest = group => {
  pendingRequestMember(group, '$pull', { role: 'pending_request' })
}

export const quitRequest = group => {
  pendingRequestMember(group, '$pull')
}

const pendingRequestAdmin = (group, userId, roleIn, newRole) => {
  const query = {
    filter: {
      _id: group._id,
      community: {
        $elemMatch: {
          user: userId,
          role: { $in: roleIn }
        }
      }
    },
    update: {
      $set: {
        'community.$.role': newRole,
        'community.$.memberDate': Date.now()
      }
    }
  }
  axiosPut(
    `${process.env.API}/groups`,
    query,
    ({ data: res }) => {
      if (res.status === 200 && res.data) {
        showSnack('Action effectuée !')
        reload()
      } else {
        showSnack('Une erreur interne est survenue', 'error')
      }
    },
    error => {
      console.log(error)
      showSnack('Une erreur interne est survenue', 'error')
    }
  )
}

export const acceptPendingRequest = (group, userId) => {
  pendingRequestAdmin(group, userId, ['pending_request'], 'member')
}

export const denyPendingRequest = (group, userId) => {
  pendingRequestAdmin(
    group,
    userId,
    ['pending_request', 'member', 'admin'],
    'denied'
  )
}

export const grantPendingRequest = (group, userId) => {
  pendingRequestAdmin(group, userId, ['denied'], 'pending_request')
}

export const giveAdminRightRequest = (group, userId) => {
  pendingRequestAdmin(group, userId, ['member'], 'admin')
}

export const removeAdminRightRequest = (group, userId) => {
  pendingRequestAdmin(group, userId, ['admin'], 'member')
}
