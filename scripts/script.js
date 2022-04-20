const MAX_DIGIT = 16;

const cal = new Calculator();

function Calculator() {
   this.leftOperand = null;
   this.rightOperand = null;
   this.op = null;
   this.displayNumber = 0;

   this.init = function() {

   };
   
   this.display = function() {
      const disp = document.querySelector('.disp');
      disp.innerText = this.displayNumber;
   };

   this.display();

   this.keyPressed = function() {

   };
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
      return this;
   }

   this.removeDigit = function () {
      return this;
   }

   this.toggleSign = function () {
      this.sign = this.sign ? '-' : '';
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