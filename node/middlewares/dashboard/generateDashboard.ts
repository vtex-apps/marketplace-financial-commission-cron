export async function generateDashboard(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { marketFinancialCommission, typeIntegration },
    vtex: { logger },
  } = ctx

  try {
    const { integration } = await typeIntegration.typeIntegration()

    if (
      integration === '1' ||
      integration === undefined ||
      integration === null
    ) {
      const response = await marketFinancialCommission.dashboardGenerate()

      logger.info({
        message: 'outgoing-dashboardGenerateResponse',
        data: response,
      })
    } else {
      logger.info({
        message:
          'The Dashboard does not perform the automatic generation since the financial-commission app is configured as external integration.',
      })
    }

    ctx.status = 200
    ctx.body = 'ok'
  } catch (error) {
    logger.error({
      message: 'outgoing-dashboardGenerateResponseError',
      error,
    })
    ctx.status = 500
  }

  await next()
}
