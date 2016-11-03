/**
 * Created by pncity on 2016/10/25.
 * redisでは重複検査メソッドなどがデフォルトで存在する
 * index操作を可能にするためにハッシュ型を採択
 */
const redis = require("redis"),
  client = redis.createClient();


class NurseWithRedis {
  // const key = channelKey || "key"; //default key is "sites"
  /** Implement **/
  /**
   * getListAll: get hash array of all, url and statusCode.
   *
   * @param <none>
   * @return <Hash> { 'http://yahoo.co.jp': '200', 'https://google.com': '200' } -> forEachで処理shori
   */
  static getListAll(key, callback) {
    client.hgetall(key, callback);
  };

  /**
   * getListKeys: get hash array of url names.
   *
   * @param <none>
   * @return <Hash> { 'http://yahoo.co.jp', 'https://google.com' }
   */
  static getListKeys(key, callback) {
    client.hkeys(key, callback);
  };

  /**
   * addUrl: adding some url and status pairs into list.
   *
   * @param <Array, Function> dataArray, callback, msg (required) data array adding into list. msg is a Message object in hubot.
   * @return <String>  Simple string reply (http://redis.io/topics/protocol#simple-string-reply)
   */
  static addUrl(key, dataArray, callback, msg) {
    /* dataArray: 元のurl,statusのarray, _dataArray: 最終的にaddする要素を格納するarray, _urlArray: hkeysの検索結果のarray */
    console.log("dataArray1: ", dataArray); //@@

    //swap用
    let _dataArray = [];
    console.log("_dataArray1: ", _dataArray); //@@ 追加するURLsを格納するarray

    //eliminate existing elements from dataArray
    client.hkeys(key, function (err, _urlArray) {
      dataArray.forEach(function (url, i) {
        console.log("i: " + i);

        if(i%2 === 0) { //urlのみ対象
          if (_urlArray.indexOf(url) > -1) { //exists
            console.log("exists: true");
            msg.send("Adding ERROR: '" + url + "' already exist.");
          } else { //not exists
            console.log("exists: false");
            _dataArray.push(dataArray[i], dataArray[i+1]);
          }
        }
      });

      console.log("_dataArray2: ", _dataArray); //@@ 最終的に追加するuRL
      client.hmset(key, _dataArray, callback);
    });
  };

  /**
   *  updateUrl: (deprecated) update status code of existing url in list.
   *
   *  @param <integer, integer, Function> index, status, callback (required) Pair of pertinent index and new status code.
   *  @return <integer> 0: overwrite(success), 1: new create(failed)
   *  */
  static updateUrl(key, index, status, callback) {
    let url;
    client.multi()
      .hkeys(key, function (err, _urlArray) {
        //もしindexがoverflowだとundefinedが代入され、undefined:statusで登録されてしまう

        if(_urlArray[index] !== undefined) {
          url = _urlArray[index];
          client.hset(key, url, status, callback); //promiseで繋げたい
        } else { //index is overflow
          callback({}, null);
        }
      })
      .exec();
  };

  /**
   * removeUrl: remove some url and status pairs from list.
   *
   * @param <integer, Function> index, callback (required) indexes wanted to be removed from list.
   * @return <integer> the number of removed elements.
   */
  /* remove */
  static removeUrl(key, index, callback) {
    /* 複数Urlに対応 */
    //対応しようと思ったのだが、hdelはarrayでフィールド指定ができないため一括削除することをデフォルトで想定していないと見た。

    let url; //削除するurl(swap用)
    client.multi()
      .hkeys(key, function (err, _urlArray) {
        //本来ならばここで_urlArray[index] !== undefined の判定が必要だが、これをあえて見逃すことでundefinedというfiledを削除してくれるため一石二鳥であるから判定は加えない。
          url = _urlArray[index];
          client.hdel(key, url, callback); //これをmultiで繋げたい
      })
      .exec();
  };

  /**
   *  searchIndexIndexFromUrl: Return a index number of specified url.
   *
   * @param <String, Function> url(required), callback(required) Specified url
   * @return <integer> index number, or -1 if not exists.
   */
  static searchIndexFromUrl(key, url, callback) {
    client.hkeys(key, function (err, _urlArray) {
      callback(_urlArray.indexOf(url));
    });
  };

  /**
   *  searchUrlFromIndex: Return a url name of specified index.
   *
   * @param <integer, Function> index(required), callback(required) index number of url
   * @return <String> url name, or -1 if not exists.
   */
  static searchUrlFromIndex(key, index, callback) {
    client.hkeys(key, function (err, _urlArray) {
      callback(_urlArray[index]);
    });
  };
}

module.exports.NurseWithRedis = NurseWithRedis;
