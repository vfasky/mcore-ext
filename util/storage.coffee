###*
 *
 * storage
 * @author vfasky <vfasky@gmail.com>
###
'use strict'

storage = typeof window == 'object' and window.localStorage or {}

exports.get = (key, defaultVal)->
    data = storage.getItem key
    if null == data
        return defaultVal

    try
        data = JSON.parse data
    catch error
        data = defaultVal

    data

exports.set = (key, val)->
    storage.setItem key, JSON.stringify val


exports.remove = (key)->
    storage.removeItem key
