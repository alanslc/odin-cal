const MAX_DIGIT = 15;
const cal = new Calculator();

function Calculator() {
   const INPUT_STATUE_NONE = 0;
   const INPUT_STATUE_LEFT_OPERAND = 1;
   const INPUT_STATUE_RIGHT_OPERAND = 2;

   this.leftOperand = null;
   this.rightOperand = null;
   this.op = null;
   this.inputState = INPUT_STATUE_NONE;
   this.error = false;

   this.init = function () {
      const body = document.querySelector('body');
      const pad = document.querySelector('.pad');
      body.addEventListener('keydown', this.keyDown.bind(this));
      pad.addEventListener('click', this.keyPressedByMouse.bind(this));

      this.leftOperand = new Num();
      this.rightOperand = new Num();
      this.op = null;
      this.inputState = INPUT_STATUE_NONE;
      this.display();
   };

   this.display = function () {
      const disp = document.querySelector('.disp');

      let s;
      if (this.error) {
         s = 'OOPS';
      }
      else {
         switch (this.inputState) {
            case INPUT_STATUE_LEFT_OPERAND:
               s = this.leftOperand.toString(); break;
            case INPUT_STATUE_RIGHT_OPERAND:
               s = this.rightOperand.toString(); break;
            default:
               s = '0';
         }
      }
      disp.innerText = s == '' ? '0' : s;
   };

   this.keyDown = function (e) {
      this.processInput(e.code);
   };

   this.keyPressedByMouse = function (e) {
      this.processInput(e.target.dataset.key);
   };

   this.keyPressedByMousex = function (e) {
      const btn = e.target;
      const key = btn.dataset.key;

      // 0 - 9
      if (btn.classList.contains('num')) {
         this.pressNum(key);
      }
      // + - * / =
      else if (btn.classList.contains('op')) {
         this.doOperation(key);
      }
      else if (key == 'dot') {
         this.pressDot();
      }
      else if (key == 'sign') {
         this.pressSign();
      }
      else if (key == 'del') {
         this.pressDel();
      }
      else if (key == 'ac') {
         this.pressAc();
      }
   };

   this.processInput = function (key) {
      const regexNumber = /^Digit|Numpad([\d]{1})$/;

      console.log(key);

      let match;
      if (match = key.match(regexNumber)) {
         this.pressNum(match[1]);
      }
      else if (key == 'NumpadDecimal' || key == 'Period') {
         this.pressDot();
      }
      else if (key == 'Minus') {
         this.pressSign();
      }
      else if (key == 'Backspace' || key == 'Delete') {
         this.pressDel();
      }
      else if (key == 'Escape') {
         this.pressAc();
      }
      else if (key == 'NumpadAdd') {
         this.doOperation('add');
      }
      else if (key == 'NumpadSubtract') {
         this.doOperation('sub');
      }
      else if (key == 'NumpadMultiply') {
         this.doOperation('mul');
      }
      else if (key == 'NumpadDivide') {
         this.doOperation('div');
      }
      else if (key == 'NumpadEnter' || key == 'Equal') {
         this.doOperation('equ');
      }
   };

   this.doOperation = function (opKey) {
      if (this.error)
         return;

      if (this.leftOperand.isNull()) {
         // No operand input, set 0 as left operand.
         this.leftOperand = new Num(0);
         this.op = opKey;
         this.inputState = INPUT_STATUE_RIGHT_OPERAND;
         return;
      }

      // From now on, has operand.
      if (this.op == null) {
         // No pervious operator, but has operand.
         this.op = opKey;
         this.inputState = INPUT_STATUE_RIGHT_OPERAND;
         this.rightOperand = new Num();
      }
      else {
         // Previously has an operator, there are two possibilities:
         // 1) 123 op 456 [now], then calculate it.
         // 2) 789 op [now], then change the operator to this one.
         if (!this.rightOperand.isNull()) {
            // This is case 1
            // Alerady is "left op right", this new operator make the forumla evaluate.
            // left op right => result newOp
            if (this.op == 'div' && this.rightOperand.toNumber() == 0) {
               this.error = true;
            } else {
               const result = this.operate(this.leftOperand.toNumber(), this.rightOperand.toNumber(), this.op);
               this.op = opKey;
               this.leftOperand = new Num(result);
               // Display the result
               this.inputState = INPUT_STATUE_LEFT_OPERAND;
            }
            this.display();
            this.rightOperand = new Num();
            // Next input will be right operand
            // this.inputState = INPUT_STATUE_RIGHT_OPERAND;
         }
         // After Case 1 calculation, it also will change to case 2.
         // 3 op 6 [now] => 18 [now]

         // This is case 2
         // If new op is =, set input status to none, when next number input, left operand will be recreate as empty,
         // to avoid clear the current left operand, and allow to change operator to others.
         // if new op is not =, next number input will be as right operand.
         this.inputState = opKey == 'equ' ? INPUT_STATUE_NONE : INPUT_STATUE_RIGHT_OPERAND;
         this.op = opKey;
      }
   };

   this.pressNum = function (num) {
      if (this.error)
         return;

      if (this.inputState == INPUT_STATUE_NONE) {
         // Clear for doOperation Case 2.
         // If not clear, will appear this case:
         // equ 123 mul, do Operator will try to calcaule 123 equ null
         this.op = null;
         this.leftOperand = new Num();
         this.inputState = INPUT_STATUE_LEFT_OPERAND;
      }

      const operand = this.inputState == INPUT_STATUE_LEFT_OPERAND ? this.leftOperand : this.rightOperand;
      if (operand.len() < MAX_DIGIT) {
         operand.inputDigit(num);
         this.display();
      }
   };

   this.pressDot = function () {
      if (this.error)
         return;

      if (this.inputState == INPUT_STATUE_NONE) {
         this.leftOperand = new Num();
         this.inputState = INPUT_STATUE_LEFT_OPERAND;
      }

      const operand = this.inputState == INPUT_STATUE_LEFT_OPERAND ? this.leftOperand : this.rightOperand;
      operand.dot();
      this.display();
   };

   this.pressSign = function () {
      if (this.error)
         return;

      if (this.inputState == INPUT_STATUE_NONE)
         this.inputState = INPUT_STATUE_LEFT_OPERAND;

      const operand = this.inputState == INPUT_STATUE_LEFT_OPERAND ? this.leftOperand : this.rightOperand;
      operand.toggleSign();
      this.display();
   };

   this.pressDel = function () {
      if (this.error)
         return;

      if (this.inputState != INPUT_STATUE_NONE) {
         const operand = this.inputState == INPUT_STATUE_LEFT_OPERAND ? this.leftOperand : this.rightOperand;
         operand.removeDigit();
         this.display();
      }
   };

   this.pressAc = function () {
      this.clearAll();
      this.display();
   };

   this.clearAll = function () {
      this.inputState = INPUT_STATUE_NONE;
      this.leftOperand = new Num();
      this.righttOperand = new Num();
      this.op = null;
      this.error = false;
   };

   this.operate = function (a, b, op) {
      return this[op](a, b);
   };

   this.add = function (a, b) {
      return a + b;
   };

   this.sub = function (a, b) {
      return a - b;
   };

   this.mul = function (a, b) {
      return a * b
   };

   this.div = function (a, b) {
      return a / b;
   };

   // init
   this.init();
}

function Num(n) {
   const INPUT_INT_MODE = 0;
   const INPUT_FRACTION_MODE = 1;
   const INPUT_LOCKED = 2;

   this.mode = INPUT_INT_MODE;
   this.sign = '';
   this.intPart = '';
   this.fraction = '';
   this.exponent = '';

   this.len = function () {
      return this.intPart.length + this.fraction.length;
   };

   this.dot = function () {
      if (this.mode == INPUT_LOCKED)
         return;

      if (this.intPart == '')
         this.intPart = '0';
      this.mode = INPUT_FRACTION_MODE;
   };

   this.inputDigit = function (ch) {
      if (this.mode == INPUT_LOCKED || ch == null || ch == undefined || isNaN(ch))
         return;

      if (ch == '0') {
         if (this.mode == INPUT_FRACTION_MODE)
            this.fraction += ch;
         else if (!this.intPart.startsWith('0'))
            this.intPart += '0';
      } else if (ch >= 1 && ch <= 9) {
         if (this.mode == INPUT_INT_MODE)
            this.intPart += ch;
         else
            this.fraction += ch;
      }

      return this;
   };

   this.removeDigit = function () {
      if (this.mode == INPUT_LOCKED)
         return;

      if (this.mode == INPUT_FRACTION_MODE) {
         if (this.fraction.length > 0) {
            if (this.fraction.length == 1)
               this.mode = INPUT_INT_MODE;
            this.fraction = removeLast(this.fraction);
         }
      } else if (this.mode == INPUT_INT_MODE) {
         if (this.intPart.length > 0) {
            if (this.intPart.length == 1)
               this.sign = '';
            this.intPart = removeLast(this.intPart);
         }
      }
      return this;
   };

   this.toggleSign = function () {
      if (this.mode == INPUT_LOCKED)
         return;

      if (this.intPart > 0 || this.fraction > 0)
         this.sign = this.sign ? '' : '-';
   };

   this.isNull = function () {
      return this.intPart == '';
   };

   this.toString = function () {
      if (this.intPart == '')
         return '';

      let s = this.sign + this.intPart;
      if (this.fraction.length > 0)
         s += '.' + this.fraction;
      if (this.exponent.length > 0)
         s += 'e' + this.exponent;

      return s;
   };

   this.toNumber = function () {
      return Number(this.toString());
   };

   this.convert = function (n) {
      if (!isFinite(n))
         return;

      let num = Math.log10(n) >= MAX_DIGIT ? n.toExponential() : n;

      // match pattern -123.456e-78
      const re = /([-]?)(\d*)\.*(\d*)e?([+-]?\d*)/i;
      const parts = num.toString().match(re);

      [, this.sign, this.intPart, this.fraction, this.exponent] = [...parts];

      // Depend on the Math.log10(n) line to make sure intPart.length <= MAX_DIGIT
      if (this.len() > MAX_DIGIT)
         this.fraction = this.fraction.substring(0, (MAX_DIGIT - this.intPart.length));
      // this.mode = INPUT_LOCKED;
   };

   function removeLast(s) {
      return s.length > 0 ? s.substring(0, s.length - 1) : '';
   };

   // init
   n != null && n != undefined && this.convert(n);
}