import type { ParamsContext, RecorderState } from '@vtex/api'
import { Service } from '@vtex/api'

import type { Clients } from './clients'
import { clients } from './clients'
import { events } from './events'
import { routes } from './routes'

export default new Service<Clients, RecorderState, ParamsContext>({
  clients,
  events,
  routes,
})
