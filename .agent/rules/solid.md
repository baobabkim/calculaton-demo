# SOLID 원칙

## 개요
이 프로젝트의 모든 코어 로직은 **SOLID 원칙**을 준수하여 구현해야 합니다.

SOLID는 객체지향 설계의 5가지 핵심 원칙으로, 유지보수가 쉽고 확장 가능한 코드를 작성하기 위한 지침입니다.

---

## 1. SRP (Single Responsibility Principle)
### 단일 책임 원칙

> 클래스는 하나의 책임만 가져야 하며, 변경의 이유도 하나여야 한다.

### ✅ Good Example
```javascript
// 각 클래스가 하나의 책임만 가짐
class Calculator {
  evaluate(expression) {
    return math.evaluate(expression);
  }
}

class HistoryManager {
  addEntry(expression, result) {
    this.history.push({ expression, result });
  }
}

class StorageManager {
  save(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  }
}
```

### ❌ Bad Example
```javascript
// 하나의 클래스가 너무 많은 책임을 가짐
class Calculator {
  evaluate(expression) { }
  saveHistory(expr, result) { }
  loadHistory() { }
  updateUI() { }  // UI 업데이트는 별도 클래스의 책임
}
```

---

## 2. OCP (Open/Closed Principle)
### 개방-폐쇄 원칙

> 소프트웨어 엔티티는 확장에는 열려 있어야 하고, 수정에는 닫혀 있어야 한다.

### ✅ Good Example
```javascript
// 새로운 연산을 추가할 때 기존 코드 수정 불필요
class Operation {
  execute(a, b) {
    throw new Error('Must implement execute');
  }
}

class Addition extends Operation {
  execute(a, b) {
    return a + b;
  }
}

class Multiplication extends Operation {
  execute(a, b) {
    return a * b;
  }
}

class Calculator {
  constructor() {
    this.operations = new Map();
  }
  
  registerOperation(symbol, operation) {
    this.operations.set(symbol, operation);
  }
  
  calculate(a, symbol, b) {
    const operation = this.operations.get(symbol);
    return operation.execute(a, b);
  }
}
```

### ❌ Bad Example
```javascript
// 새로운 연산 추가 시 기존 코드 수정 필요
class Calculator {
  calculate(a, symbol, b) {
    if (symbol === '+') return a + b;
    if (symbol === '-') return a - b;
    // 새 연산 추가 시 이 함수를 계속 수정해야 함
  }
}
```

---

## 3. LSP (Liskov Substitution Principle)
### 리스코프 치환 원칙

> 하위 타입은 상위 타입을 대체할 수 있어야 한다.

### ✅ Good Example
```javascript
class MathFunction {
  calculate(value) {
    throw new Error('Must implement calculate');
  }
}

class SquareFunction extends MathFunction {
  calculate(value) {
    return value * value;
  }
}

class SquareRootFunction extends MathFunction {
  calculate(value) {
    if (value < 0) throw new Error('Cannot calculate square root of negative number');
    return Math.sqrt(value);
  }
}

// 모든 MathFunction 하위 클래스는 동일한 인터페이스 사용
function applyFunction(func, value) {
  return func.calculate(value);
}
```

### ❌ Bad Example
```javascript
class MathFunction {
  calculate(value) {
    return value * 2;
  }
}

class SquareFunction extends MathFunction {
  // 부모와 다른 시그니처 사용 (LSP 위반)
  calculate(value, exponent) {
    return Math.pow(value, exponent);
  }
}
```

---

## 4. ISP (Interface Segregation Principle)
### 인터페이스 분리 원칙

> 클라이언트는 사용하지 않는 인터페이스에 의존하면 안 된다.

### ✅ Good Example
```javascript
// 작고 구체적인 인터페이스
class Evaluator {
  evaluate(expression) { }
}

class AngleConverter {
  setAngleMode(mode) { }
  convertAngle(value) { }
}

class MemoryManager {
  memoryClear() { }
  memoryAdd(value) { }
  memoryRecall() { }
}

// 필요한 기능만 사용
class ScientificCalculator {
  constructor(evaluator, angleConverter) {
    this.evaluator = evaluator;
    this.angleConverter = angleConverter;
  }
}
```

### ❌ Bad Example
```javascript
// 너무 큰 인터페이스
class Calculator {
  evaluate(expression) { }
  setAngleMode(mode) { }
  memoryClear() { }
  memoryAdd(value) { }
  saveHistory() { }
  loadHistory() { }
  updateTheme() { }
  // 모든 클라이언트가 이 모든 메서드를 필요로 하지 않음
}
```

---

## 5. DIP (Dependency Inversion Principle)
### 의존성 역전 원칙

> 고수준 모듈은 저수준 모듈에 의존하면 안 되며, 둘 다 추상화에 의존해야 한다.

### ✅ Good Example
```javascript
// 추상화(인터페이스)에 의존
class Calculator {
  constructor(mathEngine, storage) {
    this.mathEngine = mathEngine;  // 추상화
    this.storage = storage;          // 추상화
  }
  
  evaluate(expr) {
    const result = this.mathEngine.evaluate(expr);
    this.storage.save('lastResult', result);
    return result;
  }
}

// 구체적인 구현
class MathJSEngine {
  evaluate(expr) {
    return math.evaluate(expr);
  }
}

class LocalStorageAdapter {
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

// 의존성 주입
const calc = new Calculator(
  new MathJSEngine(),
  new LocalStorageAdapter()
);
```

### ❌ Bad Example
```javascript
// 구체적인 구현에 직접 의존
class Calculator {
  constructor() {
    this.mathEngine = new MathJSEngine();  // 강한 결합
    this.storage = localStorage;            // 강한 결합
  }
  
  evaluate(expr) {
    const result = this.mathEngine.evaluate(expr);
    localStorage.setItem('lastResult', result);
    return result;
  }
}
```

---

## 프로젝트 적용 가이드

### 클래스 설계 체크리스트
- [ ] 각 클래스가 하나의 명확한 책임을 가지는가? (SRP)
- [ ] 새 기능 추가 시 기존 코드 수정이 필요한가? (OCP)
- [ ] 하위 클래스가 상위 클래스를 완전히 대체할 수 있는가? (LSP)
- [ ] 인터페이스가 너무 크지 않은가? (ISP)
- [ ] 구체적인 구현이 아닌 추상화에 의존하는가? (DIP)

### 리팩토링 신호
다음과 같은 코드 냄새가 보이면 SOLID 원칙을 적용하여 리팩토링:

1. **God Class**: 하나의 클래스가 너무 많은 일을 함 → SRP 위반
2. **Switch/If 폭발**: 조건문이 계속 늘어남 → OCP 위반
3. **타입 체크**: instanceof 또는 typeof 남발 → LSP 위반
4. **사용하지 않는 메서드**: 인터페이스가 너무 큼 → ISP 위반
5. **new 키워드 남발**: 직접 인스턴스 생성 → DIP 위반

### 예시: Calculator 모듈 구조

```javascript
// 추상화 (인터페이스 역할)
class IEvaluator {
  evaluate(expression) { throw new Error('Not implemented'); }
}

class IStorage {
  save(key, value) { throw new Error('Not implemented'); }
  load(key) { throw new Error('Not implemented'); }
}

// 구현
class MathJSEvaluator extends IEvaluator {
  evaluate(expression) {
    return math.evaluate(expression);
  }
}

class LocalStorageAdapter extends IStorage {
  save(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  
  load(key) {
    return JSON.parse(localStorage.getItem(key));
  }
}

// 고수준 모듈
class Calculator {
  constructor(evaluator, storage) {
    this.evaluator = evaluator;
    this.storage = storage;
  }
  
  evaluate(expression) {
    const result = this.evaluator.evaluate(expression);
    this.storage.save('lastResult', result);
    return result;
  }
}

// 의존성 주입
const calculator = new Calculator(
  new MathJSEvaluator(),
  new LocalStorageAdapter()
);
```

---

## 테스트와 SOLID

SOLID 원칙을 따르면 테스트가 쉬워집니다:

```javascript
// DIP 덕분에 Mock 객체 주입 가능
test('should save result to storage', () => {
  const mockStorage = {
    save: jest.fn()
  };
  
  const calc = new Calculator(
    new MathJSEvaluator(),
    mockStorage
  );
  
  calc.evaluate('2 + 2');
  
  expect(mockStorage.save).toHaveBeenCalledWith('lastResult', 4);
});
```

---

## 금지 사항

❌ **피해야 할 패턴**
1. God Class (모든 것을 하는 클래스)
2. 긴 메서드 (10줄 이상)
3. 깊은 중첩 (3단계 이상)
4. 전역 변수 사용
5. 하드코딩된 의존성

✅ **권장 패턴**
1. 작고 집중된 클래스
2. 의존성 주입
3. 팩토리 패턴
4. 전략 패턴
5. 명확한 인터페이스

---

**중요**: SOLID 원칙은 과도하게 적용하면 오히려 복잡도가 증가할 수 있습니다. 
프로젝트 규모와 요구사항에 맞게 적절히 적용하세요.
