<template>
  <div class="page">
    <!--首页-->
    <div v-if="page===1" class="page1">
      <img class="full-width-img" src="../assets/index.png">
      <div class="face-container">
        <img class="face" src="../assets/index_face.gif">
      </div>
      <div class="bottom">
        <div v-if="start">
          <h1>让朋友更了解你的态度</h1>
          <img class="btn" @click="page=2" src="../assets/set_title_btn.png">
        </div>
        <h1 v-if="!start">请先输入姓名</h1>
      </div>
      <!--一开始输入姓名-->
      <div v-if="!start" class="input-box">
        <input @keyup.enter="sendName" id="username-input" placeholder="请输入姓名" type="text" v-model="name">
        <button :disabled="!this.name.length" @click="sendName">发送</button>
      </div>
    </div>
    <!--选择题目和答案页-->
    <div v-if="page===2" class="page2">
      <!--顶部-->
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
        <!--选择结果-->
        <div v-if="question.as[0]" :class="[select==0 ? 'check' : 'not-check', 'answer']" @click="select=0">{{ question.as[0] }}</div>
        <div v-if="question.as[1]" :class="[select==1 ? 'check' : 'not-check', 'answer']" @click="select=1">{{ question.as[1] }}</div>
        <div v-if="question.as[2]" :class="[select==2 ? 'check' : 'not-check', 'answer']" @click="select=2">{{ question.as[2] }}</div>
        <div v-if="question.as[3]" :class="[select==3 ? 'check' : 'not-check', 'answer']" @click="select=3">{{ question.as[3] }}</div>
        <!--下一步按钮-->
        <div class="btn-container" v-if="questions.length < questionLength - 1">
          <img v-if="select === -1" class="next-btn" src="../assets/next_disabled.png">
          <transition name="real-next">
            <img v-if="select !== -1" class="next-btn" @click="nextQuestion" src="../assets/next.png">
          </transition>
        </div>
        <!--完成按钮-->
        <div class="btn-container" v-else>
          <img v-if="select == -1" class="next-btn" src="../assets/done_disabled.png">
          <transition name="real-next">
            <img v-if="select !== -1 && !submited" class="next-btn" :class="submited ? 'real-next-enter-active' : ''" @click="done" src="../assets/done_btn.png">
          </transition>
        </div>
        <div v-if="!submited" class="container-bottom">
          <span>第{{ questions.length + 1 }}题/共{{ questionLength }}题</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import data from '../data'

export default {
  data () {
    return {
      page: 1,
      data: data,
      questionIndex: 0,
      select: -1,
      questions: [],
      ignoreList: [],
      questionLength: 5,
      ref: null,
      submited: false,
      name: '',
      start: false
    }
  },
  created () {
    // 如果已经出题
    let lie = localStorage.getItem('lie')
    lie = JSON.parse(lie)
    if (lie) {
      this.$router.replace({name: 'result', params: lie})
    }

    window.scroll(0, 0)
    this.changeQuestion()
    const name = localStorage.getItem('username')
    if (name) {
      this.name = name
      this.start = true
      document.title = `你看得出${name}在说谎吗?`
    }
  },
  mounted () {
    if (!this.name) {
      const input = document.getElementById('username-input')
      input.focus()
    }
  },
  methods: {
    // 发送姓名
    sendName () {
      localStorage.setItem('username', this.name)
      this.start = true
    },
    // 换一题
    changeQuestion () {
      let time = 0
      let isInQuestion = 0
      this.ignoreList.push(this.questionIndex)
      do {
        time++
        this.questionIndex = Math.floor(Math.random() * 50)
        // 判断该道题是否已经做过或换过
        isInQuestion = this.ignoreList.indexOf(this.questionIndex) > -1
      } while (isInQuestion && time < 100)
      this.select = -1
    },
    // 下一题
    nextQuestion () {
      this.questions.push({
        index: this.questionIndex,
        answer: this.select
      })
      this.changeQuestion()
    },
    // 完成
    done () {
      this.questions.push({
        index: this.questionIndex,
        answer: this.select
      })
      this.submited = true

      const time = Date.parse(new Date())
      const user = this.name + time
      const params = {name: this.name, time}
      this.$root.$wilddogRefs.ref.child(user).set({
        name: this.name,
        answer: this.questions
      }, (res) => {
        if (res === null) {
          localStorage.setItem('lie', JSON.stringify(params))
          localStorage.setItem('username', this.name)
          this.$router.replace({name: 'result', params})
        } else {
          window.alert('服务器出错!')
        }
      })
    }
  },
  computed: {
    // 显示的题目
    question () {
      return this.data[this.questionIndex]
    }
  }
}
</script>

<style>
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
  padding: .2rem 0;
}
.top-bar img {
  display: block;
  width: 90%;
  margin: 0 auto;
}
.container {
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
}
.head .title {
  width: 75%;
  color: rgb(33, 55, 127);
  font-size: .7rem;
  float: left;
}
.head .change {
  width: 25%;
  color: rgba(33, 55, 127, 0);
  font-size: .6rem;
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
  position: absolute;
  left: 0;
  top: 7.2rem;
}
.next-btn {
  width: 45%;
  margin: 0 auto;
  display: block;
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
  top: 9rem;
  left: 50%;
  transform: translate(-50%, 0);
}
</style>
