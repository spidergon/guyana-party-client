import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Fab from '@material-ui/core/Fab'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import CircularProgress from '@material-ui/core/CircularProgress'
import { showSnack } from './Snack'
import { If, Page, Link } from './addons'
import Dialog from './Dialog'
import { useGroup, deleteGroup } from '../lib/services/groupService'
import { markToSafeHTML, isAuthor } from '../lib/utils'
import CardList from './CardList'
import PhotoList from './PhotoList'
import { useAuth } from '../lib/services/authService'

const Wrapper = styled.div`
  height: calc(100vh - ${props => props.theme.headerHeight} - 2rem);
  h1,
  h2 {
    text-transform: uppercase;
  }
  h2 {
    font-size: 18px;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(151, 151, 151, 0.2);
  }
  .title {
    h1 {
      margin-bottom: 0.5rem;
    }
  }
  .desc-section {
    max-width: 800px;
    margin: 0 auto 6rem;
    p {
      margin: 0.5rem 0;
    }
    .desc-content {
      padding: 1rem 0.5rem;
      margin-bottom: 2rem;
      background: #fff;
    }
    .photos {
      .slick-track {
        margin-left: 0;
      }
    }
  }
  .controls {
    margin-bottom: 1rem;
    button {
      margin: 10px;
      width: 40px;
      height: 40px;
    }
  }
  @media (max-width: ${props => props.theme.xs}) {
    .desc-section {
      margin-bottom: 3rem;
      .photos .slick-track {
        margin-left: auto;
      }
    }
  }
`

function GroupPage ({ slug }) {
  const [description, setDescription] = useState(null)
  const [diagOpen, setDiagOpen] = useState(false)
  const [showControls, setShowControls] = useState(false)

  const { user } = useAuth()
  const { loading, group } = useGroup({ slug })

  useEffect(() => {
    if (!loading && !group) {
      showSnack(`Le group à l'adresse "${slug}" est introuvable`, 'error')
      navigate('/')
    }
  }, [group, loading, slug])

  useEffect(() => {
    (async () => {
      if (group) {
        setShowControls(isAuthor(user, group.author))
        setDescription(await markToSafeHTML(group.description))
      }
    })()
  }, [group, user])

  const archive = (id, author) => {
    const next = () => {
      showSnack('Groupe archivé avec succès')
      navigate('/app')
    }
    const fallback = error => {
      showSnack('Une erreur est survenue', 'error')
      console.log(error)
    }
    deleteGroup({ id: group._id, author: group.author }, next, fallback)
  }

  return (
    <Page>
      <Wrapper>
        {loading && !group && (
          <center>
            <CircularProgress />
          </center>
        )}
        {group && (
          <>
            <section className='title grid'>
              <h1>{group.name}</h1>
              <If condition={showControls}>
                <div className='controls center'>
                  <Link to={`/app/group/edit/${group._id}`}>
                    <Fab
                      aria-label='Modifier'
                      className='edit'
                      title='Modifier'
                    >
                      <EditIcon />
                    </Fab>
                  </Link>
                  <Fab
                    aria-label='Archiver'
                    className='archive'
                    color='secondary'
                    onClick={() => setDiagOpen(true)}
                    title='Archiver'
                  >
                    <DeleteIcon />
                  </Fab>
                </div>
                <Dialog
                  action={archive}
                  close={() => setDiagOpen(false)}
                  isOpen={diagOpen}
                  text='Ce groupe ne sera pas supprimé.'
                  title='Voulez-vous vraiment archiver ce groupe ?'
                />
              </If>
            </section>

            <section className='desc-section'>
              <p>Description :</p>
              <div
                className='desc-content'
                dangerouslySetInnerHTML={{ __html: description }} // eslint-disable-line react/no-danger
              />
              <p>
                {`Photos${group.photos ? ` (${group.photos.length})` : ''} :`}
              </p>
              <PhotoList className='photos' photos={group.photos} />
            </section>
            <CardList
              className='events'
              data={[]}
              loading={false}
              setData={() => {}}
              title='Évènements en cours'
            />
            <section className='community'>
              <h2>La communauté</h2>
            </section>
          </>
        )}
      </Wrapper>
    </Page>
  )
}

GroupPage.propTypes = { slug: PropTypes.string }

export default GroupPage
