# Widget Embed Codes

이 문서는 외부 웹사이트에 삽입할 수 있는 위젯들의 아이프레임 코드를 관리합니다.

## 1. 핸드팬 스케일 추천 서비스 (Handpan Scale Recommender)

메인 추천 서비스를 임베드합니다.

```html
<!-- 핸드팬 스케일 추천 서비스 위젯 -->
<iframe
  id="handpan-recommender"
  src="https://handpan-scale-recommender.vercel.app"
  width="100%"
  frameborder="0"
  scrolling="no"
  style="border:none; overflow:hidden; width:100%; min-height: 500px;"
></iframe>
<script>
  window.addEventListener('message', function(e) {
    // 메시지 타입이 높이 조절(setHeight)인 경우에만 실행
    if (e.data && e.data.type === 'setHeight') {
      var iframe = document.getElementById('handpan-recommender');
      if (iframe) {
        // 전달받은 높이값으로 iframe 높이 즉시 업데이트
        iframe.style.height = e.data.height + 'px';
      }
    }
  });
</script>
```

## 2. 카테고리 슬라이더 (Category Slider)

카테고리별 제품 슬라이더를 임베드합니다.

```html
<!-- 카테고리 슬라이더 위젯 -->
<iframe
  id="handpan-category-slider"
  src="https://handpan-scale-recommender.vercel.app/category-slider"
  width="100%"
  frameborder="0"
  scrolling="no"
  style="border:none; overflow:hidden; width:100%; min-height: 500px;"
></iframe>
<script>
  window.addEventListener('message', function(e) {
    // 메시지 타입이 높이 조절(setHeight)인 경우에만 실행
    if (e.data && e.data.type === 'setHeight') {
      var iframe = document.getElementById('handpan-category-slider');
      if (iframe) {
        // 전달받은 높이값으로 iframe 높이 즉시 업데이트
        iframe.style.height = e.data.height + 'px';
      }
    }
  });
</script>
```
