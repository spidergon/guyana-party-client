import React, { useState, useEffect } from 'react'
import { navigate } from 'gatsby'
import styled from 'styled-components'
import isEmail from 'validator/lib/isEmail'
import Button from './Button'
import { Link } from './addons'
import { useAuth } from '../lib/services/authService'
import { showSnack } from './Snack'

const Wrapper = styled.div`
  margin-top: 0.5rem;
  font-family: Montserrat, Helvetica, sans-serif;
  h1 {
    text-transform: uppercase;
  }
  .content {
    max-width: 390px;
    padding: 30px;
    border-radius: 5px;
    width: 100%;
    min-height: 260px;
    margin: 15px auto;
    background-color: #fff;
    color: ${props => props.theme.black};
    font-size: 15px;
    /* button.facebook {
      margin-bottom: 15px;
    } */
    /* .or-div {
      display: flex;
      -webkit-box-align: center;
      align-items: center;
      width: 100%;
      margin: 25px 0px;
      div {
        background-color: rgb(235, 236, 239);
        height: 1px;
        flex: 1 1 0%;
      }
      span {
        margin: 0px 16px;
      }
    } */
  }
  .signup-link {
    margin-bottom: 60px;
    a {
      color: rgb(73, 134, 248);
      text-decoration: none;
      font-size: 15px;
    }
  }
  .copy {
    font-size: 15px;
    height: 50px;
    line-height: 50px;
  }
  @media (max-width: ${props => props.theme.sm}) {
    .content {
      max-width: inherit;
      padding: 10px;
    }
    .signup-link {
      margin-bottom: 40px;
    }
  }
`

function Signup () {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nameError, setNameError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

  const { loading: initializing, user, signEmail } = useAuth()

  useEffect(() => {
    if (!initializing && user) navigate('/')
  }, [initializing, user])

  const checkName = value => {
    if (!value) return setNameError('Veuillez entrer votre nom')
    if (value.length < 5) {
      return setNameError('Le nom doit comporter au moins 5 caractères')
    }
    return true
  }

  const checkEmail = value => {
    if (!value) return setEmailError('Veuillez entrer votre adresse email')
    if (!isEmail(value)) return setEmailError("L'email est invalide")
    return true
  }

  const checkPassword = value => {
    if (!value) return setPasswordError('Le mot de passe est requis')
    if (value.length < 8) {
      return setPasswordError(
        'Le mot de passe doit comporter au moins 8 caractères'
      )
    }
    return true
  }

  const validate = e => {
    e.preventDefault()
    setNameError('')
    setEmailError('')
    setPasswordError('')
    if (!checkName(name) || !checkEmail(email) || !checkPassword(password)) {
      return
    }
    setLoading(true)
    signEmail(
      name,
      email,
      password,
      () => {
        showSnack('Votre compte est créé, veuillez vous connecter', 'success')
        navigate('/connexion')
      },
      error => {
        setLoading(false)
        setPassword('')
        showSnack('La création a echoué !', 'error')
        console.log(error)
      }
    )
  }

  return (
    <Wrapper>
      <h1>Créer un compte</h1>
      <div className='content'>
        <form autoComplete='off'>
          <div className={nameError ? 'error' : ''}>
            <label htmlFor='name'>{nameError || 'Nom'}</label>
            <input
              disabled={loading}
              id='name'
              onBlur={e => checkName(e.target.value)}
              onChange={e => setName(e.target.value)}
              placeholder='Votre nom'
              type='text'
              value={name}
            />
          </div>
          <div className={emailError ? 'error' : ''}>
            <label htmlFor='email'>{emailError || 'Email'}</label>
            <input
              disabled={loading}
              id='email'
              onBlur={e => checkEmail(e.target.value)}
              onChange={e => setEmail(e.target.value)}
              placeholder='exemple@email.com'
              type='email'
              value={email}
            />
          </div>
          <div className={`pass-section ${passwordError ? 'error' : ''}`}>
            <label htmlFor='password'>{passwordError || 'Mot de passe'}</label>
            <input
              disabled={loading}
              id='password'
              onChange={e => setPassword(e.target.value)}
              type='password'
              value={password}
            />
          </div>
          <Button
            disabled={loading}
            onClick={validate}
            text={loading ? 'Chargement...' : 'Créer un nouveau compte'}
          />
        </form>
      </div>
      {!loading && (
        <p className='signup-link center'>
          <Link to='/connexion'>Vous avez déjà un compte ?</Link>
        </p>
      )}
      <div className='copy center'>© GuyanaParty</div>
    </Wrapper>
  )
}

export default Signup
