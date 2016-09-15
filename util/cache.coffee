###*
 *
 * localStorage cache
 * @author vfasky <vfasky@gmail.com>
###
'use strict'

_cachePre = '__cache_'
_localStorage = require './storage'

module.exports =
    set: (key, value, time = Infinity)->
        time = (new Date()).getTime() + parseInt(time) if time != Infinity
        data =
            time: time
            value: value

        _localStorage.set _cachePre + key, data

    get: (key, defaultVal = null)->

        data = _localStorage.get _cachePre + key

        return defaultVal if data == undefined


        curTime = (new Date()).getTime()

        return data.value if curTime <= data.time

        module.exports.remove key

        defaultVal

    remove: (key)->
        _localStorage.remove _cachePre + key
