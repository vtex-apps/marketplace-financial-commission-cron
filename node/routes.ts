import { method } from '@vtex/api'

import { generateDashboard } from './middlewares/dashboard/generateDashboard'
import { generateInvoice } from './middlewares/invoice/generateInvoice'
import { schedulerAuthenticationDashboard } from './middlewares/scheduler/schedulerAuthenticationDashboard'
import { schedulerAuthenticationInvoice } from './middlewares/scheduler/schedulerAuthenticationInvoice'

const routes = {
  dashboardGenerate: method({
    POST: [schedulerAuthenticationDashboard, generateDashboard],
  }),
  invoiceGenerate: method({
    POST: [schedulerAuthenticationInvoice, generateInvoice],
  }),
}

export { routes }
