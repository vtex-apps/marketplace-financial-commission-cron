# Marketplace Financial Commission Cron

Application used exclusively for the Financial Commission project and installed together with the `vtex.marketplace-financial-commission` app. For more information [click here](https://github.com/vtex-apps/marketplace-financial-commission).

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

## Events

The `events` directory contains the schedulers to be created, which are activated when the application is installed. The `setupScheduleDashboard` file contains the process of sending the request for the generation of the last 30 days.

![image](https://user-images.githubusercontent.com/14004558/186959432-d1287f28-5f2c-4d97-9ba8-c9687467743d.png)


En el directorio `configs\schedulerTemplate` se encuentra la configuracion de los scheduler.

![image](https://user-images.githubusercontent.com/14004558/186959391-72b98072-a9ba-4859-aed1-46c9028c7f9a.png)

