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
import SingleMap from './Dashboard/SingleMap'
import { markToSafeHTML } from '../lib/utils'

const Wrapper = styled.div`
  #map {
    /* position: absolute; */
    height: 250px;
    /* width: 100vw;
    margin-left: 50%;
    transform: translateX(-50%); */
  }
  .progress {
    margin-top: 1rem;
  }
  #title {
    position: absolute;
    margin-top: -215px;
    max-width: 500px;
    height: 150px;
    /* justify-content: start; */
    /* margin-bottom: 2rem; */
    /* .block-title { */
    /* align-self: center;
    height: fit-content; */
    background-color: rgb(250, 250, 250);
    /* margin-left: 1rem; */
    padding: 0.5rem;
    z-index: 999;
    border: 1px solid ${props => props.theme.borderColor};
    h1 {
      text-align: inherit;
      margin-bottom: 0;
      span {
        font-size: 1.1rem;
      }
      a {
        color: #0078e7;
      }
    }
  }
  .controls {
    margin: 0.5rem 0;
    text-align: center;
    /* margin-bottom: 1rem; */
    /* z-index: 10; */
    button {
      margin: 10px;
    }
  }
  #content {
    grid-template-columns: 60% auto;
    .desc-content {
      background-color: #fff;
      padding: 1rem 0.5rem;
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

  useEffect(() => {
    (async () => {
      if (event) setDescription(await markToSafeHTML(event.description))
    })()
  }, [event])

  const archive = () => {}

  return (
    <Wrapper>
      <SingleMap
        coords={event && event.location.coordinates}
        viewOffset={0.006}
        zoom={16}
      />
      <Page>
        {loading && !event && (
          <center className='progress'>
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
                    <Link
                      title='Voir le group'
                      to={`/group/${event.group.slug}`}
                    >
                      {event.group.name}
                    </Link>
                  </>
                )}
              </h1>
              <p>{event.location.address}</p>
            </section>
            <If condition={admin}>
              <section className='controls'>
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
              </section>
              <Dialog
                action={archive}
                close={() => setDiagOpen(false)}
                isOpen={diagOpen}
                text='Cet évènement ne sera pas supprimé.'
                title='Voulez-vous vraiment archiver cet évènement ?'
              />
            </If>
            <section className='grid' id='content'>
              <div
                className='desc-content'
                dangerouslySetInnerHTML={{ __html: description }} // eslint-disable-line react/no-danger
              />
              <div className='info'>Info</div>
            </section>
          </>
        )}
      </Page>
    </Wrapper>
  )
}

EventPage.propTypes = { slug: PropTypes.string }

export default EventPage
