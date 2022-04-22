import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppClient } from '@vtex/api'

export default class MarketFinancialCommission extends AppClient {
  private routes: Routes = {
    dashboardGenerate: {
      endpoint: '_v/dashboard/generate',
      metric: 'dashboardGenerate',
    },
  }

  constructor(context: IOContext, options?: InstanceOptions) {
    // TODO: update the app version
    super('vtex.marketplace-financial-commission@0.x', context, options)
  }

  private getMarketplaceFinancialCommission = async (
    route: Route
  ): Promise<any> => {
    const response = await this.http.get(route.endpoint, {
      metric: `marketplaceFinancialCommission-${route.metric}`,
      headers: {
        VtexIdclientAutCookie: this.context.authToken,
      },
      // TODO: update the app version
      baseURL: `http://app.io.vtex.com/vtex.marketplace-financial-commission/v0/${this.context.account}/${this.context.workspace}`,
    })

    return response
  }

  public dashboardGenerate = async (params?: any): Promise<any> => {
    try {
      if (params) {
        this.routes.dashboardGenerate.endpoint = `${this.routes.dashboardGenerate}?${params}`
      }

      const reponse = await this.getMarketplaceFinancialCommission(
        this.routes.dashboardGenerate
      )

      return reponse
    } catch (error) {
      this.context.logger.error({
        message: 'dashboardGenerateError',
        error,
      })

      throw new Error('dashboardGenerate error')
    }
  }
}
