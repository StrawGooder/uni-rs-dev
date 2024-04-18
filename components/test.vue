<template>
  <view class="index">
<!--    <uni-nav-bar title="u-transition" :is-back="false"></uni-nav-bar>
    <image
      class="mainImg"
      src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic1.win4000.com%2Fmobile%2F2020-05-20%2F5ec49c878b478.jpg&refer=http%3A%2F%2Fpic1.win4000.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1640914481&t=c2bfcdd374daedb8c9259716a57c30d7"
      mode="widthFix"
    /> -->
	<!-- 在最外层用u-transition组件包起来，具体可看官方文档："https://uniapp.dcloud.io/component/uniui/uni-transition?id=基本用法"; -->
    <uni-transition custom-class="menu_warp" :show="show" ref="menuWarp">
      <view class="warp">
        <view
          class="bar"
          @touchmove.stop="touchMove"
          @touchend.stop="touchEnd"
          @touchstart.stop="touchStart"
        ></view>
        <input
          type="text"
          placeholder="我是一个输入框"
          @focus="focus"
          @blur="blur"
        />
        <view class="text">ドラえもん</view>
      </view>
    </uni-transition>
  </view>
</template>

<script>
export default {
  data() {
    return {
      show: true,
      windowHeight: 0,
      start: 0,
      end: 0,
    };
  },
  onLoad() {
    this.windowHeight = uni.getSystemInfoSync().windowHeight;
  },
  methods: {
    //开始触摸
    touchStart(e) {
      //记录手指触摸到屏幕的那一个的位置，计算小黑条的top值
      this.start = (e.changedTouches[0].pageY / this.windowHeight).toFixed(2);
    },
    //触摸开始并且移动
    touchMove(e) {
      this.$u.throttle(
        () => {
          //step 和 run 方法 查看uniapp官方文档："https://uniapp.dcloud.io/component/uniui/uni-transition?id=基本用法";其实文档上写需要先初始化init，但是不init也可以使用，不知道为什么
          let top =
            (e.changedTouches[0].pageY / this.windowHeight).toFixed(2) * 100 +
            "vh";
          //top：e.changedTouches[0].pageY：手指移动的实时位置，计算后转换为滑动层的top值，单位vh；
          // console.log(top);

          if (parseInt(top) >= 80) {
            top = "80vh";
          } else if (parseInt(top) <= 60) {
            top = "60vh";
          } else {
            top = top;
          }
          this.$refs.menuWarp.step({ top: top }, { duration: 180 });
          this.$refs.menuWarp.run(() => {});
        },
        60,
        true
        //节流函数：60ms内，只触发一次，感知不大，这里用的是uview封装好的节流函数，官方文档：https://v1.uviewui.com/js/debounce.html
      );
    },
    //手指离开手机
    touchEnd(e) {
      const start = this.start * 100;
      const end =
        (e.changedTouches[0].pageY / this.windowHeight).toFixed(2) * 100;
      // console.log("start", start);
      // console.log("end", end);
      if (start > end) {
        // console.log("up");
        this.$refs.menuWarp.step({ top: "60vh" }, { duration: 180 });
        this.$refs.menuWarp.run(() => {});
      } else if (start < end) {
        // console.log("down");
        this.$refs.menuWarp.step({ top: "80vh" }, { duration: 180 });
        this.$refs.menuWarp.run(() => {});
      }
    },
    //输入框获焦
    focus() {
      this.$refs.menuWarp.step({ top: "60vh" }, { duration: 180 });
      this.$refs.menuWarp.run(() => {});
    },
    //输入框失焦
    blur() {
      this.$refs.menuWarp.step({ top: "80vh" }, { duration: 180 });
      this.$refs.menuWarp.run(() => {});
    },
  },
};
</script>

<style lang="scss">
.mainImg {
  width: 100%;
}
//要给u-transition设置fixed定位
.menu_warp {
  width: 100vw;
  position: fixed;
  top: 80vh;
  left: 0;
  .warp {
    background: lightblue;
    border-radius: 40rpx 40rpx 0 0;
    padding-bottom: 300rpx;
    .bar {
      position: relative;
      width: 100%;
      height: 40rpx;
      &::after {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 200rpx;
        height: 10rpx;
        border-radius: 10rpx;
        background: #111111;
      }
    }

    input {
      width: 90vw;
      height: 82rpx;
      border-radius: 20rpx;
      background: #ffffff;
      color: #111111;
      margin: 24rpx auto;
      padding-left: 12rpx;
    }
    .text {
      font: 100rpx "Ravie";
      margin-top: 160rpx;
      text-align: center;
      color: #ffffff;
    }
  }
}
</style>
