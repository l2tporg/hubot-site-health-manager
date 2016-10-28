/**
 * Created by pncity on 2016/10/25.
 * redisでは重複検査メソッドなどがデフォルトで存在する
 * index操作を可能にするためにハッシュ型を採択
 */
var redis = require("redis"),
  client = redis.createClient(),
  bluebird = require("bluebird");


class Nurse {

}

module.exports = function (robot) {
  var key = "sites";
  console.log("robot: ", robot); //@@
  // const key = channelKey || "key"; //default key is "sites"

  /** Implement **/
  /**
   * list
   * @param <none>
   * @return <Hash> { 'http://yahoo.co.jp': '200', 'https://google.com': '200' } -> forEachで処理shori
   */
  var getList = function (callback) {
    client.hgetall(key, callback);
  };

  /**
   * addUrl: adding some url and status pairs into list.
   * ps    : if a key exists, it overwrite it.
   * @param <Array, Function> dataArray, callback (required) data array adding into list.
   * @return <String>  Simple string reply (http://redis.io/topics/protocol#simple-string-reply)
   */
  var addUrl = function (dataArray, callback) {
    /* dataArray: 元のurl,statusのarray, _urlArray: hkeysの検索結果のarray */
    console.log("dataArray1: ", dataArray); //@@

    //swap用
    var _dataArray = [];
    console.log("_dataArray1: ", _dataArray); //@@ 追加するURLsを格納するarray

    //eliminate existing elements from dataArray
    client.hkeys(key, function (err, _urlArray) {
      dataArray.forEach(function (url, i) {
        console.log("i: " + i);

        if(i%2 === 0) { //urlのみ対象
          if (_urlArray.indexOf(url) > -1) { //exists
            // console.log("i: " + i);
            // console.log("url: " + url);
            console.log("exists: true");
            console.log("Adding ERROR: '" + url + "' already exist.");
          } else { //not exists
            console.log("exists: false");
            _dataArray.push(dataArray[i], dataArray[i+1]);
          }
        }
      });

      console.log("_dataArray2: ", _dataArray); //@@ 最終的に追加するuRL
      client.hmset(key, _dataArray, callback);
    });

    // //create array of url only
    // var urlArray = [];
    // dataArray.map(function (el, i) {
    //   if (i % 2 === 0) {
    //     urlArray.push(el);
    //   }
    // });
    // console.log("urlArray: ", urlArray); //@@

    // //eliminate existing elements from dataArray
    // client.hkeys(key, function (err, _urlArray) {
    //   urlArray.forEach(function (url, i) {
    //     if (_urlArray.indexOf(url) > -1) { //exists
    //       console.log("exists: true");
    //       console.log("i: " + i);
    //       console.log("Adding ERROR: '" + url + "' already exist.");
    //       dataArray.splice(i, 2); //元のarrayからurl, statusを削除
    //     } else { //not exists
    //       console.log("exists: false");
    //     }
    //   });
    //   console.log("dataArray2: " + dataArray); //@@ 加工後のuRL
    //   client.hmset(key, dataArray, callback);
    // });
  };


  /**
   * removeUrl: remove some url and status pairs from list.
   *
   * @param <integer.., Function> index.., callback (required) indexes wanted to be removed from list.
   * @return <integer> the number of removed elements.
   */
  /* remove */
  var removeUrl = function (index, callback) {
    /* 複数Urlに対応 */
    // var delUrlArray = []; //削除するurl
    // client.multi()
    //   .hkeys(key, function (err, urlArray) {
    //     console.log(urlArray); //@@
    //     /* 該当するUrlをdelUrlArrayに格納する */
    //     if (urlArray.length > 0) {
    //       for(var i in index) {
    //         delUrlArray.push(urlArray[i]);
    //       }
    //     }
    //   })
    //   .hdel(key, delUrlArray, callback)
    //   .exec();

    var urlArray; //削除するurl(swap用)
    client.multi()
      .hkeys(key, function (err, res) {
        console.log("res: ", res); //@@ aray
        urlArray = res[index];
        console.log("urlArray: " + urlArray); //@@ string
        client.hdel(key, urlArray, callback); //こいつをmultiで繋げたいのだが、おそらくbluebirdを使ってうまく実装する必要があるため、とりあえず内部で実行しちゃう。
      })
      .hgetall(key, getCallback) //delの実行よりも先に実行されてしまう
      .exec();
  };

  /**
   *  updateUrl: (deprecated) update status code of existing url in list.
   *
   *  @param <integer, integer, Function> index, status, callback (required) Pair of pertinent index and new status code.
   *  @return <String> Simple string reply
   *  */
  var updateUrl = function (index, status, callback) {
    var urlArray;
    client.multi()
      .hkeys(key, function (err, res) {
        console.log("res: " + res);
        urlArray = res[index];
        console.log("urlArray: " + urlArray); //@@ string
        client.hset(key, urlArray, status, callback) //本当はbluebirdを使ってうまく外に出したい(multiで連鎖させたい)
      })
      .exec();

    client.hgetall(key, getCallback); //upの実行よりも先に実行されてしまう
  };

  /**
   *  searchIndex: Return index number of specified url.
   *
   * @param <String> url (required) Specified url
   * @return <integer> index >1: exist, -1: non exist
   */
  var searchIndex = function (url) {
    var urlArray = [];
    client.hkeys(key, function (err, _urlArray) {
      urlArray = _urlArray;
      console.log(typeof urlArray) //@@
    });
    console.log(urlArray.indexOf(url)) //@@
    return urlArray.indexOf(url);
  };
};
