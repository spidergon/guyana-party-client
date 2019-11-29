import React from 'react'
import { navigate } from 'gatsby'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import CardList from '../CardList'
import { Image } from '../addons'
import { useAuth } from '../../lib/services/authService'

const Wrapper = styled.div`
  grid-template-columns: 225px 1fr;
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
    .new,
    .compte {
      text-transform: none;
    }
    .new {
      padding-right: 15px;
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
  const { user } = useAuth()

  return (
    <Wrapper className='grid'>
      <section className='menu grid'>
        <Image alt='User avatar' className='avatar' src={user && user.photo} />
        <Fab
          aria-label='Créer un évènement'
          className='new'
          color='primary'
          onClick={() => navigate('/app/newevent')}
          size='small'
          variant='extended'
        >
          <AddIcon />
          Créer un évènement
        </Fab>
        <Button
          aria-label='Mon compte'
          className='compte'
          onClick={() => navigate('/app/profile')}
        >
          Mon compte
        </Button>
      </section>
      <section className='content'>
        <CardList data={events} title='Mes Évènements' />
        <CardList data={events} isGroup title='Mes Groupes' />
      </section>
    </Wrapper>
  )
}

export default Dashboard
