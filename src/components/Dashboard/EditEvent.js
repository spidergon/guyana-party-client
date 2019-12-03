import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
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
import DateFnsUtils from '@date-io/date-fns'
import fr from 'date-fns/locale/fr'
import Page from './Page'
import Description from './Mde'
import Photos from './Photos'
import { useGroups } from '../../lib/services/groupService'

const Wrapper = styled.div`
  font-size: 1rem;
  font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
  #name {
    max-width: 290px;
    margin: auto;
  }
  #group,
  #dates,
  #occurrence {
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
  @media (max-width: ${props => props.theme.xs}) {
    #dates {
      grid-template-columns: auto;
      grid-gap: 1.5rem;
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
  const [name, setName] = useState('Mon Event')
  const [group, setGroup] = useState('')
  const [newGroup, setNewGroup] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [occurrence, setOccurrence] = useState(initialOccurrence)
  const [showDays, setShowDays] = useState(false)
  const [description, setDescription] = useState('Une description')
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(false)
  const [eventLoading, setEventLoading] = useState(false)
  const [nameError, setNameError] = useState('')
  const [groupError, setGroupError] = useState('')
  const [endDateError, setEndDateError] = useState('')
  const [descError, setDescError] = useState('')

  const { loading: groupLoading, groups } = useGroups()

  useEffect(() => {
    if (groups && groups.length > 0) setGroup(groups[0]._id)
  }, [groups])

  const validateStartDate = d => {
    if (d > endDate) setEndDate(d)
    setStartDate(d)
  }

  const validateEndDate = d => {
    if (d < startDate) setStartDate(d)
    setEndDate(d)
  }

  const handleShowDaysChange = ({ target: { checked } }) => {
    if (!checked) setOccurrence(initialOccurrence)
    setShowDays(checked)
  }

  const handleOccurrenceChange = value => ({ target: { checked } }) => {
    setOccurrence({ ...occurrence, [value]: checked })
  }

  const save = () => {
    setNameError('')
    setGroupError('')
    setEndDateError('')
    setDescError('')
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
    setLoading(true)
    setEventLoading(true)
    // TODO
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
                control={<Checkbox onChange={handleShowDaysChange} />}
                label="Répétition de l'évènement"
              />
            </FormGroup>
            {showDays && (
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
            )}
          </FormControl>
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
