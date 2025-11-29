# 핸드팬 스케일 추천 애플리케이션

국내 사용자들의 사용 후기를 기반으로 최적의 핸드팬 스케일을 추천하는 Next.js 애플리케이션입니다.

## 기능

- 4가지 연주 목적별 스케일 추천 (입문용, 요가·명상·힐링, 밝은 Major, 개성강한분위기)
- 딩의 피치별 필터링 기능
- 전체 스케일 목록 탐색
- 스케일 상세 정보 및 영상 시청

## 기술 스택

- Next.js 14.2.0
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion

## 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
npm start
```

## 배포

이 프로젝트는 Vercel에 배포되어 있습니다.

**배포 주소:** [https://handpan-scale-recommender.vercel.app/](https://handpan-scale-recommender.vercel.app/)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/colobus-guereza/handpan-scale-recommender)

## 웹사이트 임베드 방법 (Iframe)

이 애플리케이션을 다른 웹사이트(Wix, Squarespace, WordPress 등)에 임베드하려면 아래의 HTML 코드를 사용하세요.

```html
<iframe 
  src="https://handpan-scale-recommender.vercel.app/" 
  width="100%" 
  height="800px" 
  style="border: none; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
  title="Handpan Scale Recommender"
></iframe>
```

### 사이즈 조절
- **width**: `100%`로 설정하면 부모 컨테이너의 너비에 맞춰집니다. 고정 픽셀(예: `600px`)로 설정할 수도 있습니다.
- **height**: `800px`은 권장 높이입니다. 필요에 따라 조절하세요.
