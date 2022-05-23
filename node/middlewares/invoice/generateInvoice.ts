export async function generateInvoice(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { invoiceFinancialComission },
    vtex: { logger },
  } = ctx

  try {
    const response = await invoiceFinancialComission.generateInvoice()

    logger.info({
      message: 'outgoing-generateInvoice',
      data: response,
    })
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
