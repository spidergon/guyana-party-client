import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { navigate } from 'gatsby'
import styled from 'styled-components'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import EditIcon from '@material-ui/icons/Edit'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormControl from '@material-ui/core/FormControl'
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers'
import DeleteIcon from '@material-ui/icons/Delete'
import Fab from '@material-ui/core/Fab'
import DateFnsUtils from '@date-io/date-fns'
import fr from 'date-fns/locale/fr'
import Page from './Page'
import Description from './Mde'
import Photos from './Photos'
import SingleMap from './SingleMap'
import Dialog from '../Dialog'
import If from '../addons/If'
import { useGroups } from '../../lib/services/groupService'
import {
  createEvent,
  getAddressFromCoords,
  useEvent,
  updateEvent,
  archiveEvent
} from '../../lib/services/eventService'
import { showSnack } from '../Snack'

const Wrapper = styled.div`
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  font-size: 1rem;
  #name {
    max-width: 290px;
    margin: auto;
  }
  #group,
  #dates,
  #occurrence,
  .map-section {
    margin-top: 2.5rem;
    p {
      margin-bottom: 0.5rem;
    }
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
    grid-template-columns: auto auto;
    grid-gap: 2rem;
    justify-content: start;
    align-items: center;
  }
  .date-error {
    margin-top: 0.5rem;
  }
  #occurrence .daylabel .MuiFormControlLabel-label {
    font-size: 0.9rem;
  }
  .map-section {
    #map {
      height: 400px;
    }
    input {
      width: 100%;
      padding: 10px;
      border: 1px solid #e6e6e6;
      outline: none;
    }
  }
  .archive-btn {
    position: fixed;
    bottom: 0;
    right: 0;
    margin: 1rem;
  }
  .mde,
  .photos,
  .save {
    margin-top: 2.5rem;
  }
  p.error {
    color: ${props => props.theme.errorColor};
    font-weight: 600;
  }
  @media (max-width: ${props => props.theme.xs}) {
    #dates {
      grid-template-columns: auto;
      grid-gap: 1.5rem;
    }
    .archive-btn {
      width: 40px;
      height: 40px;
    }
  }
`

const days = [
  { label: 'Lundi', value: 'mon' },
  { label: 'Mardi', value: 'tue' },
  { label: 'Mercredi', value: 'wed' },
  { label: 'Jeudi', value: 'thu' },
  { label: 'Vendredi', value: 'fri' },
  { label: 'Samedi', value: 'sat' },
  { label: 'Dimanche', value: 'sun' }
]

const initialOccurrence = {
  mon: false,
  tue: false,
  wed: false,
  thu: false,
  fri: false,
  sat: false,
  sun: false
}

function NewEvent ({ id }) {
  const [name, setName] = useState('')
  const [group, setGroup] = useState('')
  const [newGroup, setNewGroup] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [occurrence, setOccurrence] = useState(initialOccurrence)
  const [showDays, setShowDays] = useState(false)
  const [description, setDescription] = useState('')
  const [photos, setPhotos] = useState([])
  const [coordinates, setCoordinates] = useState([])
  const [address, setAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const [nameError, setNameError] = useState('')
  const [groupError, setGroupError] = useState('')
  const [endDateError, setEndDateError] = useState('')
  const [descError, setDescError] = useState('')
  const [addressError, setAddressError] = useState('')
  const [diagOpen, setDiagOpen] = useState(false)

  const { loading: eventLoading, error, event } = useEvent({ id })

  const { loading: groupLoading, groups } = useGroups()

  useEffect(() => {
    if (groups && groups.length > 0) setGroup(groups[0]._id)
  }, [groups])

  useEffect(() => {
    if (error) {
      showSnack('Une erreur interne est survenue', 'error')
      return navigate('/app')
    }
    if (id && event) {
      setName(event.name)
      if (groups && groups.length > 0) setGroup(event.group)
      setStartDate(new Date(event.startDate))
      setEndDate(new Date(event.endDate))
      setOccurrence(JSON.parse(event.occurrence))
      setDescription(event.description)
      setPhotos(event.photos)
      setCoordinates([
        event.location.coordinates[0],
        event.location.coordinates[1]
      ])
    } else {
      setName('')
      if (groups && groups.length > 0) setGroup(groups[0]._id)
      setStartDate(new Date())
      setEndDate(new Date())
      setOccurrence(initialOccurrence)
      setShowDays(false)
      setDescription('')
      setPhotos([])
    }
  }, [error, event, groups, id])

  useEffect(() => {
    if (id) {
      for (const d in days) {
        const { value } = days[d]
        if (occurrence[value]) {
          setShowDays(true)
          break
        }
      }
    }
  }, [id, occurrence])

  useEffect(() => {
    setAddressError('')
    getAddressFromCoords(
      coordinates,
      addr => setAddress(addr),
      error => {
        console.log(error)
        return showSnack('Une erreur est survenue', 'error')
      }
    )
  }, [coordinates])

  const validateStartDate = d => {
    if (d > endDate) setEndDate(d)
    setStartDate(d)
  }

  const validateEndDate = d => {
    if (d < startDate) setStartDate(d)
    setEndDate(d)
  }

  const handleShowDaysChange = ({ target: { checked } }) => setShowDays(checked)

  const handleOccurrenceChange = value => ({ target: { checked } }) => {
    setOccurrence({ ...occurrence, [value]: checked })
  }

  const save = () => {
    setNameError('')
    setGroupError('')
    setEndDateError('')
    setDescError('')
    setAddressError('')
    if (!name) return setNameError('Veuillez saisir un nom')
    if (group === 'new' && !newGroup) {
      return setGroupError('Veuillez saisir le nom du groupe')
    }
    if (startDate.getTime() === endDate.getTime()) {
      return setEndDateError(
        'La date de fin doit être différente de la date de début'
      )
    }
    if (!description) return setDescError('Veuillez saisir une description :')
    if (!address) {
      return setAddressError(
        "Veuillez cliquer sur la carte pour obtenir l'adresse"
      )
    }
    setLoading(true)

    const payload = {
      name,
      group,
      description,
      startDate,
      endDate,
      occurrence: JSON.stringify(showDays ? occurrence : initialOccurrence),
      photos,
      location: { coordinates, address }
    }

    if (group === 'new' && newGroup) {
      // TODO: create group
    }

    const fallback = error => {
      console.log(error)
      showSnack(
        `${id ? "L'édition" : 'La création'} de l'évènement a échoué !`,
        'error'
      )
      setLoading(false)
    }

    // console.log(payload)

    if (!id) {
      createEvent(payload, slug => navigate(`/event/${slug}`), fallback)
    } else {
      payload.id = id
      payload.author = event.author
      updateEvent(payload, () => navigate(`/event/${event.slug}`), fallback)
    }
  }

  const archive = () => {
    const next = () => {
      showSnack('Évènement archivé avec succès')
      navigate('/app')
    }
    const fallback = error => {
      showSnack('Une erreur est survenue', 'error')
      console.log(error)
    }
    archiveEvent({ id, author: event.author }, next, fallback)
  }

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
            <MenuItem value=''>
              <em>Aucun</em>
            </MenuItem>
            <MenuItem value='new'>
              <em>Nouveau groupe</em>
            </MenuItem>
            <Divider />
            {groups &&
              groups.map(g => (
                <MenuItem key={g._id} value={g._id}>
                  {g.name}
                </MenuItem>
              ))}
          </Select>
          {!groupLoading && group === 'new' && (
            <TextField
              className='new-group'
              disabled={loading || eventLoading}
              error={!!groupError}
              helperText={groupError}
              onChange={e => setNewGroup(e.target.value)}
              placeholder='Nom'
              value={newGroup}
            />
          )}
        </div>
        <div className='grid' id='dates'>
          <DatePicker
            date={startDate}
            disabled={loading || eventLoading}
            label='Début :'
            setDate={validateStartDate}
          />
          <DatePicker
            date={endDate}
            disabled={loading || eventLoading}
            error={!!endDateError}
            label='Fin :'
            setDate={validateEndDate}
          />
        </div>
        {endDateError && <p className='date-error error'>{endDateError}</p>}
        <div id='occurrence'>
          <FormControl component='fieldset'>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showDays}
                    onChange={handleShowDaysChange}
                  />
                }
                label="Répétition de l'évènement"
              />
            </FormGroup>
            <If condition={showDays}>
              <FormGroup row>
                {days.map(({ label, value }, index) => (
                  <FormControlLabel
                    className='daylabel'
                    control={
                      <Checkbox
                        checked={occurrence[value]}
                        color='primary'
                        onChange={handleOccurrenceChange(value)}
                        value={value}
                      />
                    }
                    key={index}
                    label={label}
                  />
                ))}
              </FormGroup>
            </If>
          </FormControl>
        </div>
        <Description
          error={!!descError}
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
        <div className='map-section'>
          {(addressError && <p className='error'>{addressError}&nbsp;:</p>) || (
            <p>Lieu de l&rsquo;évènement&nbsp;:</p>
          )}
          <If condition={typeof window !== 'undefined'}>
            <SingleMap
              coords={coordinates}
              onClick={({ lat, lng }) => setCoordinates([lat, lng])}
            />
            <input
              placeholder="Cliquez sur la carte pour obtenir l'adresse..."
              readOnly
              type='text'
              value={address}
            />
          </If>
        </div>
        <If condition={id}>
          <Fab
            aria-label='Archiver'
            className='archive-btn'
            color='secondary'
            onClick={() => setDiagOpen(true)}
            title='Archiver'
          >
            <DeleteIcon />
          </Fab>
          <Dialog
            action={() => archive()}
            close={() => setDiagOpen(false)}
            isOpen={diagOpen}
            text='Cet évènement ne sera pas supprimé.'
            title={`Voulez-vous vraiment archiver "${name}" ?`}
          />
        </If>
        <div className='save center'>
          <Button
            aria-label='Enregistrer'
            color='primary'
            disabled={loading || eventLoading}
            onClick={save}
            variant='contained'
          >
            {loading || eventLoading ? 'Chargement...' : 'Enregistrer'}
          </Button>
        </div>
      </Page>
    </Wrapper>
  )
}

class FrLocalizedUtils extends DateFnsUtils {
  getDateTimePickerHeaderText (date) {
    return this.format(date, 'd MMM', { locale: this.locale })
  }
}

const DatePicker = ({ label, date, setDate, disabled, error }) => (
  <MuiPickersUtilsProvider locale={fr} utils={FrLocalizedUtils}>
    <DateTimePicker
      ampm={false}
      cancelLabel='annuler'
      disabled={disabled}
      error={error}
      format='d MMM yyyy à HH:mm'
      hideTabs
      label={label}
      onChange={setDate}
      value={date}
    />
  </MuiPickersUtilsProvider>
)

DatePicker.propTypes = {
  label: PropTypes.string.isRequired,
  date: PropTypes.object,
  setDate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  error: PropTypes.bool
}

NewEvent.propTypes = { id: PropTypes.string }

export default NewEvent
