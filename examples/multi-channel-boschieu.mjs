import i2c from 'i2c-bus'
import ieu from '@johntalton/boschieu'
import tca from '@johntalton/tca9548'

const { BoschIEU } = ieu
const { Tcs9548, I2CTca9548BusFactory } = tca

class CM {
  before(channel) { return Promise.resolve() }
  after() { return Promise.resolve() }
}

const busNumber = 1

const busN = await i2c.openPromisified(1)
const multiplexer = await Tca9548.from(busN, {})
const virtualProvider = I2CTca9548BusFactory.from(busN, multiplexer, new CM())


