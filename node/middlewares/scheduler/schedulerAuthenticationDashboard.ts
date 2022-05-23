import { AuthenticationError } from '@vtex/api'

import { constants } from '../../constants'

export async function schedulerAuthenticationDashboard(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { vbase },
    request: { header },
    vtex: { logger },
  } = ctx

  const autheticationToken = await vbase.getJSON(
    constants.SCHEDULER_CONFIGURATIONS_BUCKET,
    constants.SCHEDULER_KEY
  )

  const verifyToken = async (): Promise<void> => {
    const bearerHeader = header.authorization

    if (bearerHeader) {
      const bearer = bearerHeader.split(' ')

      if (autheticationToken !== bearer[1]) {
        logger.warn({
          message: 'incoming-wrongApiKey',
        })
        throw new AuthenticationError('Unauthorized')
      }
    } else {
      logger.warn({
        message: 'incoming-missingApiKey',
      })
      throw new AuthenticationError('Unauthorized')
    }
  }

  await verifyToken()

  await next()
}
