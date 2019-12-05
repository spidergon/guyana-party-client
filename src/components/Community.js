import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import MUIDataTable from 'mui-datatables'
import Button from '@material-ui/core/Button'
import {
  confirmMember,
  countAdmins,
  isAdmin,
  isMember,
  quitRequest,
  acceptPendingRequest,
  denyPendingRequest,
  grantPendingRequest,
  giveAdminRightRequest,
  removeAdminRightRequest
} from '../lib/services/communityService'

const Wrapper = styled.section`
  margin-bottom: 50px;
  button {
    margin-right: 1rem;
  }
  h2 button {
    margin: -0.7rem 1rem 0 1rem;
    position: absolute;
    right: 0;
  }
`

const translate = {
  admin: {
    label: 'Admin',
    action: 'Retirer les droits admin'
  },
  pending_request: {
    label: 'En attente',
    action: 'Accepter la demande',
    action2: 'Refuser'
  },
  denied: {
    label: 'Bloqué(e)',
    action: 'Débloquer'
  },
  guest: {
    label: 'Invité'
  },
  member: {
    label: 'Membre',
    action: 'Donner les droits admin',
    action2: 'Bloquer'
  }
}

function Community ({ group }) {
  const [data, setData] = useState([])
  const [showList, setShowList] = useState(false)
  const [showActions, setShowActions] = useState(false)
  const [showQuitBtn, setShowQuitBtn] = useState(false)

  useEffect(() => {
    setData(
      group.community.map(m => [
        m.user.name,
        translate[m.role].label,
        `${m.role}__${m.user._id}`
      ])
    )
    setShowList(
      group.community &&
        confirmMember(group.community) &&
        !confirmMember(group.community, 'denied') &&
        !confirmMember(group.community, 'pending_request')
    )
    setShowActions(confirmMember(group.community, 'admin'))
    setShowQuitBtn(
      (isAdmin(group.community) && countAdmins(group.community) > 1) ||
        isMember(group.community)
    )
  }, [group.community])

  const doAction = (role, action, id) => {
    if (role === 'admin') {
      if (translate[role].action === action) removeAdminRightRequest(group, id)
    } else if (role === 'pending_request') {
      if (translate[role].action === action) acceptPendingRequest(group, id)
      if (translate[role].action2 === action) denyPendingRequest(group, id)
    } else if (role === 'denied') {
      if (translate[role].action === action) grantPendingRequest(group, id)
    } else if (role === 'member') {
      if (translate[role].action === action) giveAdminRightRequest(group, id)
      if (translate[role].action2 === action) denyPendingRequest(group, id)
    }
  }

  const columns = [
    'Nom',
    'Rôle',
    {
      name: 'Actions',
      options: {
        display: showActions,
        filter: false,
        sort: false,
        customBodyRender: (roleId, tableMeta, updateValue) => {
          const [role, id] = roleId.split('__')
          if (
            !showActions ||
            (role === 'admin' && countAdmins(group.community) === 1)
          ) {
            return null
          }
          const { action, action2 } = translate[role]
          return (
            <>
              <Button
                onClick={() => doAction(role, action, id)}
                size='small'
                variant='contained'
              >
                {action}
              </Button>
              {action2 && (
                <Button
                  onClick={() => doAction(role, action2, id)}
                  size='small'
                  variant='contained'
                >
                  {action2}
                </Button>
              )}
            </>
          )
        }
      }
    }
  ]

  return (
    <Wrapper className='community'>
      <h2>
        La communauté
        {showQuitBtn && (
          <Button
            aria-label='Quitter la communauté'
            onClick={() => quitRequest(group)}
            size='small'
            title='Quitter la communauté'
            variant='contained'
          >
            Quitter
          </Button>
        )}
      </h2>
      {(showList && (
        <MUIDataTable
          columns={columns}
          data={data}
          options={{
            print: false,
            download: false,
            filterType: 'dropdown',
            responsive: 'scrollMaxHeight'
          }}
          title={
            data.length > 0
              ? `${data.length} membre${data.length > 1 ? 's' : ''}`
              : ''
          }
        />
      )) || (
        <p>
          Vous souhaitez faire partie de la communauté, faites une demande
          d&rsquo;adhésion en cliquant sur le bouton correspondant en haut de la
          page.
        </p>
      )}
    </Wrapper>
  )
}

Community.propTypes = {
  group: PropTypes.object.isRequired
}

export default Community