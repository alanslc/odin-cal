const MAX_DIGIT = 15;
const cal = new Calculator();

let n = 123456.789;
n = n * n;
n = n * n;
let nn = new Num(n);
console.log(nn.toString());

function Calculator() {
   const INPUT_STATUE_NONE = 0;
   const INPUT_STATUE_LEFT_OPERAND = 1;
   const INPUT_STATUE_RIGHT_OPERAND = 2;

   this.leftOperand = null;
   this.rightOperand = null;
   this.op = null;
   this.inputState = INPUT_STATUE_NONE;

   this.init = function () {
      const pad = document.querySelector('.pad');
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
      switch (this.inputState) {
         case INPUT_STATUE_LEFT_OPERAND:
            s = this.leftOperand.toString(); break;
         case INPUT_STATUE_RIGHT_OPERAND:
            s = this.rightOperand.toString(); break;
         default:
            s = '0';
      }
      disp.innerText = s == '' ? '0' : s;
   };

   this.keyPressedByMouse = function (e) {
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

   this.doOperation = function (opKey) {
      if (this.inputState = INPUT_STATUE_NONE) {
         // No operand input, set 0 as left operand.
         this.leftOperand = new Num();
         this.op = opKey;
         this.inputState = INPUT_STATUE_LEFT_OPERAND;
         return;
      }

      // From now on, has operand.
      if (this.op == null) {
         // No pervious operator, but has operand.
         this.op = opKey;
         this.inputState = INPUT_STATUE_RIGHT_OPERAND;
         this.rightOperand = new Num();
      }
      // Previously has an operator, there are two possibilities:
      // 1) 123 op 123 [now], then calculate it.
      // 2) 123 op [now], then change the operator to this one.
      else if (!this.rightOperand.isNull()) {
         // This is case 1
         // Alerady is "left op right", this new operator make the forumla evaluate.
         // left op right => result newOp
         const result = this.operate(this.leftOperand.toNumber(), this.rightOperand.toNumber(), this.op);
         this.op = opKey;
         this.leftOperand = new Num(result);
         // Display the result
         this.inputState = INPUT_STATUE_LEFT_OPERAND;
         this.display();
         // Next input will be right operand
         this.rightOperand = new Num();
         this.inputState = INPUT_STATUE_RIGHT_OPERAND;
      } else {
         // This is case 2
         // If new op is =, next number input will be as left operand, otherwise will be as right operand
         this.inputState = opKey == 'equ' ? INPUT_STATUE_LEFT_OPERAND : INPUT_STATUE_RIGHT_OPERAND;
         this.op = opKey;
      }
   };

   this.pressNum = function (num) {
      if (this.inputState == INPUT_STATUE_NONE) {
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
      if (this.inputState == INPUT_STATUE_NONE) {
         this.leftOperand = new Num();
         this.inputState = INPUT_STATUE_LEFT_OPERAND;
      }

      const operand = this.inputState == INPUT_STATUE_LEFT_OPERAND ? this.leftOperand : this.rightOperand;
      operand.dot();
      this.display();
   };

   this.pressSign = function () {
      if (this.inputState != INPUT_STATUE_NONE) {
         const operand = this.inputState == INPUT_STATUE_LEFT_OPERAND ? this.leftOperand : this.rightOperand;
         operand.toggleSign();
         this.display();
      }
   };

   this.pressDel = function () {
      if (this.inputState != INPUT_STATUE_NONE) {
         const operand = this.inputState == INPUT_STATUE_LEFT_OPERAND ? this.leftOperand : this.rightOperand;
         operand.removeDigit();
         if (operand.isNull())
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
      if (this.mode != INPUT_FRACTION_MODE && this.intPart)
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