<template>
  <div class="page">
    <img v-if="true" src="../assets/send_group.gif" class="full-width-img">
    <div v-else class="wait-img">
      <img class="full-width-img" src="../assets/wait_for.png">
      <div class="avatar">
        <img class="full-width-img" src="../assets/logo.png">
      </div>
      <div class="text">
        <span class="name">何朝润</span>
      </div>
      <div class="de"></div>
      <!--<img class="de" src="../assets/wait_for.png">-->
    </div>
    <div class="result-bg"></div>
    <div class="result">
      <h1 v-if="false">暂无已质检朋友,快去发给朋友吧</h1>
      <p>已质检的朋友列表</p>
      <div v-for="s in [1,1,1,1,1]" class="friend">
        <img src="../assets/logo.png" class="avatar">
        <div class="txt">
          <h1>何朝润</h1>
          <p>我们之间隔了一堵墙</p>
        </div>
        <div class="score">100%</div>
        <div class="clearfix"></div>
      </div>
    </div>
  </div>
</template>

<style>
.wait-img {
  width: 100%;
  position: relative;
}
.wait-img .avatar {
  position: absolute;
  top: 1.8rem;
  left: 1.8rem;
  width: 1.7rem;
  height: 1.7rem;
  /*background: #f00;*/
}
.wait-img .text {
  position: absolute;
  color: #3B0085;
  font-size: .5rem;
  background: #F6DF00;
  /*padding: .1rem;*/
  border: .1rem solid #3B0085;
  border-radius: .2rem;
  text-align: center;
  /*font-weight: bold;*/
  top: 1.7rem;
  left: 3.8rem;
  /*width: 1.8rem;*/
}
.wait-img .de {
  position: absolute;
  top: 1.3rem;
  left: 5.55rem;
  width: 1.5rem;
  height: 1.5rem;
  background: url(../assets/wait_for.png) left bottom no-repeat;
  background-size: 10rem;
  z-index: 10;
}
.result-bg {
  position: absolute;
  width: 100%;
  height: 3rem;
  top: 9rem;
  left: 0;
  background: rgb(88, 95, 184);
  /*background: #f00;*/
}
.result {
  position: absolute;
  width: 8rem;
  max-height: 30%;
  overflow-y: scroll;
  top: 10rem;
  left: 1rem;
  padding: .2rem 0;
  background: #6B0085;
  border-radius: .2rem;
  margin: 0 auto;
}
.result h1 {
  font-size: .5rem;
  text-align: center;
  color: #fff;
}
.result p {
  font-size: .3rem;
  text-align: center;
  color: #fff;
}
.result .friend {
  width: 100%;
  float: left;
  background: #3B0085;
  height: 1rem;
  margin-bottom: .08rem;
  /*z-index: 20;*/
}
.friend .avatar {
  padding: .1rem;
  height: .8rem;
  /*background: #f00;*/
  display: block;
  float: left;
}
.friend .txt {
  float: left;
  margin-left: .2rem;
}
.txt h1 {
  font-weight: normal;
  font-size: .4rem;
  text-align: left;
}
.txt p {
  font-size: .3rem;
  margin-top: .1rem;
  color: #FF7400;
}
.friend .score {
  font-size: .6rem;
  float: right;
  height: 1rem;
  line-height: 1rem;
  padding-right: .2rem;
  color: #FF7400;
}
</style>
