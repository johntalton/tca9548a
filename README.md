# TCA9548

A simple, but effective, solution for I²C bus managment.

This package allows for direct and simple interaction with the channel (segment) selection API.  It also provides a `I2CBus` implementation for creating an abstraction layer for compositing multi-bus multi-sensor deployments.


[Adafruit](https://learn.adafruit.com/adafruit-tca9548a-1-to-8-i2c-multiplexer-breakout?view=all) as always.

[![npm Version](http://img.shields.io/npm/v/@johntalton/tca9548.svg)](https://www.npmjs.com/package/@johntalton/tca9548)
![GitHub package.json version](https://img.shields.io/github/package-json/v/johntalton/tca9548)
![CI](https://github.com/johntalton/tca9548/workflows/CI/badge.svg?branch=master&event=push)
![GitHub](https://img.shields.io/github/license/johntalton/tca9548)
[![Downloads Per Month](http://img.shields.io/npm/dm/@johntalton/tca9548.svg)](https://www.npmjs.com/package/@johntalton/tca9548)
![GitHub last commit](https://img.shields.io/github/last-commit/johntalton/tca9548)


## Concept
The TCA provides a managment layer that exposes channels. Each channel is an I²C bus segment that can extends the host I²C bus. The managment layer allow for forking and joining these channels.

As such, zero or more channel can extend the host bus.  Allowing for the host bus to address directly all connected devices to the unified channels.


### Consider the following
Assume four sensor are connected to the TCA chip via channel 0 and 1, and each sensor label by it's address.

![example bus layout](examples/example.svg)

Using the above bus configuration, the following commands will describe and allow you to control the bus segments.
```
> node tune off
> i2cdetect
  0x10 0x70
> tune 0
> i2cdetect
  0x1 0x2 0x10 0x70
> tune 1
> i2cdetect
  0x3 0x4 0x10 0x70
> tune 0 1
> i2cdetect
  0x1 0x2 0x3 0x4 0x10 0x70
```

Make note of the last multi channel `tune` call.
Also the fact that `0x10` and `0x70` is always present from the host perspective as expected.

### Overlapping static address multiplexing
A simple / common use case is to use the TCA to select from sensor that would nomraly share an address (and create errors on the I²C bus) by placing each on individual channels:
```
  host
   |
  TCA 0 --- A
      1 --- A
      2 --- A
        ...
```
In such a configuration the `tune` command would exclusivly select each channel (never selecting more then one at a time), and the `i2cdetect` call would always return 0xA onto the host bus.

Some care is needed by calling application layer when managing and caching resourses as called from code addressing 0xA (in this example) will result in read/write on different sensors depending on the channel configuration.


## Interoperability / Dependencies
This project aims to provide a common / abstract I²C bus implementation such that transparent sensor logic can be writen without knowledge of the bus layer.

As such the @johntalton/rasbus library is uses to provide an abstract I²C API definition and a host-native I²C bus implementation.
