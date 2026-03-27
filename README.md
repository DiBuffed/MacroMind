# MacroMind

거시경제 브리핑 웹앱. **API 키는 서버에서만 관리**하고, 브리핑 생성은 **Google Gemini**(AI Studio 무료 할당량 활용 가능)로 수행합니다.

## 스택

- React 19 + Vite + Tailwind v4
- Express API (`/api/briefing`, `/api/health`)
- `@google/generative-ai` — JSON 모드 브리핑

## UI / 디자인

- **앱**과 **`public/landing.html`** 은 동일한 라이트 핀테크 톤(Pretendard, `#4361ee` 액센트, 카드·여백)으로 맞춰 두었습니다.
- 마케팅용 풀 랜딩: 개발 서버에서 `http://localhost:5173/landing.html`

## 유저 플로우 (앱)

1. **시작** — 랜딩 히어로 → CTA  
2. **포트폴리오 입력** — 종목 텍스트 또는 캡쳐 (또는 스킵)  
3. **분석** — 로딩 스텝  
4. **결과** — 대시보드(지표 → 연결도 → 브리핑 → 리스크 → 분산 → 종목 탭 → 히스토리 예정)

## 로컬 실행 (프론트 + API 동시에)

```bash
npm install
cp .env.example .env
# .env에 GEMINI_API_KEY= 발급한 키 붙여넣기 (https://aistudio.google.com/apikey)
npm run dev
```

- 프론트: Vite (보통 `http://localhost:5173`) — API는 프록시로 `localhost:8787`에 연결됩니다.
- 키를 넣지 않으면 **데모 목 데이터**로만 동작합니다 (헤더에 `Demo`).

`npm run dev`는 `dev:server`와 `dev:client`를 **동시에** 띄웁니다. API만 쓰려면 `npm run dev:server`.

## 배포 시

- 빌드 결과(`dist`)와 `server/`를 함께 올리고, 프로덕션에서 `GEMINI_API_KEY`·`PORT`를 환경 변수로 넣으면 됩니다. (프론트만 CDN에 올릴 경우에는 API URL을 따로 맞춰야 합니다.)

## 라이선스

프로젝트에 맞게 지정하세요.
