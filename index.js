const {shuffle} = _;
const {fromEvent, timer} = Rx.Observable;

class TibetanAlphabetTypingGame {

  constructor() {

    this.checkboxWylie = document.querySelector('#checkbox-wylie');
    this.checkboxZhuyin = document.querySelector('#checkbox-zhuyin');
    this.form = document.querySelector('#form');
    this.input = document.querySelector('#input');
    this.message = document.querySelector('#message');
    this.pad = document.querySelector('#pad');
    this.wylie = document.querySelector('#wylie');
    this.zhuyin = document.querySelector('#zhuyin');

    this.isFrozen = false;
    this.isWylieVisible = true;
    this.isZhuyinVisible = true;
    this.shakeDuration = 1000;
    this.successDuration = 1000;

    this.tibetanAlphabets = [
      {alphabet: 'ཀ', zhuyin: 'ㄍㄚ、', wylie: 'ka'},
      {alphabet: 'ཁ', zhuyin: 'ㄎㄚ、', wylie: 'kha'},
      {alphabet: 'ག', zhuyin: 'ㄎㄚˊ', wylie: 'ga'},
      {alphabet: 'ང', zhuyin: 'nga', wylie: 'nga'},
      {alphabet: 'ཅ', zhuyin: 'ㄐㄧㄚˋ', wylie: 'ca'},
      {alphabet: 'ཆ', zhuyin: 'ㄑㄧㄚˋ', wylie: 'cha'},
      {alphabet: 'ཇ', zhuyin: 'ㄑㄧㄚˊ', wylie: 'ja'},
      {alphabet: 'ཉ', zhuyin: 'ㄋㄧㄚˊ', wylie: 'nya'},
      {alphabet: 'ཏ', zhuyin: 'ㄉㄚˋ', wylie: 'ta'},
      {alphabet: 'ཐ', zhuyin: 'ㄊㄚˋ', wylie: 'tha'},
      {alphabet: 'ད', zhuyin: 'ㄊㄚˊ', wylie: 'da'},
      {alphabet: 'ན', zhuyin: 'ㄋㄚˊ', wylie: 'na'},
      {alphabet: 'པ', zhuyin: 'ㄅㄚˋ', wylie: 'pa'},
      {alphabet: 'ཕ', zhuyin: 'ㄆㄚˋ', wylie: 'pha'},
      {alphabet: 'བ', zhuyin: 'ㄆㄚˊ', wylie: 'ba'},
      {alphabet: 'མ', zhuyin: 'ㄇㄚˊ', wylie: 'ma'},
      {alphabet: 'ཙ', zhuyin: 'ㄗㄚˋ', wylie: 'tsa'},
      {alphabet: 'ཚ', zhuyin: 'ㄘㄚˋ', wylie: 'tsha'},
      {alphabet: 'ཛ', zhuyin: 'ㄘㄚˊ', wylie: 'dza'},
      {alphabet: 'ཝ', zhuyin: 'ㄨㄚˊ', wylie: 'wa'},
      {alphabet: 'ཞ', zhuyin: 'ㄒㄧㄚˊ', wylie: 'zha'},
      {alphabet: 'ཟ', zhuyin: 'ㄙㄚˊ', wylie: 'za'},
      {alphabet: 'འ', zhuyin: 'ㄚˊ', wylie: '\'a'},
      {alphabet: 'ཡ', zhuyin: 'ㄧㄚˊ', wylie: 'ya'},
      {alphabet: 'ར', zhuyin: 'ㄖㄚˊ', wylie: 'ra'},
      {alphabet: 'ལ', zhuyin: 'ㄌㄚˊ', wylie: 'la'},
      {alphabet: 'ཤ', zhuyin: 'ㄒㄧㄚ、', wylie: 'sha'},
      {alphabet: 'ས', zhuyin: 'ㄙㄚ、', wylie: 'sa'},
      {alphabet: 'ཧ', zhuyin: 'ㄏㄚ、', wylie: 'ha'},
      {alphabet: 'ཨ', zhuyin: 'ㄚ、', wylie: 'a'}
    ];
  }

  showRandomAlphabet() {
    const {alphabet, zhuyin, wylie} = shuffle(this.tibetanAlphabets)[0];
    this.pad.textContent = alphabet;
    this.zhuyin.textContent = zhuyin;
    this.wylie.textContent = wylie;
  }

  setMessageType(type) {
    this.message.className = type;
    return this;
  }

  showMessage(message) {
    const hasMessage = !! message;
    this.message.textContent = message;
    this.message.setAttribute('aria-hidden', hasMessage ? 'false' : 'true');
    return this;
  }

  shake() {
    const self = this;
    self.form.classList.add('shake');

    timer(self.shakeDuration)
      .subscribe(() => self.form.classList.remove('shake'));
  }

  freeze() {
    this.isFrozen = true;
  }

  unfreeze() {
    this.isFrozen = false;
  }

  run() {
    const self = this;

    this.input.focus();
    this.checkboxZhuyin.checked = this.isZhuyinVisible;
    this.checkboxWylie.checked = this.isWylieVisible;

    this.form$ = fromEvent(this.form, 'submit');
    this.checkboxWylie$ = fromEvent(this.checkboxWylie, 'change');
    this.checkboxZhuyin$ = fromEvent(this.checkboxZhuyin, 'change');

    this.formSubscription = this.form$.do(event => event.preventDefault())
      .filter(() => self.input.value.trim().length > 0)
      .filter(() => ! self.isFrozen)
      .subscribe(() => {

        self.freeze();

        const answer = self.pad.textContent;

        if (self.input.value.trim() === answer) {

          self.setMessageType('success')
            .showMessage('Correct');

          timer(self.successDuration)
            .subscribe(() => {
              self.showMessage('');
              self.showRandomAlphabet();
              self.input.value = '';
              self.unfreeze();
            });
        }
        else {

          self.setMessageType('danger')
            .showMessage(`Wrong, please input ${answer}`);

          self.shake();
          self.unfreeze();
        }
      });

    this.checkboxZhuyinSubscription = this.checkboxZhuyin$.subscribe(() => {

      if (self.checkboxZhuyin.checked) {
        self.zhuyin.classList.remove('hidden');
      }
      else {
        self.zhuyin.classList.add('hidden');
      }
    });

    this.checkboxWylieSubscription = this.checkboxWylie$.subscribe(() => {

      if (self.checkboxWylie.checked) {
        self.wylie.classList.remove('hidden');
      }
      else {
        self.wylie.classList.add('hidden');
      }
    });

    this.showRandomAlphabet();
  }

  destroy() {
    this.formSubscription.unsubscribe();
    this.checkboxZhuyinSubscription.unsubscribe();
    this.checkboxWylieSubscription.unsubscribe();
  }
}

const game = new TibetanAlphabetTypingGame();

game.run();
