import type { EventContext } from '@vtex/api'

import type { Clients } from '../clients'
import { schedulerTemplate } from '../configs/schedulerTemplate'
import { constants } from '../constants'
import { generateToken } from '../utils'

const setupScheduler = async (ctx: EventContext<Clients>) => {
  const {
    clients: { scheduler, vbase, marketFinancialCommission },
    body: { to, from },
    vtex: { logger, production },
  } = ctx

  if (production !== true) {
    logger.info({
      message: 'setupScheduler-notProduction',
      data: `production: ${production}`,
    })

    return true
  }

  if (to) {
    const [appName] = to?.id?.split('@')

    if (
      appName.length &&
      `${process.env.VTEX_APP_VENDOR}.${process.env.VTEX_APP_NAME}` === appName
    ) {
      const bearerToken = await generateToken(256)

      logger.info({
        message: 'setupScheduler-bearerToken',
        data: bearerToken,
      })

      await vbase.saveJSON(
        constants.SCHEDULER_CONFIGURATIONS_BUCKET,
        constants.SCHEDULER_KEY,
        bearerToken
      )

      logger.info({
        message: 'setupScheduler-savedOnVbase',
      })

      const schedulerRequest: SchedulerRequest = schedulerTemplate

      schedulerRequest.id = 'dashboard-generate'
      schedulerRequest.request.uri = `https://${ctx.vtex.workspace}--${ctx.vtex.account}.myvtex.com/_v/scheduler/dashboard/generate`
      schedulerRequest.request.headers = {
        'cache-control': 'no-cache',
        Authorization: `Bearer ${bearerToken}`,
      }

      try {
        await scheduler.setInitialScheduler(appName, schedulerRequest)
        logger.info({
          message: 'setupScheduler-setDashboardGenerate',
        })
      } catch (error) {
        logger.error({
          message: 'setupScheduler-setDashboardGenerateError',
          error,
        })
      }

      const dateNow = new Date()
      const dateOneMonthAgo = new Date(
        dateNow.getTime() - 30 * 24 * 60 * 60 * 1000
      )

      const params = `dateNow=${dateNow.toISOString()}&dateOneMonthAgo=${dateOneMonthAgo.toISOString()}`

      try {
        await marketFinancialCommission.dashboardGenerate(params)
        logger.info({
          message: 'setupScheduler-setDashboardGenerateFor30Days',
        })
      } catch (error) {
        logger.error({
          message: 'setupScheduler-setDashboardGenerateFor30Days',
          error,
        })
      }

      return true
    }
  } else if (from) {
    const [appName] = from?.id?.split('@')

    if (
      appName.length &&
      `${process.env.VTEX_APP_VENDOR}.${process.env.VTEX_APP_NAME}` === appName
    ) {
      await vbase.deleteFile(
        constants.SCHEDULER_CONFIGURATIONS_BUCKET,
        constants.SCHEDULER_KEY
      )

      logger.info({
        message: 'setupScheduler-deleteBearerTokenVBase',
      })

      const idName = 'dashboard-generate'

      try {
        await scheduler.deleteScheduler(appName, idName)
        logger.info({
          message: 'setupScheduler-deleteDashboardGenerate',
        })
      } catch (error) {
        logger.error({
          message: 'setupScheduler-deleteDashboardGenerateError',
          error,
        })
      }

      return true
    }
  }

  return null
}

export { setupScheduler }
