import * as inquirer from 'inquirer'
import { logger } from 'vtex'
import { ManifestEditor } from 'vtex/build/api/manifest'

import AppsReview from '../clients/appsReview'

export const submitApp = async (appId?: string) => {
  const appToSubmit =
    appId ?? (await ManifestEditor.getManifestEditor()).appLocator

  // validate if there's an appId

  // ask for the github username
  const { githubUsername } = await inquirer.prompt([
    {
      name: 'githubUsername',
      message: 'Submit your github username',
      type: 'input',
    },
  ])

  // ask for the live URL
  const { liveUrl } = await inquirer.prompt([
    {
      name: 'liveUrl',
      message: 'Submit a live Url where we can test your app',
      type: 'input',
    },
  ])

  logger.info('We are validating your data, please wait a few seconds')
  // create the client and call the method
  const client = AppsReview.createClient()

  try {
    const pullRequestUrl = await client.submitApp({
      appId: appToSubmit,
      githubUsername,
      liveUrl,
    })

    // show the pullrequest URL
    logger.info(`We've submitted the app ${appToSubmit} to review!`)
    logger.info(
      "You'll receive an e-mail inviting you to the newly-created repository where you'll be able to follow the status"
    )
    logger.info(`The pull request for this version is at: ${pullRequestUrl}`)
  } catch (e) {
    // show error if something went wrong
    logger.error(e.response.data.message)
  }
}
