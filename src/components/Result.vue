<template>
  <div class="result-page">
    <!--出题后提醒分享的界面-->
    <img v-if="fromEdit && name === username && !orderDesc(results).length" src="../assets/send_group.gif" class="full-width-img">
    <!--朋友做完题后看到的界面-->
    <div v-else-if="fromAnswer && name !== username">
      <div class="answer-again" @click="answerAgain">重新回答</div>
      <div class="done-img">
        <p class="names"><span class="name">{{username}}</span>和<span class="name">{{name}}</span></p>
        <p class="score">{{answererResult.score}}</p>
      </div>
      <img @click="play" src="../assets/play_too.png" class="play"></img>
    </div>
    <!--再次进入看到的界面-->
    <div v-else class="wait-img">
      <div v-if="name !== username" class="answer-again" @click="answerAgain">重新回答</div>
      <div class="avatar">
        <img v-if="name.indexOf('朝润') > -1" class="full-width-img" src="../assets/other.jpg">
        <img v-else-if="questionId.indexOf('靖娴') > -1 || questionId.indexOf('小宝宝') > -1" class="full-width-img" src="../assets/me.jpg">
        <img v-else class="full-width-img" src="../assets/logo.png">
      </div>
      <div class="text">
        <span class="name">{{name}}</span>
      </div>
      <div v-if="name === username" id="reset-question" @click="reEdit">重新出题</div>
      <div v-else id="reset-question" @click="play">我也要玩</div>
      <div class="de"></div>
    </div>
    <!--暂无已质检朋友-->
    <h1 class="no-friend" v-if="!results">暂无已质检朋友,快去发给朋友吧</h1>
    <!--已质检的朋友列表-->
    <div v-else>
      <div class="result">
        <p>已质检的朋友列表</p>
        <div v-for="result in orderDesc(results)" class="friend">
          <img v-if="result.answerer.indexOf('靖娴') > -1 || result.answerer.indexOf('小宝宝') > -1" src="../assets/me.jpg" class="avatar">
          <img v-else-if="result.answerer.indexOf('朝润') > -1" src="../assets/other.jpg" class="avatar">
          <img v-else src="../assets/logo.png" class="avatar">
          <div class="txt">
            <h1>{{result.answerer}}</h1>
            <p>{{resultText[Math.floor(result.score / 20) * 20]}}</p>
          </div>
          <div class="score">{{result.score}}%</div>
        </div>
        <div class="clearfix"></div>
      </div>
      <div class="result-bottom"></div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      name: '',
      time: null,
      fromEdit: this.$root.fromEdit,
      fromAnswer: this.$root.fromAnswer,
      resultText: { 0: '请问，你贵姓？', 20: '交了个假朋友', 40: '我们之间隔了一道墙', 60: '多发两个红包加强沟通吧', 80: '好基友一辈纸', 100: '高山流水遇知音' },
      username: null,
      questionId: null,
      allAnswerIds: []
    }
  },
  created () {
    window.scroll(0, 0)

    const name = this.$route.params.name
    const time = this.$route.params.time
    this.questionId = name + time
    this.name = name
    this.time = time
    this.username = localStorage.getItem('username')
    document.title = `你看得出${name}在说谎吗?`

    let allAnswerIds = localStorage.getItem('allAnswerIds')
    this.allAnswerIds = allAnswerIds = JSON.parse(allAnswerIds)
    if (!allAnswerIds) allAnswerIds = []
    const hasAnswered = allAnswerIds.indexOf(this.questionId) > -1
    if (!hasAnswered && name !== this.username) {
      this.$router.replace({name: 'answer', params: {name: name, time: time}})
    }
  },
  methods: {
    // 我也要玩
    play () {
      localStorage.removeItem('lie')
      this.$router.replace({name: 'edit'})
    },
    // 将好友倒叙排列
    orderDesc (obj) {
      let res = []
      for (var i in obj) {
        res.push(obj[i])
      }
      return res.reverse()
    },
    // 重新出题
    reEdit () {
      localStorage.removeItem('lie')
      this.$router.push({name: 'edit'})
    },
    // 重新回答
    answerAgain () {
      console.log('answer again')
      let isConfirm = confirm('确认重新答题？')
      console.log(isConfirm)
      if (isConfirm) {
        this.allAnswerIds.splice(this.allAnswerIds.indexOf(this.questionId), 1)
        localStorage.setItem('allAnswerIds', JSON.stringify(this.allAnswerIds))
        this.$router.replace({name: 'answer', params: {name: this.name, time: this.time}})
      }
    }
  },
  computed: {
    // 结果列表
    results () {
      let question = this.$root.userInfo[this.questionId]
      return question ? question.results : ''
    },
    // 单个朋友的结果
    answererResult () {
      let question = this.$root.userInfo[this.questionId]
      if (question) {
        for (var key in question.results) {
          const result = question.results[key]
          if (result.answerer === this.username) {
            return result
          }
        }
      }
      return {score: 0}
    }
  }
}
</script>

<style scoped>
.result-page {
  width: 100%;
  min-height: 100%;
  background: rgb(88, 95, 184);
}
.wait-img {
  width: 100%;
  background: url(../assets/wait_for.png);
  background-size: 10rem;
  height: 9rem;
  position: relative;
  z-index: 20;
}
.wait-img .avatar {
  position: absolute;
  top: 1.8rem;
  left: 1.8rem;
  width: 1.7rem;
  height: 1.7rem;
}
.wait-img .text {
  position: absolute;
  color: #3B0085;
  font-size: .5rem;
  background: #F6DF00;
  padding: 0 .1rem;
  border: .1rem solid #3B0085;
  border-radius: .2rem;
  text-align: center;
  top: 1.7rem;
  left: 3.8rem;
}
.answer-again {
  position: absolute;
  color: rgba(0, 0, 0, 0);
  top: .5rem;
  left: .6rem;
  font-size: .2rem;
}
#reset-question {
  position: absolute;
  top: .2rem;
  right: .5rem;
  font-size: .3rem;
  color: #fff;
  padding: .1rem .2rem;
  border-radius: .3rem;
  background: #FF7400;
  border: .05rem solid #3B0085;
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
}
.result {
  width: 9rem;
  padding: .2rem 0;
  background: #9928b5;
  border-radius: .2rem;
  margin: 1rem auto 0 auto;
}
.no-friend {
  font-size: .5rem;
  text-align: center;
  color: #fff;
  position: absolute;
  width: 9rem;
  top: 10rem;
  left: .5rem;
  padding: .2rem 0;
  background: #9928b5;
  border-radius: .2rem;
}
.result p {
  font-size: .3rem;
  text-align: center;
  color: #fff;
}
.result .friend {
  width: 100%;
  float: left;
  background: #711dda;
  height: 1.5rem;
  margin-bottom: .08rem;
}
.friend .avatar {
  padding: .1rem;
  height: 1.3rem;
  display: block;
  float: left;
}
.friend .txt {
  float: left;
  margin-left: .2rem;
}
.txt h1 {
  color: #fff;
  font-weight: normal;
  font-size: .6rem;
  line-height: 1rem;
  height: 1rem;
  text-align: left;
}
.txt p {
  font-size: .3rem;
  line-height: .5rem;
  height: .4rem;
  color: #FF7400;
}
.friend .score {
  font-size: .8rem;
  float: right;
  height: 1.5rem;
  line-height: 1.5rem;
  padding-right: .2rem;
  color: #FF7400;
  display: block;
  background: url(../assets/wait_for.png) right bottom no-repeat;
  background-size: 10rem;
  width: 3rem;
  text-align: right;
}
.result-bottom {
  width: 100%;
  height: .5rem;
}
.done-img {
  width: 100%;
  height: 7.2rem;
  background: url(../assets/result.png);
  background-size: 10rem;
}
.done-img .names {
  line-height: 3.5rem;
  height: 2.1rem;
  font-size: .4rem;
  text-align: center;
  color: #FEBB0F;
}
.done-img .name {
  color: #FF7400;
  padding: .1rem;
}
.done-img .score {
  text-align: center;
  font-size: .7rem;
  color: #FF7400;
}
.play {
  width: 40%;
  display: block;
  margin: .5rem auto 0 auto;
}
</style>
