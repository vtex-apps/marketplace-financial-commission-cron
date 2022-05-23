import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppClient } from '@vtex/api'

export default class InvoiceFinancialCommission extends AppClient {
  private routes: Routes = {
    generateInvoice: {
      endpoint: 'invoice/generate',
      metric: 'GenerateInvoice',
    },
  }

  constructor(context: IOContext, options?: InstanceOptions) {
    // TODO: update the app version
    super('vtex.marketplace-financial-commission@0.x', context, options)
  }

  private generateInvoiceFinancialCommission = async (
    route: Route,
    retries = 3
  ): Promise<any> => {
    const response = await this.http
      .get(route.endpoint, {
        metric: `marketplaceFinancialCommission-${route.metric}`,
        headers: {
          VtexIdclientAutCookie: this.context.authToken,
        },
        // TODO: update the app version
        baseURL: `http://app.io.vtex.com/vtex.marketplace-financial-commission/v0/${this.context.account}/${this.context.workspace}`,
      })
      .catch((error) => {
        console.error({
          msj: `Error to generate invoice - Endpoint ${route.endpoint}`,
          messageError: error.message,
          statusError: error.status,
        })

        this.context.logger.error({
          message: 'generateInvoiceError',
          error,
          route: route.endpoint,
        })

        if (retries > 0) {
          console.info(`Starting retry Invoices --------> ${retries}`)

          return this.generateInvoiceFinancialCommission(route, retries - 1)
        }

        const resultError = {
          msj: `Error to generate invoice - Endpoint ${route.endpoint}`,
          messageError: error.message,
          statusError: error.status,
        }

        return resultError
      })

    return response
  }

  public generateInvoice = async (): Promise<any> => {
    try {
      const response = await this.generateInvoiceFinancialCommission(
        this.routes.generateInvoice
      )

      return response
    } catch (error) {
      this.context.logger.error({
        message: 'generateInvoiceError',
        error,
      })

      throw new Error('generateInvoice error')
    }
  }
}
