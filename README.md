<p align="center">
  <img src="./exeat-logo.png" width="320" alt="Nest Logo" />
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">Client Micro Service of Ex'eat project.</p>

  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# Authentication MS

---

## Description

Interaction with the PostgreSQL database exeat and the user authentication (SSO).


## All MS

- exeat.authService: 8080
- exeat.clientService: 8081
- exeat.restaurantService: 8082
- exeat.deliverService: 8083
- exeat.orderService: 8084
- exeat.paymentService: 8085
- exeat.statsService: 8086
- exeat.patronageService: 8087


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Run Docker in backend development env.

```bash
# compose 
$ docker-compose up -d --build
```


## Run Docker in frontend development env.

> uncomment the lines about this MS in the docker-compose.yml

```bash
# compose 
$ docker-compose up -d --build
```