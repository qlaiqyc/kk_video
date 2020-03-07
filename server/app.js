'use strict';
class AppBootHook {

  constructor(app) {
    this.app = app;
  }

  async didLoad() {
    // 请将你的插件项目中 app.beforeStart 中的代码置于此处。
  }

  async willReady() {
    String.HasText = function(str) {
      try {

        if (typeof (str) === 'undefined') return false;
        if (str == null) return false;
        if (str == 'null') return false;
        if (str == 'undefined') return false;

        if (typeof (str) === 'string') { str = str.replace(/(^\s*)|(\s*$)/g, ''); }
        if (str === '') return false;

      } catch (e) {
        return false;
      }
      return true;
    };
    // eslint-disable-next-line no-extend-native
    String.sqlTirm = function(str) {

      str = str.replace("'", '').replace('&#39;', '').replace('--', '')
        .replace('&', '')
        .replace('/*', '')
        .replace(';', '')
        .replace('%', '');


      return str;
    };
    // eslint-disable-next-line no-extend-native
    Date.prototype.Format = function(fmt) {
      const o = {
        'M+': this.getMonth() + 1, // 月份
        'd+': this.getDate(), // 日
        'h+': this.getHours(), // 小时
        'm+': this.getMinutes(), // 分
        's+': this.getSeconds(), // 秒
        'q+': Math.floor((this.getMonth() + 3) / 3), // 季度
        S: this.getMilliseconds(), // 毫秒
      };
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
      for (const k in o) { if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (('00' + o[k]).substr(('' + o[k]).length))); }
      return fmt;
    };

    String.hasEmoji = substring => {
      for (let i = 0; i < substring.length; i++) {
        const hs = substring.charCodeAt(i);
        if (hs >= 0xd800 && hs <= 0xdbff) {
          if (substring.length > 1) {
            const ls = substring.charCodeAt(i + 1);
            const uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
            if (uc >= 0x1d000 && uc <= 0x1f77f) {
              return true;
            }
          }
        } else if (substring.length > 1) {
          const ls = substring.charCodeAt(i + 1);
          if (ls == 0x20e3) {
            return true;
          }
        } else {
          if (hs >= 0x2100 && hs <= 0x27ff) {
            return true;
          } else if (hs >= 0x2B05 && hs <= 0x2b07) {
            return true;
          } else if (hs >= 0x2934 && hs <= 0x2935) {
            return true;
          } else if (hs >= 0x3297 && hs <= 0x3299) {
            return true;
          } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
                        || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
                        || hs == 0x2b50) {
            return true;
          }
        }
      }
    };

    String.wXml = function(key, xml) {

      // 如果key 为数组 则判断需要返回 同类格式的JSON

      const def = skey => {
        let result = '';
        const tmp = xml.split('<' + skey + '>');
        const _tmp = tmp[1].split('</' + skey + '>');

        if (_tmp[0].indexOf('<![CDATA[') > -1) {
          result = _tmp[0].split('<![CDATA[');
          result = result[1].substring(0, result[1].length - 3);
        } else {
          result = _tmp[0];
        }

        return result;
      };

      if (typeof key === 'string') {
        return def(key);
      }
      const dresult = {};
      key.forEach(curr => { dresult[curr] = def(curr); });
      return dresult;


    };

    Array.CustomForeach = (arr, callback) => {
      const length = arr.length;
      const O = Object(arr);
      let k = 0;
      while (k < length) {
        if (k in O) {
          console.log('doing foreach...');
          const kValue = O[k];
          callback(kValue, k, O);
        }
        k++;
      }
    };


  }

  async serverDidReady() {
    const ctx = await this.app.createAnonymousContext();
    const fs = require('fs');
    // const wasm_data = fs.readFileSync('./app/public/file/tx-ckey.wasm')
    const wasm_data = fs.readFileSync('./app/public/file/ckey.wasm');
    const { helper, service } = ctx;
    helper.global.set('tx_wasm', wasm_data);
    helper.global.set('sql_tables', {
      curr: 0,
      list: [
        { movies: helper.sql.table.bajie, swiper: 'base_swiper' }, // bajie
        { movies: helper.sql.table.daziyuan, swiper: 'base_swiper' }, // daziyuan
        // { movies: helper.sql.table.baiwan, swiper: 'base_swiper' }, // baiwan
        { movies: helper.sql.table.gaoqin, swiper: 'base_swiper' }, // baiwan
      ],
    });

    helper.global.set('QindexData', {});
    ctx.logger.info('----task---auto---start');

    try { await service.auto.getTx(); } catch (e) { ctx.logger.info('----task---auto---error'); }
    ctx.logger.info('----task---auto---end');
    // console.log(ctx.app.config);//获取配置信息
  }
}

module.exports = AppBootHook;
