import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress'
import Fab from '@material-ui/core/Fab'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from './Dialog'
import { If, Page, Link } from './addons'
import { showSnack } from './Snack'
import { useEvent } from '../lib/services/eventService'
import { isAdmin } from '../lib/services/communityService'

const Wrapper = styled.div`
  #title {
    margin-bottom: 2rem;
    h1 {
      margin-bottom: 0.5rem;
      span {
        font-size: 1.1rem;
      }
      a {
        color: #0078e7;
      }
    }
    .controls {
      margin-bottom: 1rem;
      button {
        margin: 10px;
      }
    }
  }
`

function EventPage ({ slug }) {
  const [description, setDescription] = useState(null)
  const [diagOpen, setDiagOpen] = useState(false)
  const [admin, setAdmin] = useState(false)

  const { loading, event } = useEvent({ slug })

  useEffect(() => {
    if (!loading && !event) {
      showSnack(`L'évènement à l'adresse "${slug}" est introuvable`, 'error')
      navigate('/')
    }
  }, [event, loading, slug])

  useEffect(() => {
    if (event) {
      setAdmin(isAdmin(event.group.community))
    }
  }, [event])

  const archive = () => {}

  return (
    <Wrapper>
      <Page>
        {loading && !event && (
          <center>
            <CircularProgress />
          </center>
        )}
        {event && (
          <>
            <section className='grid' id='title'>
              <h1>
                {event.name}{' '}
                {event.group && (
                  <>
                    <span>par</span>{' '}
                    <Link to={`/group/${event.group.slug}`}>
                      {event.group.name}
                    </Link>
                  </>
                )}
              </h1>
              <If condition={admin}>
                <div className='controls center'>
                  <Fab
                    aria-label='Modifier'
                    className='edit'
                    onClick={() => navigate(`/app/event/edit/${event._id}`)}
                    size='small'
                    title='Modifier'
                  >
                    <EditIcon />
                  </Fab>
                  <Fab
                    aria-label='Archiver'
                    className='archive'
                    color='secondary'
                    onClick={() => setDiagOpen(true)}
                    size='small'
                    title='Archiver'
                  >
                    <DeleteIcon />
                  </Fab>
                </div>
                <Dialog
                  action={archive}
                  close={() => setDiagOpen(false)}
                  isOpen={diagOpen}
                  text='Cet évènement ne sera pas supprimé.'
                  title='Voulez-vous vraiment archiver cet évènement ?'
                />
              </If>
            </section>
          </>
        )}
      </Page>
    </Wrapper>
  )
}

EventPage.propTypes = { slug: PropTypes.string }

export default EventPage
