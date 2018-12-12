﻿"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let exec = require('child_process').exec;
let logFactory = require('./logFactory')('linebot:richmenuScript');
const richmenuId = require('../models/richmenuID.json');
let bot = global.gConfig.bot;
let env = process.env.NODE_ENV;
let richmenu = richmenuId[String(env)];
let richmenuType = {
    beforeBinding: function (lineId) {
        return ('curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richmenu_before +
            ' \
        -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""');
    },
    _0: function (lineId) {
        return ('curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richMenuId_0 +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""');
    },
    _1: function (lineId) {
        return ('curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richMenuId_1 +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""');
    },
    _2: function (lineId) {
        return ('curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richMenuId_2 +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""');
    },
    _3: function (lineId) {
        return ('curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richMenuId_3 +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""');
    },
    _4: function (lineId) {
        return ('curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richMenuId_4 +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""');
    },
    _5: function (lineId) {
        return ('curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richMenuId_5 +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""');
    },
    more: function (lineId) {
        return ('curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richMenuId_more +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""');
    },
    after: function (lineId) {
        return ('curl -v -X POST https://api.line.me/v2/bot/user/' +
            lineId +
            '/richmenu/' +
            richmenu.richmenu_after +
            ' \
    -H "Authorization: Bearer "' +
            bot.channelAccessToken +
            ' -d ""');
    }
};
module.exports = {
    bindRichmenuToUser: function (type, lineId) {
        if (type === "before binding" /* BEFORE */) {
            exec(richmenuType.beforeBinding(lineId), function (err, stdout, stderr) {
                if (err)
                    return logFactory.error('get bind rich menu api error:' + stderr);
            });
        }
        else if (type === "using amount 0" /* _0 */) {
            exec(richmenuType._0(lineId), function (err, stdout, stderr) {
                if (err)
                    return logFactory.error('get bind rich menu api error:' + stderr);
            });
        }
        else if (type === "using amount 1" /* _1 */) {
            exec(richmenuType._1(lineId), function (err, stdout, stderr) {
                if (err)
                    return logFactory.error('get bind rich menu api error:' + stderr);
            });
        }
        else if (type === "using amount 2" /* _2 */) {
            exec(richmenuType._2(lineId), function (err, stdout, stderr) {
                if (err)
                    return logFactory.error('get bind rich menu api error:' + stderr);
            });
        }
        else if (type === "using amount 3" /* _3 */) {
            exec(richmenuType._3(lineId), function (err, stdout, stderr) {
                if (err)
                    return logFactory.error('get bind rich menu api error:' + stderr);
            });
        }
        else if (type === "using amount 4" /* _4 */) {
            exec(richmenuType._4(lineId), function (err, stdout, stderr) {
                if (err)
                    return logFactory.error('get bind rich menu api error:' + stderr);
            });
        }
        else if (type === "using amount 5" /* _5 */) {
            exec(richmenuType._5(lineId), function (err, stdout, stderr) {
                if (err)
                    return logFactory.error('get bind rich menu api error:' + stderr);
            });
        }
        else if (type === "using lots of" /* MORE */) {
            exec(richmenuType.more(lineId), function (err, stdout, stderr) {
                if (err)
                    return logFactory.error('get bind rich menu api error:' + stderr);
            });
        }
        else if (type === 'after') {
            exec(richmenuType.after(lineId), function (err, stdout, stderr) {
                if (err)
                    return logFactory.error('get bind rich menu api error:' + stderr);
            });
        }
    },
};
//# sourceMappingURL=richMenuScript.js.map