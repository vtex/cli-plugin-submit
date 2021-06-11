import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppClient } from '@vtex/api'
import { IOClientFactory } from 'vtex'

export default class AppStoreSeller extends AppClient {
  public static readonly DEFAULT_RETRIES = 1
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
        retries: AppStoreSeller.DEFAULT_RETRIES,
        timeout: AppStoreSeller.DEFAULT_TIMEOUT,
        ...customOptions,
      }
    )
  }

  constructor(context: IOContext, options?: InstanceOptions) {
    super('vtex.app-store-seller@0.x', { ...context }, options)
  }

  public submitApp = async (data: SubmitInput) => {
    const response = await this.http.post<SubmitResponse>(
      this.routes.reviews(),
      data
    )

    return response
  }
}

type SubmitInput = {
  appId: string
  liveUrl: string
  githubUsername: string
}

export type SubmitResponse = {
  created: boolean
  pullRequestUrl: string
}
