# Express App with NATS Integration

This is an example Express application that demonstrates integration with a NATS server for message processing.

## Description

The application sets up an Express server to handle HTTP requests and connects to a NATS server for message processing. When an HTTP request is received, the server responds with "Hello World!" while also subscribing to the 'calculateArea' topic in the NATS server. The application calculates the area based on the received data and publishes the result to the 'calculatedResult' topic.

## Prerequisites

Before running the application, make sure you have the following dependencies installed:

- Node.js
- NATS server (running on `localhost:4222` by default)

## Installation

1. npm install

## Application Run

1. node index

