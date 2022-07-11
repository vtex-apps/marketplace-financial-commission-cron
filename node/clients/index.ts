import type { ClientsConfig } from '@vtex/api'
import { IOClients, LRUCache } from '@vtex/api'

import InvoiceFinancialCommission from './invoiceFinancialComission'
import MarketFinancialCommission from './marketplaceFinancialCommission'
import Scheduler from './scheduler'
import TypeIntegration from './typeIntegration'

export class Clients extends IOClients {
  public get marketFinancialCommission() {
    return this.getOrSet('marketFinancialCommission', MarketFinancialCommission)
  }

  public get scheduler() {
    return this.getOrSet('scheduler', Scheduler)
  }

  public get invoiceFinancialComission() {
    return this.getOrSet(
      'invoiceFinancialComission',
      InvoiceFinancialCommission
    )
  }

  public get typeIntegration() {
    return this.getOrSet('typeIntegration', TypeIntegration)
  }
}

const TIMEOUT_MS = 60000
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
