import { navigate } from 'gatsby'
import React, { useState } from 'react'
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import GoogleLogin from 'react-google-login'
import isEmail from 'validator/lib/isEmail'
import { useAuth } from '../lib/services/authService'
import { If, Link } from './addons'
import Button from './Button'
import { showSnack } from './Snack'
import { FormWrapper, LoginWrapper as Wrapper, OrDivWrapper } from './styles/LoginStyled'

function Login() {
  const [email, setEmail] = useState('spidergon@gmail.com')
  const [password, setPassword] = useState('azer1234')
  const [emailOk, setEmailOk] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

  const { loading: initializing, user, loginFacebook, loginGoogle, loginEmail } = useAuth()

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
        { email, password },
        () => {
          const redirect = typeof window !== 'undefined' && window.location.search.split('=')[1]
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
          <OrDivWrapper className='or-div'>
            <div />
            <span>ou</span>
            <div />
          </OrDivWrapper>
          <FormWrapper autoComplete='off'>
            <div className={`email-section ${emailError ? 'error' : ''}`}>
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
                <label htmlFor='password'>{passwordError || 'Mot de passe'}</label>
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
              text={emailOk ? (loading ? 'Connexion...' : 'Se connecter') : 'Suivant'}
            />
          </FormWrapper>
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
