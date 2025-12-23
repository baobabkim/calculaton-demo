# Technical Specification Document
# 공학용 전자계산기 웹앱

## 문서 정보
- **버전**: 1.0
- **작성일**: 2025-12-23
- **관련 문서**: [PRD.md](file:///c:/Users/USER/calculaton-demo/PRD.md)
- **상태**: 검토 대기

---

## 목차
1. [기술 스택](#1-기술-스택)
2. [아키텍처 설계](#2-아키텍처-설계)
3. [컴포넌트 구조](#3-컴포넌트-구조)
4. [데이터 모델](#4-데이터-모델)
5. [계산 엔진](#5-계산-엔진)
6. [상태 관리](#6-상태-관리)
7. [스타일링 시스템](#7-스타일링-시스템)
8. [빌드 및 배포](#8-빌드-및-배포)
9. [테스트 전략](#9-테스트-전략)
10. [성능 최적화](#10-성능-최적화)

---

## 1. 기술 스택

### 1.1 프론트엔드 프레임워크
```json
{
  "framework": "Vanilla JavaScript (ES6+)",
  "alternative": "React (선택 사항)",
  "rationale": "가벼운 애플리케이션이므로 바닐라 JS로 충분, 필요시 React로 확장 가능"
}
```

**선택 이유:**
- 단일 페이지 애플리케이션으로 복잡도가 낮음
- 빠른 초기 로딩 시간
- 번들 크기 최소화
- 의존성 최소화

### 1.2 스타일링
```json
{
  "css_framework": "TailwindCSS v3.x",
  "cdn": "https://cdn.tailwindcss.com",
  "custom_config": true,
  "preprocessor": "PostCSS (선택 사항)"
}
```

**TailwindCSS 커스텀 설정:**
```javascript
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#135bec",
        "background-light": "#f6f6f8",
        "background-dark": "#101622",
        "surface-dark": "#1c222e",
        "surface-light": "#ffffff"
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"]
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        lg: "0.5rem",
        xl: "0.75rem",
        "2xl": "1rem",
        full: "9999px"
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        "inner-light": "inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)"
      }
    }
  }
}
```

### 1.3 폰트 및 아이콘
```json
{
  "fonts": {
    "primary": "Space Grotesk",
    "weights": [300, 400, 500, 600, 700],
    "source": "Google Fonts"
  },
  "icons": {
    "library": "Material Symbols Outlined",
    "icons_used": ["history", "settings", "backspace"]
  }
}
```

### 1.4 계산 라이브러리
**옵션 1: Math.js (권장)**
```json
{
  "library": "Math.js",
  "version": "^12.0.0",
  "features": [
    "정확한 부동소수점 연산",
    "수식 파싱 및 평가",
    "삼각함수, 로그, 지수 함수",
    "단위 변환 (DEG/RAD)"
  ],
  "cdn": "https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.0.0/math.min.js"
}
```

**옵션 2: 자체 구현**
```json
{
  "approach": "Custom Calculator Engine",
  "pros": ["번들 크기 최소화", "완전한 제어"],
  "cons": ["개발 시간 증가", "버그 가능성"],
  "recommendation": "MVP는 Math.js 사용, 이후 최적화 시 자체 구현 고려"
}
```

### 1.5 개발 도구
```json
{
  "package_manager": "npm",
  "bundler": "Vite (선택 사항)",
  "linter": "ESLint",
  "formatter": "Prettier",
  "version_control": "Git"
}
```

---

## 2. 아키텍처 설계

### 2.1 전체 아키텍처
```
┌─────────────────────────────────────────┐
│           User Interface (UI)           │
│  ┌─────────┐ ┌─────────┐ ┌───────────┐ │
│  │ Display │ │ Keypad  │ │  Header   │ │
│  └─────────┘ └─────────┘ └───────────┘ │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│         Application Controller          │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │ Event Handler│  │  State Manager  │ │
│  └──────────────┘  └─────────────────┘ │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│           Business Logic Layer          │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │ Calculator   │  │  History        │ │
│  │ Engine       │  │  Manager        │ │
│  └──────────────┘  └─────────────────┘ │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│            Data Layer (Storage)         │
│  ┌──────────────┐  ┌─────────────────┐ │
│  │ LocalStorage │  │  SessionStorage │ │
│  └──────────────┘  └─────────────────┘ │
└─────────────────────────────────────────┘
```

### 2.2 모듈 구조
```
src/
├── index.html              # 메인 HTML 파일
├── styles/
│   ├── main.css           # 메인 스타일시트
│   └── themes.css         # 테마 변수
├── scripts/
│   ├── main.js            # 애플리케이션 진입점
│   ├── calculator.js      # 계산 엔진
│   ├── ui.js              # UI 컨트롤러
│   ├── state.js           # 상태 관리
│   ├── history.js         # 히스토리 관리
│   ├── storage.js         # 로컬 스토리지 관리
│   └── utils.js           # 유틸리티 함수
└── assets/
    └── icons/             # 커스텀 아이콘 (필요시)
```

---

## 3. 컴포넌트 구조

### 3.1 UI 컴포넌트 계층
```javascript
App
├── Header
│   ├── HistoryButton
│   ├── ModeToggle (DEG/RAD)
│   └── SettingsButton
├── Display
│   ├── ExpressionDisplay
│   └── ResultDisplay
└── Keypad
    ├── ScientificKeys
    │   ├── MemoryKeys (mc, m+, m-, mr)
    │   ├── FunctionKeys (2nd, x², x³, xʸ)
    │   ├── MathKeys (1/x, √x, ln, log)
    │   └── TrigKeys (sin, cos, tan, e)
    └── StandardKeys
        ├── UtilityRow (AC, (, ), ÷)
        ├── NumberPad (0-9)
        └── OperatorKeys (+, -, ×, ÷, =)
```

### 3.2 컴포넌트 인터페이스

#### 3.2.1 Display Component
```javascript
class Display {
  constructor(expressionElement, resultElement) {
    this.expressionElement = expressionElement;
    this.resultElement = resultElement;
  }

  updateExpression(expression) {
    this.expressionElement.textContent = expression || '0';
  }

  updateResult(result) {
    this.resultElement.textContent = this.formatResult(result);
  }

  formatResult(value) {
    // 숫자 포맷팅 로직
    // - 소수점 자릿수 제한
    // - 큰 숫자는 과학적 표기법
    // - 오류 처리
  }

  clear() {
    this.updateExpression('');
    this.updateResult('0');
  }
}
```

#### 3.2.2 Calculator Engine
```javascript
class CalculatorEngine {
  constructor() {
    this.angleMode = 'DEG'; // 'DEG' or 'RAD'
    this.memory = 0;
    this.parser = null; // Math.js parser
  }

  setAngleMode(mode) {
    this.angleMode = mode;
  }

  evaluate(expression) {
    try {
      // 각도 모드에 따라 삼각함수 변환
      const processedExpression = this.preprocessExpression(expression);
      const result = this.parser.evaluate(processedExpression);
      return this.formatNumber(result);
    } catch (error) {
      return 'Error';
    }
  }

  preprocessExpression(expr) {
    // DEG 모드일 경우 각도를 라디안으로 변환
    if (this.angleMode === 'DEG') {
      expr = expr.replace(/sin\(([^)]+)\)/g, 'sin(($1) * pi / 180)');
      expr = expr.replace(/cos\(([^)]+)\)/g, 'cos(($1) * pi / 180)');
      expr = expr.replace(/tan\(([^)]+)\)/g, 'tan(($1) * pi / 180)');
    }
    return expr;
  }

  // 메모리 함수
  memoryClear() { this.memory = 0; }
  memoryAdd(value) { this.memory += value; }
  memorySubtract(value) { this.memory -= value; }
  memoryRecall() { return this.memory; }
}
```

#### 3.2.3 State Manager
```javascript
class StateManager {
  constructor() {
    this.state = {
      currentExpression: '',
      currentResult: '0',
      angleMode: 'DEG',
      theme: 'dark',
      history: [],
      memory: 0,
      secondMode: false
    };
    this.listeners = [];
  }

  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notifyListeners();
    this.saveToStorage();
  }

  getState() {
    return { ...this.state };
  }

  subscribe(listener) {
    this.listeners.push(listener);
  }

  notifyListeners() {
    this.listeners.forEach(listener => listener(this.state));
  }

  saveToStorage() {
    localStorage.setItem('calculatorState', JSON.stringify(this.state));
  }

  loadFromStorage() {
    const saved = localStorage.getItem('calculatorState');
    if (saved) {
      this.state = { ...this.state, ...JSON.parse(saved) };
    }
  }
}
```

#### 3.2.4 History Manager
```javascript
class HistoryManager {
  constructor(maxItems = 50) {
    this.maxItems = maxItems;
    this.history = [];
  }

  addEntry(expression, result) {
    const entry = {
      id: Date.now(),
      expression,
      result,
      timestamp: new Date().toISOString()
    };
    
    this.history.unshift(entry);
    
    if (this.history.length > this.maxItems) {
      this.history = this.history.slice(0, this.maxItems);
    }
    
    this.saveToStorage();
  }

  getHistory() {
    return [...this.history];
  }

  clearHistory() {
    this.history = [];
    this.saveToStorage();
  }

  saveToStorage() {
    localStorage.setItem('calculatorHistory', JSON.stringify(this.history));
  }

  loadFromStorage() {
    const saved = localStorage.getItem('calculatorHistory');
    if (saved) {
      this.history = JSON.parse(saved);
    }
  }
}
```

---

## 4. 데이터 모델

### 4.1 State Schema
```typescript
interface CalculatorState {
  currentExpression: string;      // 현재 입력 중인 수식
  currentResult: string;           // 현재 결과
  angleMode: 'DEG' | 'RAD';       // 각도 모드
  theme: 'light' | 'dark';        // 테마
  history: HistoryEntry[];         // 계산 히스토리
  memory: number;                  // 메모리 값
  secondMode: boolean;             // 2nd 모드 활성화 여부
}

interface HistoryEntry {
  id: number;                      // 고유 ID (timestamp)
  expression: string;              // 계산 수식
  result: string;                  // 계산 결과
  timestamp: string;               // ISO 8601 형식
}

interface Settings {
  theme: 'light' | 'dark' | 'auto';
  defaultAngleMode: 'DEG' | 'RAD';
  decimalPlaces: number;           // 소수점 자릿수 (기본: 10)
  hapticFeedback: boolean;         // 햅틱 피드백 (모바일)
}
```

### 4.2 LocalStorage 구조
```json
{
  "calculatorState": {
    "currentExpression": "12 + (35 × sin(45))",
    "currentResult": "36.74",
    "angleMode": "DEG",
    "theme": "dark",
    "memory": 0,
    "secondMode": false
  },
  "calculatorHistory": [
    {
      "id": 1703318400000,
      "expression": "12 + (35 × sin(45))",
      "result": "36.74",
      "timestamp": "2025-12-23T07:00:00.000Z"
    }
  ],
  "calculatorSettings": {
    "theme": "dark",
    "defaultAngleMode": "DEG",
    "decimalPlaces": 10,
    "hapticFeedback": true
  }
}
```

---

## 5. 계산 엔진

### 5.1 수식 파싱 전략

**Math.js 사용 시:**
```javascript
import { create, all } from 'mathjs';

const math = create(all);

// 커스텀 함수 정의
math.import({
  // 각도 변환
  deg: (x) => x * Math.PI / 180,
  rad: (x) => x,
  
  // 추가 함수
  factorial: (n) => {
    if (n === 0 || n === 1) return 1;
    return n * factorial(n - 1);
  }
}, { override: true });

// 수식 평가
const result = math.evaluate('sin(deg(45))');
```

### 5.2 연산자 우선순위
```
1. 괄호: ( )
2. 함수: sin, cos, tan, ln, log, √
3. 지수: x², x³, xʸ
4. 곱셈/나눗셈: ×, ÷
5. 덧셈/뺄셈: +, -
```

### 5.3 오류 처리
```javascript
class CalculationError extends Error {
  constructor(type, message) {
    super(message);
    this.type = type;
  }
}

const ERROR_TYPES = {
  SYNTAX_ERROR: 'syntax',
  MATH_ERROR: 'math',
  OVERFLOW: 'overflow'
};

function safeEvaluate(expression) {
  try {
    const result = math.evaluate(expression);
    
    // 무한대 체크
    if (!isFinite(result)) {
      throw new CalculationError(ERROR_TYPES.OVERFLOW, 'Result is too large');
    }
    
    // NaN 체크
    if (isNaN(result)) {
      throw new CalculationError(ERROR_TYPES.MATH_ERROR, 'Invalid operation');
    }
    
    return result;
  } catch (error) {
    if (error instanceof CalculationError) {
      throw error;
    }
    throw new CalculationError(ERROR_TYPES.SYNTAX_ERROR, 'Invalid expression');
  }
}
```

### 5.4 숫자 포맷팅
```javascript
function formatNumber(value, maxDecimals = 10) {
  // 정수인 경우
  if (Number.isInteger(value)) {
    return value.toString();
  }
  
  // 매우 큰 숫자는 과학적 표기법
  if (Math.abs(value) >= 1e10) {
    return value.toExponential(6);
  }
  
  // 매우 작은 숫자는 과학적 표기법
  if (Math.abs(value) < 1e-6 && value !== 0) {
    return value.toExponential(6);
  }
  
  // 일반 소수
  const fixed = value.toFixed(maxDecimals);
  // 불필요한 0 제거
  return parseFloat(fixed).toString();
}
```

---

## 6. 상태 관리

### 6.1 상태 흐름
```
User Input → Event Handler → State Update → UI Render
     ↑                                          ↓
     └──────────── User Feedback ───────────────┘
```

### 6.2 이벤트 핸들링
```javascript
class EventController {
  constructor(stateManager, calculator, display) {
    this.state = stateManager;
    this.calc = calculator;
    this.display = display;
    this.initializeEventListeners();
  }

  initializeEventListeners() {
    // 숫자 버튼
    document.querySelectorAll('[data-number]').forEach(button => {
      button.addEventListener('click', (e) => {
        this.handleNumberInput(e.target.dataset.number);
      });
    });

    // 연산자 버튼
    document.querySelectorAll('[data-operator]').forEach(button => {
      button.addEventListener('click', (e) => {
        this.handleOperatorInput(e.target.dataset.operator);
      });
    });

    // 함수 버튼
    document.querySelectorAll('[data-function]').forEach(button => {
      button.addEventListener('click', (e) => {
        this.handleFunctionInput(e.target.dataset.function);
      });
    });

    // 특수 버튼
    document.getElementById('equals').addEventListener('click', () => {
      this.handleEquals();
    });

    document.getElementById('clear').addEventListener('click', () => {
      this.handleClear();
    });

    document.getElementById('backspace').addEventListener('click', () => {
      this.handleBackspace();
    });

    // 키보드 입력
    document.addEventListener('keydown', (e) => {
      this.handleKeyboardInput(e);
    });
  }

  handleNumberInput(number) {
    const currentExpr = this.state.getState().currentExpression;
    this.state.setState({
      currentExpression: currentExpr + number
    });
  }

  handleOperatorInput(operator) {
    const currentExpr = this.state.getState().currentExpression;
    // 연산자 중복 방지 로직
    const lastChar = currentExpr.slice(-1);
    if (['+', '-', '×', '÷'].includes(lastChar)) {
      // 마지막 연산자 교체
      this.state.setState({
        currentExpression: currentExpr.slice(0, -1) + operator
      });
    } else {
      this.state.setState({
        currentExpression: currentExpr + operator
      });
    }
  }

  handleEquals() {
    const expr = this.state.getState().currentExpression;
    const result = this.calc.evaluate(expr);
    
    this.state.setState({
      currentResult: result
    });
    
    // 히스토리에 추가
    if (result !== 'Error') {
      this.historyManager.addEntry(expr, result);
    }
  }

  handleKeyboardInput(event) {
    const key = event.key;
    
    if (/[0-9]/.test(key)) {
      this.handleNumberInput(key);
    } else if (key === '+' || key === '-') {
      this.handleOperatorInput(key);
    } else if (key === '*') {
      this.handleOperatorInput('×');
    } else if (key === '/') {
      event.preventDefault();
      this.handleOperatorInput('÷');
    } else if (key === 'Enter') {
      this.handleEquals();
    } else if (key === 'Backspace') {
      this.handleBackspace();
    } else if (key === 'Escape') {
      this.handleClear();
    }
  }
}
```

---

## 7. 스타일링 시스템

### 7.1 CSS 변수 정의
```css
:root {
  /* Colors - Light Mode */
  --color-primary: #135bec;
  --color-background: #f6f6f8;
  --color-surface: #ffffff;
  --color-text: #1a1a1a;
  --color-text-secondary: #6b7280;
  --color-border: #e5e7eb;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 0.75rem;
  --radius-xl: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  
  /* Transitions */
  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;
}

.dark {
  /* Colors - Dark Mode */
  --color-background: #101622;
  --color-surface: #1c222e;
  --color-text: #ffffff;
  --color-text-secondary: #9ca3af;
  --color-border: #374151;
}
```

### 7.2 버튼 스타일 클래스
```css
/* Base Button */
.btn {
  @apply rounded-xl font-medium transition-all;
  @apply active:scale-95 active:opacity-80;
  -webkit-tap-highlight-color: transparent;
}

/* Number Buttons */
.btn-number {
  @apply h-16 text-2xl;
  @apply bg-gray-50 dark:bg-[#1E232F];
  @apply text-gray-900 dark:text-white;
  @apply hover:bg-gray-100 dark:hover:bg-[#2a303e];
  @apply shadow-sm dark:shadow-none;
}

/* Operator Buttons */
.btn-operator {
  @apply h-16 text-2xl;
  @apply bg-primary/10 dark:bg-primary/20;
  @apply text-primary dark:text-primary-300;
  @apply hover:bg-primary/20 dark:hover:bg-primary/30;
}

/* Function Buttons */
.btn-function {
  @apply h-10 text-sm;
  @apply bg-background-light dark:bg-surface-dark;
  @apply text-gray-600 dark:text-gray-300;
  @apply hover:bg-gray-200 dark:hover:bg-gray-700;
}

/* Special Buttons */
.btn-equals {
  @apply h-16 text-3xl;
  @apply bg-primary text-white;
  @apply hover:bg-blue-600;
  @apply shadow-lg shadow-blue-500/30;
}

.btn-clear {
  @apply h-16 text-lg;
  @apply bg-gray-100 dark:bg-[#252A35];
  @apply text-red-500 dark:text-red-400;
  @apply hover:bg-gray-200 dark:hover:bg-gray-600;
}
```

### 7.3 애니메이션
```css
/* Button Press Animation */
@keyframes button-press {
  0% { transform: scale(1); }
  50% { transform: scale(0.95); }
  100% { transform: scale(1); }
}

.btn:active {
  animation: button-press 150ms ease;
}

/* Result Update Animation */
@keyframes result-update {
  0% { opacity: 0.5; transform: translateY(-10px); }
  100% { opacity: 1; transform: translateY(0); }
}

.result-updated {
  animation: result-update 200ms ease;
}

/* Theme Transition */
* {
  transition: background-color 200ms ease, color 200ms ease;
}
```

---

## 8. 빌드 및 배포

### 8.1 개발 환경 설정

**package.json**
```json
{
  "name": "engineering-calculator",
  "version": "1.0.0",
  "description": "Scientific Calculator Web App",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint src/**/*.js",
    "format": "prettier --write src/**/*.{js,css,html}"
  },
  "dependencies": {
    "mathjs": "^12.0.0"
  },
  "devDependencies": {
    "vite": "^5.0.0",
    "eslint": "^8.0.0",
    "prettier": "^3.0.0",
    "autoprefixer": "^10.0.0",
    "postcss": "^8.0.0",
    "tailwindcss": "^3.0.0"
  }
}
```

**vite.config.js**
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
```

### 8.2 배포 전략

**GitHub Actions + GitHub Pages (선택된 방식)**
- **플랫폼**: GitHub Pages
- **CI/CD**: GitHub Actions
- **장점**: 
  - 무료 호스팅
  - 자동 빌드 및 배포
  - Git 통합
  - HTTPS 기본 제공
  - 커스텀 도메인 지원

**GitHub Pages 설정:**
1. Repository Settings → Pages
2. Source: GitHub Actions
3. Custom domain (선택 사항)

**자동 배포 워크플로우:**
- `.github/workflows/deploy.yml` 참조
- `main` 브랜치에 push 시 자동 배포
- Pull Request 시 빌드 검증

### 8.3 GitHub Actions 워크플로우

**.github/workflows/deploy.yml**
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    if: github.ref == 'refs/heads/main'
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

### 8.4 환경 변수
```javascript
// config.js
export const config = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  baseUrl: import.meta.env.BASE_URL || '/',
  version: '1.0.0'
};
```

**vite.config.js 업데이트 (GitHub Pages용):**
```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' 
    ? '/calculaton-demo/'  // repository 이름으로 변경
    : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  server: {
    port: 3000,
    open: true
  }
});
```

---

## 9. 테스트 전략

### 9.1 단위 테스트 (코어 로직만)
```javascript
// calculator.test.js
import { CalculatorEngine } from './calculator.js';

describe('CalculatorEngine', () => {
  let calc;

  beforeEach(() => {
    calc = new CalculatorEngine();
  });

  test('기본 산술 연산', () => {
    expect(calc.evaluate('2 + 2')).toBe('4');
    expect(calc.evaluate('10 - 5')).toBe('5');
    expect(calc.evaluate('3 × 4')).toBe('12');
    expect(calc.evaluate('15 ÷ 3')).toBe('5');
  });

  test('삼각 함수 - DEG 모드', () => {
    calc.setAngleMode('DEG');
    expect(calc.evaluate('sin(30)')).toBeCloseTo(0.5, 5);
    expect(calc.evaluate('cos(60)')).toBeCloseTo(0.5, 5);
  });

  test('삼각 함수 - RAD 모드', () => {
    calc.setAngleMode('RAD');
    expect(calc.evaluate('sin(pi/2)')).toBeCloseTo(1, 5);
  });

  test('괄호 우선순위', () => {
    expect(calc.evaluate('2 + 3 × 4')).toBe('14');
    expect(calc.evaluate('(2 + 3) × 4')).toBe('20');
  });

  test('오류 처리', () => {
    expect(calc.evaluate('1 / 0')).toBe('Error');
    expect(calc.evaluate('sqrt(-1)')).toBe('Error');
  });
});
```

### 9.2 통합 테스트 (코어 로직만)
```javascript
// integration.test.js
describe('Calculator Integration', () => {
  test('전체 계산 플로우', () => {
    const calc = new Calculator();
    const state = new StateManager();
    const history = new HistoryManager();
    
    // 계산 수행
    const result = calc.evaluate('12 + (35 × sin(45))');
    
    // 상태 업데이트
    state.setState({ currentResult: result });
    
    // 히스토리 추가
    history.addEntry('12 + (35 × sin(45))', result);
    
    // 검증
    expect(result).toBeCloseTo(36.74, 2);
    expect(state.getState().currentResult).toBe(result);
    expect(history.getHistory()).toHaveLength(1);
  });
});
```

### 9.3 UI 테스트 (수동 테스트만)

> **중요**: UI는 자동화된 테스트를 작성하지 않습니다. 수동 테스트로만 검증합니다.

#### 수동 테스트 체크리스트

**기본 계산 플로우:**
- [ ] 숫자 버튼 클릭 시 디스플레이에 표시
- [ ] 연산자 버튼 클릭 시 수식에 추가
- [ ] = 버튼 클릭 시 결과 계산 및 표시
- [ ] AC 버튼 클릭 시 모든 입력 초기화
- [ ] 백스페이스 버튼 클릭 시 마지막 문자 삭제

**과학 함수:**
- [ ] sin, cos, tan 버튼 동작 확인
- [ ] DEG/RAD 모드 전환 확인
- [ ] 로그, 지수 함수 동작 확인
- [ ] 2nd 모드 전환 및 역함수 동작 확인

**히스토리:**
- [ ] 계산 후 히스토리에 자동 추가
- [ ] 히스토리 패널 열기/닫기
- [ ] 히스토리 항목 클릭 시 재사용
- [ ] 히스토리 삭제 기능

**설정:**
- [ ] 테마 전환 (라이트/다크)
- [ ] 기본 각도 모드 설정
- [ ] 설정 저장 및 불러오기

**반응형:**
- [ ] 모바일 화면에서 레이아웃 확인
- [ ] 태블릿 화면에서 레이아웃 확인
- [ ] 데스크톱 화면에서 레이아웃 확인

**접근성:**
- [ ] 키보드로 모든 기능 접근 가능
- [ ] 포커스 표시 명확
- [ ] 스크린 리더로 테스트

### 9.4 테스트 커버리지 목표
- **코어 로직 단위 테스트**: 80% 이상
- **코어 로직 통합 테스트**: 주요 사용자 플로우 커버
- **UI 수동 테스트**: 모든 체크리스트 항목 통과

---

## 10. 성능 최적화

### 10.1 초기 로딩 최적화
```javascript
// 지연 로딩
const loadMathJS = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mathjs/12.0.0/math.min.js';
    script.onload = resolve;
    document.head.appendChild(script);
  });
};

// 필요할 때만 로드
document.addEventListener('DOMContentLoaded', async () => {
  // UI 먼저 렌더링
  renderUI();
  
  // Math.js는 백그라운드에서 로드
  await loadMathJS();
  initializeCalculator();
});
```

### 10.2 이벤트 최적화
```javascript
// 이벤트 위임 사용
document.querySelector('.keypad').addEventListener('click', (e) => {
  const button = e.target.closest('button');
  if (!button) return;
  
  const { number, operator, function: func } = button.dataset;
  
  if (number) handleNumberInput(number);
  else if (operator) handleOperatorInput(operator);
  else if (func) handleFunctionInput(func);
});

// 디바운싱 (실시간 계산 시)
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

const debouncedCalculate = debounce(calculate, 300);
```

### 10.3 렌더링 최적화
```javascript
// Virtual DOM 개념 적용 (간단한 버전)
class VirtualDOM {
  constructor(element) {
    this.element = element;
    this.cache = '';
  }

  update(newContent) {
    if (this.cache === newContent) return; // 변경 없으면 스킵
    
    this.element.textContent = newContent;
    this.cache = newContent;
  }
}

const resultDisplay = new VirtualDOM(document.querySelector('.result-display'));
resultDisplay.update('42'); // DOM 업데이트
resultDisplay.update('42'); // 스킵됨
```

### 10.4 메모리 관리
```javascript
// 히스토리 크기 제한
const MAX_HISTORY_ITEMS = 50;

// 오래된 항목 자동 삭제
function pruneHistory() {
  if (history.length > MAX_HISTORY_ITEMS) {
    history = history.slice(0, MAX_HISTORY_ITEMS);
  }
}

// 메모리 누수 방지
class Calculator {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(element, event, handler) {
    element.addEventListener(event, handler);
    
    // 나중에 제거할 수 있도록 저장
    if (!this.listeners.has(element)) {
      this.listeners.set(element, []);
    }
    this.listeners.get(element).push({ event, handler });
  }

  destroy() {
    // 모든 이벤트 리스너 제거
    this.listeners.forEach((events, element) => {
      events.forEach(({ event, handler }) => {
        element.removeEventListener(event, handler);
      });
    });
    this.listeners.clear();
  }
}
```

### 10.5 성능 모니터링
```javascript
// Performance API 사용
const measurePerformance = (name, fn) => {
  performance.mark(`${name}-start`);
  const result = fn();
  performance.mark(`${name}-end`);
  performance.measure(name, `${name}-start`, `${name}-end`);
  
  const measure = performance.getEntriesByName(name)[0];
  console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
  
  return result;
};

// 사용 예
const result = measurePerformance('calculate', () => {
  return calculator.evaluate(expression);
});
```

---

## 11. 보안 고려사항

### 11.1 입력 검증
```javascript
// XSS 방지
function sanitizeInput(input) {
  // 허용된 문자만 통과
  const allowedChars = /^[0-9+\-×÷().\s]+$/;
  if (!allowedChars.test(input)) {
    throw new Error('Invalid characters in expression');
  }
  return input;
}

// HTML 이스케이프
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
```

### 11.2 CSP (Content Security Policy)
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; 
               style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
               font-src https://fonts.gstatic.com;">
```

---

## 12. 접근성 (Accessibility)

### 12.1 ARIA 속성
```html
<!-- 버튼 예시 -->
<button 
  data-number="7" 
  aria-label="Number 7"
  role="button"
  tabindex="0">
  7
</button>

<!-- 디스플레이 -->
<div 
  class="result-display" 
  role="status" 
  aria-live="polite" 
  aria-atomic="true">
  0
</div>
```

### 12.2 키보드 네비게이션
```javascript
// 포커스 관리
function manageFocus() {
  const buttons = document.querySelectorAll('button');
  let currentIndex = 0;

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      currentIndex = (currentIndex + 1) % buttons.length;
      buttons[currentIndex].focus();
    }
  });
}
```

---

## 부록 A: API 레퍼런스

### Calculator Engine API
```javascript
// 초기화
const calc = new CalculatorEngine();

// 메서드
calc.evaluate(expression: string): string
calc.setAngleMode(mode: 'DEG' | 'RAD'): void
calc.memoryClear(): void
calc.memoryAdd(value: number): void
calc.memorySubtract(value: number): void
calc.memoryRecall(): number
```

### State Manager API
```javascript
// 초기화
const state = new StateManager();

// 메서드
state.setState(updates: Partial<CalculatorState>): void
state.getState(): CalculatorState
state.subscribe(listener: (state: CalculatorState) => void): void
state.saveToStorage(): void
state.loadFromStorage(): void
```

---

## 부록 B: 브라우저 호환성

| 기능 | Chrome | Firefox | Safari | Edge |
|------|--------|---------|--------|------|
| ES6+ | ✅ 51+ | ✅ 54+ | ✅ 10+ | ✅ 15+ |
| CSS Grid | ✅ 57+ | ✅ 52+ | ✅ 10.1+ | ✅ 16+ |
| LocalStorage | ✅ | ✅ | ✅ | ✅ |
| CSS Variables | ✅ 49+ | ✅ 31+ | ✅ 9.1+ | ✅ 15+ |

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2025-12-23 | 초기 문서 작성 |

---

**문서 승인**
- [ ] 기술 리드
- [ ] 프론트엔드 개발자
- [ ] QA 엔지니어
