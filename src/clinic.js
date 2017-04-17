'use strict';

// Generated by CoffeeScript 1.10.0
var Nurse = require('./NurseWithRedis').NurseWithRedis,
    Doctor = require('./Doctor').Doctor,
    request = require('request');

module.exports = function (robot) {
  // robot.hear( /she test/i, ( msg ) => {
  //   var key = msg.envelope.room;
  //   Nurse.add( "cronjob", key, "stopped", ( err, res ) => {
  //     console.log( "add cronjob to redis!!!!!!!!!" );
  //     if( res === 'OK' ) {
  //       console.log( 'adding success' );
  //       Nurse.getListAll( "cronjob", ( err, res ) => {
  //         console.log( "res: ", res );
  //       } );
  //     } else {
  //       console.log( 'Adding error' );
  //       console.error( err );
  //     }
  //   } )
  // } );
  //
  // robot.hear( /she test list/i, ( msg ) => {
  //   Nurse.getListAll( "cronjob", ( err, res ) => {
  //     if( err ) {
  //       console.error( err );
  //     } else {
  //       console.log( "res: ", res );
  //     }
  //   } );
  // } );
  //
  // var cronJobs = {};
  // robot.hear( /she restart cron/i, ( msg ) => {
  //   Nurse.getListAll( "cronjob", ( err, cronjobs ) => {
  //     if( err ) {
  //       console.error( err );
  //     } else {
  //       for( var envelope in cronjobs ) {
  //         var status = cronjobs[ envelope ];
  //         console.log( 'status: ', status );
  //         if( status === 'started' ) {
  //           status = true;
  //         } else if( status === 'stopped' ) {
  //           status = false;
  //         }
  //         //cron restart
  //         var flags = [1, 0, 1];
  //         var cronjob = new cronJob( {
  //           cronTime: "1 * * * * *",      // 実行時間 s m h d w m
  //           start   : status,                  // すぐにcronのjobを実行する
  //           timeZone: "Asia/Tokyo",      // タイムゾーン指定
  //           onTick  : () => {                  // 時間が来た時に実行する処理
  //             Nurse.getListAll( envelope, ( err, dataArray ) => {
  //               for(url of dataArray) {
  //                 robot.emit( 'healthExamine', url, Number( dataArray[url] ), flags, envelope );
  //               }
  //             } );
  //           }
  //         } );
  //         // cronjob.stop()のためにobjectを保存しておく
  //         cronJobs[ envelope ] = cronjob;
  //       }
  //     }
  //   } );
  // } );
  //
  // console.log( 'cronjobs: ', cronJobs );

  // const Nurse = new Nurse(robot);
  // Nurse.getList();
  /* 自発的なサイトチェック */
  /* healthExamineイベント方式 */
  // robot.hear(/she ex(?:amine)? with e(?:vent)?/i, function(msg) {
  //   var Nurse, flags, list, i, len, site, results=[];
  //   Nurse = new Nurse(robot);
  //   /* 出力内容の選定 */
  //   /* ###1st: error, 2nd: success, 3rd: fault */
  //   flags = [1,1,1];
  //   list = Nurse.getList();
  //   for (i = 0, len = list.length; i < len; i++) {
  //     site = list[i];
  //     results.push(robot.emit('healthExamine', site, flags, "bot"));
  //   }
  // });

  /* Doctor方式 */
  // robot.hear(/she examine with doctor/i, function(msg) {
  //   var list, len, i, site;
  //   list = Nurse.getList();
  //   //監視対象リストとcallback関数とmsgを渡す。
  //   for(i = 0, len = list.length; i < len; i++) {
  //     site = list[i];
  //     Doctor.examine(site, examineCallback, msg);
  //   }
  // });
  // /* examine終了後のcallback */
  // var examineCallback = function(message, msg) {
  //   var results = [];
  //   if (message.status === "error") {
  //     results.push(msg.send(message.discription));
  //   } else if (message.status === "matched") {
  //     results.push(msg.send(message.discription));
  //   } else if (message.status === "unmatched") {
  //     results.push(msg.send(message.discription));
  //   } else {
  //     results.push(void 0);
  //   }
  //   return results;
  // };

  // /** Redis Callback **/
  /* get test */
  // const getCallback = function (err, res) {
  //   if (err) {
  //     console.log("Getting ERROR: " + err);
  //   } else if (res.length === 0) {
  //     console.log("Getting ERROR: " + "empty");
  //   } else {
  //     console.dir(res);
  //   }
  // };
  //
  // /* add test */
  // const addCallback = function (err, res) {
  //   if (res === 'OK') {
  //     console.log("Adding: SUCCES");
  //   } else {
  //     console.log("Adding ERROR: " + "Unexpected Error");
  //   }
  // };
  //
  // // /* update test */
  // const updateCallback = function(err, res) {
  //   console.log("ud err: " + err); //@@
  //   console.log("ud res: " + res); //1: Not exist and set it newly. 0: already exist and overwrite it.
  // };
  //
  // /* remove test */
  // const removeCallback = function(err, res) {
  //   console.log("rm err: " + err); //@@
  //   console.log("rm res: " + res); //number of deleted elements.
  // };


  /** Get List of Nurse **/
  //she list|ls
  robot.hear(/she[\s]+li?st?$/i, function (msg) {
    var field = void 0,
        list = [];
    var key = msg.envelope.room;
    console.log(key); //@@
    Nurse.getListAll(key, function (err, _list) {
      //url配列 _listはstatusCodeを参照するために残しておく
      for (field in _list) {
        list.push(field);
      }
      if (err) {
        msg.send("Getting ERROR: " + err);
      } else if (list.length === 0) {
        msg.send("Getting ERROR: " + "empty");
      } else {
        list.forEach(function (el, i) {
          msg.send(i + " : '" + el + "' " + _list[el]);
        });
      }
    });
  });

  /** Add Nurse to check **/
  //she add <url> <statusCode>
  robot.hear(/she[\s]+add[\s]+(\S+)[\s]+(\d+)$/i, function (msg) {
    var dataArray = [],
        url = void 0,
        status = void 0;
    var key = msg.envelope.room;
    url = msg.match[1];
    status = Number(msg.match[2]);
    dataArray.push(url, status);

    Nurse.addUrl(key, dataArray, msg, function (err, res) {
      console.log('adding res: ', res); //@@
      if (res === 'OK') {
        msg.send("Adding SUCCES: '" + url + "' " + status);
      } else if (err) { //if else, res is 'undefined'
        msg.send("Adding ERROR: " + "Unexpected Error");
      }
    }, msg);
  });

  /** Update expected status code **/
  //she update|ud <index> <statusCode>
  robot.hear(/she[\s]+up?d(?:ate)?[\s]+(\d+)[\s]+(\d+)$/i, function (msg) {
    var index = void 0,
        status = void 0;
    var key = msg.envelope.room;
    index = msg.match[1];
    status = Number(msg.match[2]);
    Nurse.updateUrl(key, index, status, function (err, res) {
      if (err) {
        return msg.send("Updating ERROR: There are no such registered site.");
      } else if (res === 1) {
        return msg.send("Updating ERROR: New site has been registered now. It's not expected. You should check it.");
      } else {
        Nurse.searchUrlFromIndex(key, index, function (url) {
          return msg.send("Updating SUCCESS: '" + url + "' " + status);
        });
      }
    });
  });

  /** Remove Url from list **/
  //she remove|rm <index>
  return robot.hear(/she[\s]+re?m(?:ove)?[\s]+(\d+)$/i, function (msg) {
    var index = void 0;
    var key = msg.envelope.room;
    //削除するurlは複数でもOKなので後々対応させる
    index = msg.match[1];
    Nurse.removeUrl(key, index, function (err, res) {
      if (err) {
        return msg.send("Removing ERROR: There are no such registered site.");
      } else if (res === 0) {
        return msg.send("Removing ERROR: There are no such registered site.");
      } else {
        Nurse.searchUrlFromIndex(key, index, function (url) {
          return msg.send("Removing SUCCESS: '" + url + "'.");
        });
      }
    });
  });
};
