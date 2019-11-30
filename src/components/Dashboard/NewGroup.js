import React, { useState } from 'react'
import { navigate } from 'gatsby'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import Edit from '@material-ui/icons/Edit'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Page from './Page'
import Description from './Mde'
import Photos from './Photos'
import { showSnack } from '../Snack'
import { createGroup } from '../../lib/services/groupService'

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

function NewGroup () {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [nameError, setNameError] = useState('')
  const [descError, setDescError] = useState('')

  const save = () => {
    setNameError('')
    setDescError('')
    if (!name) return setNameError('Veuillez saisir un nom')
    if (!description) return setDescError('Veuillez saisir une description :')
    setLoading(true)
    createGroup(
      { name, description, photos },
      slug => navigate(`/group/${slug}`),
      error => {
        console.log(error)
        showSnack('La création du groupe a échoué !', 'error')
        setLoading(false)
      }
    )
  }

  return (
    <Wrapper>
      <Page title="Création d'un groupe">
        <div id='name'>
          <Grid alignItems='flex-end' container spacing={1}>
            <Grid item>
              <Edit />
            </Grid>
            <Grid item>
              <TextField
                disabled={loading}
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
          readOnly={loading}
          setValue={setDescription}
          value={description}
        />
        <Photos disabled={loading} photos={photos} setPhotos={setPhotos} />
        <div className='save center'>
          <Button
            aria-label='Enregistrer'
            color='primary'
            disabled={loading}
            onClick={save}
            variant='contained'
          >
            {loading ? 'Chargement...' : 'Enregistrer'}
          </Button>
        </div>
      </Page>
    </Wrapper>
  )
}

export default NewGroup
