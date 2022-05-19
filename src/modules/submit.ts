import * as inquirer from 'inquirer'
import { compose, equals, filter, prop } from 'ramda'
import { createAppsClient, logger, ManifestEditor, SessionManager } from 'vtex'

import AppStoreSeller from '../clients/appStoreSeller'
import { Messages } from '../lib/constants/Messages'

const VTEX_VENDOR = 'vtex'
const APP_STORE_ACCOUNT = 'extensions'

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
      e.response
        ? logger.error(e.response.data.message)
        : logger.error(e.message)
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

  if (
    !(appVendor === accountVendor || isFirstPartyApp(accountVendor, appVendor))
  ) {
    logger.error(Messages.DIFFERENT_VENDORS)

    return
  }

  // validates if the app is installed on the account
  const { listApps } = createAppsClient()
  const appArray = await listApps().then(prop('data'))
  const filterBySource = (source: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    filter(compose<any, string, boolean>(equals(source), prop('_source')))

  const appInstalledArray = filterBySource('installation')(appArray)

  if (!appInstalledArray.some(({ app }) => app === appId)) {
    logger.error(Messages.APP_NOT_INSTALLED)

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
    await appStoreSellerClient.submitApp({
      appId,
      githubUsername,
      liveUrl,
    })

    logger.info(Messages.OPENING_PULL_REQUEST)
    logger.info(Messages.CHECK_EMAIL)
    logger.info(Messages.checkPullRequest(vendorAndName))
  } catch (e) {
    handleSubmitAppError(e)
  }
}

function isFirstPartyApp(runningAccount: string, appVendor: string) {
  return (
    (runningAccount === APP_STORE_ACCOUNT ||
      runningAccount.startsWith(VTEX_VENDOR)) &&
    appVendor === VTEX_VENDOR
  )
}
