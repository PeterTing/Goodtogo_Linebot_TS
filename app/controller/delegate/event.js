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
const serviceProcess_1 = require("../../models/serviceProcess");
const client = __importStar(require("./client"));
const customPromise_1 = require("../../lib/customPromise");
const tool_1 = require("../../lib/tool");
const request = __importStar(require("../../lib/request"));
const qrcodeView_1 = require("../../etl/view/qrcodeView");
const contributionView_1 = require("../../etl/view/contributionView");
const contactView_1 = require("../../etl/view/contactView");
const logFactory = require('../../lib/logFactory')('linebot:eventDelegate');
const richMenu = require('../../lib/richMenuScript');
function followEvent(event) {
    logFactory.log('Event: added or unblocked');
    const message = '感謝您將本帳號加為好友！\n如果是初次使用請先輸入手機號碼以綁定line帳號綁定完成後即可使用本帳號提供的服務！';
    client.textMessage(event, message);
}
exports.followEvent = followEvent;
function unfollowOrUnBoundEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        if (event.type === 'unfollow')
            logFactory.log('Event: unfollowed');
        else
            logFactory.log('Event: delete bind');
        try {
            serviceProcess_1.deleteBinding(event);
            richMenu.bindRichmenuToUser('before', event.source.userId);
            const message = '已取消綁定';
            return client.textMessage(event, message);
        }
        catch (err) {
            logFactory.error(err);
            return customPromise_1.failPromise(err);
        }
    });
}
exports.unfollowOrUnBoundEvent = unfollowOrUnBoundEvent;
function bindingEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        logFactory.log('Event: binding');
        try {
            let result = yield serviceProcess_1.bindLineId(event, event.message.text);
            let message;
            logFactory.log(result);
            switch (result) {
                case "Does not find user in database" /* USER_NOT_FOUND */:
                    message =
                        '您還不是會員哦！\n請問要使用 ' +
                            event.message.text +
                            ' 為帳號註冊成為會員嗎？';
                    return client.registerTemplate(event, message);
                case "The phone has already bound with another line account" /* PHONE_HAS_BOUND */:
                    message = '此手機已經綁定過摟！';
                    return client.textMessage(event, message);
                case "Line has bound with another phone" /* LINE_HAS_BOUND */:
                    message = '此 line 已經綁定過摟！';
                    return client.textMessage(event, message);
                case "Successfullt bound with line" /* SUCCESS */:
                    message = '綁定成功！';
                    richMenu.bindRichmenuToUser('after', event.source.userId);
                    return client.textMessage(event, message);
                case "The input is not phone number" /* IS_NOT_PHONE */:
                    message = '請輸入要綁定的手機號碼！';
                    return client.textMessage(event, message);
            }
        }
        catch (err) {
            logFactory.error(err);
            return customPromise_1.failPromise(err);
        }
    });
}
exports.bindingEvent = bindingEvent;
function verificateEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield serviceProcess_1.findSignal(event);
            if (tool_1.isMobilePhone(result)) {
                request.verificate(event, result);
            }
        }
        catch (err) {
            logFactory.error(err);
            return customPromise_1.failPromise(err);
        }
    });
}
exports.verificateEvent = verificateEvent;
function getDataEvent(event, type) {
    return __awaiter(this, void 0, void 0, function* () {
        logFactory.log('Event: get data');
        try {
            const result = yield serviceProcess_1.getData(event, type);
            return client.flexMessage(event, result.getView());
        }
        catch (err) {
            return logFactory.error(err);
        }
    });
}
exports.getDataEvent = getDataEvent;
function getQRCodeEvent(event) {
    return __awaiter(this, void 0, void 0, function* () {
        logFactory.log('Event: get QRCode');
        try {
            var result = yield serviceProcess_1.getQrcode(event);
            if (result === "Does not find user in database" /* USER_NOT_FOUND */) {
                let message = '請輸入手機號碼以綁定 line id';
                return client.textMessage(event, message);
            }
            else {
                let view = new qrcodeView_1.QrcodeView(result);
                return client.flexMessage(event, view.getView());
            }
        }
        catch (err) {
            logFactory.error(err);
            return customPromise_1.failPromise(err);
        }
    });
}
exports.getQRCodeEvent = getQRCodeEvent;
function getContactWayEvent(event) {
    logFactory.log('Event: get contact way');
    let view = new contactView_1.ContactView();
    return client.flexMessage(event, view.getView());
}
exports.getContactWayEvent = getContactWayEvent;
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
exports.getContributionEvent = getContributionEvent;
//# sourceMappingURL=event.js.map