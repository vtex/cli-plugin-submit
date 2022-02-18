import { AppClient, InstanceOptions, IOContext } from '@vtex/api'
import { IOClientFactory } from 'vtex'

export default class AppStoreSeller extends AppClient {
  public static readonly DEFAULT_TIMEOUT = 30000

  private readonly routes = {
    reviews: () => `/_v/vtex.app-store-seller/reviews`,
  }

  public static createClient(
    customContext: Partial<IOContext> = {},
    customOptions: Partial<InstanceOptions> = {}
  ) {
    return IOClientFactory.createClient<AppStoreSeller>(
      AppStoreSeller,
      customContext,
      {
        timeout: AppStoreSeller.DEFAULT_TIMEOUT,
        ...customOptions,
      }
    )
  }

  constructor(context: IOContext, options?: InstanceOptions) {
    super('vtex.app-store-seller@0.x', { ...context }, options)
  }

  public submitApp = async (data: SubmitInput) => {
    return this.http.post(this.routes.reviews(), data)
  }
}

type SubmitInput = {
  appId: string
  liveUrl: string
  githubUsername: string
}
