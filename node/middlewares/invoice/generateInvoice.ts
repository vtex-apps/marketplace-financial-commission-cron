export async function generateInvoice(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { invoiceFinancialComission, typeIntegration },
    vtex: { logger },
  } = ctx

  try {
    const { integration } = await typeIntegration.typeIntegration()

    if (
      integration === '1' ||
      integration === undefined ||
      integration === null
    ) {
      const response = await invoiceFinancialComission.generateInvoice()

      logger.info({
        message: 'outgoing-generateInvoice',
        data: response,
      })
    } else {
      logger.info({
        message:
          'The Invoice does not perform the automatic generation since the financial-commission app is configured as external integration.',
      })
    }

    ctx.status = 200
    ctx.body = 'ok'
  } catch (error) {
    logger.error({
      message: 'outgoing-generateInvoiceError',
      error,
    })
    ctx.status = 500
  }

  await next()
}
