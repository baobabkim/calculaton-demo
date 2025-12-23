# 배포 가이드

## GitHub Pages 배포 설정

### 1. Repository 설정

#### 1.1 GitHub Pages 활성화
1. GitHub Repository로 이동
2. **Settings** → **Pages** 클릭
3. **Source** 섹션에서:
   - Source: **GitHub Actions** 선택
4. (선택 사항) Custom domain 설정

### 2. 자동 배포 워크플로우

#### 2.1 워크플로우 파일
- `.github/workflows/deploy.yml`: 메인 배포 워크플로우
- `.github/workflows/ci.yml`: CI 테스트 워크플로우

#### 2.2 배포 트리거
- `main` 브랜치에 push 시 자동 배포
- Pull Request 시 빌드 검증만 수행 (배포 X)

#### 2.3 배포 프로세스
```
1. 코드 체크아웃
2. Node.js 20 설치
3. 의존성 설치 (npm ci)
4. Lint 검사
5. 빌드 (npm run build)
6. GitHub Pages에 배포
```

### 3. 로컬 개발 환경

#### 3.1 초기 설정
```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

#### 3.2 로컬 빌드 테스트
```bash
# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

### 4. 배포 URL

#### 4.1 기본 URL 형식
```
https://<username>.github.io/calculaton-demo/
```

#### 4.2 Base Path 설정
`vite.config.js`에서 base path가 설정되어 있습니다:
```javascript
base: process.env.NODE_ENV === 'production' 
  ? '/calculaton-demo/'
  : '/'
```

> **중요**: Repository 이름이 다르면 `vite.config.js`의 base path를 수정해야 합니다.

### 5. 배포 확인

#### 5.1 GitHub Actions 확인
1. Repository → **Actions** 탭
2. 최근 워크플로우 실행 확인
3. 빌드 로그 확인

#### 5.2 배포 상태 확인
1. Repository → **Settings** → **Pages**
2. "Your site is live at ..." 메시지 확인
3. URL 클릭하여 사이트 접속

### 6. 트러블슈팅

#### 6.1 빌드 실패
**증상**: GitHub Actions에서 빌드 실패
**해결**:
```bash
# 로컬에서 빌드 테스트
npm run build

# 에러 로그 확인
# package.json의 scripts 확인
```

#### 6.2 404 에러
**증상**: 배포 후 페이지 접속 시 404 에러
**해결**:
1. `vite.config.js`의 base path 확인
2. Repository 이름과 일치하는지 확인
3. GitHub Pages 설정에서 Source가 "GitHub Actions"인지 확인

#### 6.3 CSS/JS 파일 로드 실패
**증상**: 페이지는 열리지만 스타일/기능 작동 안 함
**해결**:
1. 브라우저 개발자 도구 → Network 탭 확인
2. 파일 경로가 올바른지 확인
3. base path 설정 재확인

#### 6.4 캐시 문제
**증상**: 업데이트가 반영되지 않음
**해결**:
```bash
# 브라우저 캐시 강제 새로고침
# Windows/Linux: Ctrl + Shift + R
# Mac: Cmd + Shift + R

# 또는 시크릿 모드로 접속
```

### 7. 커스텀 도메인 설정 (선택 사항)

#### 7.1 도메인 연결
1. GitHub Repository → **Settings** → **Pages**
2. **Custom domain** 입력
3. DNS 설정:
   ```
   Type: CNAME
   Name: www (또는 원하는 서브도메인)
   Value: <username>.github.io
   ```

#### 7.2 HTTPS 강제
- **Enforce HTTPS** 체크박스 활성화

### 8. 환경별 설정

#### 8.1 개발 환경
```javascript
// 로컬 개발 시
base: '/'
```

#### 8.2 프로덕션 환경
```javascript
// GitHub Pages 배포 시
base: '/calculaton-demo/'
```

### 9. 성능 최적화

#### 9.1 빌드 크기 확인
```bash
npm run build

# 빌드 결과 확인
du -sh dist/
```

#### 9.2 최적화 체크리스트
- [x] Terser로 JavaScript 압축
- [x] console.log 제거
- [x] 소스맵 비활성화 (프로덕션)
- [x] 청크 분할 (vendor 분리)
- [ ] 이미지 최적화
- [ ] CDN 사용 (폰트, 아이콘)

### 10. 보안

#### 10.1 GitHub Actions Permissions
워크플로우에 필요한 최소 권한만 부여:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

#### 10.2 환경 변수
민감한 정보는 GitHub Secrets에 저장:
1. Repository → **Settings** → **Secrets and variables** → **Actions**
2. **New repository secret** 클릭
3. 이름과 값 입력

### 11. 모니터링

#### 11.1 GitHub Actions 로그
- 모든 빌드/배포 로그 자동 저장
- 최대 90일간 보관

#### 11.2 배포 히스토리
- **Environments** → **github-pages**에서 배포 히스토리 확인

---

## 빠른 참조

### 주요 명령어
```bash
npm install          # 의존성 설치
npm run dev          # 개발 서버 실행
npm run build        # 프로덕션 빌드
npm run preview      # 빌드 결과 미리보기
npm run lint         # 코드 검사
```

### 주요 파일
- `.github/workflows/deploy.yml`: 배포 워크플로우
- `.github/workflows/ci.yml`: CI 워크플로우
- `vite.config.js`: Vite 설정
- `package.json`: 프로젝트 설정

### 유용한 링크
- [GitHub Pages 문서](https://docs.github.com/en/pages)
- [GitHub Actions 문서](https://docs.github.com/en/actions)
- [Vite 문서](https://vitejs.dev/)

---

**마지막 업데이트**: 2025-12-23
