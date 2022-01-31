# CAP Multitenancy Beershop

## Prerequisites

You have a SAP BTP Cloud Foundry Subaccount with a running SAP HANA Cloud database.

## Setup

```
npm i
npm i -g mbt
mbt build
cf deploy mta_archives/mt-beershop_1.0.0.mtar
cf csk mt-beershop-db-mt dev
cf csk mt-beershop-uaa-mt dev
cf csk mt-beershop-registry dev
cf csk mt-beershop-destination dev
cf csk mt-beershop-connectivity dev
cf service-key mt-beershop-db-mt dev
cf service-key mt-beershop-uaa-mt dev
cf service-key mt-beershop-registry dev
cf service-key mt-beershop-destination dev
cf service-key mt-beershop-connectivity dev
```

Create _default-env.json_ with this content and the corresponding credentials from the last 4 commands and also the content for VCAP_APPLICATION from the deployed srv app:

```JSON
{
  "VCAP_SERVICES": {
    "service-manager": [
      {
        "label": "service-manager",
        "name": "mt-beershop-db-mt",
        "credentials": {
        },
        "syslog_drain_url": null
      }
    ],
    "xsuaa": [
      {
        "label": "xsuaa",
        "name": "mt-beershop-uaa-mt",
        "tags": ["xsuaa"],
        "credentials": {
        }
      }
    ],
    "saas-registry": [
      {
        "label": "saas-registry",
        "name": "mt-beershop-registry",
        "tags": [
          "SaaS"
        ],
        "credentials": {}
      }
    ],
    "destination": [
      {
        "label": "destination",
        "name": "mt-beershop-destination",
        "tags": [
          "destination",
          "conn",
          "connsvc"
        ],
        "credentials": {}
      }
    ],
    "connectivity": [
      {
        "label": "connectivity",
        "name": "mt-beershop-connectivity",
        "tags": ["connectivity", "conn", "connsvc"],
        "credentials": {}
      }
    ]
  },
  "VCAP_APPLICATION": {},
  "destinations": [
    {
      "name": "S4HANA",
      "url": "https://sapes5.sapdevcenter.com",
      "username": "<Your ES5 Username>",
      "password": "<Your ES5 Password>"
    }
  ]
}
```

## Local test

Create a _.env_ file in the tests folder with this content:

```
tenant_id=anonymous
localhost=http://localhost:4004
```

start the CAP Backend using:

```
npm run watch
```

This script does include the `cds build` step as otherwise the deployment to the HDI container fails as the MTX module returns `no model found, skip build`.

Create a new subscription using the PUT request in _tests/01-subscribe.http_. Test the endpoints with _tests/beershop.http_. You can also open http://localhost:4004/ via a browser and test the Fiori preview of the Beers entity.

## Update tenant schema

If you changed the database schema you can run _tests/02-update-tenant.http_ to deploy the new schema.

## Delete HDI Container

Run the delete in _tests/03-delete-tenant.http_
