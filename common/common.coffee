class usv

  prepare: (data = {}, def = {}) ->

    result = {}

    for field of def
      if (data[field]?)
        result[field] = data[field]
      else
        result[field] = def[field]

    return result

  range: (min, max) ->
    rand = min - 0.5 + Math.random() * (max - min + 1)
    rand = Math.round(rand)
    return rand

  oneOf: (variants = []) ->
    rand = Math.floor(Math.random()*variants.length)
    return variants[rand]


module.exports = new usv()