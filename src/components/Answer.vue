<template>
  <div class="page">
    <div class="talk" @click="test">
      <!--聊天界面-->
      <transition-group v-on:enter="scrollBottom" name="chat-list">
        <div v-for="(message, index) in conversation" v-bind:key="index">
          <!--对方文字消息-->
          <div v-if="message.type === 'other'" v-bind:class="message.text === conversation[conversation.length - 1].text && (nextStep === 'answer' || nextStep === 'additionA') ? 'now' : ''" class="row other">
            <div class="avatar">
              <img class="full-width-img" src="../assets/other.jpg">
            </div>
            <div class="box"><em></em><span></span>{{ message.text }}</div>
            <div class="clearfix"></div>
          </div>
          <!--对方的表情包-->
          <div v-if="message.type === 'img'" class="row other">
            <div class="avatar">
              <img class="full-width-img" src="../assets/other.jpg">
            </div>
            <div class="img-box">
              <img class="full-width-img" src="../assets/love_you.gif">
            </div>
            <div class="clearfix"></div>
          </div>
          <!--质检报告-->
          <div v-if="message.type === 'res'" class="row other">
            <div class="avatar">
              <img class="full-width-img" src="../assets/other.jpg">
            </div>
            <div class="report">
              <img class="full-width-img" @click="seeReport" src="../assets/result.jpg">
            </div>
            <div class="clearfix"></div>
          </div>
          <!--提示消息-->
          <div v-if="message.type === 'tip'" class="row">
            <div class="tip"><span>{{ message.text }}</span></div>
            <div class="clearfix"></div>
          </div>
          <!--我的文字消息-->
          <div v-if="message.type === 'me'" class="row me">
            <div class="avatar">
              <img class="full-width-img" src="../assets/me.jpg">
            </div>
            <img v-if="message.text === 'true'" class="response" src="../assets/true.jpg">
            <img v-else class="response" src="../assets/false.jpg">
            <div class="clearfix"></div>
          </div>
          <!--我的文字消息-->
          <div v-if="message.type === 'my-text'" class="row me my-text">
            <div class="avatar">
              <img class="full-width-img" src="../assets/me.jpg">
            </div>
            <div class="box"><em></em><span></span>{{ message.text }}</div>
            <div class="clearfix"></div>
          </div>
          <div class="clearfix"></div>
        </div>
      </transition-group>
      <div id="bottom" v-show="!finish"></div>
    </div>
    <!--一开始输入姓名-->
    <div v-if="!started" class="input-box">
      <input placeholder="请输入姓名" type="text" v-model="answerer">
      <button :disabled="!this.answerer.length" @click="sendName">发送</button>
    </div>
    <!--显示对方姓名-->
    <div v-if="question && !finish && started" class="ask-name">{{ question.name }}</div>
    <!--底部图片-->
    <transition v-on:after-leave="scrollBottom">
      <img v-if="!finish && started" class="full-width-img bottom-img" src="../assets/is_real.png">
    </transition>
    <!--选择按钮-->
    <transition name="answer-btn">
      <img v-if="canSelect && nextStep != 'additionA'" class="bottom-btn no-btn" @click="sayNo" src="../assets/no.png">
      <img v-if="canSelect && nextStep == 'additionA'" class="bottom-btn no-btn" @click="sayYes" src="../assets/yes.png">
    </transition>
    <transition name="answer-btn">
      <img v-if="canSelect && started" class="bottom-btn yes-btn" @click="sayYes" src="../assets/yes.png">
    </transition>
  </div>
</template>

<script>
import data from '../data'

export default {
  data () {
    return {
      title: { title: '你看得出我在说谎吗？', desc: '就是想撩你一下' },
      start: { title: ',你是最了解我的人', true: '嘻嘻，我还有五句话，全部猜对真假才是真的了解我哦！', false: '那让我们加深一下了解吧！我说五句话，你来判断真假~' },
      right: [ '猜对了，再接再厉！', '又对了,还是你了解我', '对对对,快承认你暗恋我吧', '骗不了你！大神受我一拜！', '真心人,我们之间只差一纸结婚证了' ],
      wrong: [ '答错了哦，再接再厉！', 'Opps，又错了哦,有点尴尬了', '又错了哦…,我已安装手机管家,准备屏蔽你的电话', '还错？万一有天我被盗号了…,你还是下载个管家吧', '你已被移出好友列表' ],
      addition: ['这都被你发现了', '厉害了,这你都知道', '这么了解我,除了我家宝宝还能有谁'],
      result: { 0: '请问，你贵姓？', 20: '交了个假朋友', 40: '我们之间隔了一道墙', 60: '多发两个红包加强沟通吧', 80: '好基友一辈纸', 100: '高山流水遇知音' },
      allQuestions: this.$root.ref,
      data: data,
      key: '-Kf_bceDm5iEUrd69PGT',
      questions: [],
      answerer: '',
      conversation: [],
      nextStep: null,
      hasAnswered: 0,
      rightAnswers: 0,
      canSelect: false,
      rightAnswer: null,
      showQuestionIndex: null,
      started: false,
      finish: false
    }
  },
  created () {
    this.conversation.push({
      type: 'other',
      text: '你叫什么名字呢?'
    })
  },
  methods: {
    // 获取问题
    getQuestions () {
      // console.log(this.$root.allQuestions)
      // console.log(this.allQuestions)
      for (const question of this.allQuestions) {
        const key = question['.key']
        if (key === this.key) {
          this.questions = question
          // console.log(this.questions)
        }
      }
      // console.log(this.$root.wilddogData)
    },
    // 选择假
    sayNo () {
      this.conversation.push({
        type: 'me',
        text: 'false'
      })
      this.canSelect = false
      window.setTimeout(() => { this.judge() }, 1000)
    },
    // 选择真
    sayYes () {
      this.conversation.push({
        type: 'me',
        text: 'true'
      })
      this.canSelect = false
      window.setTimeout(() => { this.judge() }, 1000)
    },
    // 判断操作
    judge () {
      switch (this.nextStep) {
        case 'knowMe':
          this.conversation.push({
            type: 'other',
            text: this.start[this.conversation[this.conversation.length - 1].text]
          })
          this.nextStep = 'start'
          window.setTimeout(() => { this.showTip() }, 1000)
          break
        case 'questionStart':
          window.setTimeout(() => { this.showTip() }, 1000)
          break
        case 'additionStart':
          window.setTimeout(() => { this.showTip() }, 1000)
          break
        case 'question':
          this.askQuestion()
          break
        case 'answer':
          this.checkAnswer()
          break
        case 'additionQ':
          this.askAddition()
          break
        case 'additionA':
          this.checkAdt()
          break
        case 'finish':
          window.setTimeout(() => { this.showTip() }, 1000)
          break
      }
    },
    // 显示提示
    showTip () {
      let tips = {
        type: 'tip',
        text: ''
      }
      switch (this.nextStep) {
        case 'start':
          tips.text = '开始质检'
          this.nextStep = 'questionStart'
          this.conversation.push(tips)
          this.judge()
          break
        case 'questionStart':
          tips.text = '第' + (this.hasAnswered + 1) + '题/共' + this.question.answer.length + '题'
          this.nextStep = 'question'
          this.conversation.push(tips)
          window.setTimeout(() => { this.judge() }, 1000)
          break
        case 'additionStart':
          tips.text = '第' + (this.hasAnswered - 4) + '题/共' + (this.data.length - 50) + '题'
          this.nextStep = 'additionQ'
          this.conversation.push(tips)
          window.setTimeout(() => { this.judge() }, 1000)
          break
        case 'addition':
          tips.text = '附加题'
          this.nextStep = 'additionStart'
          this.conversation.push(tips)
          window.setTimeout(() => { this.showTip() }, 1000)
          break
        case 'finish':
          tips.text = '质检完成'
          this.nextStep = 'showResult'
          this.conversation.push(tips)
          window.setTimeout(() => { this.showResult() }, 1000)
          break
      }
    },
    // 问问题
    askQuestion () {
      this.showQuestionIndex = Math.floor(Math.random() * 2)
      this.conversation.push({
        type: 'other',
        text: this.data[this.question.answer[this.hasAnswered]['index']].as[this.showQuestionIndex]
      })
      // console.log(this.data[this.question.answer[this.hasAnswered]['index']].as[this.question.answer[this.hasAnswered].answer])
      this.rightAnswer = this.question.answer[this.hasAnswered]['answer']
      this.canSelect = true
      this.nextStep = 'answer'
    },
    // 问附加问题
    askAddition () {
      // console.log('askAddition')
      const adtIndex = this.hasAnswered - 4 + 49
      // console.log(this.data[adtIndex].as[0])
      this.conversation.push({
        type: 'other',
        text: this.data[adtIndex].as[0]
      })
      this.canSelect = true
      this.nextStep = 'additionA'
      window.setTimeout(() => { this.showTip() }, 1000)
    },
    // 检验问题答案
    checkAnswer () {
      let other = {
        type: 'other',
        text: ''
      }
      // console.log(other.text)
      // console.log(this.conversation[this.conversation.length - 1])
      this.hasAnswered ++
      if ((this.showQuestionIndex === this.rightAnswer && this.conversation[this.conversation.length - 1].text === 'true') || this.showQuestionIndex !== this.rightAnswer && this.conversation[this.conversation.length - 1].text === 'false') {
        this.rightAnswers ++
        other.text = this.right[this.rightAnswers - 1]
      } else {
        other.text = this.wrong[this.hasAnswered - this.rightAnswers - 1]
      }
      this.conversation.push(other)
      if (this.hasAnswered < this.question.answer.length) {
        this.nextStep = 'questionStart'
        this.judge()
      } else if (this.question.name.indexOf('朝润') > -1 && (this.answerer.indexOf('小宝宝') > -1 || this.answerer.indexOf('靖娴') > -1)) {
        this.nextStep = 'addition'
        this.showTip()
      } else {
        this.nextStep = 'finish'
        this.judge()
      }
    },
    // 检验附加题答案
    checkAdt () {
      this.rightAnswers ++
      this.hasAnswered ++
      this.conversation.push({
        type: 'other',
        text: this.addition[this.hasAnswered - 5 - 1]
      })
      if (this.hasAnswered - 4 + 49 < this.data.length) {
        this.nextStep = 'additionStart'
        this.judge()
      } else {
        window.setTimeout(() => { this.sendImg() }, 1000)
      }
    },
    // 发表情包
    sendImg () {
      this.conversation.push({
        type: 'img',
        src: '../assets/love_you.gif'
      })
      window.setTimeout(() => {
        this.scrollBottom()
        this.nextStep = 'finish'
        this.judge()
      }, 10)
    },
    // 显示质检报告
    showResult () {
      this.conversation.push({
        type: 'other',
        text: '下面是我和你的友情质检报告,请查收'
      }, {
        type: 'res',
        src: '../assets/result.jpg'
      })
      this.finish = true
    },
    // 查看报告
    seeReport () {
      console.log('seeReport')
      this.$router.push({name: 'result'})
    },
    // 发送姓名
    sendName () {
      // console.log('answer' + this.answerer)
      this.started = true
      this.conversation.push({
        type: 'my-text',
        text: '我是' + this.answerer + '吖'
      })
      window.setTimeout(() => {
        this.conversation.push({
          type: 'other',
          text: this.answerer + this.start.title
        })
        this.canSelect = true
        this.nextStep = 'knowMe'

        // test
        // this.nextStep = 'addition'
        // this.hasAnswered = 5
        // this.showTip()
      }, 1000)
    },
    // 滚动到最底部
    scrollBottom () {
      window.scroll(0, 50000)
    },
    // 测试
    test () {
      // this.nextStep = 'addition'
      // this.showTip()

      // this.conversation = []
      // this.rightAnswers = 0
      // this.hasAnswered = 5
      // this.finish = true
      // this.nextStep = 'finish'
      // this.judge()
      // window.setTimeout(() => {
      //   this.conversation.push({
      //     type: 'other',
      //     text: this.answerer + this.start.title
      //   })
      //   this.canSelect = true
      //   this.nextStep = 'knowMe'
      // }, 1000)
    }
  },
  computed: {
    // 用户问题
    question () {
      for (const question of this.allQuestions) {
        const key = question['.key']
        if (key === this.key) {
          return question
        }
      }
    }
  }
}
</script>

<style scoped>
.chat-list-enter-active, .chat-list-leave-active {
  transition: all .5s;
}
.chat-list-enter, .chat-list-leave-active {
  opacity: 0;
}
.page {
  background: #C9D0EA;
}
</style>
<style>
.ask-name {
  position: fixed;
  color: #3B0085;
  font-size: .5rem;
  background: #F6DF00;
  /*padding: .1rem;*/
  border: .1rem solid #3B0085;
  border-radius: .2rem;
  text-align: center;
  /*font-weight: bold;*/
  bottom: 5.4rem;
  left: 1.5rem;
  z-index: 10;
}
.bottom-img {
  position: fixed;
  left: 0;
  bottom: 0;
}
.talk {
  width: 100%;
  background: #C9D0EA;
  z-index: 8;
  /*max-height: 100%;*/
  /*overflow-y: scroll;*/
}
#bottom {
  width: 100%;
  height: 6.5rem;
  background: #C9D0EA;
}
.input-box input {
  position: fixed;
  left: 0.2rem;
  bottom: 0.2rem;
  width: 7rem;
  height: 1rem;
  border: .05rem solid #ccc;
  border-radius: .1rem;
  padding: 0 .2rem;
}
.input-box button {
  position: fixed;
  right: 0.2rem;
  bottom: 0.2rem;
  width: 2rem;
  height: 1rem;
  border: .05rem solid #059406;
  border-radius: .1rem;
  background: #0BB20C;
  color: #fff;
  text-align: center;
}
.input-box button:disabled {
  opacity: .5;
}
.talk .row {
  width: 9.6rem;
  float: left;
  padding: .2rem;
  /*background: #f00;*/
}
.row .tip {
  color: #fff;
  font-size: .3rem;
  text-align: center;
}
.row .tip span {
  border-radius: .1rem;
  background: rgba(153, 153, 153, .5);
  padding: .1rem;
}
.row .avatar {
  width: 1rem;
  height: 1rem;
  /*padding: .1rem;*/
  /*background: #0f0;*/
}
.avatar img {
  width: 100%;
  height: 100%;
  border-radius: .2rem;
}
.row .img-box {
  position: relative;
  width: 3rem;
  height: 2.56rem;
  border-radius: .2rem;
  float: left;
  margin-left: .5rem;
}
.img-box img {
  border-radius: .2rem;
}
.row .box {
  position: relative;
  max-width: 5rem;
  border: .08rem solid #999;
  border-radius: .2rem;
  padding: .3rem;
  font-size: .5rem;
}
.report {
  position: relative;
  max-width: 5rem;
  float: left;
  margin-left: .5rem;
  padding: 0;
}
.report img {
  height: 5.4rem;
  border-radius: .2rem;
  border: .08rem solid rgb(33, 55, 127);
}
.other .avatar {
  float: left;
  border: .08rem solid #3B0085;
  border-radius: .2rem;
  /*background: url(../assets/other.jpg);
  background-size: 1rem;*/
}
.other .box {
  float: left;
  margin-left: .5rem;
  background: #fff;
}
.me .box {
  float: right;
  margin-right: .5rem;
  background: #fff;
}
.other .box em {
  position: absolute;
  left: -.8rem;
  top: .2rem;
  display: block;
  border-color: transparent #999 transparent transparent;
  border-width: .4rem;
  border-style: solid;
}
.report em {
  border-color: transparent rgb(33, 55, 127) transparent transparent !important;
}
.now .box {
  border: .08rem solid orange;
}
.now em {
  border-color: transparent orange transparent transparent !important;
}
.other .box span {
  position: absolute;
  left: -.65rem;
  top: .24rem;
  display: block;
  border-color: transparent #fff transparent transparent;
  border-width: .36rem;
  border-style: solid;
}
.me .avatar {
  float: right;
  margin-top: 1rem;
  border: .08rem solid orange;
  border-radius: .2rem;
  /*background: url(../assets/me.jpg);
  background-size: 1rem;*/
}
.my-text .avatar {
  margin-top: 0;
}
.my-text .box {
  border: .08rem solid orange;
}
.my-text .box em {
  position: absolute;
  right: -.8rem;
  top: .2rem;
  display: block;
  border-color: transparent transparent transparent orange;
  border-width: .4rem;
  border-style: solid;
}
.my-text .box span {
  position: absolute;
  right: -.65rem;
  top: .24rem;
  display: block;
  border-color: transparent transparent transparent #fff;
  border-width: .36rem;
  border-style: solid;
}
.me .response {
  float: right;
  display: block;
  width: 4.5rem;
}
.bottom-btn {
  position: fixed;
  bottom: .25rem;
  width: 4rem;
}
.no-btn {
  left: .8rem;
}
.yes-btn {
  right: .8rem;
}
.answer-btn-enter-active {
  animation: btn-scale 2s;
}
@keyframes btn-scale {
  0% {
    transform: scale(1);
    opacity: 0;
  }
  10% {
    transform: scale(1);
    opacity: 1;
  }
  70% {
    transform: scale(1);
  }
  85% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}
</style>
