import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import EditIcon from '@material-ui/icons/Edit'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Page from './Page'
import Description from './Mde'
import Photos from './Photos'
import { showSnack } from '../Snack'
import {
  createGroup,
  useGroup,
  updateGroup
} from '../../lib/services/groupService'

const Wrapper = styled.div`
  #name {
    max-width: 290px;
    margin: auto;
  }
  .mde,
  .photos,
  .save {
    margin-top: 2.5rem;
  }
  .error p,
  p.error {
    color: ${props => props.theme.errorColor};
    font-weight: 600;
  }
`

function EditGroup ({ id }) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [nameError, setNameError] = useState('')
  const [descError, setDescError] = useState('')

  const { loading: groupLoading, error, group } = useGroup({ id })

  useEffect(() => {
    if (error) {
      showSnack('Une erreur interne est survenue', 'error')
      return navigate('/app')
    }
    if (id && group) {
      setName(group.name)
      setDescription(group.description)
      setPhotos(group.photos)
    } else {
      setName('')
      setDescription('')
      setPhotos([])
    }
  }, [error, group, id])

  const save = () => {
    setNameError('')
    setDescError('')
    if (!name) return setNameError('Veuillez saisir un nom')
    if (!description) return setDescError('Veuillez saisir une description :')
    setLoading(true)

    const next = () => navigate(`/group/${group.slug}`)
    const fallback = (error, isCreate = true) => {
      showSnack(
        `${isCreate ? 'La création' : "L'édition"} du groupe a échoué !`,
        'error'
      )
      setLoading(false)
      console.log(error)
    }

    if (!id) {
      createGroup({ name, description, photos }, next, fallback)
    } else {
      updateGroup(
        { id, name, description, photos, author: group.author },
        next,
        error => fallback(error, false)
      )
    }
  }

  return (
    <Wrapper>
      <Page
        title={`${id ? 'Edition' : 'Création'} ${
          name ? `de ${name}` : "d'un groupe"
        }`}
      >
        <div id='name'>
          <Grid alignItems='flex-end' container spacing={1}>
            <Grid item>
              {loading || groupLoading ? <CircularProgress /> : <EditIcon />}
            </Grid>
            <Grid item>
              <TextField
                disabled={loading || groupLoading}
                error={!!nameError}
                fullWidth
                helperText={nameError}
                label='Nom de votre groupe'
                onChange={e => setName(e.target.value)}
                value={name}
              />
            </Grid>
          </Grid>
        </div>
        <Description
          className={descError ? 'error' : ''}
          label={descError || 'Description du groupe et de vos actions :'}
          placeholder='Donnez envie !'
          readOnly={loading || groupLoading}
          setValue={setDescription}
          value={description}
        />
        <Photos
          disabled={loading || groupLoading}
          photos={photos}
          setPhotos={setPhotos}
        />
        <div className='save center'>
          <Button
            aria-label='Enregistrer'
            color='primary'
            disabled={loading || groupLoading}
            onClick={save}
            variant='contained'
          >
            {loading || groupLoading ? 'Chargement...' : 'Enregistrer'}
          </Button>
        </div>
      </Page>
    </Wrapper>
  )
}

EditGroup.propTypes = { id: PropTypes.string }

export default EditGroup
