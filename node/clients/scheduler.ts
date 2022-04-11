import type { InstanceOptions, IOContext } from '@vtex/api'
import { JanusClient } from '@vtex/api'

export default class Scheduler extends JanusClient {
  constructor(context: IOContext, options?: InstanceOptions) {
    super(context, {
      ...options,
      headers: {
        ...options?.headers,
        VtexIdclientAutCookie: context.authToken,
      },
    })
  }

  public setInitialScheduler = async (
    schedulerData: SchedulerRequest
  ): Promise<void> => {
    await this.http.put(
      '/api/scheduler/master/marketplace-financial-commission/?version=4',
      schedulerData,
      {
        metric: `schedulerMarketplaceFinancialCommissionCron-setup`,
        headers: {
          VtexIdclientAutCookie: this.context.authToken,
        },
      }
    )
  }
}
