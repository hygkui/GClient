<template>
  <div>
    <div class="panel">

      <h2>
        {{ board.tip }}
      </h2>
      <p>开始时间:{{startTime}}</p>
      <p>{{board.aliveCount}}人参与</p>
      <span v-for="(user, index) in board.userIds">
        {{ (index + 1)  + '.' + user }}
      </span>
    </div>


    <div v-if="board.hasEnd" class="panel">
      共 {{ board.userIds.length }} 人瓜分 {{ board.totalRewardTokens }} 个悦币

      <p v-if="userInfo && userInfo.isAlive">恭喜您获得 {{ userInfo.gotTokens }} 个悦币！</p>
      <p v-if="userInfo && !userInfo.isAlive">下次再战，当王者赚悦币！</p>
    </div>

    <div v-if="userInfo && !userInfo.isAlive"  class="panel">
      <div v-if="userInfo.actionAskRecovery && !userInfo.hasRecovery">
        <h3>大侠，你还有一次复活的机会！</h3>
        <button type="button" class="am-btn am-round am-btn-success" @click="recovery('yes')">我要复活</button>
        <button type="button" class="am-btn am-round  am-btn-danger"  @click="recovery('no')">后会有期</button>
      </div>
      <p v-if="userInfo.actionAskRecovery && userInfo.hasRecovery">每场只能复活一次哦，大侠后会有期~</p>
      <p v-if="!userInfo.actionAskRecovery">大侠后会有期~</p>
    </div>

    <div class="panel" v-if="userInfo && userInfo.isAlive">

      <div v-if="board.question">
        <p>{{board.question.title}}</p>

        <div v-if="board.question && board.question.choices.length > 2">

          <div v-if="board.showAnalysis">
            <div>
              <button v-if="board.question.choices[0]" class="default-choice-btn" :class="{'answer-right-a': board.question.choices[0].isRight, 'answer': !board.question.choices[0].isRight}">{{ board.question.choices[0].text }} {{ getPeopleText(board.analysis[0].count) }}</button>
              <button v-if="board.question.choices[1]" class="default-choice-btn" :class="{'answer-right-b': board.question.choices[1].isRight, 'answer': !board.question.choices[1].isRight}">{{ board.question.choices[1].text }} {{ getPeopleText(board.analysis[1].count) }}</button>
              <button v-if="board.question.choices[2]" class="default-choice-btn" :class="{'answer-right-c': board.question.choices[2].isRight, 'answer': !board.question.choices[2].isRight}">{{ board.question.choices[2].text }} {{ getPeopleText(board.analysis[2].count) }}</button>
              <button v-if="board.question.choices[3]" class="default-choice-btn" :class="{'answer-right-d': board.question.choices[3].isRight, 'answer': !board.question.choices[3].isRight}">{{ board.question.choices[3].text }} {{ getPeopleText(board.analysis[3].count) }}</button>
              <br>
              <p>
                <span style="border: 1px solid gray; border-radius: 5px; padding: 2px; font-size: .8em; margin: 5px; background-color: lightskyblue">解析</span>
                {{ board.answer }}
              </p>
            </div>
          </div>

          <div v-else>
            <div v-if="board.stopTime > 0">
              <h3>倒计时：{{ board.stopTime }}</h3>
              <div v-if="board.question.isMultipleChoice">
                <span v-if="choices.length > 0">{{ choices }}</span>
                <button v-if="board.question.choices[0]" class="default-choice-btn" :class="{'choice-a': choices.indexOf(0) !== -1}" @click="toggleChoice(0)">{{ board.question.choices[0].text }}</button>
                <button v-if="board.question.choices[1]" class="default-choice-btn" :class="{'choice-b': choices.indexOf(1) !== -1}" @click="toggleChoice(1)">{{ board.question.choices[1].text }}</button>
                <button v-if="board.question.choices[2]" class="default-choice-btn" :class="{'choice-c': choices.indexOf(2) !== -1}" @click="toggleChoice(2)">{{ board.question.choices[2].text }}</button>
                <button v-if="board.question.choices[3]" class="default-choice-btn" :class="{'choice-d': choices.indexOf(3) !== -1}" @click="toggleChoice(3)">{{ board.question.choices[3].text }}</button>
                <!--<button type="button" class="am-center am-btn am-btn-default am-btn-secondary am-round" @click="submitChoices">-->
                  <!--<span v-if="choices.length > 0">{{ choices }}</span>-->
                  <!--提交-->
                <!--</button>-->
              </div>
              <div v-else>
                <button v-if="board.question.choices[0]" class="default-choice-btn" :class="{'choice-a': tmpChoice === 0}" @click="checkAnswer(0)">{{ board.question.choices[0].text }}</button>
                <button v-if="board.question.choices[1]" class="default-choice-btn" :class="{'choice-b': tmpChoice === 1}" @click="checkAnswer(1)">{{ board.question.choices[1].text }}</button>
                <button v-if="board.question.choices[2]" class="default-choice-btn" :class="{'choice-c': tmpChoice === 2}" @click="checkAnswer(2)">{{ board.question.choices[2].text }}</button>
                <button v-if="board.question.choices[3]" class="default-choice-btn" :class="{'choice-d': tmpChoice === 3}" @click="checkAnswer(3)">{{ board.question.choices[3].text }}</button>
              </div>


            </div>

          </div>
        </div>
      </div>





      <div  class="control" v-if="userInfo && !userInfo.isAlive && userInfo.actionAskRecovery">
        <button class="btn btn-active" @click="recovery('yes')">复活</button>
        <button class="btn btn-die" @click="recovery('no')">死吧</button>
      </div>
    </div>


    <div class="panel" v-if="!userId || !userInfo">
      <input class="am-form-field" type="text" style="display: inline-block; width: 200px;" placeholder="用户名" v-model="userId">
      <button type="button" class="am-btn am-btn-success" @click="enterGame()">加入游戏</button>
    </div>
    <div class="panel" v-else>
      <button type="button" class="am-btn am-btn-danger" @click="exitGame()">退出</button>
    </div>
  </div>
</template>

<script>
  import http from 'axios'
  import config from '../config'
  const baseURL = config.baseURL

  export default {
    name: 'game-board',
    data () {
      return {
        board: null,
        userId: '',
        userInfo: null,
        choices: [],
        tmpChoice: -1
      }
    },
    computed: {
      startTime () {
        let getTime = function (time) {
          let T = time.split('T')
          return T[0] + ' ' + T[1].split('.')[0]
        }
        return this.board ? getTime(this.board.startTime) : 'unknown'
      }
    },
    methods: {
      checkAnswer (choice) {
        this.tmpChoice = choice
      },
      sendAnswer () {
        http.post(baseURL + '/api/checkAnswer', {
          userId: this.userId,
          questionId: this.board.question.questionId,
          choice: this.tmpChoice
        }).then(function (res) {
          console.log(res.data)
        })
        this.tmpChoice = -1
      },
      getPeopleText (count) {
        if (count && parseInt(count, 10) > 0) {
          return `（${count}人选择）`
        } else {
          return ''
        }
      },
      recovery (code) {
        console.log('recovery:', code)
        http.post(baseURL + '/api/recovery', {
          userId: this.userId,
          code
        })
      },
      toggleChoice (index) {
        if (this.choices.indexOf(index) === -1) {
          this.choices.push(index)
        } else {
          this.choices.splice(this.choices.indexOf(index), 1)
        }
        this.choices.sort()
      },
      submitChoices () {
        let choice = this.choices.sort().join(',')
        http.post(baseURL + '/api/checkAnswer', {
          userId: this.userId,
          questionId: this.board.question.questionId,
          choice
        }).then(function (res) {
          console.log(res.data)
        })
        this.choices = []
      },
      exitGame () {
        http.post(baseURL + '/api/exitGame', {
          userId: this.userId
        })
        this.userId = ''
        this.userInfo = null
      },
      enterGame () {
        if (this.userId.length > 0) {
          let that = this
          console.log('enterGame, reset for ', this.userId)
          http.post(baseURL + '/api/enterGame', {
            userId: that.userId
          }).then(function (res) {
            console.log(res.data)
            that.$root.$wilddogRefs.ref.child('/users/' + that.userId).on('value', function (snapshot) {
              that.userInfo = snapshot.val()
              console.log(that.userInfo)
            })
          })
        }
      }
    },
    mounted () {
      let that = this
      this.$root.$wilddogRefs.ref.child('/board').on('value', function (snapshot) {
        that.board = snapshot.val()
      })
      setInterval(() => {
        if (that.userInfo && (that.userInfo.submitAnswerState === 0) && (that.board.stopTime === 0)) {
          if (that.board.question.isMultipleChoice) {
            that.submitChoices()
          } else {
            that.sendAnswer()
          }
          console.log('sendAnswer', new Date())
        } else {
          console.log('check state, not ready to send answer', that.board.stopTime)
          if (that.userInfo) {
            console.log(that.userInfo.submitAnswerState)
          }
        }
      }, 1000)
    }
  }
</script>

<style scoped>

  .panel {
    margin: 5px; padding: 5px; border:1px solid white;
    background-color: white;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
  }
.tip {
  margin: 5px;
  padding: 5px;
  border: 2px solid gold;
  background-color: palegoldenrod;
}

.control {
  width: 100%;
  margin: 5px;
  padding: 0;
}
  .question {
    background-color: rgba(255, 255, 255, 0.92);
    border-radius: 5px;
    display: block;
    margin: 10px;
    padding: 10px;
  }

.headBox {
  background-color: rgba(255, 255, 255, 0.92);
  border-radius: 5px;
  display: block;
  margin: 10px;
  padding: 10px;
}

.answer {
    background-color: white;
    border: 1px solid black;
  }
  .btn {
    margin: 0 5px;
    border-radius: .1rem;
    text-align: center;
    width: 1.5rem;
    height: .8rem;
  }

  .btn-ghost {
    background: #cccccc;
    border: .05rem solid #cccccc;
    color: black;
  }

  .btn-newb {
    background: #ffab0f;
    border: .05rem solid #ff6d10;
    color: #ffffff;
  }

  .btn-always {
    background: #57c5ff;
    border: .05rem solid #3ccdff;
    color: #ffffff;
  }

  .btn-active {
    border: .05rem solid #059406;
    background: #0BB20C;
    color: #fff;
  }

  .btn-die {
    border: .05rem solid #808080;
    background: #cccccc;
    color: #fff;
  }



  .default-choice-btn {
    display: block;
    -webkit-border-radius: 5px;
    -moz-border-radius: 5px;
    border-radius: 5px;
    margin: 10px;
    padding: 5px;
    width: 80%;
    background-color: rgba(128, 128, 128, 0.68);
    color: white;
    font-size: 1em;
    text-align: left;
  }

  .choice-a {
    border: 2px solid #4A90E2;
  }

  .answer-right-a {
    border: none;
    background-color: #4A90E2;
  }

  .choice-b {
    border: 2px solid #F5A623;
  }

  .answer-right-b {
    border: none;
    background-color: #F5A623;
  }

  .answer {
    border: none;
    background-color: #D8D8D8;
  }

  .choice-c {
    border: 2px solid #BD10E0;
  }

.answer-right-c {
  border: none;
  background-color: #BD10E0;
}

  .choice-d {
    border: 2px solid #50E3C2;
  }

.answer-right-d {
  border: none;
  background-color: #50E3C2;
}





</style>
