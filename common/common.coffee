###
  This script part of usv project
  @author: fe3dback@yandex.ru
###

class USV

  @imageIndex: null

  ###*
    * Prepare mixin data and set default values
    * @param {Object} data - object with user values
    * @param {Object} def - default values
    * @return {Object} result data object. Extended from def + user data
  
    * ex:
    * let data = {a:3}
    * let data = usv.prepare(data, {a:1, b:2})
    * // data = {a:3, b:2}
  ###
  prepare: (data = {}, def = {}) ->

    result = {}

    for field of def
      if (data[field]?)
        result[field] = data[field]
      else
        result[field] = def[field]

    return result

  ###*
    * Clamp number between min and max
    * @param {number} number
    * @param {number} min
    * @param {number} max
    * @return {number} clamped number
  ###
  clamp: (number, min, max) ->

    number = max if number > max
    number = min if number < min
    return number

  ###*
    * Get random number between min and max
    * @param {number} min
    * @param {number} max
    * @return {number} random number
  ###
  range: (min, max) ->
    rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand)
    return rand

  ###*
    * Choose one random value from array
    * @param {Array} variants
  ###
  oneOf: (variants = []) ->
    rand = Math.floor(Math.random()*variants.length)
    return variants[rand]


  ###*
    * Format number to ru-RU price (rub)
    * Like 2605.30 => 2 605
    * @param {number} x
    * @return {string}
  ###
  formatPrice: (x) ->
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")

  ###*
    * Generate url to random image (from any placeholder service)
    * @param {number} width
    * @param {number} height
    * @param {service} service
      - 1=placeimg.com,
      - 2=lorempixel.com,
      - 3=unsplash.it,
      - def=placehold.it
    * @param {string} tag (only for service #1, #2), ex. "tech"
  ###
  image: (width = 100, height = 100, service = 0, tag = "tech") ->

    unless (@imageIndex?)
      @imageIndex = 60

    @imageIndex++
    switch service
      when 1
        "https://placeimg.com/#{width}/#{height}/#{tag}?image=#{@imageIndex}"
      when 2
        "http://lorempixel.com/#{width}/#{height}/#{tag}/?image=#{@imageIndex}"
      when 3
        "https://unsplash.it/#{width}/#{height}?image=#{@imageIndex}"
      else
        "https://placehold.it/#{width}x#{height}"


module.exports = new USV()