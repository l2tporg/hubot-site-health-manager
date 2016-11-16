"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Created by pncity on 2016/10/25.
 * redisでは重複検査メソッドなどがデフォルトで存在する
 * index操作を可能にするためにハッシュ型を採択
 */
// let redis = require("redis"),
//   client = redis.createClient();

var redis = require("redis"),
  client;

if(process.env.REDISTOGO_URL !== undefined) {
  var redisInfo = require("url").parse(process.env.REDISTOGO_URL);
  client = redis.createClient(redisInfo.port, redisInfo.hostname);
  client.auth(redisInfo.auth.split(":")[1]);
} else {
  client = redis.createClient();
}

var NurseWithRedis = function () {
  function NurseWithRedis() {
    _classCallCheck(this, NurseWithRedis);
  }

  _createClass(NurseWithRedis, null, [{
    key: "getListAll",

    /** Implement **/
    /**
     * getListAll: get hash array of all, url and statusCode.
     *
     * @param <String, Function> key(required), callback(required)
     * @return <Hash> { 'http://yahoo.co.jp': '200', 'https://google.com': '200' } -> forEachで処理
     */
    value: function getListAll(key, callback) {
      client.hgetall(key, callback);
    }
  }, {
    key: "getListKeys",


    /**
     * getListKeys: get hash array of url names.
     *
     * @param <String, Function> key(required), callback(optional)
     * @return <Hash> { 'http://yahoo.co.jp', 'https://google.com' }
     */
    value: function getListKeys(key, callback) {
      client.hkeys(key, callback);
    }
  }, {
    key: "addUrl",


    /**
     * addUrl: adding some url and status pairs into list.
     *
     * @param <String, Array, Response, Function> key(required), dataArray(required), msg(required), callback(optional) data array adding into list. msg is a Message object in hubot.
     * @return <String>  Simple string reply (http://redis.io/topics/protocol#simple-string-reply)
     */
    value: function addUrl(key, dataArray, msg, callback) {
      /* dataArray: 元のurl,statusのarray, _dataArray: 最終的にaddする要素を格納するarray, _urlArray: hkeysの検索結果のarray */
      console.log("dataArray1: ", dataArray); //@@

      //swap用
      var _dataArray = [];
      console.log("_dataArray1: ", _dataArray); //@@ 追加するURLsを格納するarray

      //eliminate existing elements from dataArray
      client.hkeys(key, function (err, _urlArray) {
        dataArray.forEach(function (url, i) {
          console.log("i: " + i);

          if (i % 2 === 0) {
            //urlのみ対象
            if (_urlArray.indexOf(url) > -1) {
              //exists
              console.log("exists: true");
              msg.send("Adding ERROR: '" + url + "' already exist.");
            } else {
              //not exists
              console.log("exists: false");
              _dataArray.push(dataArray[i], dataArray[i + 1]);
            }
          }
        });
        console.log("_dataArray2: ", _dataArray); //@@ 最終的に追加するuRL
        client.hmset(key, _dataArray, callback);
      });
    }
  }, {
    key: "updateUrl",


    /**
     *  updateUrl: (deprecated) update status code of existing url in list.
     *
     *  @param <String, Number, Number, Function> key(required), index(required), status(required), callback(optional) Pair of pertinent index and new status code.
     *  @return <Number> 0: overwrite(success), 1: new create(failed)
     *  */
    value: function updateUrl(key, index, status, callback) {
      var url = void 0;
      client.multi().hkeys(key, function (err, _urlArray) {
        //もしindexがoverflowだとundefinedが代入され、undefined:statusで登録されてしまう

        if(_urlArray[index] !== undefined) {
          url = _urlArray[index];
          client.hset(key, url, status, callback); //promiseで繋げたい
        } else { //index is overflow
          callback({}, null);
        }
      }).exec();
    }
  }, {
    key: "removeUrl",


    /**
     * removeUrl: remove some url and status pairs from list.
     *
     * @param <String, Number, Function> key(required), index(required), callback(optional) indexes wanted to be removed from list.
     * @return <Number> the number of removed elements.
     */
    value: function removeUrl(key, index, callback) {
      /* 複数Urlに対応 */
      //対応しようと思ったのだが、hdelはarrayでフィールド指定ができないため一括削除することをデフォルトで想定していないと見た。

      var url = void 0; //削除するurl(swap用)
      client.multi().hkeys(key, function (err, _urlArray) {
        //本来ならばここで_urlArray[index] !== undefined の判定が必要だが、これをあえて見逃すことでundefinedというfiledを削除してくれるため一石二鳥であるから判定は加えない。
        url = _urlArray[index];
        client.hdel(key, url, callback); //これをmultiで繋げたい
      }).exec();
    }
  }, {
    key: "searchIndexFromUrl",


    /**
     *  searchIndexIndexFromUrl: Return a index number of specified url.
     *
     * @param <String, String, Function> key(required), url(required), callback(optional) Specified url
     * @return <Number> index number, or -1 if not exists.
     */
    value: function searchIndexFromUrl(key, url, callback) {
      client.hkeys(key, function (err, _urlArray) {
        callback(_urlArray.indexOf(url));
      });
    }
  }, {
    key: "searchUrlFromIndex",


    /**
     *  searchUrlFromIndex: Return a url name of specified index.
     *
     * @param <String, Number, Function> key(required), index(required), callback(optional) index number of url
     * @return <String> url name, or -1 if not exists.
     */
    value: function searchUrlFromIndex(key, index, callback) {
      client.hkeys(key, function (err, _urlArray) {
        callback(_urlArray[index]);
      });
    }
  }]);

  return NurseWithRedis;
}();

module.exports.NurseWithRedis = NurseWithRedis;
