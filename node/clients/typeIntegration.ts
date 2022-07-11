import type { InstanceOptions, IOContext } from '@vtex/api'
import { AppClient } from '@vtex/api'

export default class TypeIntegration extends AppClient {
  private baseURL = `http://app.io.vtex.com/vtex.marketplace-financial-commission/v0/${this.context.account}/${this.context.workspace}`

  constructor(context: IOContext, options?: InstanceOptions) {
    // TODO: update the app version
    super('vtex.marketplace-financial-commission@0.x', context, options)
  }

  private getTypeIntegration = async (route: string) => {
    const response = await this.http.get(route, {
      headers: {
        VtexIdclientAutCookie: this.context.authToken,
      },
      baseURL: this.baseURL,
    })

    return response
  }

  public typeIntegration = async (): Promise<any> => {
    try {
      const response = await this.getTypeIntegration(
        this.routes.typeIntegration()
      )

      return response
    } catch (error) {
      this.context.logger.error({
        message: 'Get Type Integration Error',
        error,
      })

      throw new Error('Get Type Integration Error')
    }
  }

  private get routes() {
    const baseRoute = `_v/policy/financial-commission`

    return {
      typeIntegration: () => `/${baseRoute}/typeIntegration`,
    }
  }
}
