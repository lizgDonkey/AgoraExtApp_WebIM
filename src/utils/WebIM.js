import websdk from 'easemob-websdk'
import config from './WebIMConfig'
import { getPageQuery } from './index'



let WebIM = window.WebIM || {}
WebIM.config = config;

// 从iframe取appkey
export const appkey = `${getPageQuery().org}#${getPageQuery().apk}`;

let options = {
    isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
    isDebug: WebIM.config.isDebug,
    https: WebIM.config.https,
    isAutoLogin: false,
    heartBeatWait: WebIM.config.heartBeatWait,
    autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
    delivery: WebIM.config.delivery,
    appKey: appkey,
    useOwnUploadFun: WebIM.config.useOwnUploadFun,
    deviceId: WebIM.config.deviceId,
    //公有云 isHttpDNS 默认配置为true
    isHttpDNS: WebIM.config.isHttpDNS,
}

WebIM.conn = new websdk.connection(options)
export default WebIM;