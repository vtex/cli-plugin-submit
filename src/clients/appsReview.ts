import { InstanceOptions, AppClient, IOContext } from '@vtex/api'
import { IOClientFactory } from 'vtex/build/api/clients/IOClients/IOClientFactory'

export default class AppsReview extends AppClient {
  public static readonly DEFAULT_TIMEOUT = 30000

  private readonly routes = {
    submissions: () => `/submissions`,
  }

  public static createClient(
    customContext: Partial<IOContext> = {},
    customOptions: Partial<InstanceOptions> = {}
  ) {
    return IOClientFactory.createClient<AppsReview>(AppsReview, customContext, {
      timeout: AppsReview.DEFAULT_TIMEOUT,
      ...customOptions,
    })
  }

  constructor(context: IOContext, options?: InstanceOptions) {
    super(
      'vtex.apps-review@0.x',
      { ...context, account: 'appliancetheme', workspace: 'elizabeth' },
      options
    )
  }

  public submitApp = async (data: SubmitInput) => {
    const response = await this.http.post<SubmitResponse>(
      this.routes.submissions(),
      data
    )

    return response.pullRequestUrl
  }
}

type SubmitInput = {
  appId: string
  liveUrl: string
  githubUsername: string
}

type SubmitResponse = {
  created: boolean
  pullRequestUrl: string
}
