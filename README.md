Photomong Cloud (GitHub → Firebase CI/CD)

개요
- 이 레포는 로컬 포토몽 앱은 그대로 두고, 클라우드 동기화/대시보드/배포를 Firebase로 관리하기 위한 모노레포 스켈레톤입니다.
- 구성: `agent/`(키오스크 동기화 에이전트), `functions/`(Cloud Functions), `web/`(Hosting 정적 리소스), `firestore.rules`, `storage.rules`, `firebase.json`.

시작하기
1) Node 20+ 설치 후 Firebase CLI 설치
   - `npm i -g firebase-tools`

2) Firebase 로그인 및 프로젝트 연결
   - `firebase login`
   - `.firebaserc`의 `YOUR_PROJECT_ID`를 실제 프로젝트 ID로 교체

3) Functions 의존성 설치
   - `cd functions && npm ci && cd ..`

4) 로컬 에이전트 설정(옵션)
   - `agent/agent.config.example.json`을 `agent/agent.config.json`으로 복사 후 값 채우기
   - `node agent/agent.js`로 테스트

5) 배포
   - 수동: `firebase deploy --only hosting,functions,firestore:rules,storage`
   - GitHub Actions: `FIREBASE_TOKEN`/`FIREBASE_PROJECT_ID` 시크릿을 설정하면 `main` 푸시에 자동 배포

GitHub 시크릿
- `FIREBASE_TOKEN`: `firebase login:ci`로 생성한 토큰
- `FIREBASE_PROJECT_ID`: 예) `photomong-prod`

디렉터리 구조
- `agent/`: 사진 업로드/하트비트 전송 스크립트
- `functions/`: 헬스체크 등 백엔드 API
- `web/`: 간단한 정적 대시보드(초기 템플릿)
- `firestore.rules` / `storage.rules`: 최소 권한 보안 규칙
- `firebase.json` / `.firebaserc`: Firebase 설정

주의
- 실제 배포 전 규칙을 프로젝트 보안정책에 맞게 조정하세요.
- `agent/agent.config.json`은 커밋 금지(.gitignore 포함).


