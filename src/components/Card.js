import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import Fab from '@material-ui/core/Fab'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import Dialog from './Dialog'
import { Image, Link } from './addons'
import { dateToStr, isAuthor } from '../lib/utils'
import { useAuth } from '../lib/services/authService'

const Wrapper = styled.div`
  position: relative;
  margin: 0.5rem;
  box-shadow: 1px 1px 5px ${props => props.theme.borderColor};
  border: 1px solid rgb(239, 239, 239);
  transition: box-shadow 0.3s ease;
  .caption {
    color: rgba(0, 0, 0, 0.8);
    line-height: 1.5;
    font-size: 20px;
    padding: 0.5rem 0;
    .title {
      padding: 0 0.5rem;
      p {
        font-size: 15px;
      }
    }
  }
  .overlay {
    opacity: 0;
    position: absolute;
    top: 0;
    background-color: rgba(0, 0, 0, 0.2);
    color: #fff;
    height: 200px;
    width: 100%;
    z-index: 10;
    transition: opacity 0.3s ease;
    .edit,
    .delete {
      position: absolute;
      margin: 10px;
      width: 46px;
      height: 46px;
    }
    .delete {
      right: 0;
    }
    .text {
      position: absolute;
      bottom: 0;
      width: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      padding: 5px;
      .red {
        color: rgb(248, 99, 73);
      }
      .green {
        color: #43a047;
      }
      a {
        color: #fff;
      }
    }
  }
  &:hover {
    box-shadow: 0 15px 15px -15px gray;
    .overlay {
      opacity: 1;
    }
  }
`

function Card ({
  data: { author, name, photo, slug, _id, startDate, private: privacy, status },
  isGroup,
  archive
}) {
  const [diagOpen, setDiagOpen] = useState(false)

  const { user } = useAuth()

  useEffect(
    () => () => photo && URL.revokeObjectURL(photo), // Revoke the data uris to avoid memory leaks
    [photo]
  )

  return (
    <Wrapper>
      <Image
        alt={name}
        className='cover'
        height='200'
        loading='lazy'
        src={photo || ''}
      />
      <div className='caption'>
        <div className='title text-wrap center'>
          <Link
            aria-label={name}
            title={name}
            to={`/${isGroup ? 'group' : 'event'}/${slug}`}
          >
            <strong>{name}</strong>
          </Link>
          {!isGroup && <p>{`Le ${dateToStr(startDate)}`}</p>}
        </div>
      </div>
      <div className='overlay'>
        <Link to={`/app/${isGroup ? 'group' : 'event'}/edit/${_id}`}>
          <Fab aria-label='Modifier' className='edit' title='Modifier'>
            <EditIcon />
          </Fab>
        </Link>
        <Fab
          aria-label='Archiver'
          className='delete'
          color='secondary'
          onClick={() => setDiagOpen(true)}
          title='Archiver'
        >
          <DeleteIcon />
        </Fab>
        <div className='text'>
          {!isGroup && (
            <>
              <Link title='Voir le groupe' to={`/group/${slug}`}>
                <p className='text-wrap'>Organisateur : Group1</p>
              </Link>
              <p>
                {status === 'waiting' && (
                  <span className='red'>Hors ligne</span>
                )}
                {status === 'online' && <span className='green'>En ligne</span>}
                {privacy && ' | Évènement privé'}
              </p>
            </>
          )}
          {isGroup && isAuthor(user, author) && <p>Vous êtes administrateur</p>}
        </div>
      </div>
      <Dialog
        action={() => archive(_id, author)}
        close={() => setDiagOpen(false)}
        isOpen={diagOpen}
        text={`Ce${isGroup ? ' groupe' : 't évènement'} ne sera pas supprimé.`}
        title={`Voulez-vous vraiment archiver "${name}" ?`}
      />
    </Wrapper>
  )
}

Card.propTypes = {
  data: PropTypes.object.isRequired,
  isGroup: PropTypes.bool,
  archive: PropTypes.func.isRequired
}

export default Card
