export default class MediaAnalytics {
  constructor() {
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
  }

  initMediaAnalytics() {
    // 重置
    this.completePlayCount = 0;
    this.pausedCount = 0;
    this.fullPlay = false;
    this.mediaP = 480;
    this.pausedTimeCode = [];
    this.eachPlayPercent = [];
    this.forwardCount = 0;
    this.forwardTimeCode = [];
    this.backwardCount = 0;
    this.backwardTimeCode = [];
    this.account = '';
    this.relayCount = 0;
  }

  setPausedCount(pausedTimeCode) {
    // 暫停次數
    this.pausedCount = this.pausedCount + 1;
    this.setPausedTimeCode(pausedTimeCode);
  }
  setPausedTimeCode(pausedTimeCode) {
    this.pausedTimeCode.push({ timeCode: pausedTimeCode });
  }

  setForwardCount(forwardimeCode) {
    // 設定快進count
    this.forwardCount = this.forwardCount + 1;
    this.forwardTimeCode.push(forwardimeCode);
    console.log('forwardTimeCode', this.forwardTimeCode);
  }
  setBackwardCount(backwardCount) {
    // 設定後退count
    this.backwardCount = this.backwardCount + 1;
    this.backwardTimeCode.push(backwardCount);
    console.log('backwardTimeCode', this.backwardTimeCode);
  }

  setFullPlay() {
    this.fullPlay = true;
  }

  setEachPlayPercent(percent) {
    this.eachPlayPercent.push(percent);
    console.log('eachPlayPercent', this.eachPlayPercent);
  }
}
