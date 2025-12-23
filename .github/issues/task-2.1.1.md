## 📋 작업 배경

계산기의 핵심 기능인 기본 산술 연산(덧셈, 뺄셈, 곱셈, 나눗셈)을 구현합니다. 이는 모든 계산 기능의 기반이 되는 가장 중요한 작업입니다.

**TDD 방식**으로 개발하여 코드 품질을 보장하고, **SOLID 원칙**을 적용하여 확장 가능한 구조를 만듭니다.

## 🎯 작업 내용

### 1. 🔴 Red: 테스트 작성

**파일**: `tests/calculator.test.js`

- [ ] 테스트 파일 생성
- [ ] 덧셈 테스트 작성
  ```javascript
  test('should add two numbers', () => {
    expect(calc.evaluate('2 + 3')).toBe('5');
  });
  ```
- [ ] 뺄셈 테스트 작성
  ```javascript
  test('should subtract two numbers', () => {
    expect(calc.evaluate('10 - 5')).toBe('5');
  });
  ```
- [ ] 곱셈 테스트 작성
  ```javascript
  test('should multiply two numbers', () => {
    expect(calc.evaluate('3 × 4')).toBe('12');
  });
  ```
- [ ] 나눗셈 테스트 작성
  ```javascript
  test('should divide two numbers', () => {
    expect(calc.evaluate('15 ÷ 3')).toBe('5');
  });
  ```
- [ ] 엣지 케이스 테스트
  - [ ] 0으로 나누기 → "Error"
  - [ ] 소수점 계산
  - [ ] 음수 계산

### 2. 🟢 Green: 최소 구현

**파일**: `src/scripts/calculator.js`

- [ ] Calculator 클래스 생성
  ```javascript
  class Calculator {
    constructor(mathEngine) {
      this.mathEngine = mathEngine;
    }
    
    evaluate(expression) {
      // 구현
    }
  }
  ```
- [ ] Math.js 통합
  - [ ] Math.js import
  - [ ] 수식 평가 로직
- [ ] evaluate() 메서드 구현
  - [ ] 수식 파싱
  - [ ] 계산 실행
  - [ ] 결과 반환
- [ ] 오류 처리 (0으로 나누기)

### 3. 🔵 Refactor: SOLID 원칙 적용

- [ ] **SRP (단일 책임)**: Calculator는 계산만 담당
- [ ] **DIP (의존성 역전)**: Math.js를 의존성 주입으로 변경
  ```javascript
  // Bad
  class Calculator {
    constructor() {
      this.math = math; // 직접 의존
    }
  }
  
  // Good
  class Calculator {
    constructor(mathEngine = math) {
      this.mathEngine = mathEngine; // 주입받음
    }
  }
  ```
- [ ] 테스트 가능성 향상 (Mock 사용 가능)
- [ ] 코드 정리 및 주석 추가

## ✅ 인수 조건 (Acceptance Criteria)

### 기능 요구사항
- [ ] 덧셈 연산이 정확하게 동작 (예: `2 + 3` = `5`)
- [ ] 뺄셈 연산이 정확하게 동작 (예: `10 - 5` = `5`)
- [ ] 곱셈 연산이 정확하게 동작 (예: `3 × 4` = `12`)
- [ ] 나눗셈 연산이 정확하게 동작 (예: `15 ÷ 3` = `5`)
- [ ] 0으로 나누기 시 "Error" 반환
- [ ] 소수점 계산 지원 (예: `1.5 + 2.5` = `4`)
- [ ] 음수 계산 지원 (예: `-5 + 3` = `-2`)

### 테스트 요구사항
- [ ] 모든 테스트 통과 (`npm test`)
- [ ] 코드 커버리지 100%
- [ ] 엣지 케이스 모두 커버

### 코드 품질 요구사항
- [ ] ESLint 규칙 준수 (`npm run lint`)
- [ ] SOLID 원칙 적용 확인
- [ ] 의존성 주입 패턴 사용
- [ ] 주석 및 문서화 완료

## 📊 예상 시간

**2-3시간**

- 테스트 작성: 1시간
- 구현: 1시간
- 리팩토링: 30분-1시간

## 🔗 관련 문서

- [ROADMAP.md - Task 2.1.1](../docs/ROADMAP.md)
- [TDD Guidelines](../.agent/rules/tdd.md)
- [SOLID Principles](../.agent/rules/solid.md)
- [Tech Spec](../docs/TECH_SPEC.md)

## 🏷️ Labels

`enhancement` `tdd` `core-logic` `phase-2`

## 📌 Milestone

Phase 2: 코어 로직 구현
