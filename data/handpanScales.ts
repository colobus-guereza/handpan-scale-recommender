export interface Scale {
    id: string;
    name: string;
    nameEn?: string;
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
    tagsEn?: string[];
    description: string;
    descriptionEn?: string;
    videoUrl?: string;
    productUrl?: string;
    ownUrl?: string;
}

export const VECTOR_AXES = {
    minorMajor: {
        id: 'minorMajor',
        label: '조성 (Mood)',
        labelEn: 'Mood',
        description: '스케일이 주는 전체적인 감정적 분위기를 나타냅니다.',
        descriptionEn: 'Represents the overall emotional atmosphere of the scale.',
        minLabel: 'Minor (단조)',
        minLabelEn: 'Minor',
        maxLabel: 'Major (장조)',
        maxLabelEn: 'Major',
        range: '-1.0 ~ +1.0'
    },
    pureSpicy: {
        id: 'pureSpicy',
        label: '음향 질감 (Tone)',
        labelEn: 'Tone',
        description: '소리의 담백함과 화려함의 정도를 나타냅니다.',
        descriptionEn: 'Represents the degree of simplicity vs. complexity of the sound.',
        minLabel: 'Pure (담백함)',
        minLabelEn: 'Pure',
        maxLabel: 'Spicy (화려함)',
        maxLabelEn: 'Spicy',
        range: '0.0 ~ 1.0'
    },
    rarePopular: {
        id: 'rarePopular',
        label: '대중성 (Popularity)',
        labelEn: 'Popularity',
        description: '시장에서의 희소성과 대중적인 인기를 나타냅니다.',
        descriptionEn: 'Represents market rarity and popular demand.',
        minLabel: 'Rare (희소함)',
        minLabelEn: 'Rare',
        maxLabel: 'Popular (대중적)',
        maxLabelEn: 'Popular',
        range: '0.0 ~ 1.0'
    }
} as const;

export const SCALES: Scale[] = [
    // 1. D Kurd 9 (The Standard Minor)
    {
        id: "d_kurd_9",
        name: "D Kurd 9",
        nameEn: "D Kurd 9",
        notes: {
            ding: "D3",
            top: ["A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4"],
            bottom: []
        },
        vector: { minorMajor: -0.8, pureSpicy: 0.1, rarePopular: 1.0 },
        tags: ["마이너", "대중적", "감성적"],
        tagsEn: ["Minor", "Popular", "Emotional"],
        description: "가장 대중적인 마이너 스케일입니다. 깊고 감성적인 울림으로 완벽한 균형을 이룹니다.",
        descriptionEn: "The most popular minor scale. It achieves perfect balance with a deep and emotional resonance.",
        videoUrl: "https://youtu.be/IvdeC_YuSIg",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/9206864886",
        ownUrl: "https://handpan.co.kr/shop/?idx=75"
    },

    // 2. D Kurd 10 (The Standard Minor Extended)
    {
        id: "d_kurd_10",
        name: "D Kurd 10",
        nameEn: "D Kurd 10",
        notes: {
            ding: "D3",
            top: ["A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5"],
            bottom: []
        },
        vector: { minorMajor: -0.8, pureSpicy: 0.1, rarePopular: 0.98 },
        tags: ["마이너", "대중적", "연습곡 제일 많음", "유튜브에 교재도 많음"],
        tagsEn: ["Minor", "Popular", "Most Practice Songs", "Many Tutorials"],
        description: "대중적인 D minor와 같은 음계인 D Kurd 10으로, 유튜브에 악보와 연습곡이 가장 많은 입문용에 적합한 모델입니다.",
        descriptionEn: "D Kurd 10, the same scale as the popular D minor. It is the best model for beginners with the most sheet music and practice songs available on YouTube.",
        videoUrl: "https://youtu.be/uL40C1bqKik?si=DpqHwPB_RLpcA5mc",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/7514024868",
        ownUrl: "https://handpan.co.kr/shop/?idx=74"
    },

    // 3. E Equinox 14 (Mutant/Extended)
    {
        id: "e_equinox_14_mutant",
        name: "E Equinox 14",
        nameEn: "E Equinox 14",
        notes: {
            ding: "E3",
            top: ["G3", "B3", "C4", "D4", "E4", "F#4", "G4", "B4", "C5"],
            bottom: ["C3", "D3", "D5", "E5"]
        },
        vector: { minorMajor: -0.4, pureSpicy: 0.4, rarePopular: 0.5 },
        tags: ["하이브리드", "시네마틱", "상급자용", "달콤씁쓸한"],
        tagsEn: ["Hybrid", "Cinematic", "Advanced", "Bittersweet"],
        description: "메이저와 마이너의 경계에 있는 하이브리드 스케일입니다. 시네마틱한 감성과 달콤씁쓸한 매력이 특징이며, 묵직한 저음을 포함한 14개의 노트로 풍성함을 자랑합니다. 상급자용 모델로 복잡하고 감성적인 연주에 적합합니다.",
        descriptionEn: "A hybrid scale on the border of major and minor. Featuring cinematic emotion and bittersweet charm, it boasts richness with 14 notes including heavy bass. Suitable for advanced players for complex and emotional performance.",
        videoUrl: "https://youtu.be/v9pXYwhylPg?si=Em_dHnMGyeU19YkE",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12351119980",
        ownUrl: "https://handpan.co.kr/shop/?idx=78"
    },

    // 4. F# Low Pygmy 14 (The Global Bestseller) - Mutant
    {
        id: "fs_low_pygmy_14_mutant",
        name: "F# Low Pygmy 14",
        nameEn: "F# Low Pygmy 14",
        notes: {
            ding: "F#3",
            top: ["G#3", "A3", "C#4", "E4", "F#4", "G#4", "A4", "B4", "C#5", "E5", "F#5"],
            bottom: ["D3", "E3"]
        },
        vector: { minorMajor: -0.6, pureSpicy: 0.25, rarePopular: 0.95 },
        tags: ["Malte Marten Style", "Bestseller", "Deep", "Storytelling"],
        tagsEn: ["Malte Marten Style", "Bestseller", "Deep", "Storytelling"],
        description: "전 세계적으로 가장 인기 있는 베스트셀러 스케일입니다. 낮은 저음 노트들이 조화로운 이야기를 만들어내는 스토리텔링이 특징이며, 깊은 울림을 자랑합니다. Malte Marten 같은 연주자들에 의해 널리 알려진 스타일입니다.",
        descriptionEn: "The world's most popular bestseller scale. Characterized by storytelling where low bass notes create harmonious stories, it boasts deep resonance. A style widely known by players like Malte Marten.",
        videoUrl: "https://youtu.be/SthKlH686Pc?si=_YG050uZwcbIoP0X",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12070387231",
        ownUrl: "https://handpan.co.kr/shop/?idx=97"
    },

    // 5. F Aeolian 10 (Domestic Steady Seller)
    {
        id: "f_aeolian_10",
        name: "F Aeolian 10",
        nameEn: "F Aeolian 10",
        notes: {
            ding: "F3",
            top: ["Ab3", "Bb3", "C4", "Db4", "Eb4", "F4", "G4", "Ab4", "C5"],
            bottom: []
        },
        vector: { minorMajor: -0.8, pureSpicy: 0.15, rarePopular: 0.7 },
        tags: ["국내인기", "안정적", "우울함", "변신가능", "바텀업그레이드", "가성비최고"],
        tagsEn: ["Domestic Popular", "Stable", "Melancholy", "Transformable", "Bottom Upgrade", "Best Value"],
        description: "국내 시장에서 꾸준히 사랑받는 국내인기 스테디셀러입니다. 안정적이고 우울한 감성이 특징이며, 바텀 업그레이드를 통해 다양한 분위기로 변신이 가능합니다. 가성비 최고의 모델로 추천됩니다.",
        descriptionEn: "A steady seller consistently loved in the domestic market. Characterized by stable and melancholic emotion, it can transform into various atmospheres through bottom upgrades. Recommended as the best value model.",
        videoUrl: "https://youtu.be/BH45TEboAgE?si=SLlNpG-5vTLSWAsx",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/9561986680",
        ownUrl: "https://handpan.co.kr/shop/?idx=71"
    },

    // 6. E Romanian Hijaz 10 (The Exotic Individualist)
    {
        id: "e_romanian_hijaz_10",
        name: "E Romanian Hijaz 10",
        nameEn: "E Romanian Hijaz 10",
        notes: {
            ding: "E3",
            top: ["A3", "B3", "C4", "D#4", "E4", "F#4", "G4", "A4", "B4"],
            bottom: []
        },
        vector: { minorMajor: -0.5, pureSpicy: 0.75, rarePopular: 0.35 },
        tags: ["이국적", "집시", "독특함", "보헤미안"],
        tagsEn: ["Exotic", "Gypsy", "Unique", "Bohemian"],
        description: "남들과 다른 독특함을 추구하는 분들을 위한 이국적인 스케일입니다. 집시와 보헤미안 음악을 연상시키는 강렬하고 신비로운 분위기를 자아냅니다.",
        descriptionEn: "An exotic scale for those seeking uniqueness. It creates an intense and mysterious atmosphere reminiscent of Gypsy and Bohemian music.",
        videoUrl: "https://youtu.be/gTEsQG3dfKQ?si=IJcS8SYJe9468WgP",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8681747137",
        ownUrl: "https://handpan.co.kr/shop/?idx=72"
    },

    // 7. D Saladin 9 (The Extreme Niche)
    {
        id: "d_saladin_9",
        name: "D Saladin 9",
        nameEn: "D Saladin 9",
        notes: {
            ding: "D3",
            top: ["G3", "A3", "C4", "D4", "Eb4", "F#4", "G4", "A4"],
            bottom: []
        },
        vector: { minorMajor: -0.2, pureSpicy: 0.85, rarePopular: 0.1 },
        tags: ["아라비안", "희귀함", "매운맛", "프리지안"],
        tagsEn: ["Arabian", "Rare", "Spicy", "Phrygian"],
        description: "아라비안 나이트를 연상시키는 매우 이국적이고 강렬한 프리지안 스케일입니다. 희귀함과 매운맛이 특징이며, 희소성이 높아 독보적인 개성을 표현하기 좋습니다.",
        descriptionEn: "A very exotic and intense Phrygian scale reminiscent of Arabian Nights. Characterized by rarity and spiciness, it's great for expressing unique individuality.",
        videoUrl: "https://youtu.be/OJWGyT1OxIg?si=RM_0FkjjEuxaWPJu",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8669289024",
        ownUrl: "https://handpan.co.kr/shop/?idx=85"
    },

    // 8. D Asha 9 (The Gentle Major / Sabye)
    {
        id: "d_asha_9",
        name: "D Asha 9",
        nameEn: "D Asha 9",
        notes: {
            ding: "D3",
            top: ["G3", "A3", "B3", "C#4", "D4", "E4", "F#4", "A4"],
            bottom: []
        },
        vector: { minorMajor: 0.9, pureSpicy: 0.1, rarePopular: 0.9 },
        tags: ["D메이저", "세컨드핸드팬인기", "젠틀소프트", "Sabye", "Ashakiran"],
        tagsEn: ["D Major", "Popular Second Handpan", "Gentle Soft", "Sabye", "Ashakiran"],
        description: "Sabye 또는 Ashakiran이라고도 불리는 부드럽고 온화한 D 메이저 스케일입니다. 젠틀하고 소프트한 음색으로 순수한 빛과 희망을 담고 있으며, 마이너 스케일과 함께 연주하기 좋은 최고의 세컨드 핸드팬으로 인기가 높습니다.",
        descriptionEn: "A soft and gentle D Major scale, also known as Sabye or Ashakiran. It embodies pure light and hope with a gentle tone, and is highly popular as a second handpan to play alongside minor scales.",
        videoUrl: "https://youtu.be/4tgdyOhT-RI?si=9SQ66sdPiwvgxoP7",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8497384066",
        ownUrl: "https://handpan.co.kr/shop/?idx=87"
    },

    // 9. E La Sirena 10 (The Siren / Dorian)
    {
        id: "e_la_sirena_10",
        name: "E La Sirena 10",
        nameEn: "E La Sirena 10",
        notes: {
            ding: "E3",
            top: ["G3", "B3", "C#4", "D4", "E4", "F#4", "G4", "B4", "E5"],
            bottom: []
        },
        vector: { minorMajor: -0.3, pureSpicy: 0.6, rarePopular: 0.4 },
        tags: ["도리안", "중급자용", "세이렌", "C#4활용이포인트"],
        tagsEn: ["Dorian", "Intermediate", "Siren", "C#4 Point"],
        description: "'세이렌'이라는 이름처럼 신비롭고 깊은 물속을 유영하는 듯한 느낌을 주는 도리안 스케일입니다. 메이저와 마이너를 오가는 묘한 매력이 있으며, C#4 노트의 활용이 포인트입니다. 중급자용 모델로 추천됩니다.",
        descriptionEn: "A Dorian scale that gives the feeling of swimming in mysterious deep water, like its name 'Siren'. It has a subtle charm shifting between major and minor, with the use of the C#4 note being a key point. Recommended for intermediate players.",
        videoUrl: "https://youtu.be/B-7jukbN3hw?si=ci_6mlElCZvu_WGH",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8490886007",
        ownUrl: "https://handpan.co.kr/shop/?idx=73"
    },

    // 10. C# Pygmy 9 (The Original Trance Classic)
    {
        id: "cs_pygmy_9",
        name: "C# Pygmy 9",
        nameEn: "C# Pygmy 9",
        notes: {
            ding: "C#3",
            top: ["F#3", "G#3", "A3", "C#4", "E4", "F#4", "G#4", "A4"],
            bottom: []
        },
        vector: { minorMajor: -0.7, pureSpicy: 0.05, rarePopular: 0.85 },
        tags: ["피그미", "트랜스", "깊음", "클래식"],
        tagsEn: ["Pygmy", "Trance", "Deep", "Classic"],
        description: "핸드팬의 고전이자 명작인 클래식 피그미 스케일입니다. 특유의 공허하고 몽환적인 깊은 울림은 깊은 명상과 트랜스 상태로 인도합니다.",
        descriptionEn: "A classic Pygmy scale, a masterpiece of handpans. Its unique hollow and dreamy deep resonance leads to deep meditation and trance states.",
        videoUrl: "https://youtu.be/WcREkpJ5I_0?si=YUyV1CEIOLyXWesW",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8521877785",
        ownUrl: "https://handpan.co.kr/shop/?idx=88"
    },

    // 11. D Asha 15 (2-Octave Major) - Mutant
    {
        id: "d_asha_15_mutant",
        name: "D Asha 15",
        nameEn: "D Asha 15",
        notes: {
            ding: "D3",
            top: ["A3", "B3", "C#4", "D4", "E4", "F#4", "G4", "A4", "B4", "C#5", "D5"],
            bottom: ["E3", "F#3", "G3"]
        },
        vector: { minorMajor: 0.9, pureSpicy: 0.1, rarePopular: 0.8 },
        tags: ["D메이저", "2옥타브", "범용성", "협연추천"],
        tagsEn: ["D Major", "2 Octaves", "Versatile", "Great for Jamming"],
        description: "2옥타브 음역을 완벽하게 커버하는 D 메이저 스케일입니다. 범용성이 뛰어나 메이저 조성이 대다수인 일반 대중음악에서의 활용도가 매우 높으며, 다른 악기와의 협연에서도 강력한 강점을 발휘하는 협연 추천 모델입니다.",
        descriptionEn: "A D Major scale that perfectly covers a 2-octave range. With excellent versatility, it is highly useful in popular music where major keys are dominant, and is strongly recommended for jamming with other instruments.",
        videoUrl: "https://youtu.be/aGKx4zLFvRo",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12655523545",
        ownUrl: "https://handpan.co.kr/shop/?idx=77"
    },

    // 12. E Equinox 12 (Normal, Bass 2 Dings)
    {
        id: "e_equinox_12",
        name: "E Equinox 12",
        nameEn: "E Equinox 12",
        notes: {
            ding: "E3",
            top: ["G3", "B3", "C4", "D4", "E4", "F#4", "G4", "B4", "C5"],
            bottom: ["C3", "D3"]
        },
        vector: { minorMajor: -0.3, pureSpicy: 0.3, rarePopular: 0.6 },
        tags: ["하이브리드", "저음보강", "감성적", "밸런스"],
        tagsEn: ["Hybrid", "Bass Boost", "Emotional", "Balanced"],
        description: "하이브리드 스케일인 기존 Equinox에 저음(C3, D3)을 보강하여 더욱 풍성한 울림을 제공합니다. 감성적인 연주에 최적화된 완벽한 밸런스를 자랑합니다.",
        descriptionEn: "Adds bass notes (C3, D3) to the hybrid Equinox scale for a richer resonance. Boasts perfect balance optimized for emotional performance.",
        videoUrl: "https://youtu.be/OcQ64DyA9xM?si=40_8I1KnB_rxCNQO",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12320335441",
        ownUrl: "https://handpan.co.kr/shop/?idx=79"
    },

    // 13. E Equinox 10 (Normal)
    {
        id: "e_equinox_10",
        name: "E Equinox 10",
        nameEn: "E Equinox 10",
        notes: {
            ding: "E3",
            top: ["G3", "B3", "C4", "D4", "E4", "F#4", "G4", "B4", "C5"],
            bottom: []
        },
        vector: { minorMajor: -0.3, pureSpicy: 0.3, rarePopular: 0.7 },
        tags: ["메이저마이너", "그사이어딘가", "미묘한느낌", "색다른감성추천"],
        tagsEn: ["Major-Minor", "Somewhere In Between", "Subtle Feeling", "Unique Emotion"],
        description: "Equinox 스케일의 표준 모델로, 메이저와 마이너 그 사이 어딘가의 미묘한 느낌이 특징입니다. 색다른 감성을 추구하는 분들에게 추천되며, 적절한 음역대와 감성적인 멜로디 라인으로 입문자부터 숙련자까지 모두에게 적합합니다.",
        descriptionEn: "The standard model of the Equinox scale, characterized by a subtle feeling somewhere between major and minor. Recommended for those seeking unique emotions, it is suitable for everyone from beginners to experts with its appropriate range and emotional melody lines.",
        videoUrl: "https://youtu.be/8t8MqTelD9k?si=4gbYwCubpVxb_URT",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12320275460",
        ownUrl: "https://handpan.co.kr/shop/?idx=80"
    },

    // 14. F# Low Pygmy 18 (Mutant)
    {
        id: "fs_low_pygmy_18_mutant",
        name: "F# Low Pygmy 18",
        nameEn: "F# Low Pygmy 18",
        notes: {
            ding: "F#3",
            top: ["G#3", "A3", "C#4", "E4", "F#4", "G#4", "A4", "B4", "C#5", "E5", "F#5", "G#5"],
            bottom: ["D3", "E3", "B3", "D5"]
        },
        vector: { minorMajor: -0.6, pureSpicy: 0.25, rarePopular: 0.9 },
        tags: ["Malte Marten Style", "뮤턴트", "초고음역", "피그미", "전문가용"],
        tagsEn: ["Malte Marten Style", "Mutant", "Ultra High Range", "Pygmy", "Professional"],
        description: "Malte Marten 스타일의 뮤턴트 피그미 스케일로, Low Pygmy의 확장판입니다. 18개의 노트를 통해 광활한 음역대와 초고음역을 제공하며, 섬세한 고음 표현과 깊은 저음이 어우러진 전문가용 모델입니다.",
        descriptionEn: "A mutant Pygmy scale in the Malte Marten style, an extension of the Low Pygmy. With 18 notes providing a vast range including ultra-highs, it is a professional model combining delicate high notes with deep bass.",
        videoUrl: "https://youtu.be/UxsvhXeDok0?si=GnSeCzBk0qe8snYr",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12689630331",
        ownUrl: "https://handpan.co.kr/shop/?idx=76"
    },

    // 15. C# Pygmy 11 (Normal, Bass 2 Dings)
    {
        id: "cs_pygmy_11",
        name: "C# Pygmy 11",
        nameEn: "C# Pygmy 11",
        notes: {
            ding: "C#3",
            top: ["F#3", "G#3", "A3", "C#4", "E4", "F#4", "G#4", "A4"],
            bottom: ["D3", "E3"]
        },
        vector: { minorMajor: -0.7, pureSpicy: 0.05, rarePopular: 0.8 },
        tags: ["피그미", "저음보강", "트랜스", "깊은울림"],
        tagsEn: ["Pygmy", "Bass Boost", "Trance", "Deep Resonance"],
        description: "클래식 피그미 스케일인 C# Pygmy에 저음(D3, E3)을 보강하여 더욱 깊고 웅장한 깊은 울림을 만들어냅니다. 트랜스와 명상, 힐링 연주에 탁월합니다.",
        descriptionEn: "Adds bass notes (D3, E3) to the classic C# Pygmy scale for a deeper and more majestic resonance. Excellent for trance, meditation, and healing performances.",
        videoUrl: "https://youtu.be/QoUbOkhGGR8?si=TIKXYdCKX4RiuaLY",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12276307998",
        ownUrl: "https://handpan.co.kr/shop/?idx=81"
    },

    // 16. F Low Pygmy 12 (Normal, Bass 2 Dings)
    {
        id: "f_low_pygmy_12",
        name: "F Low Pygmy 12",
        nameEn: "F Low Pygmy 12",
        notes: {
            ding: "F3",
            top: ["G3", "Ab3", "C4", "Eb4", "F4", "G4", "Ab4", "C5", "Eb5"],
            bottom: ["Db3", "Eb3"]
        },
        vector: { minorMajor: -0.6, pureSpicy: 0.1, rarePopular: 0.75 },
        tags: ["피그미", "저음보강", "따뜻함", "몽환적"],
        tagsEn: ["Pygmy", "Bass Boost", "Warm", "Dreamy"],
        description: "피그미 스케일인 F Pygmy의 부드러움에 저음을 보강하여 깊이를 더했습니다. 따뜻하고 몽환적인 분위기를 연출하기에 좋습니다.",
        descriptionEn: "Adds bass notes to the softness of the F Pygmy scale for added depth. Great for creating a warm and dreamy atmosphere.",
        videoUrl: "https://youtu.be/_3jpTdVfOBc?si=W9bAL_AqZ5e25Rj8",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8611436986",
        ownUrl: "https://handpan.co.kr/shop/?idx=82"
    },

    // 17. D Kurd 12 (Normal, Bass 2 Dings)
    {
        id: "d_kurd_12",
        name: "D Kurd 12",
        nameEn: "D Kurd 12",
        notes: {
            ding: "D3",
            top: ["A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5"],
            bottom: ["E3", "F3"]
        },
        vector: { minorMajor: -0.8, pureSpicy: 0.1, rarePopular: 0.95 },
        tags: ["마이너", "저음보강", "표준확장", "딩베이스", "화성연주"],
        tagsEn: ["Minor", "Bass Boost", "Standard Extended", "Ding Bass", "Harmonic Play"],
        description: "마이너 스케일인 D Kurd 10 악기에 바텀 업그레이드 한 표준확장형으로, 저음을 보강하여 하단 두개의 딩 베이스로 화성 연주가 가능한 모델입니다.",
        descriptionEn: "A standard extended version of the D Kurd 10 minor scale with bottom upgrades. Reinforced with bass notes, it allows for harmonic play with two bottom ding basses.",
        videoUrl: "https://youtu.be/KXDSbCdPjTM?si=3GD2eOil-5WsmVHa",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12070396728",
        ownUrl: "https://handpan.co.kr/shop/?idx=83"
    },

    // 18. F Low Pygmy 9 (Normal)
    {
        id: "f_low_pygmy_9",
        name: "F Low Pygmy 9",
        nameEn: "F Low Pygmy 9",
        notes: {
            ding: "F3",
            top: ["G3", "G#3", "C4", "D#4", "F4", "G4", "G#4", "C5"],
            bottom: []
        },
        vector: { minorMajor: -0.6, pureSpicy: 0.1, rarePopular: 0.7 },
        tags: ["피그미", "기본", "차분함", "명상"],
        tagsEn: ["Pygmy", "Basic", "Calm", "Meditation"],
        description: "차분하고 안정적인 Pygmy 스케일의 기본형입니다. 명상과 힐링 연주에 적합한 부드러운 음색을 가졌습니다.",
        descriptionEn: "The basic form of the calm and stable Pygmy scale. It has a soft tone suitable for meditation and healing performances.",
        videoUrl: "https://youtu.be/61g8qreUeJk?si=NgBTdfaU51SV__5O",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12085324936",
        ownUrl: "https://handpan.co.kr/shop/?idx=86"
    },

    // 19. C# Annapurna 9 (Normal)
    {
        id: "cs_annapurna_9",
        name: "C# Annapurna 9",
        nameEn: "C# Annapurna 9",
        notes: {
            ding: "C#3",
            top: ["G#3", "C4", "C#4", "D#4", "F4", "F#4", "G#4", "C#5"],
            bottom: []
        },
        vector: { minorMajor: 0.8, pureSpicy: 0.35, rarePopular: 0.5 },
        tags: ["메이저", "안나푸르나", "상쾌함", "에너지"],
        tagsEn: ["Major", "Annapurna", "Refreshing", "Energy"],
        description: "Yisha Savita와 동일한 구성으로, 안나푸르나의 웅장함과 상쾌함, 에너지를 담은 메이저 스케일입니다.",
        descriptionEn: "A major scale with the same composition as Yisha Savita, embodying the majesty, freshness, and energy of Annapurna.",
        videoUrl: "https://youtu.be/HSHDfm9PEM4?si=930q4Eu3DT2URi50",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8513450652",
        ownUrl: "https://handpan.co.kr/shop/?idx=89"
    },

    // 20. C Major 10
    {
        id: "c_major_10",
        name: "C Major 10",
        nameEn: "C Major 10",
        notes: {
            ding: "C3",
            top: ["G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4"],
            bottom: []
        },
        vector: { minorMajor: 1.0, pureSpicy: 0.0, rarePopular: 0.6 },
        tags: ["메이저", "기본", "밝음", "동요"],
        tagsEn: ["Major", "Basic", "Bright", "Nursery Rhymes"],
        description: "가장 기본적이고 순수한 메이저 스케일인 C Major입니다. 밝고 명랑하며, 동요와 같이 누구나 아는 멜로디를 연주하기에 좋습니다.",
        descriptionEn: "C Major, the most basic and pure major scale. It is bright and cheerful, great for playing familiar melodies like nursery rhymes.",
        videoUrl: "https://youtu.be/2peCXnJP2U0?si=bVePs8DvAlPEwI7v",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12751985321",
        ownUrl: "https://handpan.co.kr/shop/?idx=91"
    },

    // 21. C Rasavali 10
    {
        id: "c_rasavali_10",
        name: "C Rasavali 10",
        nameEn: "C Rasavali 10",
        notes: {
            ding: "C3",
            top: ["G3", "Ab3", "C4", "D4", "E4", "F4", "G4", "Ab4", "C5"],
            bottom: []
        },
        vector: { minorMajor: -0.2, pureSpicy: 0.6, rarePopular: 0.3 },
        tags: ["라사발리", "인도풍", "신비로움", "독특함"],
        tagsEn: ["Rasavali", "Indian Style", "Mysterious", "Unique"],
        description: "라사발리 스케일로, 인도풍의 색채를 지닌 신비로운 스케일입니다. 독특한 음계가 만들어내는 묘한 분위기가 매력적입니다.",
        descriptionEn: "A Rasavali scale with Indian-style colors. The mysterious atmosphere created by its unique scale is attractive.",
        videoUrl: "https://youtu.be/u9dsmUSd_SY?si=rMBMQOFvj5Yec7vs",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12751991029",
        ownUrl: "https://handpan.co.kr/shop/?idx=92"
    },

    // 22. C# Deepasia 14 (Normal)
    {
        id: "cs_deepasia_14",
        name: "C# Deepasia 14",
        nameEn: "C# Deepasia 14",
        notes: {
            ding: "C#3",
            top: ["G#3", "A#3", "C#4", "D#4", "F4", "F4", "F#4", "G#4", "C#5", "D#5", "F5"],
            bottom: ["D#3", "F3"]
        },
        vector: { minorMajor: -0.5, pureSpicy: 0.5, rarePopular: 0.4 },
        tags: ["딥아시아", "동양적", "확장형", "깊음"],
        tagsEn: ["Deep Asia", "Oriental", "Extended", "Deep"],
        description: "딥아시아 스케일로, 동양적인 깊은 울림을 가진 확장형 모델입니다. 14개의 노트로 확장되어 더욱 풍성하고 명상적인 연주가 가능합니다.",
        descriptionEn: "A Deep Asia scale, an extended model with deep oriental resonance. Expanded to 14 notes, it allows for richer and more meditative performances.",
        videoUrl: "https://youtu.be/pMKoFUicrFw?si=5HPgyOp8NM0qXMNU",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12689651421",
        ownUrl: "https://handpan.co.kr/shop/?idx=84"
    },

    // 23. C# Blues 9 (Normal)
    {
        id: "cs_blues_9",
        name: "C# Blues 9",
        nameEn: "C# Blues 9",
        notes: {
            ding: "C#3",
            top: ["G#3", "B3", "C#4", "E4", "F#4", "G4", "G#4", "B4"],
            bottom: []
        },
        vector: { minorMajor: -0.1, pureSpicy: 0.6, rarePopular: 0.4 },
        tags: ["블루스", "재즈", "감성적", "그루브"],
        tagsEn: ["Blues", "Jazz", "Emotional", "Groove"],
        description: "블루스 스케일로, 블루지한 감성을 담은 스케일입니다. 재즈나 소울풀한 연주에 적합하며, 특유의 그루브가 살아있는 감성적인 모델입니다.",
        descriptionEn: "A Blues scale capturing bluesy emotions. Suitable for jazz or soulful playing, it is an emotional model with a distinct groove.",
        videoUrl: "https://youtu.be/mY-Uvw-VKO4?si=Ail972LckjNWKp8S",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12689712335",
        ownUrl: "https://handpan.co.kr/shop/?idx=90"
    },

    // 24. Eb MUJU 10 (Normal)
    {
        id: "eb_muju_10",
        name: "Eb MUJU 10",
        nameEn: "Eb MUJU 10",
        notes: {
            ding: "Eb3",
            top: ["G3", "Ab3", "Bb3", "C4", "Eb4", "F4", "G4", "Ab4", "C5"],
            bottom: []
        },
        vector: { minorMajor: 0.5, pureSpicy: 0.2, rarePopular: 0.3 },
        tags: ["Eb메이저", "국악평조", "아리랑음계", "무주자연"],
        tagsEn: ["Eb Major", "Korean Traditional", "Arirang Scale", "Muju Nature"],
        description: "Eb 메이저 스케일로, 국악 평조와 아리랑 음계를 담고 있습니다. 무주의 자연을 닮은 평화로운 스케일이며, 부드럽고 따뜻한 음색으로 마음을 치유하는 힘이 있습니다.",
        descriptionEn: "Eb Major scale containing Korean traditional Pyeongjo and Arirang scales. A peaceful scale resembling the nature of Muju, it has the power to heal the mind with its soft and warm tone.",
        videoUrl: "https://youtu.be/0IGtmQlb1X4?si=y9oZiE4w-_Zkyih6",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8513504905",
        ownUrl: "https://handpan.co.kr/shop/?idx=96"
    },

    // 25. C Yunsl 9 (Normal)
    {
        id: "c_yunsl_9",
        name: "C Yunsl 9",
        nameEn: "C Yunsl 9",
        notes: {
            ding: "C3",
            top: ["C4", "D4", "E4", "F4", "G4", "B4", "C5", "D5"],
            bottom: []
        },
        vector: { minorMajor: 0.8, pureSpicy: 0.1, rarePopular: 0.5 },
        tags: ["윤슬", "반짝임", "맑음", "서정적"],
        tagsEn: ["Yunsl", "Sparkling", "Clear", "Lyrical"],
        description: "윤슬 스케일로, 물결에 비치는 햇살처럼 맑고 반짝이는 소리를 가졌습니다. 서정적이고 아름다운 멜로디 연주에 좋습니다.",
        descriptionEn: "Yunsl scale, possessing a clear and sparkling sound like sunlight reflecting on ripples. Good for playing lyrical and beautiful melodies.",
        videoUrl: "https://youtu.be/_fB5VHpE1f0?si=v6RDSBTJJUsiAZXK",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12752009418",
        ownUrl: "https://handpan.co.kr/shop/?idx=102"
    },

    // 26. C# Sapphire 9 (Normal)
    {
        id: "cs_sapphire_9",
        name: "C# Sapphire 9",
        nameEn: "C# Sapphire 9",
        notes: {
            ding: "C#3",
            top: ["G#3", "B3", "C#4", "F4", "F#4", "G#4", "B4", "C#5"],
            bottom: []
        },
        vector: { minorMajor: -0.2, pureSpicy: 0.4, rarePopular: 0.4 },
        tags: ["사파이어", "청량함", "보석", "세련됨"],
        tagsEn: ["Sapphire", "Refreshing", "Gemstone", "Sophisticated"],
        description: "사파이어 스케일로, 사파이어 보석처럼 청량하고 세련된 울림을 줍니다. 깔끔하고 모던한 느낌의 연주를 선호하는 분들께 추천합니다.",
        descriptionEn: "Sapphire scale, giving a refreshing and sophisticated resonance like a sapphire gem. Recommended for those who prefer clean and modern performances.",
        videoUrl: "https://youtu.be/V1bfHlVl9VY?si=yREB5-6dey1kvC_4",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12752029521",
        ownUrl: "https://handpan.co.kr/shop/?idx=93"
    },

    // 27. C# Annaziska 9 (Normal)
    {
        id: "cs_annaziska_9",
        name: "C# Annaziska 9",
        nameEn: "C# Annaziska 9",
        notes: {
            ding: "C#3",
            top: ["G#3", "A3", "B3", "C#4", "D#4", "E4", "F#4", "G#4"],
            bottom: []
        },
        vector: { minorMajor: -0.4, pureSpicy: 0.5, rarePopular: 0.2 },
        tags: ["이국적", "긴장감", "신비", "매니아"],
        tagsEn: ["Exotic", "Tension", "Mysterious", "Mania"],
        description: "신비롭고 약간의 긴장감을 주는 이국적인 스케일입니다. 독특한 분위기를 연출하고 싶은 매니아 연주자에게 적합합니다.",
        descriptionEn: "An exotic scale that is mysterious and gives a slight sense of tension. Suitable for mania players who want to create a unique atmosphere.",
        videoUrl: "https://youtu.be/Z3bVZYykphA?si=zJAD4lmQPxMQ0xq8",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12085316070",
        ownUrl: "https://handpan.co.kr/shop/?idx=94"
    },

    // 28. E Hijaz 9 (Normal)
    {
        id: "e_hijaz_9",
        name: "E Hijaz 9",
        nameEn: "E Hijaz 9",
        notes: {
            ding: "E3",
            top: ["A3", "B3", "C4", "D#4", "E4", "F#4", "G4", "B4"],
            bottom: []
        },
        vector: { minorMajor: -0.3, pureSpicy: 0.7, rarePopular: 0.5 },
        tags: ["이국적", "중동풍", "정열적", "스파이시"],
        tagsEn: ["Exotic", "Middle Eastern", "Passionate", "Spicy"],
        description: "E 키의 히자즈 스케일로, 이국적이고 중동풍의 정열적이며 스파이시한 느낌을 강하게 전달합니다.",
        descriptionEn: "E key Hijaz scale, strongly conveying an exotic, Middle Eastern, passionate, and spicy feeling.",
        videoUrl: "https://youtu.be/MRyGVe5k4Y8?si=VEoopVqXSO9gJ6Rd",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12085332035",
        ownUrl: "https://handpan.co.kr/shop/?idx=95"
    }
];

