# Marketplace Financial Commission Cron

Application used exclusively for the Financial Commission project and installed together with the `vtex.marketplace-financial-commission` app.

The application has the function of calling the endpoints responsible for generating the dashboard and generating invoices. 

    > 1. Call the `dashboard/generate` endpoint, from the `vtex.marketplace-financial-commission` app, to generate the dashboard data. The cron job is triggered in the middle of the night.
    > 2. Call the `invoice/generate` endpoint, from the `vtex.marketplace-financial-commission` app, to generate the invoice data. The cron job is triggered in the middle of the night.

## Install

```powershell
vtex install vtex.marketplace-financial-commission-cron@1.1.x
```

In order for it to work correctly in the account to be installed, it must have been previously installed `vtex.marketplace-financial-commission` app.

When the app is installed it automatically triggers the `dashboard/generate` enpoint and generates the information of the last 30 days.


## External Invoice

If the integration type configuration used in the marketplace of the `vtex.marketplace-financial-commission` app is set to `external`, the calls to the above mentioned `dashboard/generate` and `invoice/generate`  endpoints will not be triggered.
