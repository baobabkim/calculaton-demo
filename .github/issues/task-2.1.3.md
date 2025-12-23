## 📋 작업 배경

사용자가 잘못된 수식을 입력하거나 정의되지 않은 연산을 시도할 때 적절한 오류 메시지를 표시하여 사용자 경험을 개선합니다.

예: `1 / 0` → "Error", `sqrt(-1)` → "Error"

## 🎯 작업 내용

### 1. 🔴 Red: 테스트 작성

**파일**: `tests/calculator.test.js`

- [ ] 0으로 나누기 테스트
  ```javascript
  test('should return Error when dividing by zero', () => {
    expect(calc.evaluate('1 / 0')).toBe('Error');
    expect(calc.evaluate('10 ÷ 0')).toBe('Error');
  });
  ```
- [ ] 정의되지 않은 연산 테스트
  ```javascript
  test('should return Error for undefined operations', () => {
    expect(calc.evaluate('sqrt(-1)')).toBe('Error');
    expect(calc.evaluate('log(-10)')).toBe('Error');
  });
  ```
- [ ] 잘못된 수식 테스트
  ```javascript
  test('should return Error for invalid expressions', () => {
    expect(calc.evaluate('2 + + 3')).toBe('Error');
    expect(calc.evaluate('invalid')).toBe('Error');
    expect(calc.evaluate('')).toBe('Error');
  });
  ```
- [ ] 오버플로우 테스트
  ```javascript
  test('should handle overflow', () => {
    const result = calc.evaluate('10^1000');
    expect(result).toMatch(/Error|Infinity/);
  });
  ```

### 2. 🟢 Green: 구현

**파일**: `src/scripts/calculator.js`

- [ ] try-catch 블록 추가
  ```javascript
  evaluate(expression) {
    try {
      const result = this.mathEngine.evaluate(expression);
      
      if (!isFinite(result)) {
        return 'Error';
      }
      
      if (isNaN(result)) {
        return 'Error';
      }
      
      return this.formatResult(result);
    } catch (error) {
      return 'Error';
    }
  }
  ```
- [ ] 무한대 검사
- [ ] NaN 검사
- [ ] 빈 수식 검사

### 3. 🔵 Refactor: 오류 타입 분리

- [ ] CalculationError 클래스 생성
  ```javascript
  class CalculationError extends Error {
    constructor(type, message) {
      super(message);
      this.type = type;
    }
  }
  ```
- [ ] 오류 타입 정의
  ```javascript
  const ERROR_TYPES = {
    SYNTAX_ERROR: 'syntax',
    MATH_ERROR: 'math',
    OVERFLOW: 'overflow'
  };
  ```
- [ ] 오류 타입별 처리 (향후 확장 가능)

## ✅ 인수 조건 (Acceptance Criteria)

### 기능 요구사항
- [ ] 0으로 나누기 시 "Error" 반환
- [ ] 음수의 제곱근 시 "Error" 반환
- [ ] 잘못된 수식 시 "Error" 반환
- [ ] 빈 수식 시 "Error" 반환
- [ ] 무한대/NaN 시 "Error" 반환
- [ ] 애플리케이션 크래시 없음

### 테스트 요구사항
- [ ] 모든 오류 케이스 테스트 통과
- [ ] 코드 커버리지 100%
- [ ] 예외 상황 모두 커버

### 코드 품질 요구사항
- [ ] 명확한 오류 처리 로직
- [ ] 사용자 친화적 오류 메시지
- [ ] 확장 가능한 오류 타입 구조

## 📊 예상 시간

**1-2시간**

## 🔗 관련 문서

- [ROADMAP.md - Task 2.1.3](../docs/ROADMAP.md)
- [TDD Guidelines](../.agent/rules/tdd.md)

## 🏷️ Labels

`enhancement` `tdd` `core-logic` `error-handling` `phase-2`

## 📌 Milestone

Phase 2: 코어 로직 구현
