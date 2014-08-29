#!/usr/bin/env node

var path = require('path')
var connect = require('connect')
var serveStatic = require('serve-static')

var port = process.env.PORT || 8080
var server = connect()

server.use('/source/icons', serveStatic(path.join(__dirname, '/source/icons')))
server.use('/bower_components', serveStatic(path.join(__dirname, '/bower_components')))
server.use(serveStatic(__dirname+'/dist'))
server.listen(port)

console.log('Listening on port', port)
