<template>
  <div v-if="board">
    <p>开始时间:{{startTime}}</p>
    <p>{{board.aliveCount}}人参与</p>
    <span v-for="(user, index) in board.userIds">
      {{ (index + 1)  + '.' + user }}
    </span>
    <div class="tip">
      {{ board.tip }}
    </div>

    <div v-if="board.hasEnd">
      共 {{ board.userIds.length }} 人瓜分 {{ board.totalRewardTokens }} 个悦币
      <!--<p v-for="(id, key) in board.userIds">-->
        <!--<span>{{ id }}</span>-->
      <!--</p>-->

      <p v-if="userInfo && userInfo.isAlive">恭喜您获得 {{ userInfo.gotTokens }} 个悦币！</p>
    </div>
    <div v-if="userInfo && !userInfo.isAlive" style="border: 1px solid cadetblue; padding: 5px; margin: 5px;">
      <div v-if="userInfo.actionAskRecovery">还可以复活
        <button class="btn btn-active" @click="recovery('yes')">复活</button>
        <button class="btn btn-die" @click="recovery('no')">死吧</button>
      </div>
      <p v-if="!userInfo.actionAskRecovery && userInfo.hasRecovery">已经复活过一次了，虽然有复活卡，但是不能复活</p>
      <p v-if="!userInfo.actionAskRecovery && !userInfo.hasRecovery">没复活卡，直接死</p>
    </div>

    <div v-if="userInfo && userInfo.isAlive">
      <div class="stopTime" v-if="board.stopTime > 0">
        倒计时：{{ board.stopTime }}
      </div>

      <div class="question" v-if="board.question">
        <p>questionId: {{board.question.questionId}}</p>
        <p>题目：{{board.question.title}}</p>
        <ul v-for="choice in board.question.choices">
          <li>{{ choice }}</li>
        </ul>
      </div>

      <div class="answer" v-if="board.answer">
        正确选项：{{ board.rightChoice }}
        <br>
        答案解析：{{ board.answer }}
      </div>

      <div class="analysis" v-for="(value, key) in board.analysis">
        <span>{{ key + ': ' + value + '人选'}}</span>
      </div>

      <div class="control" v-if="board.question && !board.answer && !board.rightAnswer">
        <button class="btn btn-always" @click="checkAnswer(board.question.choices[1])">A: {{ board.question.choices[1] }}</button>
        <button class="btn btn-newb" @click="checkAnswer(board.question.choices[2])">B: {{ board.question.choices[2] }}</button>
        <button class="btn btn-ghost" @click="checkAnswer(board.question.choices[3])">C: {{ board.question.choices[3] }}</button>
      </div>

      <div  class="control" v-if="userInfo && !userInfo.isAlive && userInfo.actionAskRecovery">
        <button class="btn btn-active" @click="recovery('yes')">复活</button>
        <button class="btn btn-die" @click="recovery('no')">死吧</button>
      </div>
    </div>


    <div class="control" v-if="!userId || !userInfo">
      <input type="text" class="input-userid" placeholder="user id" v-model="userId">
      <button class="btn btn-active" @click="enterGame()">加入游戏</button>
    </div>
    <div v-else>
      <button class="btn btn-die" @click="exitGame()">退出游戏</button>
    </div>
  </div>
</template>

<script>
  import http from 'axios'

  export default {
    name: 'game-board',
    data () {
      return {
        board: null,
        userId: '',
        userInfo: null
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
        let that = this
        http.post('http://127.0.0.1:3000/api/checkAnswer', {
          userId: that.userId,
          questionId: that.board.question.questionId,
          choice
        }).then(function (res) {
          console.log(res.data)
        })
      },
      recovery (code) {
        console.log('recovery:', code)
        http.post('http://127.0.0.1:3000/api/recovery', {
          userId: this.userId,
          code
        })
      },
      exitGame () {
        this.userId = ''
        this.userInfo = null
      },
      enterGame () {
        if (this.userId.length > 0) {
          let that = this
          console.log('enterGame, reset for ', this.userId)
          http.post('http://127.0.0.1:3000/api/enterGame', {
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
    }
  }
</script>

<style scoped>
.tip {
  margin: 5px;
  padding: 5px;
  border: 2px solid gold;
  background-color: palegoldenrod;
}

  .question {
    background-color: gray;
    border: 1px solid black;
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

  .input-userid {
    height: .8rem;
    margin: 0;
    padding: 0;
    margin-right: -10px;
  }

</style>
