import { ManifestEditor } from 'vtex/build/api/manifest'

export const submitApp = async (appId?: string) => {
  const appToSubmit = appId || (await ManifestEditor.getManifestEditor()).appLocator

  // validate if there's an appId
  // ask for the github username
  // ask for the live URL
  // create the client and call the method
  // show the pullrequest URL
  // show error if something went wrong

  console.log('Submitting for app ' + appToSubmit)
}
