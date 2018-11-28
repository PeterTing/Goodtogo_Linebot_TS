﻿"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const serviceProcess_1 = require("../models/serviceProcess");
const client = __importStar(require("./clientDelegate"));
const request = __importStar(require("../api/request"));
const customPromise_1 = require("../api/customPromise");
const api_1 = require("../api/api");
const contributionView_1 = require("../etl/view/contributionView");
const logFactory = require('../api/logFactory')('linebot:eventHandler');
function isVerificationCode(code) {
    var reg = /[0-9]{6}/;
    var res = reg.test(code);
    if (res)
        return true;
    else
        return false;
}
function postbackAction(event) {
    return __awaiter(this, void 0, void 0, function* () {
        let postbackData = event.postback.data;
        if (api_1.isMobilePhone(postbackData)) {
            logFactory.log(postbackData);
            return request.register(event, postbackData);
        }
        else if (postbackData === client.registerWilling.NO) {
            let message = "期待您成為好合器會員！";
            return client.textMessage(event, message);
        }
        else if (postbackData === serviceProcess_1.DataType.GetMoreInused || postbackData === serviceProcess_1.DataType.Inused || postbackData === serviceProcess_1.DataType.Record || postbackData === serviceProcess_1.DataType.GetMoreRecord) {
            return getDataEvent(event, Number(postbackData));
        }
    });
}
function followEvent(event) {
    logFactory.log('Event: added or unblocked');
    const message = '感謝您將本帳號加為好友！\n如果是初次使用請先輸入手機號碼以綁定line帳號\綁定完成後即可使用本帳號提供的服務！';
    client.textMessage(event, message);
}
function unfollowOrUnBoundEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        if (event.type === 'unfollow')
            logFactory.log('Event: unfollowed');
        else
            logFactory.log('Event: delete bind');
        try {
            serviceProcess_1.deleteBinding(event);
            const message = '已取消綁定';
            return client.textMessage(event, message);
        }
        catch (err) {
            logFactory.error(err);
            return customPromise_1.failPromise(err);
        }
    });
}
function getContributionEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        logFactory.log('Event: get contribution');
        // try {
        //     let message: string;
        //     var result = await getContribution(event);
        //     switch (result) {
        //         case DatabaseState.USER_NOT_FOUND:
        //             message = '請輸入手機號碼以綁定 line id'
        //             return client.textMessage(event, message);
        //         default:
        //             return client.textMessage(event, '您的功德數為：' + result); 
        //     }
        // } catch (err) {
        //     logFactory.error(err);
        //     return failPromise(err);
        // }
        let view = new contributionView_1.ContrubtionView();
        return client.flexMessage(event, view.getView());
    });
}
function getDataEvent(event, type) {
    return __awaiter(this, void 0, void 0, function* () {
        logFactory.log('Event: get data');
        try {
            const result = yield serviceProcess_1.getRecord(event, type);
            client.flexMessage(event, result.getView());
        }
        catch (err) {
            logFactory.error(err);
        }
    });
}
function getQRCodeEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        logFactory.log('Event: get QRCode');
        try {
            var result = yield serviceProcess_1.getQrcode(event);
            if (result === serviceProcess_1.DatabaseState.USER_NOT_FOUND) {
                let message = '請輸入手機號碼以綁定 line id';
                return client.textMessage(event, message);
            }
            else
                return client.getQrcode(event, result);
        }
        catch (err) {
            logFactory.error(err);
            return customPromise_1.failPromise(err);
        }
    });
}
function getContactWayEvent(event) {
    logFactory.log('Event: get contact way');
    const message = "好盒器工作室: (06)200-2341\n" +
        "FB: https://www.facebook.com/good.to.go.tw";
    return client.textMessage(event, message);
}
function bindingEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        logFactory.log('Event: binding');
        try {
            let result = yield serviceProcess_1.bindLineId(event, event.message.text);
            let message;
            logFactory.log(result);
            switch (result) {
                case serviceProcess_1.DatabaseState.USER_NOT_FOUND:
                    message = "您還不是會員哦！\n請問要使用 " + event.message.text + " 為帳號註冊成為會員嗎？";
                    return client.registerTemplate(event, message);
                case serviceProcess_1.BindState.HAS_BOUND:
                    message = "此手機已經綁定過摟！";
                    return client.textMessage(event, message);
                case serviceProcess_1.BindState.LINE_HAS_BOUND:
                    message = "此 line 已經綁定過摟！";
                    return client.textMessage(event, message);
                case serviceProcess_1.BindState.SUCCESS:
                    message = "綁定成功！";
                    return client.textMessage(event, message);
                case serviceProcess_1.BindState.IS_NOT_MOBILEPHONE:
                    message = "請輸入要綁定的手機號碼！";
                    return client.textMessage(event, message);
            }
        }
        catch (err) {
            logFactory.error(err);
            return customPromise_1.failPromise(err);
        }
    });
}
function registerEvent(event) {
    logFactory.log('Event: register');
}
function verificateEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield serviceProcess_1.findSignal(event);
            if (api_1.isMobilePhone(result)) {
                request.verificate(event, result);
            }
        }
        catch (err) {
            logFactory.error(err);
            return customPromise_1.failPromise(err);
        }
    });
}
module.exports = {
    bot: function (event) {
        if ((event.type !== 'message' || event.message.type !== 'text') && event.type !== 'follow' && event.type !== 'unfollow' &&
            event.type !== 'postback') {
            logFactory.error('Event Type: Wrong Type');
            return Promise.resolve(null);
        }
        if (event.type === 'postback') {
            postbackAction(event);
        }
        if (event.type === 'follow') {
            followEvent(event);
        }
        else if (event.type === 'unfollow' || event.message.text === '解除綁定') {
            unfollowOrUnBoundEvent(event);
        }
        else if (event.message.text === "我的好杯幣") {
            getContributionEvent(event);
        }
        else if (event.message.text === "使用中容器") {
            getDataEvent(event, serviceProcess_1.DataType.Inused);
        }
        else if (event.message.text === "我的會員卡") {
            getQRCodeEvent(event);
        }
        else if (event.message.text === "聯絡好盒器") {
            getContactWayEvent(event);
        }
        else if (event.message.text === "綁定") {
            bindingEvent(event);
            // client.textMessage(event, "請輸入手機號碼");
        }
        else if (event.message.text === "註冊") {
            registerEvent(event);
        }
        else if (api_1.isMobilePhone(event.message.text)) {
            bindingEvent(event);
        }
        else if (isVerificationCode(event.message.text)) {
            verificateEvent(event);
        }
        else {
            logFactory.log("Event: not our business");
            // client.textMessage(event, "如果有需要任何服務請點選下列表單哦!");
        }
    }
};
//# sourceMappingURL=eventHandler.js.map