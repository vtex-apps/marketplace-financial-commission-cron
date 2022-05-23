/* eslint-disable no-await-in-loop */
import type { EventContext } from '@vtex/api'

import type { Clients } from '../clients'
import { schedulerTemplate } from '../configs/schedulerTemplate'
import { constants } from '../constants'
import { generateToken } from '../utils'

const setupSchedulerInvoice = async (ctx: EventContext<Clients>) => {
  const {
    clients: { scheduler, vbase },
    body: { to, from },
    vtex: { logger, production },
  } = ctx

  if (production !== true) {
    logger.info({
      message: 'setupSchedulerInvoice-notProduction',
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
        message: 'setupSchedulerInvoice-bearerToken',
        data: bearerToken,
      })

      await vbase.saveJSON(
        constants.SCHEDULER_CONFIGURATIONS_BUCKET,
        constants.SCHEDULER_KEY_INVOICE,
        bearerToken
      )

      logger.info({
        message: 'setupSchedulerInvoice-savedOnVbase',
      })

      const schedulerRequest: SchedulerRequest = schedulerTemplate

      schedulerRequest.id = 'invoice-generate'
      schedulerRequest.request.uri = `https://${ctx.vtex.workspace}--${ctx.vtex.account}.myvtex.com/_v/scheduler/invoice/generate`
      schedulerRequest.request.headers = {
        'cache-control': 'no-cache',
        Authorization: `Bearer ${bearerToken}`,
      }

      try {
        await scheduler.setInitialScheduler(appName, schedulerRequest)
        logger.info({
          message: 'setupSchedulerInvoice-setInvoiceGenerate',
        })
      } catch (error) {
        logger.error({
          message: 'setupSchedulerInvoice-setInvoiceGenerateError',
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
        constants.SCHEDULER_KEY_INVOICE
      )

      logger.info({
        message: 'setupSchedulerInvoice-deleteBearerTokenVBase',
      })

      const idName = 'invoice-generate'

      try {
        await scheduler.deleteScheduler(appName, idName)
        logger.info({
          message: 'setupSchedulerInvoice-deleteInvoiceGenerate',
        })
      } catch (error) {
        logger.error({
          message: 'setupSchedulerInvoice-deleteInvoiceGenerateError',
          error,
        })
      }

      return true
    }
  }

  return null
}

export { setupSchedulerInvoice }
