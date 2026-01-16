# Git Commit (미커밋 변경사항 커밋)

현재 미커밋 변경사항을 확인하고 커밋해라.

## 실행 순서

1. `git status`로 변경사항 확인
2. `git diff`로 변경 내용 확인
3. `git log --oneline -5`로 최근 커밋 스타일 확인
4. 변경사항을 staging (`git add`)
5. 커밋 메시지 작성 후 커밋

## 커밋 메시지 규칙

- 한글 사용
- 첫 줄: 변경 요약 (50자 이내)
- 본문: 주요 변경 내용 bullet point
