export interface Scale {
    id: string;
    name: string;
    notes: {
        ding: string;
        top: string[];
        bottom: string[];
    };
    vector: {
        minorMajor: number; // -1.0 (Dark) ~ 1.0 (Bright)
        pureSpicy: number;  // 0.0 (Pure) ~ 1.0 (Spicy)
        rarePopular: number; // 0.0 (Rare) ~ 1.0 (Popular)
    };
    tags: string[];
    description: string;
    videoUrl?: string;
    productUrl?: string;
}

export const SCALES: Scale[] = [
    // 1. D Kurd 9 (The Standard Minor)
    {
        id: "d_kurd_9",
        name: "D Kurd 9",
        notes: {
            ding: "D3",
            top: ["A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4"],
            bottom: []
        },
        vector: { minorMajor: -0.8, pureSpicy: 0.1, rarePopular: 1.0 },
        tags: ["마이너", "대중적", "감성적"],
        description: "가장 대중적인 스케일입니다. 깊고 감성적이며 완벽한 균형을 이룹니다.",
        videoUrl: "https://youtu.be/IvdeC_YuSIg",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/9206864886"
    },

    // 1-1. D Kurd 10 (The Standard Minor Extended)
    {
        id: "d_kurd_10",
        name: "D Kurd 10",
        notes: {
            ding: "D3",
            top: ["A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5"],
            bottom: []
        },
        vector: { minorMajor: -0.8, pureSpicy: 0.1, rarePopular: 0.98 },
        tags: ["마이너", "대중적", "고음확장", "멜로디"],
        description: "D Kurd 9에 고음(C5)을 추가한 확장 버전입니다. 더 넓은 음역대로 화려한 멜로디 연주가 가능합니다.",
        videoUrl: "https://youtu.be/uL40C1bqKik?si=DpqHwPB_RLpcA5mc",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/7514024868"
    },

    // 5. E Equinox 14 (Mutant/Extended)
    {
        id: "e_equinox_14_mutant",
        name: "E Equinox 14",
        notes: {
            ding: "E3",
            top: ["G3", "B3", "C4", "D4", "E4", "F#4", "G4", "B4", "C5"],
            bottom: ["C3", "D3", "D5", "E5"] // Assuming lower notes are bottom/mutant based on context, but user will verify
        },
        vector: { minorMajor: -0.4, pureSpicy: 0.4, rarePopular: 0.5 },
        tags: ["하이브리드", "시네마틱", "상급자용", "달콤씁쓸한"],
        description: "메이저와 마이너의 경계에 있습니다. 복잡하고 감성적이며, 묵직한 저음을 포함한 14개의 노트로 풍성함을 자랑합니다.",
        videoUrl: "https://youtu.be/v9pXYwhylPg?si=Em_dHnMGyeU19YkE",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12351119980"
    },

    // 6. F# Low Pygmy 14 (The Global Bestseller)
    {
        id: "fs_low_pygmy_14",
        name: "F# Low Pygmy 14",
        notes: {
            ding: "F#3",
            top: ["G#3", "A3", "C#4", "E4", "F#4", "G#4", "A4", "B4", "C#5", "E5", "F#5"],
            bottom: ["D3", "E3"]
        },
        vector: { minorMajor: -0.6, pureSpicy: 0.25, rarePopular: 0.95 },
        tags: ["Bestseller", "Deep", "Storytelling", "Malte Marten Style"],
        description: "전 세계적으로 가장 사랑받는 스케일 중 하나입니다. G#으로 시작하는 독특한 구조가 풍부한 스토리텔링을 가능하게 합니다.",
        videoUrl: "https://youtu.be/SthKlH686Pc?si=_YG050uZwcbIoP0X",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12070387231"
    },

    // 7. F Aeolian 10 (Domestic Steady Seller)
    {
        id: "f_aeolian_10",
        name: "F Aeolian 10",
        notes: {
            ding: "F3",
            top: ["Ab3", "Bb3", "C4", "Db4", "Eb4", "F4", "G4", "Ab4", "C5"],
            bottom: []
        },
        vector: { minorMajor: -0.8, pureSpicy: 0.15, rarePopular: 0.7 },
        tags: ["국내인기", "안정적", "우울함", "변신가능", "바텀업그레이드", "가성비최고"],
        description: "국내 시장에서 꾸준히 사랑받는 스테디셀러입니다. 기본적으로 우울하고 차분하지만, 확장을 통해 다양한 분위기로 변신할 수 있습니다.",
        videoUrl: "https://youtu.be/BH45TEboAgE?si=SLlNpG-5vTLSWAsx",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/9561986680"
    },

    // 8. E Romanian Hijaz 10 (The Exotic Individualist)
    {
        id: "e_romanian_hijaz_10",
        name: "E Romanian Hijaz 10",
        notes: {
            ding: "E3",
            top: ["A3", "B3", "C4", "D#4", "E4", "F#4", "G4", "A4", "B4"],
            bottom: []
        },
        vector: { minorMajor: -0.5, pureSpicy: 0.75, rarePopular: 0.35 },
        tags: ["이국적", "집시", "독특함", "미스터리"],
        description: "남들과 다른 독특함을 추구하는 분들을 위한 스케일입니다. 집시 음악을 연상시키는 강렬하고 신비로운 분위기를 자아냅니다.",
        videoUrl: "https://youtu.be/gTEsQG3dfKQ?si=IJcS8SYJe9468WgP",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8681747137"
    },

    // 9. D Saladin 9 (The Extreme Niche)
    {
        id: "d_saladin_9",
        name: "D Saladin 9",
        notes: {
            ding: "D3",
            top: ["G3", "A3", "C4", "D4", "Eb4", "F#4", "G4", "A4"],
            bottom: []
        },
        vector: { minorMajor: -0.2, pureSpicy: 0.85, rarePopular: 0.1 },
        tags: ["아라비안", "희귀함", "매운맛", "프리지안"],
        description: "아라비안 나이트를 연상시키는 매우 이국적이고 강렬한 스케일입니다. 희소성이 높아 독보적인 개성을 표현하기 좋습니다.",
        videoUrl: "https://youtu.be/OJWGyT1OxIg?si=RM_0FkjjEuxaWPJu",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8669289024"
    },

    // 10. D Asha 9 (The Gentle Major / Sabye)
    {
        id: "d_asha_9",
        name: "D Asha 9 (Sabye)",
        notes: {
            ding: "D3",
            top: ["G3", "A3", "B3", "C#4", "D4", "E4", "F#4", "A4"],
            bottom: []
        },
        vector: { minorMajor: 0.9, pureSpicy: 0.1, rarePopular: 0.9 },
        tags: ["메이저", "젠틀", "세컨드핸드팬", "Sabye", "희망적"],
        description: "Sabye라고도 불리는 부드럽고 온화한 메이저 스케일입니다. 순수한 빛과 희망을 담고 있으며, 마이너 스케일과 함께 연주하기 좋은 최고의 세컨드 악기로 추천됩니다.",
        videoUrl: "https://youtu.be/4tgdyOhT-RI?si=9SQ66sdPiwvgxoP7",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8497384066"
    },

    // 11. E La Sirena 10 (The Siren / Dorian)
    {
        id: "e_la_sirena_10",
        name: "E La Sirena 10",
        notes: {
            ding: "E3",
            top: ["G3", "B3", "C#4", "D4", "E4", "F#4", "G4", "B4", "E5"],
            bottom: []
        },
        vector: { minorMajor: -0.3, pureSpicy: 0.6, rarePopular: 0.4 },
        tags: ["도리안", "물", "중급자용", "풍부한색채"],
        description: "'사이렌'이라는 이름처럼 신비롭고 깊은 물속을 유영하는 듯한 느낌을 줍니다. 메이저와 마이너를 오가는 묘한 매력이 있습니다.",
        videoUrl: "https://youtu.be/B-7jukbN3hw?si=ci_6mlElCZvu_WGH",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8490886007"
    },

    // 12. C# Pygmy 9 (The Original Trance Classic)
    {
        id: "cs_pygmy_9",
        name: "C# Pygmy 9",
        notes: {
            ding: "C#3",
            top: ["F#3", "G#3", "A3", "C#4", "E4", "F#4", "G#4", "A4"],
            bottom: []
        },
        vector: { minorMajor: -0.7, pureSpicy: 0.05, rarePopular: 0.85 },
        tags: ["피그미", "트랜스", "깊음", "클래식"],
        description: "핸드팬의 고전이자 명작입니다. 특유의 공허하고 몽환적인 울림은 깊은 명상과 트랜스 상태로 인도합니다.",
        videoUrl: "https://youtu.be/WcREkpJ5I_0?si=YUyV1CEIOLyXWesW",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8521877785"
    },

    // 13. C# Yisha Savita 9 (The Energetic Major / Annapurna)
    {
        id: "cs_yisha_savita_9",
        name: "C# Yisha Savita 9",
        notes: {
            ding: "C#3",
            top: ["G#3", "C4", "C#4", "D#4", "F4", "F#4", "G#4", "C#5"],
            bottom: []
        },
        vector: { minorMajor: 0.8, pureSpicy: 0.35, rarePopular: 0.5 },
        tags: ["메이저", "상쾌함", "에너지", "안나푸르나"],
        description: "상쾌하고 에너지가 넘치는 메이저 스케일입니다. 뚜렷한 멜로디 라인과 활기찬 분위기를 만들어냅니다.",
        videoUrl: "",
        productUrl: ""
    },

    // 14. D Asha 15 (2-Octave Major)
    {
        id: "d_asha_15",
        name: "D Asha 15",
        notes: {
            ding: "D3",
            top: ["A3", "B3", "C#4", "D4", "E4", "F#4", "G4", "A4", "B4", "C#5", "D5"],
            bottom: ["E3", "F#3", "G3"]
        },
        vector: { minorMajor: 0.9, pureSpicy: 0.1, rarePopular: 0.8 },
        tags: ["메이저", "2옥타브", "범용성", "협연추천"],
        description: "2옥타브 음역을 완벽하게 커버하는 D Major 스케일입니다. 메이저 조성이 대다수인 일반 대중음악에서의 활용도가 매우 높으며, 다른 악기와의 협연에서도 강력한 강점을 발휘합니다.",
        videoUrl: "https://youtu.be/aGKx4zLFvRo",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12655523545"
    },

    // 15. E Equinox 12 (Normal, Bass 2 Dings)
    {
        id: "e_equinox_12",
        name: "E Equinox 12",
        notes: {
            ding: "E3",
            top: ["G3", "B3", "C4", "D4", "E4", "F#4", "G4", "B4", "C5"],
            bottom: ["C3", "D3"]
        },
        vector: { minorMajor: -0.3, pureSpicy: 0.3, rarePopular: 0.6 },
        tags: ["하이브리드", "저음보강", "감성적", "밸런스"],
        description: "기존 Equinox에 저음(C3, D3)을 보강하여 더욱 풍성한 울림을 제공합니다. 감성적인 연주에 최적화된 밸런스를 자랑합니다.",
        videoUrl: "https://youtu.be/OcQ64DyA9xM?si=40_8I1KnB_rxCNQO",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12320335441"
    },

    // 16. E Equinox 10 (Normal)
    {
        id: "e_equinox_10",
        name: "E Equinox 10",
        notes: {
            ding: "E3",
            top: ["G3", "B3", "C4", "D4", "E4", "F#4", "G4", "B4", "C5"],
            bottom: []
        },
        vector: { minorMajor: -0.3, pureSpicy: 0.3, rarePopular: 0.7 },
        tags: ["하이브리드", "표준", "감성적", "입문추천"],
        description: "Equinox 스케일의 표준 모델입니다. 적절한 음역대와 감성적인 멜로디 라인으로 입문자부터 숙련자까지 모두에게 추천됩니다.",
        videoUrl: "https://youtu.be/8t8MqTelD9k?si=4gbYwCubpVxb_URT",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12320275460"
    },

    // 17. F# Low Pygmy 18 (Mutant)
    {
        id: "fs_low_pygmy_18_mutant",
        name: "F# Low Pygmy 18",
        notes: {
            ding: "F#3",
            top: ["G#3", "A3", "C#4", "E4", "F#4", "G#4", "A4", "B4", "C#5", "E5", "F#5", "G#5"],
            bottom: ["D3", "E3", "B3", "D5"] // Approximate distribution, user to verify
        },
        vector: { minorMajor: -0.6, pureSpicy: 0.25, rarePopular: 0.9 },
        tags: ["뮤턴트", "초고음역", "피그미", "전문가용"],
        description: "Low Pygmy의 확장판으로, 18개의 노트를 통해 광활한 음역대를 제공합니다. 섬세한 고음 표현과 깊은 저음이 어우러진 전문가용 모델입니다.",
        videoUrl: "https://youtu.be/UxsvhXeDok0?si=GnSeCzBk0qe8snYr",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12689630331"
    },

    // 18. C# Pygmy 11 (Normal, Bass 2 Dings)
    {
        id: "cs_pygmy_11",
        name: "C# Pygmy 11",
        notes: {
            ding: "C#3",
            top: ["F#3", "G#3", "A3", "C#4", "E4", "F#4", "G#4", "A4"],
            bottom: ["D3", "E3"]
        },
        vector: { minorMajor: -0.7, pureSpicy: 0.05, rarePopular: 0.8 },
        tags: ["피그미", "저음보강", "트랜스", "깊은울림"],
        description: "클래식 C# Pygmy에 저음(D3, E3)을 추가하여 더욱 깊고 웅장한 사운드를 만들어냅니다. 명상과 힐링에 탁월합니다.",
        videoUrl: "https://youtu.be/QoUbOkhGGR8?si=TIKXYdCKX4RiuaLY",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12276307998"
    },

    // 19. F Low Pygmy 12 (Normal, Bass 2 Dings)
    {
        id: "f_low_pygmy_12",
        name: "F Low Pygmy 12",
        notes: {
            ding: "F3",
            top: ["G3", "Ab3", "C4", "Eb4", "F4", "G4", "Ab4", "C5", "Eb5"],
            bottom: ["Db3", "Eb3"]
        },
        vector: { minorMajor: -0.6, pureSpicy: 0.1, rarePopular: 0.75 },
        tags: ["피그미", "저음보강", "따뜻함", "몽환적"],
        description: "F Pygmy의 부드러움에 저음의 깊이를 더했습니다. 따뜻하고 몽환적인 분위기를 연출하기에 좋습니다.",
        videoUrl: "https://youtu.be/_3jpTdVfOBc?si=W9bAL_AqZ5e25Rj8",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8611436986"
    },

    // 20. D Kurd 12 (Normal, Bass 2 Dings)
    {
        id: "d_kurd_12",
        name: "D Kurd 12",
        notes: {
            ding: "D3",
            top: ["A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5"],
            bottom: ["E3", "F3"]
        },
        vector: { minorMajor: -0.8, pureSpicy: 0.1, rarePopular: 0.95 },
        tags: ["마이너", "저음보강", "표준확장", "풍성함"],
        description: "가장 인기 있는 D Kurd 스케일에 저음(E, F)을 추가하여 더욱 풍성한 연주가 가능합니다. 초보자부터 전문가까지 만족할 수 있는 구성입니다.",
        videoUrl: "https://youtu.be/KXDSbCdPjTM?si=3GD2eOil-5WsmVHa",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12070396728"
    },

    // 21. F Low Pygmy 9 (Normal)
    {
        id: "f_low_pygmy_9",
        name: "F Low Pygmy 9",
        notes: {
            ding: "F3",
            top: ["G3", "G#3", "C4", "D#4", "F4", "G4", "G#4", "C5"],
            bottom: []
        },
        vector: { minorMajor: -0.6, pureSpicy: 0.1, rarePopular: 0.7 },
        tags: ["피그미", "기본", "차분함", "명상"],
        description: "차분하고 안정적인 F Pygmy 스케일의 기본형입니다. 명상과 힐링 연주에 적합한 부드러운 음색을 가졌습니다.",
        videoUrl: "https://youtu.be/61g8qreUeJk?si=NgBTdfaU51SV__5O",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12085324936"
    },

    // 22. C# Annapurna 9 (Normal)
    {
        id: "cs_annapurna_9",
        name: "C# Annapurna 9",
        notes: {
            ding: "C#3",
            top: ["G#3", "C4", "C#4", "D#4", "F4", "F#4", "G#4", "C#5"],
            bottom: []
        },
        vector: { minorMajor: 0.8, pureSpicy: 0.35, rarePopular: 0.5 },
        tags: ["메이저", "안나푸르나", "상쾌함", "에너지"],
        description: "Yisha Savita와 동일한 구성으로, 안나푸르나의 웅장함과 상쾌함을 담은 메이저 스케일입니다.",
        videoUrl: "https://youtu.be/HSHDfm9PEM4?si=930q4Eu3DT2URi50",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8513450652"
    },

    // 23. C Major 9
    {
        id: "c_major_9",
        name: "C Major 9",
        notes: {
            ding: "C3",
            top: ["G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4"],
            bottom: []
        },
        vector: { minorMajor: 1.0, pureSpicy: 0.0, rarePopular: 0.6 },
        tags: ["메이저", "기본", "밝음", "동요"],
        description: "가장 기본적이고 순수한 C Major 스케일입니다. 밝고 명랑하며, 누구나 아는 멜로디를 연주하기에 좋습니다.",
        videoUrl: "https://youtu.be/2peCXnJP2U0?si=bVePs8DvAlPEwI7v",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12751985321"
    },

    // 24. C Rasavali 9
    {
        id: "c_rasavali_9",
        name: "C Rasavali 9",
        notes: {
            ding: "C3",
            top: ["G3", "Ab3", "C4", "D4", "E4", "F4", "G4", "Ab4", "C5"],
            bottom: []
        },
        vector: { minorMajor: -0.2, pureSpicy: 0.6, rarePopular: 0.3 },
        tags: ["라사발리", "인도풍", "신비로움", "독특함"],
        description: "인도 음악의 색채를 지닌 신비로운 스케일입니다. 독특한 음계가 만들어내는 묘한 분위기가 매력적입니다.",
        videoUrl: "https://youtu.be/u9dsmUSd_SY?si=rMBMQOFvj5Yec7vs",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12751991029"
    },

    // 25. C# Deepasia 14 (Normal)
    {
        id: "cs_deepasia_14",
        name: "C# Deepasia 14",
        notes: {
            ding: "C#3",
            top: ["G#3", "A#3", "C#4", "D#4", "F4", "F4", "F#4", "G#4", "C#5", "D#5", "F5"],
            bottom: ["D#3", "F3"]
        },
        vector: { minorMajor: -0.5, pureSpicy: 0.5, rarePopular: 0.4 },
        tags: ["딥아시아", "동양적", "확장형", "깊음"],
        description: "동양적인 깊은 울림을 가진 스케일입니다. 14개의 노트로 확장되어 더욱 풍성하고 명상적인 연주가 가능합니다.",
        videoUrl: "https://youtu.be/pMKoFUicrFw?si=5HPgyOp8NM0qXMNU",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12689651421"
    },

    // 26. C# Blues 9 (Normal)
    {
        id: "cs_blues_9",
        name: "C# Blues 9",
        notes: {
            ding: "C#3",
            top: ["G#3", "B3", "C#4", "E4", "F#4", "G4", "G#4", "B4"],
            bottom: []
        },
        vector: { minorMajor: -0.1, pureSpicy: 0.6, rarePopular: 0.4 },
        tags: ["블루스", "재즈", "감성적", "그루브"],
        description: "블루지한 감성을 담은 스케일입니다. 재즈나 소울풀한 연주에 적합하며, 특유의 그루브가 살아있습니다.",
        videoUrl: "https://youtu.be/mY-Uvw-VKO4?si=Ail972LckjNWKp8S",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12689712335"
    },

    // 27. Eb MUJU 10 (Normal)
    {
        id: "eb_muju_10",
        name: "Eb MUJU 10",
        notes: {
            ding: "Eb3",
            top: ["G3", "Ab3", "Bb3", "C4", "Eb4", "F4", "G4", "Ab4", "C5"],
            bottom: []
        },
        vector: { minorMajor: 0.5, pureSpicy: 0.2, rarePopular: 0.3 },
        tags: ["무주", "평화", "자연", "치유"],
        description: "무주의 자연을 닮은 평화로운 스케일입니다. 부드럽고 따뜻한 음색으로 마음을 치유하는 힘이 있습니다.",
        videoUrl: "https://youtu.be/0IGtmQlb1X4?si=y9oZiE4w-_Zkyih6",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8513504905"
    },

    // 28. C Yunsl 9 (Normal)
    {
        id: "c_yunsl_9",
        name: "C 윤슬 9",
        notes: {
            ding: "C3",
            top: ["C4", "D4", "E4", "F4", "G4", "B4", "C5"],
            bottom: []
        },
        vector: { minorMajor: 0.8, pureSpicy: 0.1, rarePopular: 0.5 },
        tags: ["윤슬", "반짝임", "맑음", "서정적"],
        description: "물결에 비치는 햇살(윤슬)처럼 맑고 반짝이는 소리를 가졌습니다. 서정적이고 아름다운 멜로디 연주에 좋습니다.",
        videoUrl: "https://youtu.be/_fB5VHpE1f0?si=v6RDSBTJJUsiAZXK",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12752009418"
    },

    // 29. C# Sapphire 9 (Normal)
    {
        id: "cs_sapphire_9",
        name: "C# Sapphire 9",
        notes: {
            ding: "C#3",
            top: ["G#3", "B3", "C#4", "F4", "F#4", "G#4", "B4", "C#5"],
            bottom: []
        },
        vector: { minorMajor: -0.2, pureSpicy: 0.4, rarePopular: 0.4 },
        tags: ["사파이어", "청량함", "보석", "세련됨"],
        description: "사파이어 보석처럼 청량하고 세련된 울림을 줍니다. 깔끔하고 모던한 느낌의 연주를 선호하는 분들께 추천합니다.",
        videoUrl: "https://youtu.be/V1bfHlVl9VY?si=yREB5-6dey1kvC_4",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12752029521"
    },

    // 30. C# Annaziska 9 (Normal)
    {
        id: "cs_annaziska_9",
        name: "C# Annaziska 9",
        notes: {
            ding: "C#3",
            top: ["G#3", "A3", "B3", "C#4", "D#4", "E4", "F#4", "G#4"],
            bottom: []
        },
        vector: { minorMajor: -0.4, pureSpicy: 0.5, rarePopular: 0.2 },
        tags: ["이국적", "긴장감", "신비", "매니아"],
        description: "신비롭고 약간의 긴장감을 주는 이국적인 스케일입니다. 독특한 분위기를 연출하고 싶은 연주자에게 적합합니다.",
        videoUrl: "https://youtu.be/Z3bVZYykphA?si=zJAD4lmQPxMQ0xq8",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12085316070"
    },

    // 31. E Hijaz 9 (Normal)
    {
        id: "e_hijaz_9",
        name: "E Hijaz 9",
        notes: {
            ding: "E3",
            top: ["A3", "B3", "C4", "D#4", "E4", "F#4", "G4", "B4"],
            bottom: []
        },
        vector: { minorMajor: -0.3, pureSpicy: 0.7, rarePopular: 0.5 },
        tags: ["이국적", "중동풍", "정열적", "스파이시"],
        description: "E 키의 히자즈 스케일로, 중동의 정열적이고 스파이시한 느낌을 강하게 전달합니다.",
        videoUrl: "https://youtu.be/MRyGVe5k4Y8?si=VEoopVqXSO9gJ6Rd",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12085332035"
    }
];
