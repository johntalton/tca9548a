# TCA9548

A simple, but effective, solution for I²C bus managment. 

as expected: [Adafruit](https://learn.adafruit.com/adafruit-tca9548a-1-to-8-i2c-multiplexer-breakout?view=all)

## Concept 
The TCA provides a managment layer that exposes channels. Each channel is an I²C bus segment that can extends the host I²C bus. The managment layer allow for forking and joining these channels.

As such, zero or more channel can extend the host bus.  Allowing for the host bus to address directly all connected devices to the unified channels.


### Consider the following
Assume four sensor are connected to the TCA chip via channel 0 and 1, and each sensor label represents its addres
```
  A---B--- 0 TCA 1 ---C---D
              |
             host ---E
```
Using a select / detect workflow the expected results:
```
> tune off
> i2cdetect
  0xE 
> tune 0
> i2cdetect
  0xA 0xB 0xE
> tune 1
> i2cdetect
  0xC 0xD 0xE
> tune 0, 1
> i2cdetect
  0xA 0xB 0xC 0xD 0xE
```

Make note of the last multi channel `tune` call. 
Also the fact that 0xE is always present from the host perspective (and is a standin for explicit listing of the TCA address, which is also visible to the host)


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



