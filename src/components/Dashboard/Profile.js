import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import CardList from '../CardList'
import { Image, Page } from '../addons'
import { useAuth } from '../../lib/services/authService'
import { useArchived as useArchivedEvents } from '../../lib/services/eventService'
import { useArchived as useArchivedGroups } from '../../lib/services/groupService'

const Wrapper = styled.section`
  max-width: 430px;
  margin-top: 2rem;
  margin-left: auto;
  margin-right: auto;
  img {
    justify-self: center;
    height: 192px;
    max-width: 192px;
  }
`

function Profile () {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [nameError] = useState('')
  const [emailError] = useState('')

  const { loading, user } = useAuth()
  const { loading: eventLoading, events } = useArchivedEvents()
  const { loading: groupLoading, groups } = useArchivedGroups()

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
    }
  }, [user])

  return (
    <Page loading={loading && !user}>
      <Wrapper className='grid'>
        <Image alt='User avatar' className='cover' src={user && user.photo} />
        <form autoComplete='off'>
          <div className={nameError ? 'error' : ''}>
            <label htmlFor='name'>{nameError || 'Nom'}</label>
            <input
              disabled
              id='name'
              onChange={e => setName(e.target.value)}
              placeholder='Votre nom'
              type='text'
              value={name}
            />
          </div>
          <div className={emailError ? 'error' : ''}>
            <label htmlFor='email'>{emailError || 'Email'}</label>
            <input
              disabled
              id='email'
              onChange={e => setEmail(e.target.value)}
              placeholder='exemple@email.com'
              type='email'
              value={email}
            />
          </div>
        </form>
      </Wrapper>
      <CardList
        data={events}
        isArchived
        loading={eventLoading}
        title='Mes évènements archivés'
      />
      <CardList
        data={groups}
        isArchived
        isGroup
        loading={groupLoading}
        title='Mes groupes archivés'
      />
    </Page>
  )
}

export default Profile
