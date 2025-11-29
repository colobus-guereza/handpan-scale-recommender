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

### 1. 기본 임베드 (고정 높이)
간단하게 삽입하려면 아래 코드를 사용하세요.

```html
<iframe 
  src="https://handpan-scale-recommender.vercel.app/" 
  width="100%" 
  height="800px" 
  style="border: none; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);"
  title="Handpan Scale Recommender"
></iframe>
```

### 2. 자동 높이 조절 (스크롤 문제 해결)
내부 컨텐츠 길이에 따라 Iframe 높이가 자동으로 조절되게 하려면, **부모 웹사이트(삽입하는 곳)**에 아래 스크립트를 추가해야 합니다.

**HTML 코드:**
```html
<iframe 
  id="handpan-frame"
  src="https://handpan-scale-recommender.vercel.app/" 
  width="100%" 
  style="border: none; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;"
  scrolling="no"
  title="Handpan Scale Recommender"
></iframe>

<script>
  window.addEventListener('message', function(e) {
    // 메시지 타입 확인
    if (e.data && e.data.type === 'setHeight') {
      const iframe = document.getElementById('handpan-frame');
      if (iframe) {
        // 전달받은 높이로 Iframe 높이 설정
        iframe.style.height = e.data.height + 'px';
      }
    }
  });
</script>
```

이 방식을 사용하면 내부 페이지가 길어질 때 Iframe도 같이 길어져서 중복 스크롤바가 생기지 않습니다.
