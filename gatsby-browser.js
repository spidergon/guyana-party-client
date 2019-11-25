/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

const onServiceWorkerUpdateReady = () => {
  const answer = window.confirm(
    'Cette application a été mise à jour. Voulez-vous recharger la page ?'
  )
  if (answer === true) window.location.reload()
}

export default onServiceWorkerUpdateReady
