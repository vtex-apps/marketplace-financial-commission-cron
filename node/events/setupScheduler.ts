import type { EventContext } from '@vtex/api'

import type { Clients } from '../clients'
import { schedulerDashboardGenerate } from '../configs/schedulerDashboardGenerate'
import { constants } from '../constants'
import { generateToken } from '../utils'

const setupScheduler = async (ctx: EventContext<Clients>) => {
  const {
    clients: { scheduler, vbase },
    body: { to },
    vtex: { logger },
  } = ctx

  if (to) {
    const [appName] = to?.id?.split('@')

    if (
      appName.length &&
      `${process.env.VTEX_APP_VENDOR}.${process.env.VTEX_APP_NAME}` === appName
    ) {
      const bearerToken = await generateToken(256)

      logger.info({
        message: 'generated-bearerToken',
      })

      await vbase.saveJSON(
        constants.SCHEDULER_CONFIGURATIONS_BUCKET,
        constants.SCHEDULER_KEY,
        bearerToken
      )

      logger.info({
        message: 'savedOnVbase-bearerToken',
      })

      const schedulerRequest: SchedulerRequest = schedulerDashboardGenerate

      schedulerRequest.request.uri = `https://${ctx.vtex.workspace}--${ctx.vtex.account}.myvtex.com/_v/dashboard/generate`
      schedulerRequest.request.headers = {
        'cache-control': 'no-cache',
        Authorization: `Bearer ${bearerToken}`,
      }

      try {
        await scheduler.setInitialScheduler(schedulerRequest)
      } catch (error) {
        logger.error({
          message: 'saveScheduler-dashboardGenerateError',
          error,
        })
      }

      return true
    }
  }

  return null
}

export { setupScheduler }
