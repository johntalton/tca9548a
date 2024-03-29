const MAX_CHANNEL_NUM = 8

/**
 * Helpers to provider api-data transformation between common api and device.
 **/
export class Converter {
  static channelsToMask(channels) {
    if(channels.length === 0) { return 0 }

    return channels.reduce((acc, item) => {
      if(!Number.isInteger(item) || item < 0 || item >= MAX_CHANNEL_NUM) { throw new Error('invalid channel: ' + item) }
      return acc | (1 << item)
    }, 0)
  }

  static maskToChannels(mask) {
    // todo range(channelCount)
    return [0, 1, 2, 3, 4, 5, 6, 7].filter(idx => {
      return ((mask >> idx) & 1) === 1
    })
  }
}
