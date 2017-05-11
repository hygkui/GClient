# 仿腾讯手机管家真假朋友第二季

> 一个使用Vue和wilddog仿的腾讯手机管家真假朋友第二季H5页面。

![image](https://github.com/HumiH/lie/raw/master/src/assets/results/edit.gif)
 
 
![image](https://github.com/HumiH/lie/raw/master/src/assets/results/answer.gif)

## 体验

### 刚刚野狗那边发短信告诉我今天的设备数已经超过限制了，因为是免费的。。。学生党伤不起。可能会出现新设备无法访问的情况，本人目前也不方便改，喜欢的朋友可以克隆项目改自己的野狗链接来测试

可点开答题链接[https://humih.github.io/lie/#/result/%E8%80%81%E6%9C%9D/1490287575000](https://humih.github.io/lie/#/result/%E8%80%81%E6%9C%9D/1490287575000) 查看，出题链接是[https://humih.github.io/lie/#/edit](https://humih.github.io/lie/#/edit)，也可用手机扫码：

![image](https://github.com/HumiH/lie/raw/master/src/assets/results/qrcode.png)

## 关于该项目

前几天朋友圈很多人分享腾讯手机管家的这个活动，女朋友看到后也出题发了一份给我，我理所当然地得了100分。不过我在出题给她做时没注意到上方几个小字“只选择你的真心话”，误选了相反的答案...结果可想而知，她做完发现只有0分。然后自己赶紧重新出题发给她，却发现同一用户只能回答一次。女朋友不开心肯定要哄啊，那怎么办？腾讯的这页面同一用户不能重复回答怎么办？那就自己写一个出来呗。

说做就做，立刻用电脑打开了那个[链接](http://sdi.3g.qq.com/v/2017022316563001128?uid=oKowes5CNbfbeTZtMfenb6XC4q7g&sdi_sc=57&sdi_from=1&from=timeline&isappinstalled=0)，开发者工具查看页面资源，然后发现需要的图片素材大部分都有了，保存下来再自己根据它的页面来写就行了。然而分享给好友首先需要保存数据到服务器，然后就想到了有免费资源的[wilddog](https://www.wilddog.com)的实时通信引擎，刚好有个[wildvue](https://github.com/WildDogTeam/lib-js-wild-vue)插件支持vue2，再加上vue-router就够了。最后做出来总共有3个页面，编辑、回答和结果页，其实有些地方写得比较乱，尤其是回答页面...逻辑不是很清晰。

## 运行

先克隆或下载项目，进入项目根目录，运行以下命令：

``` bash
# 安装依赖
npm install

# 运行
npm run dev
```

然后浏览器打开localhost:8888，开发者工具中打开手机模式即可看到效果
