import { method } from '@vtex/api'

import { generate } from './middlewares/dashboard/generate'
import { schedulerAuthentication } from './middlewares/scheduler/schedulerAuthentication'

const routes = {
  dashboardGenerate: method({
    POST: [schedulerAuthentication, generate],
  }),
}

export { routes }
