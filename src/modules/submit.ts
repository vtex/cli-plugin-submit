import * as inquirer from 'inquirer'
import { logger } from 'vtex'
import { ManifestEditor } from 'vtex/build/api/manifest'
import { SessionManager } from 'vtex/build/api/session/SessionManager'

import AppStoreSeller from '../clients/appStoreSeller'
import { Messages } from '../lib/constants/Messages'

const handleSubmitAppError = (e: any) => {
  const response = e?.response
  const status = response?.status

  switch (status) {
    case 400: {
      logger.error(Messages.OBJECT_FORMAT, JSON.parse(response?.data?.message))
      break
    }

    case 404: {
      logger.error(Messages.APP_STORE_SELLER_NOT_FOUND)
      break
    }

    case 412: {
      logger.error(Messages.APP_STORE_SELLER_NOT_CONFIGURED)
      break
    }

    default: {
      logger.error(e.response?.data)
    }
  }
}

export const submitApp = async (appToSubmit?: string) => {
  const appId =
    appToSubmit ?? (await ManifestEditor.getManifestEditor()).appLocator

  // validates if the user is logged in the same account of the app's vendor
  const [vendorAndName] = appId.split('@')
  const [appVendor] = vendorAndName.split('.')
  const accountVendor = SessionManager.getSingleton().account

  if (appVendor !== accountVendor) {
    logger.error(Messages.DIFFERENT_VENDORS)

    return
  }

  const { githubUsername } = await inquirer.prompt([
    {
      name: 'githubUsername',
      message: Messages.ENTER_GITHUB_USERNAME,
      type: 'input',
    },
  ])

  const { liveUrl } = await inquirer.prompt([
    {
      name: 'liveUrl',
      message: Messages.ENTER_STATUS_CHECK_URL,
      type: 'input',
    },
  ])

  const appStoreSellerClient = AppStoreSeller.createClient()

  logger.info(Messages.WAIT_VALIDATION)

  try {
    const pullRequestUrl = await appStoreSellerClient.submitApp({
      appId,
      githubUsername,
      liveUrl,
    })

    logger.info(Messages.OPENING_PULL_REQUEST)

    logger.info(Messages.appSubmitted(appToSubmit))
    logger.info(Messages.CHECK_EMAIL)
    logger.info(Messages.checkPullRequestUrl(pullRequestUrl))
  } catch (e) {
    handleSubmitAppError(e)
  }
}
