export default class VimeoActions {
  constructor(props) {
    this.rootState = props;
  }
  getCurrentTime() {
    // vimeo 取得正確時間
    return this.rootState.mediaData.getCurrentTime().then(res => { return res; });
  }
  getDuration() {
    // vimeo 取得總影片時間
    return this.rootState.mediaData.getDuration().then(res => { return res; });
  }
  setCurrentTime(setCurrentTime) {
    // vimeo 設定影片時間
    return this.rootState.mediaData.setCurrentTime(setCurrentTime).then(res => { return res; });
  }
}