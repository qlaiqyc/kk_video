const  crypto = require('crypto');
const parser = require('fast-xml-parser');
const {parseString} = require('xml2js');
const cheerio = require('cheerio');
module.exports = {
    user:{
        key:"login_data",

        //获取当前用户信息
        async getUser(ctx,openid){
            const { helper,service,originalUrl } = ctx;
            const {sql} = helper;

            let data = helper.global.get(this.key);
            return  (String.HasText(data) && openid in data) ?data[openid]:"";
        },
        //使用token  获取  用户信息
        async getGlobalToken(ctx,token){

            const { helper,service,originalUrl } = ctx;
            const {sql} = helper;

            let data = helper.global.get(this.key),keys = token+"_token";
            return  (String.HasText(data) && keys in data) ?data[keys]:"";

        },

        //保存全局变量
        async setGlobalUser(ctx,user){
            const { helper,service } = ctx;
            let data = helper.global.get(this.key);
            if(!String.HasText(data)) data={};
            data[user.openId] = user;
            data[user.token+"_token"] = user;
            helper.global.set(this.key,data);
        },


        //检查token 是否过期
        async checkLogin(ctx,user){
            //先从缓存中获取 如果 无 有数据库取
            let result = false;//默认过期

            let cha = new Date().getTime() - user.token_time.getTime();
            if(cha <(1000*60*60*24*20)){//默认20天过期
                //使用 他设置的表
                result = true;
            }

            return result;
        },







    },
    wx:{
        AppID:"wxcbef196a868ccfac",
        AppSecret:"ddc7f48c680710e7da59f2507a71213a",
        decodeData(sessionKey,encryptedData,iv){

            // base64 decode
            var sessionKey = new Buffer(sessionKey, 'base64')
            encryptedData = new Buffer(encryptedData, 'base64')
            iv = new Buffer(iv, 'base64')

            try {
                // 解密
                var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
                // 设置自动 padding 为 true，删除填充补位
                decipher.setAutoPadding(true)
                var decoded = decipher.update(encryptedData, 'binary', 'utf8')
                decoded += decipher.final('utf8')

                decoded = JSON.parse(decoded)

            } catch (err) {
                throw new Error('Illegal Buffer')
            }

            if (decoded.watermark.appid !== this.AppID) {
                throw new Error('Illegal Buffer')
            }

            return decoded
        }
    },
    sql:{
        table:{
            movies:"movies_bajie",//默认是八戒网
            swiper:"base_swiper",
            type:"base_type",
            index:"base_index",
            rank:"base_rank",
            user:"base_user",

            bajie:"movies_bajie",
            daziyuan:"movies_ziyuan",
            baiwan:"movies_baiwan",
            gaoqin:"movies_gaoqin"
        },

    },
    urlParam(durl){
        const url = require("url");
        const querystring = require("querystring");

        //将arg参数字符串反序列化为一个对象
        return querystring.parse(url.parse(durl).query);
    },
    url2String(data){
        const url = require("url");
        const querystring = require("querystring");

        return querystring.stringify(data);

    },
    userId(ctx){
        return ctx.req.headers.authorization;
    },
    md5(md5str){

            var createMD5String = function(string) {
                var x = Array()
                var k, AA, BB, CC, DD, a, b, c, d
                var S11 = 7,
                    S12 = 12,
                    S13 = 17,
                    S14 = 22
                var S21 = 5,
                    S22 = 9,
                    S23 = 14,
                    S24 = 20
                var S31 = 4,
                    S32 = 11,
                    S33 = 16,
                    S34 = 23
                var S41 = 6,
                    S42 = 10,
                    S43 = 15,
                    S44 = 21
                string = uTF8Encode(string)
                x = convertToWordArray(string)
                a = 0x67452301
                b = 0xEFCDAB89
                c = 0x98BADCFE
                d = 0x10325476
                for (k = 0; k < x.length; k += 16) {
                    AA = a
                    BB = b
                    CC = c
                    DD = d
                    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478)
                    d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756)
                    c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB)
                    b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE)
                    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF)
                    d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A)
                    c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613)
                    b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501)
                    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8)
                    d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF)
                    c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1)
                    b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE)
                    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122)
                    d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193)
                    c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E)
                    b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821)
                    a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562)
                    d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340)
                    c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51)
                    b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA)
                    a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D)
                    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453)
                    c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681)
                    b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8)
                    a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6)
                    d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6)
                    c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87)
                    b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED)
                    a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905)
                    d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8)
                    c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9)
                    b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A)
                    a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942)
                    d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681)
                    c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122)
                    b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C)
                    a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44)
                    d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9)
                    c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60)
                    b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70)
                    a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6)
                    d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA)
                    c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085)
                    b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05)
                    a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039)
                    d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5)
                    c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8)
                    b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665)
                    a = II(a, b, c, d, x[k + 0], S41, 0xF4292244)
                    d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97)
                    c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7)
                    b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039)
                    a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3)
                    d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92)
                    c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D)
                    b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1)
                    a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F)
                    d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0)
                    c = II(c, d, a, b, x[k + 6], S43, 0xA3014314)
                    b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1)
                    a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82)
                    d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235)
                    c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB)
                    b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391)
                    a = addUnsigned(a, AA)
                    b = addUnsigned(b, BB)
                    c = addUnsigned(c, CC)
                    d = addUnsigned(d, DD)
                }
                var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d)
                return tempValue.toLowerCase()
            }
            var rotateLeft = function(lValue, iShiftBits) {
                return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits))
            }
            var addUnsigned = function(lX, lY) {
                var lX4, lY4, lX8, lY8, lResult
                lX8 = (lX & 0x80000000)
                lY8 = (lY & 0x80000000)
                lX4 = (lX & 0x40000000)
                lY4 = (lY & 0x40000000)
                lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF)
                if (lX4 & lY4) return (lResult ^ 0x80000000 ^ lX8 ^ lY8)
                if (lX4 | lY4) {
                    if (lResult & 0x40000000) return (lResult ^ 0xC0000000 ^ lX8 ^ lY8)
                    else return (lResult ^ 0x40000000 ^ lX8 ^ lY8)
                } else {
                    return (lResult ^ lX8 ^ lY8)
                }
            }
            var F = function(x, y, z) {
                return (x & y) | ((~x) & z)
            }
            var G = function(x, y, z) {
                return (x & z) | (y & (~z))
            }
            var H = function(x, y, z) {
                return (x ^ y ^ z)
            }
            var I = function(x, y, z) {
                return (y ^ (x | (~z)))
            }
            var FF = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(F(b, c, d), x), ac))
                return addUnsigned(rotateLeft(a, s), b)
            }
            var GG = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac))
                return addUnsigned(rotateLeft(a, s), b)
            }
            var HH = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(H(b, c, d), x), ac))
                return addUnsigned(rotateLeft(a, s), b)
            }
            var II = function(a, b, c, d, x, s, ac) {
                a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac))
                return addUnsigned(rotateLeft(a, s), b)
            }
            var convertToWordArray = function(string) {
                var lWordCount
                var lMessageLength = string.length
                var lNumberOfWordsTempOne = lMessageLength + 8
                var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64
                var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16
                var lWordArray = Array(lNumberOfWords - 1)
                var lBytePosition = 0
                var lByteCount = 0
                while (lByteCount < lMessageLength) {
                    lWordCount = (lByteCount - (lByteCount % 4)) / 4
                    lBytePosition = (lByteCount % 4) * 8
                    lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition))
                    lByteCount++
                }
                lWordCount = (lByteCount - (lByteCount % 4)) / 4
                lBytePosition = (lByteCount % 4) * 8
                lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition)
                lWordArray[lNumberOfWords - 2] = lMessageLength << 3
                lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29
                return lWordArray
            }
            var wordToHex = function(lValue) {
                var WordToHexValue = '',
                    WordToHexValueTemp = '',
                    lByte, lCount
                for (lCount = 0; lCount <= 3; lCount++) {
                    lByte = (lValue >>> (lCount * 8)) & 255
                    WordToHexValueTemp = '0' + lByte.toString(16)
                    WordToHexValue = WordToHexValue + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2)
                }
                return WordToHexValue
            }
            var uTF8Encode = function(string) {
                string = string.toString().replace(/\x0d\x0a/g, '\x0a')
                var output = ''
                for (var n = 0; n < string.length; n++) {
                    var c = string.charCodeAt(n)
                    if (c < 128) {
                        output += String.fromCharCode(c)
                    } else if ((c > 127) && (c < 2048)) {
                        output += String.fromCharCode((c >> 6) | 192)
                        output += String.fromCharCode((c & 63) | 128)
                    } else {
                        output += String.fromCharCode((c >> 12) | 224)
                        output += String.fromCharCode(((c >> 6) & 63) | 128)
                        output += String.fromCharCode((c & 63) | 128)
                    }
                }
                return output
            }
            return createMD5String(md5str)

    },
    getMapDistance(param){
        var EARTH_RADIUS = 6378137.0;    //单位M
        var PI = Math.PI;

        var getRad=(d)=>{
            return d*PI/180.0;
        };

        /**
         * approx distance between two points on earth ellipsoid
         * @param {Object} lat1
         * @param {Object} lng1
         * @param {Object} lat2
         * @param {Object} lng2
         */
        var getFlatternDistance = (lat1,lng1,lat2,lng2)=>{
            var f = getRad((lat1 + lat2)/2);
            var g = getRad((lat1 - lat2)/2);
            var l = getRad((lng1 - lng2)/2);

            var sg = Math.sin(g);
            var sl = Math.sin(l);
            var sf = Math.sin(f);

            var s,c,w,r,d,h1,h2;
            var a = EARTH_RADIUS;
            var fl = 1/298.257;

            sg = sg*sg;
            sl = sl*sl;
            sf = sf*sf;

            s = sg*(1-sl) + (1-sf)*sl;
            c = (1-sg)*(1-sl) + sf*sl;

            w = Math.atan(Math.sqrt(s/c));
            r = Math.sqrt(s*c)/w;
            d = 2*w*a;
            h1 = (3*r -1)/2/c;
            h2 = (3*r +1)/2/s;

            return d*(1 + fl*(h1*sf*(1-sg) - h2*(1-sf)*sg));
        };

        var result = getFlatternDistance(param.latitude,param.longitude,param.latitude2,param.longitude2);
        return result;

    },
    time(date3){

//计算出相差天数
        var days=Math.floor(date3/(24*3600*1000));

//计算出小时数

        var leave1=date3%(24*3600*1000);    //计算天数后剩余的毫秒数
        var hours=Math.floor(leave1/(3600*1000));
//计算相差分钟数
        var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
        var minutes=Math.floor(leave2/(60*1000));
//计算相差秒数
        var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
        var seconds=Math.round(leave3/1000);

        const result = (days > 0 ? days+'天' : '') +(hours > 0 ? hours+'小时' : '')+(minutes > 0 ? minutes+'分钟' : '');

        return result;
    },
    map:{
        leave:{"1":"病假","2":"事假","3":"年假","4":"其他","5":"加班"},
        key:"OXCBZ-DPBC3-NUB3X-Y36BE-HJJRV-6HBCI",
        local:{
            // latitude:30.628790,
            // longitude:104.006004,
            // precision:30.000000

            latitude:30.629118,
            longitude:104.006264,
            precision:65.000000
        }
    },
    tx:{
        data:{
            platform:'10201',
            appVer:'3.5.57'
        },
        createGUID(a){
            a = a || 32;
            for (var b = "", c = 1; c <= a; c++) {
                var d = Math.floor(16 * Math.random()).toString(16);
                b += d
            }
            return b
        },
        async getKey(sparam,ctx){
            let endData = "";

           try{
               var document = {
                   // URL:decodeURIComponent(sparam.ehost),//"https://v.qq.com/x/cover/bzfkv5se8qaqel2/j002024w2wg.html","
                   // referrer: "https://v.qq.com"

                   URL:decodeURIComponent(sparam.ehost),//"https://v.qq.com/x/cover/bzfkv5se8qaqel2/j002024w2wg.html","
                   // referrer:"https://v.qq.com/"
                 referrer:""
               }

               var window = {
                   document: document,
                   navigator: {
                       userAgent: "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36",
                       appCodeName: "Mozilla",
                       appName: "Netscape",
                       platform: "Win32"
                   },
               };



               function w() {
                   Fa = new Int8Array(Ea),
                       Ha = new Int16Array(Ea),
                       Ja = new Int32Array(Ea),
                       Ga = new Uint8Array(Ea),
                       Ia = new Uint16Array(Ea),
                       Ka = new Uint32Array(Ea),
                       La = new Float32Array(Ea),
                       Ma = new Float64Array(Ea);
               }
               function d(a) {
                   var b = Oa;
                   return Oa = Oa + a + 15 & -16,
                       b
               }
               function e(a, b) {
                   b || (b = Da);
                   var c = a = Math.ceil(a / b) * b;
                   return c
               }
               function i(a, b, c, d, e){
                   function f(a) {
                       return "string" === b ? k(a) : "boolean" === b ? Boolean(a) : a
                   }
                   var i = wasmobject.exports._getckey //h(a)
                       , j = []
                       , l = 0;
                   // if (g("array" !== b, 'Return type should not be "array".'),
                   //     d)
                   if (d)
                       for (var m = 0; m < d.length; m++) {
                           var n = $a[c[m]];
                           // n ? (0 === l && (l = Ub()),
                           n ? (0 === l && (l = Ub()),
                               j[m] = n(d[m])) : j[m] = d[m]
                       }
                   var o = i.apply(null, j);
                       console.log("----o===",o)
                   console.log("---f(o)==",f(o))


                   return o = f(o),
                   0 !== l && Tb(l),
                       o

               }
               function k(a, b) {
                   if (0 === b || !a)
                       return "";
                   for (var c, d = 0, e = 0; ; ) {
                       if ((a + e < db),
                           c = Ga[a + e >> 0],
                           d |= c,
                       0 == c && !b)
                           break;
                       if (e++,
                       b && e == b)
                           break
                   }
                   b || (b = e);
                   var f = "";
                   if (d < 128) {
                       for (var h, i = 1024; b > 0; )
                           h = String.fromCharCode.apply(String, Ga.subarray(a, a + Math.min(b, i))),
                               f = f ? f + h : h,
                               a += i,
                               b -= i;
                       return f
                   }
                   return m(a)
               }
               function o(a, b, c) {
                   return n(a, Ga, b, c)
               }
               function n(a, b, c, d) {
                   if (!(d > 0))
                       return 0;
                   for (var e = c, f = c + d - 1, g = 0; g < a.length; ++g) {
                       var h = a.charCodeAt(g);
                       if (h >= 55296 && h <= 57343) {
                           var i = a.charCodeAt(++g);
                           h = 65536 + ((1023 & h) << 10) | 1023 & i
                       }
                       if (h <= 127) {
                           if (c >= f)
                               break;
                           b[c++] = h
                       } else if (h <= 2047) {
                           if (c + 1 >= f)
                               break;
                           b[c++] = 192 | h >> 6,
                               b[c++] = 128 | 63 & h
                       } else if (h <= 65535) {
                           if (c + 2 >= f)
                               break;
                           b[c++] = 224 | h >> 12,
                               b[c++] = 128 | h >> 6 & 63,
                               b[c++] = 128 | 63 & h
                       } else if (h <= 2097151) {
                           if (c + 3 >= f)
                               break;
                           b[c++] = 240 | h >> 18,
                               b[c++] = 128 | h >> 12 & 63,
                               b[c++] = 128 | h >> 6 & 63,
                               b[c++] = 128 | 63 & h
                       } else if (h <= 67108863) {
                           if (c + 4 >= f)
                               break;
                           b[c++] = 248 | h >> 24,
                               b[c++] = 128 | h >> 18 & 63,
                               b[c++] = 128 | h >> 12 & 63,
                               b[c++] = 128 | h >> 6 & 63,
                               b[c++] = 128 | 63 & h
                       } else {
                           if (c + 5 >= f)
                               break;
                           b[c++] = 252 | h >> 30,
                               b[c++] = 128 | h >> 24 & 63,
                               b[c++] = 128 | h >> 18 & 63,
                               b[c++] = 128 | h >> 12 & 63,
                               b[c++] = 128 | h >> 6 & 63,
                               b[c++] = 128 | 63 & h
                       }
                   }
                   return b[c] = 0,
                   c - e
               }
               function Tb(){
                   return wasmobject.exports.stackRestore.apply(null, arguments)

               }
               function Ub(){
                   return wasmobject.exports.stackSave.apply(null, arguments)

               }
               function Sb(){
                   return wasmobject.exports.stackAlloc.apply(null, arguments)

               }
               function Pb(){
                   return wasmobject.exports._malloc.apply(null, arguments)
               }
               function P() {      // function 20( )
                   function p(a) {
                       for (var b = 0, c = 0; c < a.length; ++c) {
                           var d = a.charCodeAt(c);
                           d >= 55296 && d <= 57343 && (d = 65536 + ((1023 & d) << 10) | 1023 & a.charCodeAt(++c)),
                               d <= 127 ? ++b : b += d <= 2047 ? 2 : d <= 65535 ? 3 : d <= 2097151 ? 4 : d <= 67108863 ? 5 : 6
                       }
                       return b
                   }
                   function a(a) {
                       return a ? a.length > 48 ? a.substr(0, 48) : a : ""
                   }
                   function b() {
                       var b = document.URL
                           , c = window.navigator.userAgent.toLowerCase()
                           , d = "";
                       document.referrer.length > 0 && (d = document.referrer);
                       try {
                           0 == d.length && opener.location.href.length > 0 && (d = opener.location.href)
                       } catch (e) {}
                       var f = window.navigator.appCodeName
                           , g = window.navigator.appName
                           , h = window.navigator.platform;
                       return b = a(b),
                           d = a(d),
                           c = a(c),
                       b + "|" + c + "|" + d + "|" + f + "|" + g + "|" + h
                   }
                   var c = b()
                       , d = p(c) + 1
                       , e = Pb(d);
                   return o(c, e, d + 1),
                       e
               }
               function C() {
                   return db
               }

               var $a = {
                   string: function(a) {
                       var b = 0;
                       if (null !== a && void 0 !== a && 0 !== a) {
                           var c = (a.length << 2) + 1;
                           b = Sb(c),
                               o(a, b, c)
                       }
                       return b
                   },
                   array: function(a) {
                       var b = Sb(a.length);
                       return K(a, b),
                           b
                   },
               };




//////////////////////////////// init global var

               var Da = 16;

               var Ea, Fa, Ga, Ha, Ia, Ja, Ka, La, Ma, Na, Oa, Pa, Qa, Ra, Sa, Ta, Ua, Va = {
                   "f64-rem": function(a, b) {
                       return a % b
                   },
                   "debugger": function() {}
               }, Wa = (new Array(0), 1024) ;

               Na = Oa = Qa = Ra = Sa = Ta = Ua = 0,
                   Pa = !1;
               var cb = 5242880 , db = 16777216, ab = 65536;


               var wasmMemory = new WebAssembly.Memory({
                   initial: db / ab,
                   maximum: db / ab
               });
               Ea = wasmMemory.buffer;

               w();
               Ja[0] = 1668509029;
               Ha[1] = 25459;

               var eb = []
                   , fb = []
                   , gb = []
                   , hb = []
                   , ib = !1
                   , jb = !1;

               Na = Wa,
                   Oa = Na + 6928,
                   fb.push();

               Oa += 16;

               Ua = d(4),
                   Qa = Ra = e(Oa),
                   Sa = Qa + cb,
                   Ta = e(Sa),
                   Ja[Ua >> 2] = Ta,
                   Pa = !0;

////////////////////////////////// wasm env ///////////////////////////////////////

               var fun_ = function(){};

               wasm_env = {
                   abort: fun_,
                   assert: fun_,
                   enlargeMemory: fun_,
                   getTotalMemory: C,
                   abortOnCannotGrowMemory: fun_,
                   abortStackOverflow: fun_,
                   nullFunc_ii: fun_,
                   nullFunc_iiii: fun_,
                   nullFunc_v: fun_,
                   nullFunc_vi: fun_,
                   nullFunc_viiii: fun_,
                   nullFunc_viiiii: fun_,
                   nullFunc_viiiiii: fun_,
                   invoke_ii: fun_,
                   invoke_iiii: fun_,
                   invoke_v: fun_,
                   invoke_vi: fun_,
                   invoke_viiii: fun_,
                   invoke_viiiii: fun_,
                   invoke_viiiiii: fun_,
                   __ZSt18uncaught_exceptionv: fun_,
                   ___cxa_find_matching_catch: fun_,
                   ___gxx_personality_v0: fun_,
                   ___lock: fun_,
                   ___resumeException: fun_,
                   ___setErrNo: fun_,
                   ___syscall140: fun_,
                   ___syscall146: fun_,
                   ___syscall54: fun_,
                   ___syscall6: fun_,
                   ___unlock: fun_,
                   _abort: fun_,
                   _emscripten_memcpy_big: fun_,
                   _get_unicode_str: P,              // function 20( ) => P( )
                   flush_NO_FILESYSTEM: fun_,
                   DYNAMICTOP_PTR: 7968,               //Ua
                   tempDoublePtr: 7952,                //rb
                   STACKTOP: 7984,                     //Ra
                   STACK_MAX: 5250864,                 //Sa

                   memoryBase: 1024,
                   tableBase: 0,
                   memory: wasmMemory,
                   table: new WebAssembly.Table({
                       initial: 99,
                       maximum: 99,
                       element: "anyfunc"
                   })
               };

               var importObject = {
                   'env': wasm_env,
                   'asm2wasm': {
                       "f64-rem": function(a, b) {
                           return a % b
                       },
                       "debugger": function() {}
                   },
                   'global': {
                       NaN: NaN,
                       Infinity: 1 / 0
                   },
                   "global.Math": Math,
                   // "parent": {};

               };

               const { helper } = ctx;
               const wasm_data = helper.global.get("tx_wasm");
               var buffer = new Uint8Array(wasm_data);

               var wasmobject = new WebAssembly.Instance(new WebAssembly.Module(buffer), importObject);



               function setdocument(URL, referrer){
                   document.URL = URL;
                   document.referrer = referrer;
               }

// encryptVer = "9.1"
               function getckey(platform, appVer, vid, empty_str="", guid, tm){
                   var _args = [platform, appVer, vid, empty_str="", guid, tm];
                   var c = ['number', 'string', 'string', 'string', 'string', 'number'];
                   return i('getckey', 'string', c, _args, undefined)

               }


//  playerID, guid
               function createGUID(a) {
                   a = a || 32;
                   for (var b = "", c = 1; c <= a; c++) {
                       var d = Math.floor(16 * Math.random()).toString(16);
                       b += d
                   }
                   return b
               }
               const dparam = this.data;
               endData = getckey(dparam.platform, dparam.appVer, sparam.vid, '', sparam.guid, sparam.tm.toString())
           }catch (e) {

               console.log(e)

           }

           return endData

        },
        async getVid(cid,ctx){
            //通过cid 换区vid
            const url = 'https://v.qq.com/x/cover/'+cid+'.html';

            console.log(url);
            let result = await ctx.curl(url, {   dataType: 'text', });

            const $ = cheerio.load(result.data, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            const durl = $('link[rel=canonical]').attr('href')
            let a = durl.split("/").reverse()[0].replace(".html","");
            return {
                vid:a,
                url:encodeURIComponent(url)
            };
        },
        async getVideoInfo(data,ctx){

            const { helper } = ctx;
            const defParam = {
                charge:0,
                defaultfmt:"auto",
                otype:"ojson",
                guid:"d4d95c534bfdd14e65842b8e253e939a",
                flowid:"",
                platform:10201,
                sdtfrom:"v1010",
                defnpayver:1,
                appVer:"3.5.57",
                host:"v.qq.com",
                ehost:"https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Fmzc0020022o8qha%2Fc0032xx9gkf.html",
                refer:"v.qq.com",
                sphttps:1,
                tm:1569139455,
                spwm:4,
                logintoken:'{"main_login":"","openid":"","appid":"","access_token":"","vuserid":"","vusession":""}',
                unid:"c8b3ad6fdd0c11e9981ca0424b63310a",
                vid:"c0032xx9gkf",
                defn:"",
                fhdswitch:0,
                show1080p:1,
                isHLS:1,
                dtype:3,
                sphls:2,
                spgzip:1,
                dlver:2,
                drm:32,
                hdcp:0,
                spau:1,
                spaudio:15,
                defsrc:1,
                encryptVer:"9.1",
                cKey:"qKCcBFr-0B579ZEItZs_lpJX5WB4a2CdS8k4xPWkVaqtHEZQ1c_W6myJ8hQOnmDCH4hmQsKQPDs52vPBr-xE-uhvZyEMY131vUh1H4pgCXe2Op8F_DerfPItmUppprhuqXwnEERXE5LBluNDEH6IC8EOljLQ2VfW2sTdospNPlD9535CNT9iSo3cLRH93ogtX_OJeYNVWrDYS8btjkFpGl3F3IxmISJc_8dRIBruTik-e4rt0isxZAXexKqWDJGxu2q0HP2MxCRA_O1gKkhW6CkPoHFF0xxVEIqoUQXdT6AxgEpFvFaJSMc2SvMQeMPBzaAGBgYGBgYx52iv",
                fp2p:1,
                spadseg:1
            }

            const getTime=function(a){a=a||10;var b=parseInt(+new Date)+"";if(b.length===a)return b;if(b.length>a)return b.substring(0,a);for(var c=a-b.length;c>0;)b="0"+b,c--;return b};
            defParam.tm =getTime();
            defParam.guid = helper.tx.createGUID();
            defParam.flowid = helper.tx.createGUID() + '_10201'
            defParam.ehost = decodeURIComponent(data.url)
            defParam.unid = helper.tx.createGUID();
            defParam.vid = data.vid;
            const cKey = await helper.tx.getKey(defParam,ctx);
            defParam.cKey=cKey;


            let endData = "";

            try{
                const fparam = {"buid":"vinfoad","adparam":"pf=in&ad_type=LD%7CKB%7CPVL&pf_ex=pc&url=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Fmzc0020022o8qha%2Fd003279ebxs.html&refer=https%3A%2F%2Fv.qq.com%2F&ty=web&plugin=1.0.0&v=3.5.57&coverid=mzc0020022o8qha&vid=d003279ebxs&pt=&flowid=ab182645c412027290b626a6b260cae4_10201&vptag=&pu=1&chid=0&adaptor=2&dtype=1&live=0&resp_type=json&guid=57e9d812e46159e7482f6d0ea8149527&req_type=1&from=0&appversion=1.0.141&uid=412124365&tkn=yk55qNYKHcZa7RaG9V_q-w..&lt=qq&platform=10201&opid=27D85B64EA86974952494392D3B9AA2D&atkn=6848299EF4929CDC8D5430A6CB973FF3&appid=101483052&tpid=2&rfid=6095412d81fa4f874ed2f21aca4324e3_1567664999","vinfoparam":"charge=0&defaultfmt=auto&otype=ojson&guid=57e9d812e46159e7482f6d0ea8149527&flowid=ab182645c412027290b626a6b260cae4_10201&platform=10201&sdtfrom=v1010&defnpayver=1&appVer=3.5.57&host=v.qq.com&ehost=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Fmzc0020022o8qha%2Fd003279ebxs.html&refer=v.qq.com&sphttps=1&tm=1567666856&spwm=4&logintoken=%7B%22main_login%22%3A%22qq%22%2C%22openid%22%3A%2227D85B64EA86974952494392D3B9AA2D%22%2C%22appid%22%3A%22101483052%22%2C%22access_token%22%3A%226848299EF4929CDC8D5430A6CB973FF3%22%2C%22vuserid%22%3A%22412124365%22%2C%22vusession%22%3A%22yk55qNYKHcZa7RaG9V_q-w..%22%7D&unid=389a2bf7c4bd11e9981ca0424b63310a&vid=d003279ebxs&defn=&fhdswitch=0&show1080p=1&isHLS=1&dtype=3&sphls=2&spgzip=1&dlver=2&drm=32&hdcp=0&spau=1&spaudio=15&defsrc=1&encryptVer=9.1&cKey=4edV6hO4GfB7xJEItZs_lpJX5WB4a2CdS8k4M23zVaqtHEZQ1c_W6myJ8hQJnmDCH8cnHseDKTvK2vPBr-xE-uhvZyEMY131vUh1H4pgCXe2Op8F_DerfPItmUppprhuqXwgEERXE92AluNDEH6IC8EOljLQ2VfW2sTdospNPlD9535CNT9iSo3aNBH9zIg0GafMPJVASLfUSMb5t1pjAAuGkoYGNScB_8lMahr0SD1lJfkplb5LtU1mpdrzcMbY1XniNzyOKljQ8AICTCwy2R1qtnFKghdTEN6oAQKOR6YxhI9oJNSAn0b7Tz8vMynPRK7kHTQSB0nxdmIalPsuAW2G8AUFBQUFTJFMuQ&fp2p=1&spadseg=1"}
                //fparam -- 原始数据测试使用
                const result = await ctx.curl('https://vd.l.qq.com/proxyhttp', {
                    headers: {
                        // "Accept": "application/json, text/javascript, */*; q=0.01",
                         "Origin":"https://v.qq.com",
                        "Referer":decodeURIComponent(data.url),
                        "Sec-Fetch-Mode":"cors",
                        "User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.132 Safari/537.36"
                    },
                    data:{
                        adparam:"",//"pf=in&ad_type=LD%7CKB%7CPVL&pf_ex=pc&url="+encodeURIComponent(data.url)+"&refer=https%3A%2F%2Fv.qq.com%2Fchannel%2Ftv&ty=web&plugin=1.0.0&v=3.5.57&coverid="+data.cid+"&vid="+defParam.vid+"&pt=&flowid="+defParam.flowid+"&vptag=&pu=0&chid=0&adaptor=2&dtype=1&live=0&resp_type=json&guid="+defParam.guid+"&req_type=1&from=0&appversion=1.0.141&platform=10201&tpid=2&rfid="+defParam.guid+"_1568442240",
                        buid:"vinfoad",
                        vinfoparam:helper.url2String(defParam)
                        // vinfoparam: "charge=0&defaultfmt=auto&otype=ojson&guid=d4d95c534bfdd14e65842b8e253e939a&flowid=7da775aea05d7bd680a6a7ee8dff5ca9_10201&platform=10201&sdtfrom=v1010&defnpayver=1&appVer=3.5.57&host=v.qq.com&ehost=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Fmzc0020022o8qha%2Fc0032xx9gkf.html&refer=v.qq.com&sphttps=1&tm=1569139455&spwm=4&logintoken=%7B%22main_login%22%3A%22%22%2C%22openid%22%3A%22%22%2C%22appid%22%3A%22%22%2C%22access_token%22%3A%22%22%2C%22vuserid%22%3A%22%22%2C%22vusession%22%3A%22%22%7D&unid=c8b3ad6fdd0c11e9981ca0424b63310a&vid=c0032xx9gkf&defn=&fhdswitch=0&show1080p=1&isHLS=1&dtype=3&sphls=2&spgzip=1&dlver=2&drm=32&hdcp=0&spau=1&spaudio=15&defsrc=1&encryptVer=9.1&cKey=qKCcBFr-0B579ZEItZs_lpJX5WB4a2CdS8k4xPWkVaqtHEZQ1c_W6myJ8hQOnmDCH4hmQsKQPDs52vPBr-xE-uhvZyEMY131vUh1H4pgCXe2Op8F_DerfPItmUppprhuqXwnEERXE5LBluNDEH6IC8EOljLQ2VfW2sTdospNPlD9535CNT9iSo3cLRH93ogtX_OJeYNVWrDYS8btjkFpGl3F3IxmISJc_8dRIBruTik-e4rt0isxZAXexKqWDJGxu2q0HP2MxCRA_O1gKkhW6CkPoHFF0xxVEIqoUQXdT6AxgEpFvFaJSMc2SvMQeMPBzaAGBgYGBgYx52iv&fp2p=1&spadseg=1"
                    },
                    // data:{"buid":"vinfoad","adparam":"pf=in&ad_type=LD%7CKB%7CPVL&pf_ex=pc&url=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Fmzc0020022o8qha%2Fm00326tgugv.html&refer=https%3A%2F%2Fv.qq.com%2F&ty=web&plugin=1.0.0&v=3.5.57&coverid=mzc0020022o8qha&vid=m00326tgugv&pt=&flowid=98a58b91c506673ca465f2a6aff306b8_10201&vptag=%7Cv_qq_com&pu=-1&chid=0&adaptor=2&dtype=1&live=0&resp_type=json&guid=65386cecd00e6a8df774cb3291adf45e&req_type=1&from=0&appversion=1.0.141&uid=1977439602&tkn=rcMYby4ZMxjONuR2LhXBKQ..&lt=wx&platform=10201&opid=ox8XOvtG38kiC72xbYijPJ9f0G4g&atkn=25_rn7VgrI45mBzdShpaLP87KWAyN3MDuKJCTb_k90oFiIoUubwkHnmfz35CA8unCH0PKugdsYl0KqE7HhX4MNLRVXlZkt8OBd5trmlCBPTgK4&appid=wx5ed58254bc0d6b7f&tpid=2","vinfoparam":"charge=0&defaultfmt=auto&otype=ojson&guid=65386cecd00e6a8df774cb3291adf45e&flowid=98a58b91c506673ca465f2a6aff306b8_10201&platform=10201&sdtfrom=v1010&defnpayver=1&appVer=3.5.57&host=v.qq.com&ehost=https%3A%2F%2Fv.qq.com%2Fx%2Fcover%2Fmzc0020022o8qha%2Fm00326tgugv.html&refer=v.qq.com&sphttps=1&tm=1568536161&spwm=4&logintoken=%7B%22main_login%22%3A%22wx%22%2C%22openid%22%3A%22ox8XOvtG38kiC72xbYijPJ9f0G4g%22%2C%22appid%22%3A%22wx5ed58254bc0d6b7f%22%2C%22access_token%22%3A%2225_rn7VgrI45mBzdShpaLP87KWAyN3MDuKJCTb_k90oFiIoUubwkHnmfz35CA8unCH0PKugdsYl0KqE7HhX4MNLRVXlZkt8OBd5trmlCBPTgK4%22%2C%22vuserid%22%3A%221977439602%22%2C%22vusession%22%3A%22rcMYby4ZMxjONuR2LhXBKQ..%22%7D&unid=9b4428ccd6d311e9981ca042d48ad00a&vid=m00326tgugv&defn=&fhdswitch=0&show1080p=1&isHLS=1&dtype=3&sphls=2&spgzip=1&dlver=2&drm=32&hdcp=0&spau=1&spaudio=15&defsrc=1&encryptVer=9.1&cKey=uOlpy0q2JdF7xJEItZs_lpJX5WB4a2CdS8k4Pik6VaqtHEZQ1c_W6myJ8hQAnmDCH8ZqHNCcLDvK2vPBr-xE-uhvZyEMY131vUh1H4pgCXe2Op8F_DerfPItmUppprhuqXwpEERXE9zNluNDEH6IC8EOljLQ2VfW2sTdospNPlD9535CNT9iSo3cLRH93ogtX_OJeYNVWrDYS8b5t1pjAAuGkoYGNScB_8lMahr0SD1lJfkplb5LtU1mpdrzcMbY1XniNzyOKljQ8AICTCwy2R1qtnJI1BYBS4r5AAaIE6Vp2dw6K9HSykD4GGcmY3mQRam2LMl4xIC9kLzlwBvDVaSjcAUFBQUFdE8hcg&fp2p=1&spadseg=1"},
                    method: 'POST'
                    ,dataType: 'json',
                    contentType: 'json',
                });
                let {vinfo,errCode} = result.data;

                vinfo= JSON.parse(vinfo);
                let obj = vinfo.vl.vi[0].ul.ui.sort((a,b)=>{return a.vt >  b.vt})[0];

                endData=obj.url.indexOf(".m3u8")>-1?obj.url:(obj.url+obj.hls.pt);

                console.log(endData);
            }catch (e) {
                console.error(e)
            }

            return endData;
        }

    },

    global: {
        get(key) {
            return global[key];
        },
        set(key, value) {
            global[key] = value;
        },
    },
    // login:{
    //     set(ctx,data){
    //
    //
    //     }
    // }


};
