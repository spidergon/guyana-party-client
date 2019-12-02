import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'
import EditIcon from '@material-ui/icons/Edit'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import DatePicker, { registerLocale } from 'react-datepicker'
import fr from 'date-fns/locale/fr'
import 'react-datepicker/dist/react-datepicker.css'
import Page from './Page'
import Description from './Mde'
import Photos from './Photos'
import { useGroups } from '../../lib/services/groupService'

registerLocale('fr', fr)

const Wrapper = styled.div`
  #name {
    max-width: 290px;
    margin: auto;
  }
  #group,
  #dates {
    margin-top: 2.5rem;
  }
  #group {
    label {
      margin-right: 1rem;
    }
    .new-group {
      margin-left: 1rem;
    }
  }
  #dates {
    grid-template-columns: auto auto auto auto;
    justify-content: start;
    input {
      margin-left: 0.5rem;
      padding: 5px 10px;
      &:first-of-type {
        margin-right: 1rem;
      }
    }
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
  @media (max-width: ${props => props.theme.sm}) {
    #dates {
      grid-template-columns: auto auto;
      grid-gap: 0.5rem;
    }
  }
  @media (max-width: 336px) {
    .react-datepicker-popper {
      display: none;
    }
  }
`

const MyDatePicker = ({ label, date, setDate, id }) => (
  <>
    <label htmlFor={id}>{label}</label>
    <DatePicker
      dateFormat='dd/MM/yyyy à HH:mm'
      id={id}
      locale='fr'
      onChange={d => setDate(d)}
      popperModifiers={{
        preventOverflow: {
          enabled: true,
          escapeWithReference: false,
          boundariesElement: 'viewport'
        }
      }}
      selected={date}
      showTimeSelect
      timeCaption='Heure'
      timeFormat='HH:mm'
      timeIntervals={5}
    />
  </>
)

function NewEvent ({ id }) {
  const [name, setName] = useState('')
  const [group, setGroup] = useState('')
  const [newGroup, setNewGroup] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [eventLoading, setEventLoading] = useState(false)
  const [nameError, setNameError] = useState('')
  const [descError, setDescError] = useState('')

  const { loading: groupLoading, groups } = useGroups()

  useEffect(() => {
    if (groups && groups.length > 0) setGroup(groups[0].slug)
  }, [groups])

  return (
    <Wrapper>
      <Page
        title={`${id ? 'Edition' : 'Création'} ${
          name ? `de ${name}` : "d'un évènement"
        }`}
      >
        <div id='name'>
          <Grid alignItems='flex-end' container spacing={1}>
            <Grid item>
              {loading || eventLoading ? <CircularProgress /> : <EditIcon />}
            </Grid>
            <Grid item>
              <TextField
                disabled={loading || eventLoading}
                error={!!nameError}
                fullWidth
                helperText={nameError}
                label='Nom de votre évènement'
                onChange={e => setName(e.target.value)}
                value={name}
              />
            </Grid>
          </Grid>
        </div>
        <div id='group'>
          <label htmlFor='group-select'>
            Groupe créateur de l&rsquo;évènement :
          </label>
          <Select
            className=''
            displayEmpty
            id='group-select'
            onChange={e => setGroup(e.target.value)}
            value={group}
          >
            {groups &&
              groups.map((g, index) => (
                <MenuItem key={g._id} value={g.slug}>
                  {g.name}
                </MenuItem>
              ))}
            {!groupLoading && (
              <MenuItem value=''>
                <em>Nouveau groupe</em>
              </MenuItem>
            )}
          </Select>
          {!groupLoading && group === '' && (
            <TextField
              className='new-group'
              disabled={loading || eventLoading}
              error={!!nameError}
              helperText={nameError}
              onChange={e => setNewGroup(e.target.value)}
              placeholder='Nom'
              value={newGroup}
            />
          )}
        </div>
        <div className='grid' id='dates'>
          <MyDatePicker
            date={startDate}
            id='start'
            label='Début :'
            setDate={setStartDate}
          />
          <MyDatePicker
            date={endDate}
            id='end'
            label='Fin :'
            setDate={setEndDate}
          />
        </div>
        <Description
          className={descError ? 'error' : ''}
          label={descError || 'Description :'}
          placeholder='Donnez envie !'
          readOnly={loading || eventLoading}
          setValue={setDescription}
          value={description}
        />
        <Photos
          disabled={loading || eventLoading}
          photos={photos}
          setPhotos={setPhotos}
        />
        <div className='save center'>
          <Button
            aria-label='Enregistrer'
            color='primary'
            disabled={loading || eventLoading}
            onClick={() => {}}
            variant='contained'
          >
            {loading || eventLoading ? 'Chargement...' : 'Enregistrer'}
          </Button>
        </div>
      </Page>
    </Wrapper>
  )
}

NewEvent.propTypes = { id: PropTypes.string }

MyDatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  date: PropTypes.object.isRequired,
  setDate: PropTypes.func.isRequired,
  id: PropTypes.string.isRequired
}

export default NewEvent
