# MacroMind

거시경제 브리핑 에이전트 웹앱. 포트폴리오 캡쳐 또는 종목 입력을 바탕으로, AI가 오늘의 거시 뉴스·리스크·역사적 패턴을 정리한 한 페이지 대시보드를 보여 줍니다.

## 스택

- React 19 + [Vite](https://vite.dev/)
- Tailwind CSS v4 (`@tailwindcss/vite`)
- Anthropic Messages API (Claude) — 프론트엔드에서 직접 호출

## 로컬 실행

```bash
npm install
cp .env.example .env
# .env에 VITE_ANTHROPIC_API_KEY=your_key
npm run dev
```

API 키가 없으면 **데모용 목 데이터**로 동작합니다 (해커톤·UI 확인용).

## 빌드

```bash
npm run build
npm run preview
```

## GitHub에 올리기

1. [GitHub](https://github.com/new)에서 새 저장소 생성
2. 이 폴더에서:

```bash
git commit -m "Initial MacroMind scaffold: Vite, Tailwind, briefing flow"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

## 보안 참고

`VITE_*` 변수는 **클라이언트에 노출**됩니다. 프로덕션에서는 백엔드 프록시나 서버리스로 키를 숨기는 구성을 권장합니다.

## 라이선스

프로젝트에 맞게 지정하세요.
