#!/usr/bin/env node
const fs = require('fs')
const Joi = require('joi')
const Boom = require('boom')
const Hapi = require('hapi')
const path = require('path')
const Inert = require('inert')
const Vision = require('vision')
const mkdirp = require('mkdirp')
const config = require('rc')('wofserver', require('../options'))
console.log(config)

if (config._[0]) {
  config.dir = path.resolve(config._[0])
}
console.log('serving files from ', config.dir)

// Create a server with a host and port
var server = new Hapi.Server()
server.connection({ port: config.port })
server.register([Inert, Vision])

server.route({
  method:'GET',
  path:'/data/{first}/{second}/{third}/{fourth}/{id}.geojson',
  handler: (req, reply) => {
    let f = `${config.dir}/data/${req.params.first}/${req.params.second}/${req.params.third}/${req.params.fourth}/${req.params.id}.geojson`
    reply.file(f, {confine: false}).type('application/json')
  },
  config: {
    validate: {
      params: {
        first: Joi.number().required(),
        second: Joi.number().required(),
        third: Joi.number().required(),
        fourth: Joi.number().required(),
        id: Joi.number().required()
      }
    }
  }
})

server.route({
  method:'GET',
  path:'/data/{first}/{second}/{third}/{id}.geojson',
  handler: (req, reply) => {
    let f = `${config.dir}/data/${req.params.first}/${req.params.second}/${req.params.third}/${req.params.id}.geojson`
    reply.file(f, {confine: false}).type('application/json')
  },
  config: {
    validate: {
      params: {
        first: Joi.number().required(),
        second: Joi.number().required(),
        third: Joi.number().required(),
        id: Joi.number().required()
      }
    }
  }
})


server.route({
  method:'PUT',
  path:'/data/{first}/{second}/{third}/{id}.geojson',
  handler: (req, reply) => {
    let folder = `${config.dir}/data/${req.params.first}/${req.params.second}/${req.params.third}`
    mkdirp(folder, err => {
      if (err) return reply(Boom.boomify(err))
      let f = `${config.dir}/data/${req.params.first}/${req.params.second}/${req.params.third}/${req.params.id}.geojson`
      fs.writeFile(f, JSON.stringify(req.payload), err => {
        if (err) return reply(Boom.boomify(err))
        reply({ok: true})
      })
    })
  },
  config: {
    validate: {
      params: {
        first: Joi.number().required(),
        second: Joi.number().required(),
        third: Joi.number().required(),
        id: Joi.number().required()
      },
      payload: Joi.object().required()
    }
  }
})


server.start(function (err) {
  console.log('server started', config.port)
})
