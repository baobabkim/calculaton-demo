## 📋 작업 배경

사용자가 입력한 수식의 연산자 우선순위와 괄호를 올바르게 처리하여 정확한 계산 결과를 제공해야 합니다. 

예: `2 + 3 × 4`는 `14`가 되어야 하며 (곱셈 우선), `(2 + 3) × 4`는 `20`이 되어야 합니다 (괄호 우선).

## 🎯 작업 내용

### 1. 🔴 Red: 테스트 작성

**파일**: `tests/calculator.test.js`

- [ ] 연산자 우선순위 테스트
  ```javascript
  test('should respect operator precedence', () => {
    expect(calc.evaluate('2 + 3 × 4')).toBe('14'); // 곱셈 먼저
    expect(calc.evaluate('10 - 2 × 3')).toBe('4');  // 곱셈 먼저
  });
  ```
- [ ] 괄호 우선순위 테스트
  ```javascript
  test('should handle parentheses correctly', () => {
    expect(calc.evaluate('(2 + 3) × 4')).toBe('20');
    expect(calc.evaluate('2 × (3 + 4)')).toBe('14');
  });
  ```
- [ ] 중첩 괄호 테스트
  ```javascript
  test('should handle nested parentheses', () => {
    expect(calc.evaluate('((2 + 3) × 4) - 5')).toBe('15');
    expect(calc.evaluate('2 × (3 + (4 × 5))')).toBe('46');
  });
  ```
- [ ] 복잡한 수식 테스트
  ```javascript
  test('should handle complex expressions', () => {
    expect(calc.evaluate('12 + (35 × sin(45))')).toBeCloseTo(36.74, 2);
  });
  ```

### 2. 🟢 Green: 구현

**파일**: `src/scripts/calculator.js`

- [ ] Math.js의 수식 파싱 기능 활용
  - Math.js는 이미 연산자 우선순위와 괄호를 지원
- [ ] 수식 전처리 로직
  - [ ] 연산자 기호 변환 (× → *, ÷ → /)
  - [ ] 공백 제거
- [ ] 괄호 검증
  - [ ] 여는 괄호와 닫는 괄호 개수 일치 확인
  - [ ] 불일치 시 오류 처리

### 3. 🔵 Refactor: 코드 최적화

- [ ] 수식 전처리 함수 분리
  ```javascript
  preprocessExpression(expr) {
    return expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/\s/g, '');
  }
  ```
- [ ] 괄호 검증 함수 분리
  ```javascript
  validateParentheses(expr) {
    const open = (expr.match(/\(/g) || []).length;
    const close = (expr.match(/\)/g) || []).length;
    return open === close;
  }
  ```
- [ ] 유틸리티 함수로 이동 고려

## ✅ 인수 조건 (Acceptance Criteria)

### 기능 요구사항
- [ ] 곱셈/나눗셈이 덧셈/뺄셈보다 먼저 계산
- [ ] 괄호 내부가 먼저 계산
- [ ] 중첩 괄호 올바르게 처리
- [ ] 괄호 불일치 시 오류 처리
- [ ] 복잡한 수식 정확하게 계산

### 테스트 요구사항
- [ ] 모든 테스트 통과
- [ ] 코드 커버리지 100%
- [ ] 엣지 케이스 커버
  - [ ] 빈 괄호 `()`
  - [ ] 괄호만 있는 경우 `(((5)))`
  - [ ] 괄호 불일치 `(2 + 3`

### 코드 품질 요구사항
- [ ] 함수 분리 (전처리, 검증)
- [ ] 명확한 함수명
- [ ] 주석 추가

## 📊 예상 시간

**2시간**

## 🔗 관련 문서

- [ROADMAP.md - Task 2.1.2](../docs/ROADMAP.md)
- [TDD Guidelines](../.agent/rules/tdd.md)

## 🏷️ Labels

`enhancement` `tdd` `core-logic` `phase-2`

## 📌 Milestone

Phase 2: 코어 로직 구현
