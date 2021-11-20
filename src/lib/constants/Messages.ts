export const Messages = {
  OBJECT_FORMAT: '%o',
  APP_STORE_SELLER_NOT_FOUND:
    'You must have the `vtex.app-store-seller` app installed in order to submit apps.',

  APP_STORE_SELLER_NOT_CONFIGURED:
    'This account is not configured to submit apps to VTEX App Store. Please, follow the steps described on: http://bit.ly/vtex-app-store-pub',

  DIFFERENT_VENDORS:
    "You are trying to submit this app in an account that differs from the app's vendor.",

  APP_NOT_INSTALLED:
    "The app you're trying to submit must be installed on this workspace.",
  ENTER_GITHUB_USERNAME: 'Enter your Github username',
  ENTER_STATUS_CHECK_URL:
    'Enter a URL from where we can test your app working. It can be in your workspace',
  WAIT_VALIDATION: 'We are validating your data, please wait a few seconds',

  OPENING_PULL_REQUEST:
    "We will open a Pull Request with your app's code. You'll be able to check the review status directly from Gitub.",
  CHECK_EMAIL:
    "You'll receive an e-mail inviting you to the newly-created repository where you'll be able to follow the status",
  appSubmitted: (app?: string) => `We've submitted the app ${app} to review!`,
  checkPullRequest: (vendorAndName: string) =>
    `When created, the pull request for this version will be at: https://github.com/vtex-reviews/${vendorAndName}/pulls`,
}
