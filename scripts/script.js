const cal = new Calculator();

function Calculator() {
   const MAX_DIGIT = 16;
   const INPUT_STATUE_NONE = 0;
   const INPUT_STATUE_LEFT_OPERAND = 1;
   const INPUT_STATUE_RIGHT_OPERAND = 2;

   this.leftOperand = null;
   this.rightOperand = null;
   this.op = null;
   this.displayNumber = 0;
   this.inputState = INPUT_STATUE_NONE;

   this.init = function () {
      const pad = document.querySelector('.pad');
      pad.addEventListener('click', this.keyPressedByMouse.bind(this));

      this.leftOperand = null;
      this.rightOperand = null;
      this.op = null;
      this.displayNumber = new Num();
      this.inputState = INPUT_STATUE_NONE;
      this.display();
   };

   this.display = function () {
      const disp = document.querySelector('.disp');

      let n;
      switch (this.inputState) {
         case INPUT_STATUE_LEFT_OPERAND:
            n = this.leftOperand; break;
         case INPUT_STATUE_RIGHT_OPERAND:
            n = this.rightOperand; break;
         default:
            n = new Num();
      }
      disp.innerText = n.toString();
      console.log('display')
   };

   this.keyPressedByMouse = function (e) {
      const btn = e.target;
      if (btn.classList.contains('num')) {
         if (this.inputState == INPUT_STATUE_NONE) {
            this.leftOperand = new Num();
            this.inputState = INPUT_STATUE_LEFT_OPERAND;
         }

         if (this.inputState == INPUT_STATUE_LEFT_OPERAND) {
            if (this.leftOperand.len() < MAX_DIGIT) {
               this.leftOperand.inputDigit(btn.dataset.key);
               this.display();
            }
         }
         // this.displayNumber = buttonPressed.dataset.key;
      }
   };

   this.init();
}

function Num(intPart = '', fraction = '', sign = '') {
   this.inputIntPart = true;
   this.sign = '';
   this.intPart = '';
   this.fraction = ''

   this.len = function () {
      return this.intPart.length + this.fraction.length;
   };

   this.value = function () {
      return 0;
   }

   this.inputDigit = function (ch) {
      if (ch == null || ch == undefined || isNaN(ch))
         return;

      if (ch >= 0 && ch <= 9) {
         if (this.inputIntPart)
            this.intPart += ch;
         else
            this.fraction += ch;
      }
   }

   this.removeDigit = function () {
      return this;
   }

   this.toggleSign = function () {
      this.sign = this.sign ? '-' : '';
   }

   this.toString = function () {
      if (this.intPart == '')
         return '0';
      else
         return this.intPart;
   }
}

function operate(a, b, op) {
   let result;

   switch (op) {
      case '+':
         result = add(a, b);
         break;
      case '-':
         result = sub(a, b);
         break;
      case '*':
         result = mul(a, b);
         break;
      case '/':
         result = div(a, b);
         break;
      default:
   }

   return result;
}

function add(a, b) {

}

function sub(a, b) {

}

function mul(a, b) {

}

function div(a, b) {

}