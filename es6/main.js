
import RootState from './RootState.js';

const rootState = new RootState();

Vue.component('loading', {
  template: `
  <div class="r_loading" :style="{ display: getisLoading ? 'block' : 'none'}">
    <div class="r_loading_icon"></div>
  </div>
  `,
  computed: {
    getisLoading: function () {
      return rootState.isLoading;
    }
  }
});

Vue.component('video-time-bar', {
  template: `
  <div class="r_video_time_bar">
    <div id="r_vTime_ctn" class="r_vTime_ctn">
      <div id="r_vPlay_progress" class="r_vPlay_progress" :style="{'width':  progressPercent +'%'}"></div>
      <!-- end r_vPlay_progress -->
      <div id="r_vTime_dot" class="r_vTime_dot" :style="{'left':  progressPercent +'%'}">
      </div>
      <!-- end r_vTime_dot -->
      <input type="range" min="0" max="100" step="0.01" v-model="timePercent" @input="setMediaCurrentTime()"
        @mouseup="reversionPlayState()" style="padding: 0px 0px 0px 0px;">
    </div><!-- end r_vTime_ctn -->
  </div><!-- end vr_video_time_bar -->
  `,
  data() {
    return {
      isSeek: false,
      timePercent: 0,
    };
  },
  methods: {
    setMediaCurrentTime: function () {
      // 設定影片正確播放時間- mouse down
      const vm = this;
      vm.isSeek = true;
      rootState.setDownCurrentTime(vm.timePercent);
    },
    reversionPlayState: function () {
      // 設定影片正確播放時間- mouse up
      const vm = this;
      vm.timePercent = (this.getMediaCurrentTime / this.getMediaDuration) * 100;
      rootState.setUpCurrentTime();
      vm.isSeek = false;
    },
  },
  computed: {
    getMediaDuration: function () {
      return rootState.getMediaDuration;
    },
    getMediaCurrentTime: function () {
      return rootState.getMediaCurrentTime;
    },
    getdidInvalidate: function () {
      // 確認是否讀取完成
      return rootState.getdidInvalidate;
    },
    progressPercent: function () {
      // 影片進度表
      const vm = this;
      return vm.isSeek && !vm.getdidInvalidate ? vm.timePercent : (this.getMediaCurrentTime / this.getMediaDuration) * 100;
    },
  }
});

Vue.component('play-btn', {
  template: `
  <div id="r_vButton" class="r_vButton" @click="plsyState()" :class="getIsPaused ? '' : 'pause'"></div>
  `,
  methods: {
    plsyState: function () {
      // 播放狀態
      rootState.setPlayState();
    },
  },
  computed: {
    getIsPaused: function () {
      // 取得 class 影片播放狀態
      return rootState.getIsPaused;
    },
  }
});

Vue.component('volume-control', {
  template: `
  <div id="r_vSound" class="r_vSound">
    <div class="r_sound_icon" @click="muteVol()" :class="volumeClass"></div>
    <!-- end r_sound_icon -->
    <div class="r_range_block">
      <div class="r_range_content">
        <div class="slider_dot" :style="{'bottom': getMdiaVol + '%'}"></div>
        <!-- end slider_dot -->
        <div class="slider_line"
          :style="{'top': ( 100 - getMdiaVol ) + '%' , 'height': getMdiaVol + '%'}">
        </div><!-- end slider_line -->
        <input type="range" min="0" max="100" step="1" v-model="volPercent" @input="setMediaVol()"
          style="padding: 0px 0px 0px 0px;">
        <!-- end input range -->
      </div><!-- end r_range_content -->
    </div><!-- end r_range_block -->
  </div><!-- end r_vSound -->
  `,
  data() {
    return {
      volPercent: 100,
    };
  },
  methods: {
    muteVol: function () {
      // 靜音
      rootState.setMuteVol();
    },
    setMediaVol: function () {
      // 設定聲音大小
      const vm = this;
      rootState.setMediaVol(vm.volPercent);
    },
  },
  computed: {
    getMdiaVol: function () {
      // 聲音百分比
      return rootState.getMdiaVol;
    },
    volumeClass: function () {
      // 喇叭css
      const vm = this;
      const className = [];
      if (vm.getMdiaVol === 0) {
        className.push("mute");
      } else if (vm.getMdiaVol < 33) {
        className.push("vol33");
      } else if (vm.getMdiaVol < 66) {
        className.push("vol66");
      }
      return className;
    },
  }
});

Vue.component('video-skip-second', {
  template: `
  <div class="r_vSecond">
    <div class="replay_5" @click="replaySec"></div>
    <div class="forward_5" @click="forwardSec"></div>
  </div><!-- end r_vSecond -->
  `,
  data() {
    return {};
  },
  methods: {
    replaySec: function () {
      // 倒退影片
      rootState.setReplay();
    },
    forwardSec: function () {
      // 快進影片
      rootState.setForward();
    },
  },
  computed: {
    getMdiaVol: function () {
      // 聲音百分比
      return rootState.getMdiaVol;
    },
    volumeClass: function () {
      // 喇叭css
      const vm = this;
      const className = [];
      if (vm.getMdiaVol === 0) {
        className.push("mute");
      } else if (vm.getMdiaVol < 33) {
        className.push("vol33");
      } else if (vm.getMdiaVol < 66) {
        className.push("vol66");
      }
      return className;
    },
  }
});

Vue.component('video-play-time', {
  template: `
  <div class="play_time">
    <span v-cloak>
      {{getFormatCurrentTime}}
    </span>
    /
    <span v-cloak>
      {{getFormatDuration}}
    </span>
  </div> <!-- end play_time -->
  `,
  data() {
    return {};
  },
  computed: {
    getFormatCurrentTime: function () {
      // 取得影片播放時間
      return rootState.getFormatCurrentTime;
    },
    getFormatDuration: function () {
      // 取得影片總時長
      return rootState.getFormatDuration;
    },
  }
});

Vue.component('video-quality', {
  template: `
  <div id="r_vQuality" class="r_vQuality">
    <div class="r_quality_icon"></div><!-- end r_quality_icon -->
    <div class="r_range_block">
      <div class="r_range_content">
        <div class="range" :class="getMediaquality === item ? 'active': ''"
          @click="videiqualitySet(item)" v-for="item in quality.slice().reverse()" :key="item">{{item}}
        </div>
      </div><!-- end r_range_content -->
    </div><!-- end r_range_block -->
    </div><!-- end r_vQuality -->
  `,
  data() {
    return {
      quality: [540, 720, 1080],
    };
  },
  methods: {
    videiqualitySet: function (quality) {
      // 更換影片畫質
      rootState.mediaData.getVideoUrl().then((url) => {
        const sources = url;
        rootState.setQuality(quality, sources);
      })
    },
  },
  computed: {
    getMediaquality: function () {
      // 取得影片畫值
      return rootState.getMediaquality;
    },
  }
});

Vue.component('video-speed', {
  template: `
  <div id="r_vSpeed" class="r_vSpeed">
    <div class="r_speed_icon"></div><!-- end r_speed_icon -->
    <div class="r_range_block">
      <div class="r_range_content">
        <div class="range" :class="getMediaSpeed === item ? 'active': ''" @click="videiSpeedSet(item)"
          v-for="item in videoSpeed.slice().reverse()" :key="item">{{item}}
        </div>
      </div><!-- end r_range_content -->
    </div><!-- end r_range_block -->
  </div><!-- end r_vSpeed -->
  `,
  data() {
    return {
      videoSpeed: [0.5, 0.75, 1, 1.25, 1.5, 2],
    };
  },
  methods: {
    videiSpeedSet: function (speed) {
      // 設定影片速度
      rootState.setVideoSpeed(speed);
    },
  },
  computed: {
    getMediaSpeed: function () {
      // 取得影片速度
      return rootState.getMediaSpeed;
    },
  }
});

Vue.component('video-screen', {
  template: `
  <div 
    id="r_vScreen" 
    class="r_vScreen" 
    @click.prevent="fullScreen()"
    :class="getIsFullScreen ? 'toExit' : 'toFull'"
    >
  </div><!-- end right_ctrols -->
  `,
  data() {
    return {};
  },
  methods: {
    fullScreen: function () {
      // 全螢幕
      rootState.setIsFullScreen();
    },
  },
  computed: {
    getIsFullScreen: function () {
      // 取得是否全螢幕
      return rootState.getIsFullScreen;
    },
  }
});




var app = new Vue({
  el: '#r_video_app',
  data: {
    hideDom: false,
    player: null,
    timePercent: 0,
    isSeek: false,
    mediaList: [
      {
        id: 76979871,
        title: "The New Vimeo Player (You Know, For Videos)",
        sources: "https://player.vimeo.com/video/76979871?controls=0",
        poster: "https://i.vimeocdn.com/portrait/9934446_300x300"
      },
      {
        id: 414925381,
        title: "Waze & Odyssey, George Michael, Mary J. Blige & Tommy Theo - Always (Director's Cut)",
        sources: "https://player.vimeo.com/video/414925381?speed=1&controls=0&quality=1080p",
        poster: "https://i.vimeocdn.com/video/892335179_1280x720.jpg"
      }, {
        id: 191777290,
        title: "The Taj Hotels & Palaces - Explore Series -Vizag",
        sources: "https://player.vimeo.com/video/191777290?title=0&byline=0&portrait=0&controls=0",
        poster: "https://i.vimeocdn.com/video/602927725_640.jpg",
        reloadTime: 42
      }
    ]
  },
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
    plsyState: function () {
      // 播放狀態
      rootState.setPlayState();
    },
    changeMedia: function (mediaData) {
      // 換影片
      rootState.changeMedia(mediaData);
    },
  },
  computed: {
    getIsPaused: function () {
      // 取得 class 影片播放狀態
      return rootState.getIsPaused;
    },
    getIsFullScreen: function () {
      // 取得是否全螢幕
      return rootState.getIsFullScreen;
    },
    getdidInvalidate: function () {
      // 確認是否讀取完成
      return rootState.getdidInvalidate;
    },
    getMediaDuration: function () {
      return rootState.getMediaDuration;
    },
    getMediaCurrentTime: function () {
      return rootState.getMediaCurrentTime;
    },
    getMaPausedCount: function () {
      return rootState.getMaPausedCount;
    },
    getMaPausedTimeCode: function () {
      return rootState.getMaPausedTimeCode;
    },
    getMaForwardCount: function () {
      return rootState.getMaForwardCount;
    },
    getMaForwardTimeCode: function () {
      return rootState.getMaForwardTimeCode;
    },
    getMaBackwardCount: function () {
      return rootState.getMaBackwardCount;
    },
    getMaBackwardTimeCode: function () {
      return rootState.getMaBackwardTimeCode;
    },
    getisLoading: function () {
      return rootState.isLoading;
    }
  },
});


