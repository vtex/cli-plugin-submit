import * as inquirer from 'inquirer'
import { logger } from 'vtex'
import { ManifestEditor } from 'vtex/build/api/manifest'

import AppsReview from '../clients/appsReview'

export const submitApp = async (appToSubmit?: string) => {
  const appId =
    appToSubmit ?? (await ManifestEditor.getManifestEditor()).appLocator

  logger.info(
    "We will open a Pull Request with your app's code. You'll be able to check the review status directly from Gitub."
  )

  const { githubUsername } = await inquirer.prompt([
    {
      name: 'githubUsername',
      message: 'Enter your Github username',
      type: 'input',
    },
  ])

  const { liveUrl } = await inquirer.prompt([
    {
      name: 'liveUrl',
      message:
        'Enter a URL from where we can test your app working. It can be in your workspace',
      type: 'input',
    },
  ])

  logger.info('We are validating your data, please wait a few seconds')

  const client = AppsReview.createClient()

  try {
    const pullRequestUrl = await client.submitApp({
      appId,
      githubUsername,
      liveUrl,
    })

    logger.info(`We've submitted the app ${appToSubmit} to review!`)
    logger.info(
      "You'll receive an e-mail inviting you to the newly-created repository where you'll be able to follow the status"
    )
    logger.info(`The pull request for this version is at: ${pullRequestUrl}`)
  } catch (e) {
    logger.error(e.response.data.message)
  }
}
