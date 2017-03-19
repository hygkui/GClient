<template>
  <div class="page">
    <div class="talk">
      <!--聊天-->
      <div v-for="message in conversation">
        <!--type === 'other'-->
        <div v-if="message.type === 'other'" class="row other">
          <div class="avatar">
            <img class="full-width-img" src="../assets/logo.png">
          </div>
          <div class="box"><em></em><span></span>{{ message.text }}</div>
          <div class="clearfix"></div>
        </div>
        <!--type === 'tip'-->
        <div  v-if="message.type === 'tip'" class="row">
          <div class="tip"><span>{{ message.text }}</span></div>
        </div>
        <!--type === 'me'-->
        <div  v-if="message.type === 'me'" class="row me">
          <div class="avatar">
            <img class="full-width-img" src="../assets/no.png">
          </div>
          <img v-if="message.text === 'true'" class="response" src="../assets/true.jpg">
          <img v-else class="response" src="../assets/false.jpg">
          <div class="clearfix"></div>
        </div>
      </div>
      <div class="bottom"></div>
      
      <!--<div class="row">
        <div class="tip"><span>第1题/共5题</span></div>
      </div>
      <div v-for="l in [1,2,3]" class="row me">
        <div class="avatar">
          <img class="full-width-img" src="../assets/no.png">
        </div>
        <img class="response" src="../assets/false.jpg">
        <div class="clearfix"></div>
      </div>
      <div class="row other">
        <div class="avatar">
          <img class="full-width-img" src="../assets/logo.png">
        </div>
        <div class="box"><em></em><span></span>你好,听说你是最了解我的人是吗?</div>
        <div class="clearfix"></div>
      </div>
      <div class="row me">
        <div class="avatar">
          <img class="full-width-img" src="../assets/no.png">
        </div>
        <img class="response" src="../assets/true.jpg">
        <div class="clearfix"></div>
      </div>-->
    </div>
    <!--<img class="full-width-img" src="../assets/false.jpg">-->
    <div v-if="question" class="ask-name">{{ question.name }}</div>
    <img class="full-width-img bottom-img" src="../assets/is_real.png">
    <img v-if="canSelect" class="bottom-btn no-btn" @click="sayNo" src="../assets/no.png">
    <img v-if="canSelect" class="bottom-btn yes-btn" @click="sayYes" src="../assets/yes.png">
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
      wrong: [ '答错了，再接再厉！', 'Opps，又错了,有点尴尬了', '又错了…,我已安装手机管家,准备屏蔽你的电话', '还错？万一有天我被盗号了…,你还是下载个管家吧', '你已被移出好友列表' ],
      result: { 0: '请问，你贵姓？', 20: '交了个假朋友', 40: '我们之间隔了一道墙', 60: '多发两个红包加强沟通吧', 80: '好基友一辈纸', 100: '高山流水遇知音' },
      allQuestions: this.$root.ref,
      data: data,
      key: '-Kf_bceDm5iEUrd69PGT',
      questions: [],
      answerer: '老朝',
      conversation: [],
      nextStep: null,
      hasAnswered: 0,
      rightAnswers: 0,
      canSelect: false,
      rightAnswer: null
    }
  },
  created () {
    console.log(this.$root.ref)
    window.setTimeout(() => {
      this.conversation.push({
        type: 'other',
        text: this.answerer + this.start.title
      })
      this.canSelect = true
      this.nextStep = 'knowMe'
    }, 1000)
  },
  methods: {
    getQuestions () {
      // console.log(this.$root.allQuestions)
      console.log(this.allQuestions)
      for (const question of this.allQuestions) {
        const key = question['.key']
        if (key === this.key) {
          this.questions = question
          console.log(this.questions)
        }
      }
      // console.log(this.$root.wilddogData)
    },
    sayNo () {
      this.conversation.push({
        type: 'me',
        text: 'false'
      })
      this.canSelect = false
      window.setTimeout(() => { this.judge() }, 2000)
    },
    sayYes () {
      this.conversation.push({
        type: 'me',
        text: 'true'
      })
      this.canSelect = false
      window.setTimeout(() => { this.judge() }, 2000)
    },
    judge () {
      switch (this.nextStep) {
        case 'knowMe':
          this.conversation.push({
            type: 'other',
            text: this.start[this.conversation[1].text]
          })
          this.nextStep = 'start'
          window.setTimeout(() => { this.showTip() }, 2000)
          break
        case 'questionStart':
          window.setTimeout(() => { this.showTip() }, 500)
          break
        case 'question':
          this.askQuestion()
          break
      }
    },
    showTip () {
      let tips = {
        type: 'tip',
        text: ''
      }
      switch (this.nextStep) {
        case 'start':
          tips.text = '开始质检'
          this.nextStep = 'questionStart'
          break
        case 'questionStart':
          tips.text = '第' + (this.hasAnswered + 1) + '题/共' + this.question.answer.length + '题'
          this.nextStep = 'question'
          break
      }
      this.conversation.push(tips)
      this.judge()
    },
    askQuestion () {
      this.conversation.push({
        type: 'other',
        text: this.data[this.question.answer[this.hasAnswered]['index']]
      })
      this.rightAnswer = this.question.answer[this.hasAnswered]['answer']
      this.canSelect = false
    }
  },
  computed: {
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

<style>
.page {
  background: #C9D0EA;
}
.ask-name {
  position: absolute;
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
  position: absolute;
  left: 0;
  bottom: 0;
}
.talk {
  width: 100%;
  max-height: 100%;
  overflow-y: scroll;
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
.talk .bottom {
  width: 100%;
  float: left;
  height: 5.7rem;
}
.row .avatar {
  width: 1rem;
  height: 1rem;
  /*padding: .1rem;*/
  /*background: #0f0;*/
  border: .08rem solid #3B0085;
  border-radius: .2rem;
}
.avatar img {
  width: 100%;
  height: 100%;
}
.row .box {
  position: relative;
  max-width: 5rem;
  border: .08rem solid #999;
  border-radius: .2rem;
  padding: .3rem;
  font-size: .5rem;
}
.other .avatar {
  float: left;
}
.other .box {
  float: left;
  margin-left: .5rem;
}
.other .box {
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
}
.me .response {
  float: right;
  display: block;
  width: 4.5rem;
}
.bottom-btn {
  position: absolute;
  bottom: .25rem;
  width: 4rem;
}
.no-btn {
  left: .8rem;
}
.yes-btn {
  right: .8rem;
}
</style>
