/* eslint-disable no-await-in-loop */
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

      try {
        const dayYesterday = new Date(
          new Date().setDate(new Date().getDate() - 1)
        )

        const dateOneMonthAgo = new Date(
          dayYesterday.getTime() - 30 * 24 * 60 * 60 * 1000
        )

        const result: any[] = []

        let loop = dateOneMonthAgo
        const endLoop = dayYesterday

        const processGenerate = async () => {
          while (loop <= endLoop) {
            const [dayToProcess] = loop.toISOString().split('T')
            let params = ''

            params = `dateStart=${dayToProcess}&dateEnd=${dayToProcess}`

            const responseSer =
              await marketFinancialCommission.dashboardGenerate(params)

            result.push(responseSer)

            logger.info({
              message: `setupScheduler-setDashboardGenerateFor30Days`,
              params,
              generate: JSON.stringify(responseSer),
            })

            const newDate = loop.setDate(loop.getDate() + 1)

            loop = new Date(newDate)
            console.info({ loop })

            await delay(2000)
          }

          logger.info({
            message: `DashboardGenerateFor30Days`,
            generate: JSON.stringify(result),
          })
        }

        processGenerate()
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

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
