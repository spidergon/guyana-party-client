import React, { useState } from 'react'
import { navigate } from 'gatsby'
import styled from 'styled-components'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login'
import isEmail from 'validator/lib/isEmail'
import Button from './Button'
import { If, Link } from './addons'
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
    button.facebook {
      margin-bottom: 15px;
    }
    .or-div {
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
    }
    form {
      margin: 0;
      font-size: 15px;
      .pass-section {
        margin-top: 18px;
      }
      input {
        position: relative;
        width: 100%;
        height: 50px;
        background-color: transparent;
        padding: 0 15px;
        border: 1px solid rgb(206, 210, 217);
        border-radius: 4px;
        font-size: 16px;
      }
      .error {
        label {
          color: rgb(248, 99, 73);
          font-weight: 600;
        }
        input {
          background-color: rgb(254, 245, 231);
          border-color: rgb(248, 187, 73);
        }
      }
    }
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

function Login () {
  const [email, setEmail] = useState('spidergon@gmail.com')
  const [password, setPassword] = useState('azer1234')
  const [emailOk, setEmailOk] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

  const {
    loading: initializing,
    user,
    loginFacebook,
    loginGoogle,
    loginEmail
  } = useAuth()

  const loginGoogleHandle = response => {
    setLoading(true)
    loginGoogle(
      response,
      () => navigate('/app'),
      error => {
        setLoading(false)
        showSnack('La connexion a echoué !', 'error')
        console.log(error)
      }
    )
  }

  const checkEmail = value => {
    if (!value) return setEmailError('Veuillez entrer votre adresse email')
    if (!isEmail(value)) return setEmailError("L'email est invalide")
    if (emailError) setEmailError('')
  }

  const validate = e => {
    e.preventDefault()
    checkEmail(email)
    if (!emailOk && email && !emailError) {
      setEmailOk(true)
    } else if (emailOk) {
      if (!password) return setPasswordError('Le mot de passe est requis')
      if (passwordError) setPasswordError('')
      setLoading(true)
      loginEmail(
        email,
        password,
        () => {
          const redirect =
            typeof window !== 'undefined' &&
            window.location.search.split('=')[1]
          if (redirect) return navigate(redirect)
          navigate('/app')
        },
        error => {
          setLoading(false)
          setPassword('')
          showSnack('La connexion a echoué !', 'error')
          console.log(error)
        }
      )
    }
  }

  return (
    <Wrapper>
      <h1>Connexion</h1>
      <If
        condition={!initializing && !user}
        otherwise={<p className='center'>Vous êtes déjà connecté(e).</p>}
      >
        <div className='content'>
          <FacebookLogin
            appId={process.env.FACEBOOK_APP_ID}
            autoLoad
            callback={loginFacebook}
            fields='name,email,picture'
            render={({ onClick, disabled }) => (
              <Button
                className='facebook fb_bg'
                disabled={loading || disabled}
                onClick={onClick}
                text='Connexion avec Facebook'
              />
            )}
          />
          <GoogleLogin
            clientId={process.env.GOOGLE_APP_ID}
            cookiePolicy='single_host_origin'
            onFailure={loginGoogleHandle}
            onSuccess={loginGoogleHandle}
            render={({ onClick, disabled }) => (
              <Button
                className='google g_bg'
                disabled={loading || disabled}
                onClick={onClick}
                text='Connexion avec Google'
              />
            )}
          />
          <div className='or-div'>
            <div />
            <span>ou</span>
            <div />
          </div>
          <form autoComplete='off'>
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
            <If condition={emailOk}>
              <div className={`pass-section ${passwordError ? 'error' : ''}`}>
                <label htmlFor='password'>
                  {passwordError || 'Mot de passe'}
                </label>
                <input
                  disabled={loading}
                  id='password'
                  onChange={e => setPassword(e.target.value)}
                  type='password'
                  value={password}
                />
              </div>
            </If>
            <Button
              disabled={loading}
              onClick={validate}
              text={
                emailOk
                  ? loading
                    ? 'Connexion...'
                    : 'Se connecter'
                  : 'Suivant'
              }
            />
          </form>
        </div>
        <p className='signup-link center'>
          <Link to='/signup'>Vous n&rsquo;avez pas de compte ?</Link>
        </p>
        <div className='copy center'>© GuyanaParty</div>
      </If>
    </Wrapper>
  )
}

export default Login
