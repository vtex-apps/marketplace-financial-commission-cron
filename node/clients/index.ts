import type { ClientsConfig } from '@vtex/api'
import { IOClients, LRUCache } from '@vtex/api'

import MarketFinancialCommission from './marketplaceFinancialCommission'
import Scheduler from './scheduler'

export class Clients extends IOClients {
  public get marketFinancialCommission() {
    return this.getOrSet('marketFinancialCommission', MarketFinancialCommission)
  }

  public get scheduler() {
    return this.getOrSet('scheduler', Scheduler)
  }
}

const TIMEOUT_MS = 10000
const CONCURRENCY = 2
const memoryCache = new LRUCache<string, any>({ max: 5000 })

metrics.trackCache('financial-commission-cron', memoryCache)

export const clients: ClientsConfig<Clients> = {
  implementation: Clients,
  options: {
    default: {
      retries: 2,
      timeout: TIMEOUT_MS,
      memoryCache,
    },
    events: {
      exponentialTimeoutCoefficient: 2,
      exponentialBackoffCoefficient: 2,
      initialBackoffDelay: 50,
      retries: 1,
      timeout: TIMEOUT_MS,
      concurrency: CONCURRENCY,
    },
  },
}
