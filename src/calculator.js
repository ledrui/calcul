"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var readline = require('readline');
var Calculator = /** @class */ (function () {
    function Calculator() {
        this.operationMap = {
            '+': function (a, b) { return a + b; },
            '-': function (a, b) { return a - b; },
            '*': function (a, b) { return a * b; },
            '/': function (a, b) { return a / b; },
        };
        this.currentDisplay = '0';
        this.operator = null;
        this.tempResult = null;
    }
    Calculator.prototype.isValidExpression = function (expression) {
        var arithmeticRegex = /^[\d\s()+\-*/.%]+$/;
        return arithmeticRegex.test(expression);
    };
    Calculator.prototype.clear = function () {
        this.currentDisplay = '0';
        this.operator = null;
        this.tempResult = null;
    };
    Calculator.prototype.evaluate = function (expression) {
        var _a;
        // get the first character of the expression
        if (isNaN(parseFloat(expression[0]))) {
            this.operator = expression[0];
            expression = expression.slice(1);
        }
        if (this.operator === 'c') {
            this.clear();
            return this.currentDisplay;
        }
        if (this.operator === '!') {
            this.tempResult = this.tempResult !== null ? -1 * this.tempResult : null;
            this.currentDisplay = (_a = this.tempResult) === null || _a === void 0 ? void 0 : _a.toString();
            return parseFloat(this.currentDisplay);
        }
        if (['='].includes(this.operator) && this.tempResult !== null) {
            this.operator = null;
            return this.tempResult.toString();
        }
        var equalSign = expression.indexOf('=') !== -1;
        if (equalSign) {
            expression = expression.slice(0, expression.indexOf('='));
            if (!expression) {
                return this.tempResult.toString();
            }
        }
        if (!this.isValidExpression(expression)) {
            return "Error: Invalid expression \nexpression is not a valid artihmetic expression";
        }
        if (this.operator === '/' && expression === '0') {
            return "Error: Invalid expression \ndivision by zero";
        }
        console.log("this.operator:", this.operator);
        console.log("expression:", expression);
        expression = expression.split(/([+\-*\/^]|[0-9.]+|\w+)/).filter(function (item) { return item !== ''; }).join('');
        if (this.operator === null) {
            if (this.tempResult === null) {
                this.tempResult = eval(expression);
            }
            else {
                return "Error: Invalid expression \ncompute state is not empty. Please clear the state first";
            }
        }
        else {
            if (['*', '/'].includes(this.operator)) {
                var frontDigit = expression.split(/[+\-*\/]/)[0];
                this.tempResult = this.operationMap[this.operator](this.tempResult, parseFloat(frontDigit));
                // slice the front digit
                expression = expression.slice(frontDigit.length);
                if (!expression || expression.length === 0) {
                    this.currentDisplay = this.tempResult.toString();
                    return this.currentDisplay;
                }
            }
            else if (['+', '-'].includes(this.operator)) {
                console.log("expression:", expression);
                var evaluated = eval(expression);
                if (evaluated === Infinity) {
                    return "Error: Invalid expression \ndivision by zero";
                }
                console.log("evaluated:", evaluated);
                this.tempResult = this.operationMap[this.operator](this.tempResult, parseFloat(evaluated));
            }
            else if (this.operator === '=' && this.tempResult !== null) {
                this.currentDisplay = this.tempResult.toString();
                this.operator = null;
            }
            else {
                this.operator = null;
                return "Error: Invalid expression \noperator is not valid";
            }
        }
        if (equalSign || ['='].includes(this.operator)) {
            this.operator = null;
            this.currentDisplay = this.tempResult.toString();
        }
        else {
            this.currentDisplay = expression;
        }
        return this.currentDisplay;
    };
    // Define a function to handle user input and output results
    Calculator.prototype.handleInput = function () {
        var _this = this;
        // Create a readline interface for reading user input
        var rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        // Prompt the user for input and handle each line of input
        rl.prompt();
        rl.on('line', function (input) {
            input = input.trim();
            if (input === 'q' || input === 'quit') {
                rl.close();
            }
            else if (input === '') {
                console.log(_this.currentDisplay);
            }
            else {
                // Evaluate the expression and display the result
                var result = _this.evaluate(input);
                console.log(result);
                rl.prompt();
            }
        });
    };
    Calculator.prototype.run = function () {
        this.handleInput();
    };
    return Calculator;
}());
exports.default = Calculator;
