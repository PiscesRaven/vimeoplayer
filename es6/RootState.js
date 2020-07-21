import MediaAnalytics from "./MediaAnalytics";
import VimeoActions from "./VimeoActions";

export default class RootState {
  constructor() {
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
    this.mediaAnalytics = new MediaAnalytics(this);
    this.vimeoActions = new VimeoActions(this);
  }

  initElId(elId) {
    // init iframe tag
    this.elId = elId;
  }

  initVimeo(id, options) {
    return new Vimeo.Player(id, options);
  }

  regexPath(url) {
    const regex = /^.*(vimeo.com\/|video\/)(\d+).*/;
    return url.match(regex) ? RegExp.$2 : url;
  }

  getQuery(url) {
    // get url query string
    var result = {};
    var qs = url.substring(url.indexOf('?') + 1).split('&');
    for (var i = 0, result = {}; i < qs.length; i++) {
      qs[i] = qs[i].split('=');
      result[qs[i][0]] = decodeURIComponent(qs[i][1]);
    }
    return result;
  }

  async initMedia(mediaOptions) {
    // 初始化 第一次新增影片
    this.didInvalidate = !this.didInvalidate;
    const regexRes = this.regexPath(mediaOptions.sources);
    let options = this.getQuery(mediaOptions.sources);
    options.id = regexRes;
    options.controls = false;
    const domId = document.getElementById(this.elId);
    if (!domId) return;
    this.el = domId;
    this.el.append(this.createDom(this.childDon));
    this.mediaData = this.initVimeo(this.childDon, options);
    this.mediaData.play().then(() => this.mediaData.pause());
    this.eventLoad();
    this.initMediaSpeed(options.speed);
    await this.initMediaVol();
    await this.initMediaTime();
    if (mediaOptions.reloadTime) this.currentTime = await this.vimeoActions.setCurrentTime(mediaOptions.reloadTime);
    this.didInvalidate = !this.didInvalidate;
  }

  async initIframe(mediaOptions, refsDom) {
    // 初始化 iframe
    this.didInvalidate = !this.didInvalidate;
    const regexRes = this.regexPath(mediaOptions.sources);
    let options = this.getQuery(mediaOptions.sources);
    options.id = regexRes;
    options.controls = false;
    const domId = document.getElementById(this.elId);
    this.el = domId;
    if (this.el.childNodes) { this.el.removeChild(this.el.firstChild); }
    refsDom.append(this.createDom(this.childDon));
    this.mediaData = this.initVimeo(this.childDon, options);
    this.mediaData.play().then(() => this.mediaData.pause());
    this.eventLoad();
    this.initMediaSpeed(options.speed);
    await this.initMediaVol();
    await this.initMediaTime();
    this.didInvalidate = !this.didInvalidate;
  }

  initMediaVol() {
    // 初始化聲音
    const locVolume = localStorage.getItem('volume');
    if (!this.mediaData) { return }
    if (this.mediaData && locVolume) {
      this.mediaVol = Number(locVolume);
      this.mediaData.setVolume(Number(locVolume));
      localStorage.setItem('volume', locVolume);
    } else {
      this.mediaVol = 1;
    }
  }

  initMediaSpeed(speed) {
    // 初始化影片速度
    if (!this.mediaData) { return console.log('initMediaSpeed') }
    if (speed) {
      this.setVideoSpeed(speed);
    } else {
      this.mediaData.getPlaybackRate().then((playbackRate) => { this.mediaSpeed = playbackRate; });
    }
  }

  async initMediaTime() {
    if (!this.mediaData) { return console.log('initMediaTime') }
    this.duration = await this.vimeoActions.getDuration();
    this.currentTime = await this.vimeoActions.getCurrentTime();
    this.eventTime();
  }

  eventLoad() {
    // vimeo 事件
    this.mediaData.on('durationchange', (data) => {
      // console.log('durationchange', data)
      this.duration = data.duration;
    });

    this.mediaData.on('loaded', (data) => {
      // console.log('loaded', data)
    });

    this.mediaData.on('ended', () => {
      // console.log('ended')
      this.mediaData.pause();
      this.isPaused = true;
      this.returnToPlayed = false;
      if (this.mediaAnalytics.forwardCount === 0 && this.mediaAnalytics.backwardCount === 0) {
        this.mediaAnalytics.setFullPlay();
        console.log(`ended: ${this.mediaAnalytics}`)
      }
    });

    this.mediaData.on('bufferstart', () => {
      // console.log('bufferstart')
      this.isLoading = true;
    });

    this.mediaData.on('bufferend', () => {
      // console.log('bufferend')
      this.isLoading = false;
      if (this.returnToPlayed) {
        console.log('bufferend', this.returnToPlayed)
        this.isPaused = false;
        this.mediaData.pause().then(() => this.mediaData.play());

        // this.mediaData.play();
      }
    });
  }

  eventTime() {
    this.mediaData.on('timeupdate', (data) => {
      // console.log('timeupdate');
      this.currentTime = data.seconds;
      // this.duration = data.duration;
    });
    this.mediaData.on('seeking', (data) => {
      // console.log('seeking', data);
      this.currentTime = data.seconds;
    });
    this.mediaData.on('seeked', (data) => {
      // console.log('seeked', data);
      this.currentTime = data.seconds;
      // this.setDownCurrentTime(percent);
    });
  }

  setChildDon(childId) {
    this.childDon = childId;
  }

  async setPlayState() {
    // 設定播放狀態
    if (!this.mediaData) { return console.log('setPlayState', this.mediaData); }
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.returnToPlayed = !this.returnToPlayed;
      this.mediaData.pause();
      const { currentTime } = this;
      this.mediaAnalytics.setPausedCount(this.formatVideoTime(currentTime));
    } else {
      this.returnToPlayed = !this.returnToPlayed;
      this.mediaData.play();
    }
  }

  setVideoSpeed(speed) {
    // 設定影片速度
    const parsedSpeed = typeof speed === 'string' ? Number(speed) : speed;
    if (!this.mediaData) { return }
    if (parsedSpeed < 0.5 || parsedSpeed > 2) { return }
    this.mediaData.setPlaybackRate(parsedSpeed).then((playbackRate) => {
      this.mediaSpeed = playbackRate;
    }).catch(function (error) {
      switch (error.name) {
        case 'RangeError':
          // The playback rate is less than 0.5 or greater than 2
          break;

        default:
          // Some other error occurred
          break;
      }
    });
  }

  async setQuality(quality, sources) {
    const parsedQuality = typeof speed === 'string' ? Number(quality) : quality;
    // 切換影片畫質
    if (!this.isPaused) {
      this.mediaData.pause();
      this.isPaused = true;
      this.returnToPlayed = true;
    }
    const { currentTime } = this;
    this.quality = parsedQuality;
    // refsDom.innerHTML = '';
    const mediaOptions = {
      id: this.regexPath(sources),
      sources: sources,
      quality: parsedQuality
    }
    this.initIframe(mediaOptions, this.el);
    this.currentTime = await this.vimeoActions.setCurrentTime(currentTime);
    this.resumePlaying();
  }

  async changeMedia(mediaOptions) {
    // 切換影片來源
    this.mediaData.pause();
    this.isPaused = true;
    console.log(this.mediaAnalytics);
    this.mediaAnalytics.initMediaAnalytics();
    this.initIframe(mediaOptions, this.el);
    this.currentTime = 0;
    if (mediaOptions.reloadTime) { this.currentTime = await this.vimeoActions.setCurrentTime(mediaOptions.reloadTime); }
  }

  createDom(elAttr) {
    let element = document.createElement('div');
    element.id = elAttr;
    element.classList.add(elAttr);
    return element;
  }

  setMuteVol() {
    // 靜音開關
    if (!this.mediaData) { return }
    if (this.mediaVol) {
      this.muteBeforeVol = this.mediaVol;
      this.mediaVol = 0;
      this.mediaData.setVolume(0);
    } else if (!this.mediaVol && this.muteBeforeVol) {
      this.mediaVol = this.muteBeforeVol;
      this.mediaData.setVolume(this.mediaVol);
    } else if (!this.mediaVol && !this.muteBeforeVol) {
      this.mediaVol = 1;
      this.mediaData.setVolume(this.mediaVol);
      this.muteBeforeVol = this.mediaVol;
    }
  }

  setMediaVol(setVol) {
    // 影片聲音拖曳
    if (!this.mediaData) { return }
    const vol = setVol / 100;
    this.mediaData.setVolume(vol).then((volume) => {
      // The volume is set
      this.mediaVol = volume;
    }).catch(function (error) {
      switch (error.name) {
        case 'RangeError':
          // The volume is less than 0 or greater than 1
          break;

        default:
          // Some other error occurred
          break;
      }
    });
    localStorage.setItem('volume', vol.toString());
  }

  async setDownCurrentTime(percent) {
    // 設定影片正確時間 mouse down
    if (!this.mediaData) { return }
    this.didInvalidate = false;
    this.mediaData.pause();
    if (this.isSeeking === false) {
      this.isSeeking = true;
      this.seekData.startTime = this.formatVideoTime(this.currentTime);
    }
    this.isPaused = true;
    let setCurrentTime = (this.duration / 100) * percent;
    percent >= 100 ? setCurrentTime = 0 : setCurrentTime;

    this.currentTime = await this.vimeoActions.setCurrentTime(setCurrentTime);
  }

  async setUpCurrentTime() {
    // 設定影片正確時間 mouse up
    if (!this.mediaData) { return }
    this.mediaData.muted = false;
    this.mediaData.pause();
    this.currentTime = await this.vimeoActions.getCurrentTime();
    if (this.isSeeking === true) {
      this.seekData.endTime = this.formatVideoTime(this.currentTime);
      const { startTime, endTime } = this.seekData;
      if (startTime === endTime) return
      startTime >= endTime ? this.mediaAnalytics.setBackwardCount(this.seekData) : this.mediaAnalytics.setForwardCount(this.seekData)
      this.seekData = {};
      this.isSeeking = false;
    }
    this.didInvalidate = true;
    this.resumePlaying();
  }

  setIsFullScreen() {
    // 設定全螢幕
    if (!this.mediaData) { return }
    const msExitFullscreen = 'msExitFullscreen';
    const mozCancelFullScreen = 'mozCancelFullScreen';
    const oRequestFullscreen = 'oRequestFullscreen';
    const oCancelFullScreen = 'oCancelFullScreen';
    const webkitExitFullscreen = 'webkitExitFullscreen';
    const parentNode = 'parentNode';
    this.isFullScreen = !this.isFullScreen;
    if (this.isFullScreen) {
      if (this.el[parentNode].requestFullscreen) {
        this.el[parentNode].requestFullscreen();
      } else if (this.el[parentNode].mozRequestFullScreen) {
        this.el[parentNode].mozRequestFullScreen();
      } else if (this.el[parentNode].webkitRequestFullScreen) {
        this.el[parentNode].webkitRequestFullScreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document[msExitFullscreen]) {
        document[msExitFullscreen]();
      } else if (document[mozCancelFullScreen]) {
        document[mozCancelFullScreen]();
      } else if (document[oRequestFullscreen]) {
        document[oCancelFullScreen]();
      } else if (document[webkitExitFullscreen]) {
        document[webkitExitFullscreen]();
      }
    }
  }

  resumePlaying() {
    if (this.returnToPlayed) {
      this.isPaused = false;
      this.mediaData.play();
    }
  }

  formatVideoTime(sec) {
    // 時間轉換
    var time = Math.round(sec)
    const s = Math.floor(time % 3600 % 60);
    const second = s < 10 ? ('0' + s).toString() : s.toString();
    const m = Math.floor(time % 3600 / 60);
    if (m <= 0) { return (0 + ':' + second) }
    const h = Math.floor(time / 3600);
    if (h <= 0) { return (m + ':' + second); }
    return h + ':' + m + ':' + second;
  }

  async setReplay() {
    // 設定重播回放
    if (this.currentTime === 0) { return console.log('後對5秒，但是已經是0秒') }
    this.mediaData.pause();
    const setCurrentTime = (this.currentTime) - this.wrapTime <= 0 ? 0 : (this.currentTime) - this.wrapTime;
    const timeCode = {
      startTime: this.formatVideoTime(this.currentTime),
      endTime: this.formatVideoTime(setCurrentTime)
    };
    this.mediaAnalytics.setBackwardCount(timeCode);
    this.currentTime = await this.vimeoActions.setCurrentTime(setCurrentTime);
    if (!this.returnToPlayed) { return }
    this.mediaData.play();
  }

  async setForward() {
    // 設定快進
    if (this.currentTime === this.duration) { return console.log('快進5秒，但是已經播放完畢') }
    this.mediaData.pause();
    const setCurrentTime = (this.currentTime) + this.wrapTime >= this.duration ? this.duration : (this.currentTime) + this.wrapTime;
    const timeCode = {
      startTime: this.formatVideoTime(this.currentTime),
      endTime: this.formatVideoTime(setCurrentTime)
    };

    this.mediaAnalytics.setForwardCount(timeCode);
    if ((this.currentTime) + this.wrapTime >= this.duration) {
      this.mediaData.pause();
      this.currentTime = await this.vimeoActions.setCurrentTime(setCurrentTime);
    } else {
      this.currentTime = await this.vimeoActions.setCurrentTime(setCurrentTime);
      if (!this.returnToPlayed) { return }
      this.mediaData.play();
    }
  }

  get getdidInvalidate() {
    // 取得資料讀取完畢
    return this.didInvalidate;
  }

  get getIsPaused() {
    // 取得影片播放狀態
    if (!this.mediaData) { return }
    return this.isPaused;
  }

  get getMdiaVol() {
    // 取得聲音大小
    return this.mediaVol * 100;
  }

  get getMediaDuration() {
    // 影片總時長，單位 sec
    if (!this.mediaData) { return }
    return this.duration;
  }

  get getMediaCurrentTime() {
    // 影片當下播放時間，單位 sec
    if (!this.mediaData) { return }
    return this.currentTime;
  }

  get getIsFullScreen() {
    // 取得是否全螢幕
    return this.isFullScreen;
  }
  get getFormatCurrentTime() {
    // 取得格式化的時間-播放時間
    if (!this.mediaData) { return }
    return this.formatVideoTime(this.currentTime);
  }

  get getFormatDuration() {
    // 取得格式化的時間-總時長
    if (!this.mediaData) { return }
    return this.formatVideoTime(this.duration);
  }

  get getMediaSpeed() {
    // 取得影片播放速度
    if (!this.mediaData) { return }
    return this.mediaSpeed;
  }

  get getMediaquality() {
    // 取得影片畫值
    return this.quality;
  }

  get getMaPausedCount() {
    return this.mediaAnalytics.pausedCount;
  }

  get getMaPausedTimeCode() {
    return this.mediaAnalytics.pausedTimeCode;
  }

  get getMaForwardCount() {
    return this.mediaAnalytics.forwardCount;
  }

  get getMaForwardTimeCode() {
    return this.mediaAnalytics.forwardTimeCode;
  }

  get getMaBackwardCount() {
    return this.mediaAnalytics.backwardCount;
  }

  get getMaBackwardTimeCode() {
    return this.mediaAnalytics.backwardTimeCode;
  }
}