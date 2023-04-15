const {  default: Calculator } = require('./calculator.ts');

describe('Calculator', () => {
  let calculator: typeof Calculator;

  beforeEach(() => {
    calculator = new Calculator();
  });

  test('adds 1 + 2 to equal 3', () => {
    const expression = '1 + 2 =';
    const result = parseFloat(calculator.evaluate(expression));
    expect(result).toBe(3);
  });

  test('multiline expresion', () => {
    const expression = '2 + 45 =';
    const result = parseFloat(calculator.evaluate(expression));
    expect(result).toBe(47);
    const resultNext = parseFloat(calculator.evaluate('* 2 ='));
    expect(resultNext).toBe(94);
    const resultNext1 = parseFloat(calculator.evaluate('/ 2 ='));
    expect(resultNext1).toBe(47);
    const resultNext2 = parseFloat(calculator.evaluate('+ 2 + 3 * 2 ='));
    expect(resultNext2).toBe(55);
    const resultNext3 = parseFloat(calculator.evaluate('! ='));
    expect(resultNext3).toBe(-55);
  });

  test('should evaluate a valid expression', () => {
    const expression = '2 + 3 * 4 =';
    const result = parseFloat(calculator.evaluate(expression));
    expect(result).toBe(14);
  });

  test('should handle division by zero', () => {
    const expression = '5 / 0 =';
    const result = calculator.evaluate(expression);
    expect(result).toBe('Error: Invalid expression \ndivision by zero');
  });

  test('should handle invalid expressions', () => {
    const expression = '2 + x =';
    const result = calculator.evaluate(expression);
    expect(result).toBe('Error: Invalid expression \nexpression is not a valid artihmetic expression');
  });

  test('should handle compute state not being empty', () => {
    const expression1 = '2 + 3 =';
    const result1 = parseFloat(calculator.evaluate(expression1))
    expect(result1).toBe(5);
    const expression2 = '2 + 3 =';
    const result2 = calculator.evaluate(expression2);
    expect(result2).toBe('Error: Invalid expression \ncompute state is not empty. Please clear the state first');
  });

  test('should handle clear operator', () => {
    const expression1 = '2 + 3 =';
    const result1 = parseFloat(calculator.evaluate(expression1));
    expect(result1).toBe(5);
    const expression2 = 'c';
    const result2 = calculator.evaluate(expression2);
    expect(result2).toBe('0');
  });
});
