export async function generate(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { marketFinancialCommission },
    vtex: { logger },
  } = ctx

  try {
    const response = await marketFinancialCommission.dashboardGenerate()

    logger.info({
      message: 'outgoing-dashboardGenerateResponse',
      data: response,
    })
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
