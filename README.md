# MacroMind

거시경제 브리핑 웹앱. **API 키는 서버에서만 관리**하고, 브리핑 생성은 **Google Gemini**(AI Studio 무료 할당량 활용 가능)로 수행합니다.

## 스택

- React 19 + Vite + Tailwind
- Express API (`/api/briefing`, `/api/health`)
- `@google/generative-ai` — JSON 모드 브리핑

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
