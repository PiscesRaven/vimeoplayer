

Demo create
```javascript
const rootState = new RootState();

// VUE 
created: function () {
  const vm = this;
  vm.player = rootState;
},
mounted: function () {
  this.initPlayer();
},
methods: {
  initPlayer: function () {
    rootState.initElId('iframe_ctn');
    const initData = {
      id: 76979871,
      title: "The New Vimeo Player (You Know, For Videos)",
      sources: "https://player.vimeo.com/video/76979871?controls=0",
      poster: "https://img.youtube.com/vi/V-xK3sbc7xI/maxresdefault.jpg"
    };
    rootState.initMedia(initData);
  },
}

```

## class constructor

### RootState
```javascript
this.elId = null;
this.childDon = 'iframe_dom'; // elId 的預設子節點
this.el = null;
this.isPaused = true; // 播放狀態
this.returnToPlayed = false; // 是否繼續播放
this.isPlayed = false; // 是否播放過
this.mediaData = null; // 媒體資料
this.mediaSources = null; // 媒體來原
this.mediaVol = 1; // 聲音
this.muteBeforeVol = 1; // 靜音前的聲音大小
this.mediaSpeed = 1; // 影片速度
this.duration = 0; // 影片總時長
this.currentTime = 0; // 影片播放中的時間
this.isFullScreen = false; // 是否全螢幕
this.didInvalidate = true; // 確認是否有資料
this.isSeeking = false; // 是否正在拖曳 
this.quality = 1080;
this.seekData = {} // startTime 、 endTime
this.wrapTime = 5; // 快進後退秒數
this.isLoading = false;// 是否loading中
this.mediaAnalytics = new MediaAnalytics(this); // 內部引入的影片使用者分析
this.vimeoActions = new VimeoActions(this); // vimeo 相關功能

```

### VimeoActions
```javascript
this.rootState = props; // 從上層的 rootstate 傳進的狀態
```
### MediaAnalytics
```javascript
this.completePlayCount = 0; // 完整播放
this.fullPlay = false; // 從頭開始播放次數
this.pausedCount = 0;  // 暫停次數
this.mediaP = 480;  // 影片畫質
this.pausedTimeCode = []; // 每次暫停時間點紀錄
this.eachPlayPercent = [];  // 單次影片播放%  startTime、endTime、percent
this.forwardCount = 0; // 快進次數 startTime、endTime
this.forwardTimeCode = []; // 快進時間點紀錄
this.backwardCount = 0; // 倒退次數
this.backwardTimeCode = []; // 倒退時間點紀錄
this.account = '';
this.relayCount = 0;// 中繼點次數 有疑慮

```




## class methods 

### initElId()

初始化綁定的 dom id ，type: `string`

### initMedia()

初始化影片播放框，帶入物件，
目前支援 影片Id、sources，title、poster則用於影片清單時使用。，type: `object`

```javascript

initData = {
  id: 76979871,
  title: "The New Vimeo Player (You Know, For Videos)",
  sources: "https://player.vimeo.com/video/76979871?controls=0",
  poster: "https://img.youtube.com/vi/V-xK3sbc7xI/maxresdefault.jpg"
}

```

### setPlayState()

設定影片播放狀態，暫停時候會記錄暫停時間點。


### setVideoSpeed(speed)

僅支援 `0.5~2` 倍速，超過這範圍則無功能，暫時無支援 vimeo VIP的功能

speed可帶入 `string | number`，內有string 轉型別


### setQuality(quality, sources)

須帶入兩個參數`影片畫值`、`影片網址`

quality可帶入 `string | number`，內有string 轉型別
sources 需要帶入影片網址

### changeMedia(mediaOptions)

更換影片時候所用的methods，帶入物件，
目前支援 影片Id、sources，title、poster則用於影片清單時使用。，type: `object`


### setMuteVol()

可以直接靜音影片，如果有聲音，則會靜音聲音歸零，再次可恢復原本聲音大小
例子: 
 第一次觸發
 `vul-66 > vol-0`
 再次觸發
 `vul-0 > vol-66`
 如果影片聲音初始化就是 `vol-0` 則會直接變成 `vol-100`
 
 
### setMediaVol(setVol)

設定聲音大小 ，type: `number`


### setDownCurrentTime(percent)

針對mouseDown類型的ev，mouseDown時，會持續的set影片時間
type: `number`


### setUpCurrentTime() 
針對mouseUp類型的ev,會針對影片的拖曳時間決定執行，setBackwardCount()、setForwardCount()，這兩個methods

### setIsFullScreen()

fullscreen 功能，可全螢幕或是恢復原本影片大小，有針對各瀏覽器做API全螢幕功能

### setReplay()

後退五秒，並記錄影片後退起始時間，如果起始時間與後退時間皆為零，則不執行

  
### setForward()

快進五秒，並記錄影片後退起始時間，如果起始時間與後退時間皆為影片總時長，則不執行


## class getter

### get getdidInvalidate() 

取得影片是否讀取完畢 ，type: `boolean`
 
### get getIsPaused() 

取得現在播放狀態，type: `boolean`

### get getMdiaVol()

取得現在播放狀態，type: `number`

### get getMediaDuration() 

取得影片總時長，單位 sec，type: `number`


### get getMediaCurrentTime() 

取得影片當下播放時間，單位 sec，type: `number`

### get getIsFullScreen()

取得是否全螢幕，type: `boolean`

### get getFormatCurrentTime()

取得格式化的時間-影片當下播放時間，時:分:秒，type: `string`

### get getFormatCurrentTime()

取得格式化的時間-影片總時長，時:分:秒，type: `string`

### get getMediaSpeed()

取得影片播放速度，type: `number`

### get getMediaquality()

取得影片畫質(例如:480、720、1080)，type: `number`


### get getMaPausedCount()

計算影片暫停次數，type: `number`

### get getMaPausedTimeCode()

計算影片暫停的時間點，type: `Array`

### get getMaForwardCount()

計算影片快進5秒次數，type: `number`

### get getMaForwardTimeCode()

計算影片快進5秒的時間點，type: `Array`

### get getMaBackwardCount()

計算影片倒退5秒次數，type: `number`

### get getMaBackwardTimeCode()

計算影片倒退5秒的時間點，type: `Array`

