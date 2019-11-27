import { createGlobalState } from 'react-hooks-global-state'

const defaultState = {
  snack: { msg: '', variant: '' }
}

export const {
  GlobalStateProvider,
  setGlobalState,
  useGlobalState
} = createGlobalState(defaultState)

/**
 * Show a snackbar containing a message.
 * @param {string} msg - the message to display.
 * @param {string} [variant] - the variant of the message (default: 'success').
 */
export const showSnack = (msg, variant = 'success') =>
  setGlobalState('snack', { msg, variant })
