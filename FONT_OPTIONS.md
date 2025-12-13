# Touch 텍스트용 영문 폰트 옵션

## Three.js Text3D에서 사용 가능한 폰트 (Typeface.json)

### 1. **기본 제공 폰트 (Three.js Examples)**
```
https://threejs.org/examples/fonts/helvetiker_bold.typeface.json (현재 사용 중)
https://threejs.org/examples/fonts/helvetiker_regular.typeface.json
https://threejs.org/examples/fonts/optimer_bold.typeface.json
https://threejs.org/examples/fonts/optimer_regular.typeface.json
https://threejs.org/examples/fonts/gentilis_bold.typeface.json
https://threejs.org/examples/fonts/gentilis_regular.typeface.json
https://threejs.org/examples/fonts/droid/droid_sans_bold.typeface.json
https://threejs.org/examples/fonts/droid/droid_sans_regular.typeface.json
https://threejs.org/examples/fonts/droid/droid_serif_bold.typeface.json
https://threejs.org/examples/fonts/droid/droid_serif_regular.typeface.json
```

### 2. **추천 폰트 (Typeface.js로 변환 가능)**

#### **모던 & 미니멀**
- **Inter** - 현재 웹사이트에서 사용 중, 깔끔하고 가독성 우수
- **Roboto** - Google의 대표 폰트, 기하학적이고 현대적
- **Poppins** - 둥근 형태, 친근하고 모던함
- **Montserrat** - 우아하고 세련됨
- **Open Sans** - 넓은 가독성, 웹 최적화

#### **강조 & 임팩트**
- **Bebas Neue** - 대문자 전용, 강렬한 임팩트
- **Oswald** - 좁은 폭, 높은 임팩트
- **Raleway** - 우아하고 세련된 세리프 느낌
- **Lato** - 균형잡힌 형태, 전문적
- **Nunito** - 둥근 형태, 친근함

#### **기하학적 & 테크니컬**
- **Orbitron** - 미래지향적, SF 느낌
- **Rajdhani** - 기하학적, 깔끔함
- **Exo 2** - 테크니컬, 모던
- **Titillium Web** - 기하학적, 강한 임팩트
- **Source Sans Pro** - 깔끔하고 전문적

#### **세리프 (전통적이면서 모던)**
- **Playfair Display** - 우아한 세리프, 고급스러움
- **Merriweather** - 가독성 우수한 세리프
- **Lora** - 부드러운 세리프, 읽기 편함
- **Crimson Text** - 클래식한 세리프

#### **특수 스타일**
- **Futura** - 기하학적, 클래식 모던
- **Gotham** - 현대적, 강한 브랜드 느낌
- **Avenir** - 우아하고 균형잡힌 형태
- **Proxima Nova** - 모던하고 다목적

## Google Fonts에서 Typeface.js로 변환하기

1. **폰트 다운로드**: Google Fonts에서 원하는 폰트 선택
2. **Typeface.js 변환**: 
   - https://gero3.github.io/f3d/ (온라인 변환기)
   - 또는 `typeface.js` npm 패키지 사용
3. **public 폰트 폴더에 저장**: `/public/fonts/` 디렉토리
4. **코드에서 사용**:
```typescript
font="/fonts/your-font-bold.typeface.json"
```

## 추천 조합 (Touch 텍스트용)

### **옵션 1: 강한 임팩트**
- **Bebas Neue Bold** - 대문자 전용, 매우 강렬
- **Oswald Bold** - 좁고 높은 형태, 임팩트 강함

### **옵션 2: 모던 & 미니멀**
- **Inter Bold** - 현재 웹사이트와 일관성
- **Poppins Bold** - 둥근 형태, 친근함

### **옵션 3: 테크니컬 & 미래지향적**
- **Orbitron Bold** - SF 느낌, 디지털
- **Rajdhani Bold** - 기하학적, 깔끔

### **옵션 4: 우아 & 세련**
- **Raleway Bold** - 우아하고 세련됨
- **Montserrat Bold** - 모던하고 우아함

## 현재 사용 중인 폰트
- **Helvetiker Bold** - 클래식한 산세리프, 깔끔하고 읽기 쉬움

## 폰트 변환 도구
- https://gero3.github.io/f3d/ (온라인 변환기, 추천)
- https://threejs.org/editor/ (Three.js Editor에서 폰트 로드 가능)

