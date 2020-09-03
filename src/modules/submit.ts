import * as inquirer from 'inquirer'
import { prop, filter, compose, equals } from 'ramda'
import { logger } from 'vtex'
import { ManifestEditor } from 'vtex/build/api/manifest'
import { SessionManager } from 'vtex/build/api/session/SessionManager'
import { createAppsClient } from 'vtex/build/api/clients/IOClients/infra/Apps'

import AppStoreSeller from '../clients/appStoreSeller'

export const submitApp = async (appToSubmit?: string) => {
  const appId =
    appToSubmit ?? (await ManifestEditor.getManifestEditor()).appLocator

  // validates if the user is logged in the same account of the app's vendor
  const [vendorAndName] = appId.split('@')
  const [appVendor] = vendorAndName.split('.')
  const accountVendor = SessionManager.getSingleton().account

  if (appVendor !== accountVendor) {
    logger.error(
      "You are trying to submit this app in an account that differs from the app's vendor."
    )

    return
  }

  // validates if the app is installed on the account
  const { listApps } = createAppsClient()
  const appArray = await listApps().then(prop('data'))
  const filterBySource = (source: string) =>
    filter(compose<any, string, boolean>(equals(source), prop('_source')))

  const appInstalledArray = filterBySource('installation')(appArray)

  if (!appInstalledArray.find((item) => item.app === appId)) {
    logger.error("The app you're trying to submit must be installed on this workspace")

    return
  }

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

  const appStoreSellerClient = AppStoreSeller.createClient()

  logger.info('We are validating your data, please wait a few seconds')

  try {
    const pullRequestUrl = await appStoreSellerClient.submitApp({
      appId,
      githubUsername,
      liveUrl,
    })

    logger.info(
      "We will open a Pull Request with your app's code. You'll be able to check the review status directly from Gitub."
    )

    logger.info(`We've submitted the app ${appToSubmit} to review!`)
    logger.info(
      "You'll receive an e-mail inviting you to the newly-created repository where you'll be able to follow the status"
    )
    logger.info(`The pull request for this version is at: ${pullRequestUrl}`)
  } catch (e) {
    const status = e.response?.status

    if (status === 404) {
      logger.error("We couldn't find the App Store Seller app installed.")
    } else if (status === 412) {
      logger.error(
        'We found the App Store Seller installed, but you need to do the setup.'
      )
    } else {
      logger.error(e.response?.data)
    }
  }
}
