/* ============================================================
   ALGOFORGE — assessment engine
   ============================================================ */

const QuizEngine = {
  level: null,
  questions: [],
  index: 0,
  selected: null,
  answers: [], // { chosen, correct }

  start(level) {
    this.level = level;
    this.questions = QUIZ_DATA[level];
    this.index = 0;
    this.selected = null;
    this.answers = [];
  },

  current() {
    return this.questions[this.index];
  },

  choose(optionIdx) {
    this.selected = optionIdx;
  },

  confirm() {
    const q = this.current();
    const correct = this.selected === q.answer;
    this.answers[this.index] = { chosen: this.selected, correct };
    return correct;
  },

  next() {
    if (this.index < this.questions.length - 1) {
      this.index++;
      this.selected = this.answers[this.index] ? this.answers[this.index].chosen : null;
      return true;
    }
    return false;
  },

  prev() {
    if (this.index > 0) {
      this.index--;
      this.selected = this.answers[this.index] ? this.answers[this.index].chosen : null;
      return true;
    }
    return false;
  },

  isLast() {
    return this.index === this.questions.length - 1;
  },

  score() {
    const correctCount = this.answers.filter(a => a && a.correct).length;
    return { score: correctCount, total: this.questions.length };
  }
};
