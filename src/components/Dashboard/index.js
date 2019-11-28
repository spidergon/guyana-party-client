import React, { useEffect } from 'react'
import { navigate } from 'gatsby'
import styled from 'styled-components'
import CardList from '../CardList'
import { Image, Link } from '../addons'
import { useAuth } from '../../lib/services/authService'
import { showSnack } from '../../lib/state'

const Wrapper = styled.div`
  grid-template-columns: 200px 1fr;
  height: calc(100vh - ${props => props.theme.headerHeight});
  .menu {
    overflow: auto;
    grid-auto-rows: max-content;
    grid-gap: 1rem;
    justify-items: center;
    padding: 2rem 1rem;
    white-space: nowrap;
    border-right: 1px solid ${props => props.theme.borderColor};
    box-shadow: 10px 0 10px -10px ${props => props.theme.borderColor};
    img.avatar {
      width: 100px;
      border-radius: 50%;
      margin-bottom: 1rem;
    }
  }
  .content {
    overflow: auto;
    padding: 2rem 1.5rem;
  }
  @media (max-width: ${props => props.theme.sm}) {
    grid-template-columns: auto;
    .menu {
      display: none;
    }
  }
`

const events = [
  {
    position: [4.93, -52.3],
    title: "Event 1: un nom d'évènement super long !",
    slug: 'event1',
    photo: ''
  },
  { position: [51.51, -0.1], title: 'Event 2', slug: 'event2', photo: '' },
  { position: [51.49, -0.05], title: 'Event 3', slug: 'event3', photo: '' },
  { position: [51.49, -0.05], title: 'Event 4', slug: 'event4', photo: '' }
]

function Dashboard () {
  const { loading, user, hasSignedOut } = useAuth()

  useEffect(() => {
    if (!loading && !user && !hasSignedOut) {
      showSnack('Veuillez vous connecter pour accéder à cette page.', 'error')
      navigate('/connexion')
    }
  }, [hasSignedOut, loading, user])

  return (
    <Wrapper className='grid'>
      <section className='menu grid'>
        <Image alt='User avatar' className='avatar' src={user && user.photo} />
        <button
          aria-label='Créer un évènement'
          onClick={() => navigate('/app/newevent')}
          title='Créer un évènement'
        >
          Créer un évènement
        </button>
        <div>
          <Link to='/app/profile'>Mon compte</Link>
        </div>
      </section>
      <section className='content'>
        <CardList data={events} title='Mes Évènements' />
        <CardList data={events} isGroup title='Mes Groupes' />
      </section>
    </Wrapper>
  )
}

export default Dashboard
