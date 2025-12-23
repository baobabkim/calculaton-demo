# GitHub 이슈 일괄 생성 스크립트
# 사용법: .\scripts\create-issues.ps1

# GitHub CLI 설치 확인
if (!(Get-Command gh -ErrorAction SilentlyContinue)) {
    Write-Host "❌ GitHub CLI가 설치되지 않았습니다." -ForegroundColor Red
    Write-Host "다음 명령어로 설치하세요:" -ForegroundColor Yellow
    Write-Host "  winget install --id GitHub.cli" -ForegroundColor Cyan
    exit 1
}

# GitHub CLI 인증 확인
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ GitHub CLI 인증이 필요합니다." -ForegroundColor Red
    Write-Host "다음 명령어로 인증하세요:" -ForegroundColor Yellow
    Write-Host "  gh auth login" -ForegroundColor Cyan
    exit 1
}

Write-Host "✅ GitHub CLI 준비 완료" -ForegroundColor Green
Write-Host ""

# 이슈 생성 함수
function Create-Issue {
    param(
        [string]$Title,
        [string]$BodyFile,
        [string[]]$Labels,
        [string]$Milestone
    )
    
    Write-Host "📝 생성 중: $Title" -ForegroundColor Cyan
    
    $labelStr = $Labels -join ","
    
    try {
        $result = gh issue create `
            --title $Title `
            --body-file $BodyFile `
            --label $labelStr `
            --milestone $Milestone
        
        Write-Host "✅ 생성 완료: $result" -ForegroundColor Green
        return $true
    }
    catch {
        Write-Host "❌ 생성 실패: $_" -ForegroundColor Red
        return $false
    }
}

# Milestone 생성 (없으면)
Write-Host "📌 Milestone 확인 중..." -ForegroundColor Yellow

$milestones = @(
    "Phase 2: 코어 로직 구현",
    "Phase 3: UI 구현",
    "Phase 4: 고급 기능",
    "Phase 5: 테스트 및 최적화",
    "Phase 6: 배포 및 문서화"
)

foreach ($milestone in $milestones) {
    $existing = gh api repos/:owner/:repo/milestones --jq ".[] | select(.title == `"$milestone`")" 2>$null
    
    if (!$existing) {
        Write-Host "  생성: $milestone" -ForegroundColor Cyan
        gh api repos/:owner/:repo/milestones -f title="$milestone" -f state="open" | Out-Null
    }
}

Write-Host "✅ Milestone 준비 완료" -ForegroundColor Green
Write-Host ""

# 이슈 생성 시작
Write-Host "🚀 이슈 생성을 시작합니다..." -ForegroundColor Yellow
Write-Host ""

$successCount = 0
$failCount = 0

# Phase 2.1: 계산 엔진 기초
$phase2_1_issues = @(
    @{
        Title = "[Phase 2.1.1] 기본 산술 연산 구현"
        BodyFile = ".github/issues/task-2.1.1.md"
        Labels = @("enhancement", "tdd", "core-logic", "phase-2")
        Milestone = "Phase 2: 코어 로직 구현"
    },
    @{
        Title = "[Phase 2.1.2] 수식 파싱 및 우선순위 처리"
        BodyFile = ".github/issues/task-2.1.2.md"
        Labels = @("enhancement", "tdd", "core-logic", "phase-2")
        Milestone = "Phase 2: 코어 로직 구현"
    },
    @{
        Title = "[Phase 2.1.3] 오류 처리 구현"
        BodyFile = ".github/issues/task-2.1.3.md"
        Labels = @("enhancement", "tdd", "core-logic", "error-handling", "phase-2")
        Milestone = "Phase 2: 코어 로직 구현"
    }
)

foreach ($issue in $phase2_1_issues) {
    if (Create-Issue @issue) {
        $successCount++
    } else {
        $failCount++
    }
    Start-Sleep -Seconds 1
}

# 결과 출력
Write-Host ""
Write-Host "=" * 50 -ForegroundColor Gray
Write-Host "📊 이슈 생성 완료" -ForegroundColor Green
Write-Host "  ✅ 성공: $successCount" -ForegroundColor Green
Write-Host "  ❌ 실패: $failCount" -ForegroundColor Red
Write-Host "=" * 50 -ForegroundColor Gray
Write-Host ""
Write-Host "💡 생성된 이슈 확인:" -ForegroundColor Yellow
Write-Host "  gh issue list" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 브라우저에서 보기:" -ForegroundColor Yellow
Write-Host "  gh issue list --web" -ForegroundColor Cyan
