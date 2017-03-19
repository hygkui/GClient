<template>
  <div class="page">
    <!--首页-->
    <div v-if="page===1" class="page1">
      <img class="full-width-img" src="../assets/index.png">
      <div class="face-container">
        <img class="face" src="../assets/index_face.gif">
      </div>
      <div class="bottom">
        <h1>让朋友更了解你的态度</h1>
        <img class="btn" @click="page=2" src="../assets/set_title_btn.png">
      </div>
    </div>
    <!--选择题目和答案页-->
    <div v-if="page===2" class="page2">
      <div class="top-bar">
        <img v-if="questions.length >= questionLength - 1 && select != -1" src="../assets/wait_top.png">
        <img v-else src="../assets/edit_top.png">
      </div>
      <div class="full-width-img title_bg"></div>
      <img class="full-width-img title_bg" src="../assets/title_bg.png">
      <div class="container">
        <div style="text-align: center;">
          <span style="color:#b46e53;">只选择你的真心话</span>
        </div>
        <div class="head">
          <div class="title">&nbsp;{{ question.qData[0].txt }}</div>
          <div class="change" @click="changeQuestion">换一张</div>
          <div class="clearfix"></div>
        </div>
        <div class="answer" v-bind:class="[select==0 ? 'check' : 'not-check']" @click="select=0">{{ question.as[0] }}</div>
        <div class="answer" v-bind:class="[select==1 ? 'check' : 'not-check']" @click="select=1">{{ question.as[1] }}</div>
        <div class="btn-container" v-if="questions.length < questionLength - 1">
          <img v-if="select === -1" class="next-btn" @click="page=2" src="../assets/next_disabled.png">
          <transition name="real-next">
            <img v-if="select !== -1" class="next-btn" @click="nextQuestion" src="../assets/next.png">
          </transition>
        </div>
        <div class="btn-container" v-else>
          <img v-if="select == -1" class="next-btn" @click="done" src="../assets/done_disabled.png">
          <transition name="real-next">
            <img v-if="select !== -1" class="next-btn" @click="done" src="../assets/done_btn.png">
          </transition>
        </div>
        <div class="container-bottom">
          <span>第{{ questions.length + 1 }}题/共{{ questionLength }}题</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data from '../data'

export default {
  name: 'lie',
  data () {
    return {
      page: 1,
      data: data,
      questionIndex: 0,
      select: -1,
      questions: [],
      questionLength: 5
    }
  },
  created () {
    console.log(data.length)
    this.changeQuestion()
  },
  methods: {
    changeQuestion () {
      let time = 0
      let isInQuestion = 0
      do {
        time++
        this.questionIndex = Math.floor(Math.random() * this.data.length)
        console.log(this.questionIndex)
        // 判断该道题是否已经做过
        isInQuestion = this.questions.filter((question) => {
          return question.index === this.questionIndex
        }).length
        console.log('isInQuestion:' + isInQuestion)
      } while (isInQuestion && time < 10)
      this.select = -1
    },
    nextQuestion () {
      console.log('next')
      this.questions.push({
        index: this.questionIndex,
        answer: this.select
      })
      this.changeQuestion()
    },
    done () {
      this.questions.push({
        index: this.questionIndex,
        answer: this.select
      })
      console.log('done!')
    }
  },
  computed: {
    question () {
      return this.data[this.questionIndex]
    }
  }
}
</script>

<style scoped>
.page {
  width: 100%;
  height: 100%;
  font-size: 1rem;
  background-color: rgb(88, 95, 184);
  position: relative;
}
.full-width-img {
  width: 100%;
}
.face-container {
  position: fixed;
  left: 24.3%;
  /*top: 26%;;*/
  top: 4.6rem;
  width: 2.3rem;
}
.face {
  width: 100%;
}
.page1 h1 {
  color: #fff;
  font-size: .5rem;
  text-align: center;
  font-weight: normal;
}
.bottom {
  width: 100%;
  margin-top: .2rem;
}
.page .btn {
  width: 60%;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
}
.page2 {
  padding: .2em .5rem;
  position: relative;
}
.title_bg {
  margin-top: 1.4rem;
}
.top-bar {
  width: 100%;
  /*background: #f00;*/
  padding: .2rem 0;
}
.top-bar img {
  display: block;
  width: 90%;
  margin: 0 auto;
}
.container {
  /*background-color: rgba(216, 194, 194, 0.65);*/
  width: 85%;
  height: 55%;
  position: fixed;
  top: 4rem;
  padding: .2rem;
}
.container span {
  font-size: .5rem;
}
.container .head {
  width: 100%;
  margin-bottom: .1rem;
  /*padding: 1em 0;*/
}
.head .title {
  width: 75%;
  color: rgb(33, 55, 127);
  font-size: .7rem;
  /*background-color: #f00;*/
  float: left;
}
.head .change {
  width: 25%;
  color: rgba(33, 55, 127, 0);
  font-size: .6rem;  
  /*background-color: #0f0;*/
  float: left;
}
.clearfix {
  clear: both;
}
.container .answer {
  background: #ffd766;
  padding: .2rem;
  font-size: .5rem;
  color: rgb(33, 55, 127);
  margin-bottom: .3rem;
  border-radius: .2rem;
}
.container .not-check::before {
  content: '';
  background: url(../assets/check.png) left bottom no-repeat;
  background-size: 100% auto;
  width: .8rem;
  height: .8rem;
  display: inline-block;
  margin-right: .1rem;
}
.container .check::before {
  content: '';
  background: url(../assets/check.png) left top no-repeat;
  background-size: 100% auto;
  width: .8rem;
  height: .8rem;
  display: inline-block;
  margin-right: .1rem;
}
.btn-container {
  width: 100%;
  /*background: #f00;*/
  position: absolute;
  left: 0;
  top: 7.2rem;
}
.next-btn {
  width: 45%;
  margin: 0 auto;
  display: block;
  /*position: absolute;*/
  /*bottom: .3rem;*/
  /*top: 7.2rem;*/
  /*left: 50%;*/
  /*transform: translate(-50%, 0);*/
}
.real-next-enter-active {
  animation: scale-in .8s;
}
.real-next-leave-active {
  animation: all .5s;
  opacity: 0;
}
@keyframes scale-in {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes fade-out {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
.container-bottom {
  color: #b46e53;
  font-size: .8rem;
  position: absolute;
  /*bottom: .1rem;*/
  top: 9rem;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
