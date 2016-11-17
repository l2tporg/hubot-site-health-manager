# Hubot Site Health Manager

## Description
- これはRedisを使った、以下のような形式でUrlとStatusCodeのペアを格納するストレージマネージャです。

  > 
  ```js
  {
      channelName: {
        url: statusCode,
        url: statusCode
        ...
      },
      channelName: {
        url: statusCode,
        url: statusCode
        ...
      }
    }
  ```
- [Hubot-Site-Health-Examine](https://github.com/l2tporg/hubot-site-health-examine.git)と合わせてご使用ください。
- ボットを招待したチャネルごとに異なるデータベースを構築します。

## <div id="Feature">Features</div>
- Hubot-Site-Health-Managerで提供する機能は以下のとおりです。
  1. 監視したいサイトリストのCRUD管理 -> [Commands](#Commands)の項目を参照

## <div id="Install">Install</div>
### 1. 
```bash
npm install --save hubot-site-health-examine
```
or 
```bash
yarn add hubot-site-health-manager && yarn install
```

### 2. 
`external-scripts.json`に`"hubot-site-health-manager"`を追記する。
### 3.
`hubot-site-health-examine` を合わせてinstallする。


## <div id="Commands">Commands</div>

##### []:省略可能, <>:引数

- `[BOT_NAME] she add <URL:string> <STATUS_CODE:int>` : 検査するサイトを登録
- `[BOT_NAME] she list|ls` : 登録されたサイトをインデックス付きで表示
- `[BOT_NAME] she update|ud <INDEX:int> <NEW_STATUS_CODE:int>` : 登録されたサイトのインデックスと新しいステータスを指定して更新
- `[BOT_NAME] she remove|rm <INDEX:int>` : 登録されたサイトをインデックスを指定して削除

> コマンドで `|` 区切りで指定されているものは、いずれかに一致という意味です。

> なお, コマンド名がsheである理由はHubot-Site-Health-Examineの名残です。



## <div id="Customize">Customize</div>
- 独自のストレージ様式を構築する場合のTips

### モジュールのimport
```coffeescript:sample.coffee
#ストレージ操作用のclassを読み込む
Nurse = require('hubot-site-health-manager').NurseWithRedis
```

### メソッド群

#### 1. getListAll
- 指定したkeyに登録されているすべてのオブジェクトを取得
```js
    /**
     * getListAll: get hash array of all, url and statusCode.
     *
     * @param <String, Function> key, callback
     * @return <Hash> { 'http://yahoo.co.jp': '200', 'https://google.com': '200' } -> forEachで処理
     */
```

#### 2. getListKeys
- 指定したkeyに登録されているオブジェクトのUrl一覧のみを取得
```js
    /**
     * getListKeys: get hash array of url names.
     *
     * @param <String, Function> key(required), callback(optional)
     * @return <Hash> { 'http://yahoo.co.jp', 'https://google.com' }
     */
```

#### 3. addUrl

- 指定したkeyに、指定したUrlとstatusCodeのペアを追加
```js
   /**
    * addUrl: adding some url and status pairs into list.
    *
    * @param <String, Array, Response, Function> key(required), dataArray(required), msg(required), callback(optional) data array adding into list. msg is a Message object in hubot.
    * @return <String>  Simple string reply (http://redis.io/topics/protocol#simple-string-reply)
    */
```

#### 4. updateUrl
- 指定したkeyに登録されている、指定したindexのUrlのstatusCodeを、指定した新しいstatusCodeに更新
```js
    /**
     *  updateUrl: (deprecated) update status code of existing url in list.
     *
     *  @param <String, Number, Number, Function> key(required), index(required), status(required), callback(optional) Pair of pertinent index and new status code.
     *  @return <Number> 0: overwrite(success), 1: new create(failed)
     */
```


#### 5. removeUrl
- 指定したkeyに登録されている、指定したindexのurlを削除
```js
    /**
     * removeUrl: remove some url and status pairs from list.
     *
     * @param <String, Number, Function> key(required), index(required), callback(optional) indexes wanted to be removed from list.
     * @return <Number> the number of removed elements.
     */
```

#### 6. searchIndexFromUrl
- 指定したkeyに登録されている、指定したindexに対応するUrlを取得
```js
    /**
     *  searchIndexFromUrl: Return a index number of specified url.
     *
     * @param <String, String, Function> key(required), url(required), callback(optional) Specified url
     * @return <Number> index number, or -1 if not exists.
     */
```

#### 7. searchUrlFromIndex
- 指定したkeyに登録されている、指定したUrlに対応するindexを取得
```js
    /**
     *  searchUrlFromIndex: Return a url name of specified index.
     *
     * @param <String, Number, Function> key(required), index(required), callback(optional) index number of url
     * @return <String> url name, or -1 if not exists.
     */
```

#### サンプルコード(addUrlを使ってみる)
```coffeescript:sample.coffee
# Nurseインスタンスを生成
nurse = new Nurse(robot)
# key指定
key = "hoge"
robot.hear /she add sample/i, (msg) ->
  # keyに格納するurlとstatusCodeのペアをArrayに格納
  url = 'http://google.com'
  status = 200
  dataArray = [url, status];
  # addUrlメソッドを実行
  nurse.addUrl(key, dataArray, msg, (err, res) {
        if res === 'OK'
          msg.send "Adding SUCCES: '" + url + "' " + status
        else if err?
          msg.send "Adding ERROR: " + "Unexpected Error"
  }
```

## <div id="Licence">Licence</div>

[MIT](https://github.com/sak39)

## <div id="Author">Author</div>

[sak39](https://github.com/sak39)
