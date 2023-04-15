const readline = require('readline');

type Operator = '+' | '-' | '*' | '/' | 'c' | '!' | '=';

interface historyItem {
    leftOperand: string;
    rightOperand: string;
    operator: Operator;
}

class Calculator {
    private currentDisplay: string | undefined; 
    private operator: Operator | null;
    private tempResult: number | null;
    private result: number | null;

    constructor() {
        this.currentDisplay = '0';
        this.operator = null;
        this.tempResult = null;
    }

    private operationMap: { [key: string]: (a: number, b: number) => number } = {
        '+': (a: number, b: number) => a + b,
        '-': (a: number, b: number) => a - b,
        '*': (a: number, b: number) => a * b,
        '/': (a: number, b: number) => a / b,
    };

    private isValidExpression(expression: string): boolean {
      const arithmeticRegex = /^[\d\s()+\-*/.%]+$/;
      return arithmeticRegex.test(expression);
    }

    private clear(): void {
        this.currentDisplay = '0';
        this.operator = null;
        this.tempResult = null;
      }

    public evaluate(expression: string): string | number {
        // get the first character of the expression
        if (isNaN(parseFloat(expression[0]))) {
            this.operator = expression[0] as Operator;
            expression = expression.slice(1);
        }
        if (this.operator === 'c') {
            this.clear();
            return this.currentDisplay!;
        }
        if (this.operator === '!') {
            this.tempResult = this.tempResult !== null? -1 * this.tempResult!: null;
            this.currentDisplay = this.tempResult?.toString();
            return parseFloat(this.currentDisplay!);
        }
        if (['='].includes(this.operator!) && this.tempResult !== null) {
            this.operator = null;
            return this.tempResult.toString();
        }
        
        const equalSign: boolean = expression.indexOf('=') !== -1;
        if (equalSign) {
            expression = expression.slice(0, expression.indexOf('='));
            if (!expression) {
                return this.tempResult!.toString();
            }
        }
        if (!this.isValidExpression(expression)) {
            return `Error: Invalid expression \nexpression is not a valid artihmetic expression`;
        }
        if (this.operator === '/' && expression === '0') {
          return `Error: Invalid expression \ndivision by zero`;
        }

        expression = expression.split(/([+\-*\/^]|[0-9.]+|\w+)/).filter((item) => item !== '').join('');
        if (this.operator === null) {
          if (this.tempResult === null) {
              this.tempResult = eval(expression);
          } else {
            return `Error: Invalid expression \ncompute state is not empty. Please clear the state first`;
          }
        } else {
          if (['*', '/'].includes(this.operator)) {
            const frontDigit = expression.split(/[+\-*\/]/)[0];
            this.tempResult = this.operationMap[this.operator](this.tempResult!, parseFloat(frontDigit));
            // slice the front digit
            expression = expression.slice(frontDigit.length);
            if (!expression || expression.length === 0) {
              this.currentDisplay = this.tempResult!.toString();
              return this.currentDisplay!;
            }
          }
          else if (['+', '-'].includes(this.operator)) {
            const evaluated = eval(expression);
            if (evaluated === Infinity) {
              return `Error: Invalid expression \ndivision by zero`;
            }
            this.tempResult = this.operationMap[this.operator](this.tempResult!, parseFloat(evaluated));
          }
          else if (this.operator === '=' && this.tempResult !== null) {
            this.currentDisplay = this.tempResult!.toString();
            this.operator = null;
          }
          else {
            this.operator = null;
            return `Error: Invalid expression \noperator is not valid`;
          }
        }

        if (equalSign || ['='].includes(this.operator!)) {
          this.operator = null;
          this.currentDisplay = this.tempResult!.toString();
        } else {
          this.currentDisplay = expression;
        }

        return this.currentDisplay!;
      }

    // Define a function to handle user input and output results
      private handleInput() {
        // Create a readline interface for reading user input
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        // Prompt the user for input and handle each line of input
        rl.prompt();
        rl.on('line', (input: string) => {
            input = input.trim();
            if (input === 'q' || input === 'quit') {
                rl.close();
            } else if (input === '') {
                console.log(this.currentDisplay);
            } else {
            // Evaluate the expression and display the result
                const result = this.evaluate(input);
                console.log(result);
                rl.prompt();
            }
        });
    }

    public run() {
      this.handleInput();
    }
}
export default Calculator;
