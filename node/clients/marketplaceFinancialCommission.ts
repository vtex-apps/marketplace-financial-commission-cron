import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppClient } from '@vtex/api'

export default class MarketFinancialCommission extends AppClient {
  private routes: Routes = {
    dashboardGenerate: {
      endpoint: 'dashboard/generate',
      metric: 'dashboardGenerate',
    },
  }

  constructor(context: IOContext, options?: InstanceOptions) {
    // TODO: update the app version
    super('vtex.marketplace-financial-commission@0.x', context, options)
  }

  private getMarketplaceFinancialCommission = async (
    route: Route,
    retries = 3
  ): Promise<any> => {
    const response = await this.http
      .post(route.endpoint, {
        metric: `marketplaceFinancialCommission-${route.metric}`,
        headers: {
          VtexIdclientAutCookie: this.context.authToken,
        },
        // TODO: update the app version
        baseURL: `http://app.io.vtex.com/vtex.marketplace-financial-commission/v0/${this.context.account}/${this.context.workspace}`,
      })
      .catch((error) => {
        console.error({
          msj: `Error to generate dashboard - Endpoint ${route.endpoint}`,
          messageError: error.message,
          statusError: error.status,
        })

        this.context.logger.error({
          message: 'dashboardGenerateError',
          error,
          route: route.endpoint,
        })

        if (retries > 0) {
          console.info(`Starting retry --------> ${retries}`)

          return this.getMarketplaceFinancialCommission(route, retries - 1)
        }

        const resultError = {
          msj: `Error to generate dashboard - Endpoint ${route.endpoint}`,
          messageError: error.message,
          statusError: error.status,
        }

        return resultError
      })

    return response
  }

  public dashboardGenerate = async (params?: any): Promise<any> => {
    try {
      if (params) {
        const route: Route = {
          endpoint: `${this.routes.dashboardGenerate.endpoint}?${params}`,
          metric: 'dashboardGenerate',
        }

        const reponse = await this.getMarketplaceFinancialCommission(route)

        return reponse
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
