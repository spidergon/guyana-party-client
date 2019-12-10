import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Image, Page } from '../addons'
import { useAuth } from '../../lib/services/authService'

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
              disabled={loading}
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
              disabled={loading}
              id='email'
              onChange={e => setEmail(e.target.value)}
              placeholder='exemple@email.com'
              type='email'
              value={email}
            />
          </div>
        </form>
      </Wrapper>
    </Page>
  )
}

export default Profile
