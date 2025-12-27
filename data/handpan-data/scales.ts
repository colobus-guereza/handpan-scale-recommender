import { Scale } from './types';

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
        vector: { minorMajor: -0.8, pureSpicy: 0.1, rarePopular: 0.90 },
        tags: ["마이너", "대중적", "감성적"],
        description: "6번째 음이 포함된 완전한 내추럴 마이너 스케일로, 서정적이고 깊은 울림을 자랑하는 가장 대중적인 모델입니다. 쿠르드(Kurd)라는 이름처럼 중동의 감성을 담고 있으면서도, 호불호 없는 완벽한 균형감으로 누구나 쉽게 연주할 수 있습니다. 감성적인 연주부터 리드미컬한 곡까지 폭넓게 소화 가능한 핸드팬의 표준입니다.",
        videoUrl: "https://youtu.be/IvdeC_YuSIg",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/9206864886",
        ownUrl: "https://handpan.co.kr/shop/?idx=75",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=75",
        nameEn: "D Kurd 9",
        tagsEn: ["Minor", "Popular", "Emotional"],
        descriptionEn: "A complete Natural Minor scale including the 6th note, it is the most popular model boasting a lyrical and deep resonance. As the name 'Kurd' suggests, it embodies Middle Eastern sentiments yet maintains a perfect balance without polarizing listeners, allowing anyone to play easily. It is the standard of Handpans, capable of handling a wide range from emotional performances to rhythmical songs.",
        i18n: {
            fr: {
                name: "D Kurd 9",
                description: "Une gamme mineure naturelle complète incluant la 6ème note, c'est le modèle le plus populaire offrant une résonance lyrique et profonde. Comme son nom « Kurd » l'indique, elle incarne des sentiments du Moyen-Orient tout en conservant un équilibre parfait, permettant à chacun de jouer facilement. C'est le standard du Handpan, capable de couvrir un large éventail, des performances émotionnelles aux chansons rythmiques."
            },
            ja: {
                name: "D Kurd 9",
                description: "6番目の音を含む完全なナチュラルマイナースケールで、叙情的で深い響きを誇る最も大衆的なモデルです。「クルド（Kurd）」という名の通り中東の感性を込めつつも、好みが分かれない完璧なバランス感で誰でも簡単に演奏できます。感性的な演奏からリズミカルな曲まで幅広く消化可能なハンドパンの標準です。"
            },
            zh: {
                name: "D Kurd 9",
                description: "包含第6个音符的完整自然小调音阶，是以抒情深沉的共鸣而自豪的最受欢迎型号。正如“库尔德（Kurd）”之名，既蕴含中东情调，又保持完美平衡，任何人都能轻松演奏。是由于情感演奏到律动乐曲都能广泛驾驭的 Handpan 标准。"
            },
            de: {
                name: "D Kurd 9",
                description: "Eine vollständige natürliche Moll-Skala einschließlich der 6. Note, ist es das beliebteste Modell, das eine lyrische und tiefe Resonanz bietet. Wie der Name 'Kurd' vermuten lässt, verkörpert sie nahöstliche Gefühle, bewahrt aber eine perfekte Balance, die es jedem ermöglicht, leicht zu spielen. Es ist der Standard für Handpans, der ein breites Spektrum von emotionalen Darbietungen bis hin zu rhythmischen Liedern abdeckt."
            },
            es: {
                name: "D Kurd 9",
                description: "Una escala menor natural completa que incluye la 6.ª nota, es el modelo más popular que presume de una resonancia lírica y profunda. Como sugiere el nombre 'Kurd', encarna sentimientos de Oriente Medio pero mantiene un equilibrio perfecto, permitiendo que cualquiera toque fácilmente. Es el estándar de los Handpans, capaz de manejar una amplia gama desde interpretaciones emocionales hasta canciones rítmicas."
            },
            ru: {
                name: "D Kurd 9",
                description: "Полная натуральная минорная гамма, включающая 6-ю ноту, это самая популярная модель, отличающаяся лиричным и глубоким резонансом. Как следует из названия «Kurd», она воплощает ближневосточные чувства, но при этом сохраняет идеальный баланс, позволяя любому играть легко. Это стандарт хэндпанов, способный охватить широкий диапазон от эмоциональных выступлений до ритмичных песен."
            },
            fa: {
                name: "D Kurd 9",
                description: "یک گام مینور طبیعی کامل شامل نت ششم، محبوب‌ترین مدلی است که از طنینی تغزلی و عمیق برخوردار است. همانطور که از نام «Kurd» پیداست، احساسات خاورمیانه‌ای را در خود دارد اما تعادلی کامل را حفظ می‌کند که به هر کسی اجازه می‌دهد به راحتی بنوازد. این استاندارد هندپن است که می‌تواند طیف وسیعی از اجراهای احساسی تا آهنگ‌های ریتمیک را پوشش دهد."
            },
            pt: {
                name: "D Kurd 9",
                description: "Uma escala Menor Natural completa incluindo a 6ª nota, é o modelo mais popular ostentando uma ressonância lírica e profunda. Como o nome 'Kurd' sugere, incorpora sentimentos do Oriente Médio, mas mantém um equilíbrio perfeito, permitindo que qualquer pessoa toque facilmente. É o padrão dos Handpans, capaz de lidar com uma ampla gama, desde performances emocionais até canções rítmicas."
            },
            ae: {
                name: "D Kurd 9",
                description: "سُلَّم مينور طبيعي (Natural Minor) كامل يتضمن النغمة السادسة، وهو النموذج الأكثر شعبية الذي يفتخر برنين غنائي وعميق. كما يوحي الاسم «Kurd» (كُرد)، فهو يجسد مشاعر الشرق الأوسط ومع ذلك يحافظ على توازن مثالي، مما يسمح لأي شخص بالعزف بسهولة. إنه معيار الهاندبان، القادر على التعامل مع نطاق واسع من العروض العاطفية إلى الأغاني الإيقاعية."
            },
            it: {
                name: "D Kurd 9",
                description: "Una scala Minore Naturale completa che include la 6ª nota, è il modello più popolare che vanta una risonanza lirica e profonda. Come suggerisce il nome 'Kurd', incarna sentimenti mediorientali ma mantiene un equilibrio perfetto, permettendo a chiunque di suonare facilmente. È lo standard degli Handpan, in grado di gestire una vasta gamma dalle esecuzioni emotive alle canzoni ritmiche."
            }
        }
    },

    // 2. D Kurd 10 (The Standard Minor Extended)
    {
        id: "d_kurd_10",
        name: "D Kurd 10",
        notes: {
            ding: "D3",
            top: ["A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5"],
            bottom: []
        },
        vector: { minorMajor: -0.8, pureSpicy: 0.1, rarePopular: 0.90 },
        tags: ["마이너", "대중적", "연습곡 제일 많음", "유튜브에 교재도 많음"],
        description: "9음 구성의 D Kurd에 고음 C5가 추가된 확장형 모델로, 전 세계적으로 가장 많은 연습곡과 악보가 존재하는 표준 마이너 스케일입니다. 입문자가 학습하기에 가장 이상적인 '핸드팬의 교과서'와 같은 모델로, 풍성한 멜로디 연주가 가능합니다. 깊고 호소력 짙은 단조의 매력을 완벽하게 표현하는 베스트셀러입니다.",
        videoUrl: "https://youtu.be/uL40C1bqKik?si=DpqHwPB_RLpcA5mc",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/7514024868",
        ownUrl: "https://handpan.co.kr/shop/?idx=74",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=74",
        nameEn: "D Kurd 10",
        tagsEn: ["Minor", "Popular", "Most Practice Songs", "Many Tutorials"],
        descriptionEn: "An extended model adding a high C5 note to the 9-note D Kurd, it is the standard minor scale with the most practice songs and sheet music globally. Ideal for beginners, it is like a 'textbook of Handpan', allowing for rich melodic play. A bestseller that perfectly expresses the deep and appealing charm of the minor key.",
        i18n: {
            fr: {
                name: "D Kurd 10",
                description: "Un modèle étendu ajoutant une note haute C5 au D Kurd de 9 notes, c'est la gamme mineure standard avec le plus de chansons d'entraînement et de partitions au monde. Idéal pour les débutants, c'est comme un « manuel de Handpan », permettant un jeu mélodique riche. Un best-seller qui exprime parfaitement le charme profond et attrayant de la tonalité mineure."
            },
            ja: {
                name: "D Kurd 10",
                description: "9音構成のD Kurdに高音C5が追加された拡張型モデルで、世界的に最も多くの練習曲と楽譜が存在する標準マイナースケールです。入門者が学習するのに最も理想的な「ハンドパンの教科書」のようなモデルで、豊かなメロディ演奏が可能です。深く訴えかけるような短調の魅力を完璧に表現するベストセラーです。"
            },
            zh: {
                name: "D Kurd 10",
                description: "在9音构成的 D Kurd 上增加高音 C5 的扩展型号，是全球拥有最多练习曲和乐谱的标准小调音阶。是初学者学习最理想的“Handpan 教科书”般的型号，可演奏丰富的旋律。完美表现深沉且极具号召力的小调魅力的畅销款。"
            },
            de: {
                name: "D Kurd 10",
                description: "Ein erweitertes Modell, das dem 9-tönigen D Kurd eine hohe C5-Note hinzufügt; es ist die Standard-Moll-Skala mit den meisten Übungsliedern und Notenblättern weltweit. Ideal für Anfänger, ist es wie ein 'Lehrbuch für Handpan', das ein reichhaltiges melodisches Spiel ermöglicht. Ein Bestseller, der den tiefen und ansprechenden Charme der Moll-Tonart perfekt ausdrückt."
            },
            es: {
                name: "D Kurd 10",
                description: "Un modelo extendido que añade una nota alta Do5 a la escala D Kurd de 9 notas, es la escala menor estándar con más canciones de práctica y partituras a nivel mundial. Ideal para principiantes, es como un 'libro de texto de Handpan', permitiendo un juego melódico rico. Un superventas que expresa perfectamente el encanto profundo y atractivo de la tonalidad menor."
            },
            ru: {
                name: "D Kurd 10",
                description: "Расширенная модель, добавляющая высокую ноту C5 к 9-нотной гамме D Kurd, это стандартная минорная гамма с наибольшим количеством учебных пьес и нот в мире. Идеальна для начинающих, это словно «учебник по хэндпану», позволяющий исполнять богатые мелодии. Бестселлер, идеально выражающий глубокое и притягательное очарование минора."
            },
            fa: {
                name: "D Kurd 10",
                description: "یک مدل گسترش‌یافته که نت بالای C5 را به D Kurd نُه نُتی اضافه می‌کند و استانداردترین گام مینور با بیشترین آهنگ‌های تمرینی و نت‌های موسیقی در جهان است. برای مبتدیان ایده‌آل است، مانند یک «کتاب درسی هندپن» است که امکان نواختن ملودی‌های غنی را فراهم می‌کند. یک پرفروش که جذابیت عمیق و گیرای گام مینور را به کمال بیان می‌کند."
            },
            pt: {
                name: "D Kurd 10",
                description: "Um modelo estendido adicionando uma nota alta C5 à escala D Kurd de 9 notas, é a escala menor padrão com mais músicas de prática e partituras globalmente. Ideal para iniciantes, é como um 'livro didático de Handpan', permitindo um toque melódico rico. Um best-seller que expressa perfeitamente o charme profundo e atraente do tom menor."
            },
            ae: {
                name: "D Kurd 10",
                description: "نموذج موسع يضيف نغمة C5 عالية إلى سُلَّم D Kurd المكون من 9 نغمات، وهو سُلَّم المينور القياسي الذي يحتوي على أكبر عدد من أغاني التدريب والنوتات الموسيقية عالميًا. مثالي للمبتدئين، فهو يشبه «كتاب مدرسي للهاندبان»، مما يسمح بعزف ألحان غنية. الأكثر مبيعًا الذي يعبر تمامًا عن السحر العميق والجذاب للمقام الصغير (Minor)."
            },
            it: {
                name: "D Kurd 10",
                description: "Un modello esteso che aggiunge una nota alta C5 alla scala D Kurd a 9 note, è la scala minore standard con il maggior numero di brani di pratica e spartiti a livello globale. Ideale per i principianti, è come un 'libro di testo dell'Handpan', che consente un'esecuzione melodica ricca. Un best-seller che esprime perfettamente il fascino profondo e attraente della tonalità minore."
            }
        }
    },

    // 3. E Equinox 14 (Normal)
    {
        id: "e_equinox_14",
        name: "E Equinox 14",
        notes: {
            ding: "E3",
            top: ["G3", "B3", "C4", "D4", "E4", "F#4", "G4", "B4", "C5"],
            bottom: ["C3", "D3", "D5", "E5"]
        },
        vector: { minorMajor: -0.4, pureSpicy: 0.4, rarePopular: 0.30 },
        tags: ["하이브리드", "시네마틱", "상급자용", "달콤씁쓸한"],
        description: "마이너와 메이저의 경계를 넘나드는 하이브리드 스케일로, 낮과 밤의 길이가 같은 '춘분/추분(Equinox)'이라는 이름처럼 묘한 균형미를 가집니다. 저음을 포함한 14개의 풍성한 노트가 시네마틱하고 웅장한 서사를 만들어내며, 달콤씁쓸한 특유의 감성은 상급자의 섬세한 표현력을 극대화합니다. 복잡하고 감성적인 연주를 원하는 분들에게 추천하는 묵직한 모델입니다.",
        videoUrl: "https://youtu.be/v9pXYwhylPg?si=Em_dHnMGyeU19YkE",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12351119980",
        ownUrl: "https://handpan.co.kr/shop/?idx=78",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=78",
        nameEn: "E Equinox 14",
        tagsEn: ["Hybrid", "Cinematic", "Advanced", "Bittersweet"],
        descriptionEn: "A hybrid scale on the border of major and minor. Featuring cinematic emotion and bittersweet charm, it boasts richness with 14 notes including heavy bass. Suitable for advanced players for complex and emotional performance.",
        i18n: {
            fr: {
                name: "E Equinox 14",
                description: "Gamme hybride entre majeur et mineur, à la fois cinématique et doux-amer. Les 14 notes, incluant des basses puissantes, offrent une grande richesse harmonique, idéale pour des jeux complexes et très expressifs, plutôt destinés aux joueurs avancés."
            },
            ja: {
                name: "E Equinox 14",
                description: "メジャーとマイナーの境界に位置するハイブリッドスケールです。シネマティックな雰囲気とほろ苦い感性が魅力で、重厚な低音を含む 14 音により非常に豊かなサウンドを奏でます。複雑で感情豊かな演奏を楽しみたい上級者向けモデルです。"
            },
            zh: {
                name: "E Equinox 14",
                description: "介于大调与小调之间的混合型音阶，带有电影配乐般的氛围及微妙的苦甜感。包括厚重低音在内的 14 个音，让声音层次极其丰富，非常适合擅长细腻、复杂表达的高级玩家。"
            },
            de: {
                name: "E Equinox 14",
                description: "Eine hybride Skala an der Grenze zwischen Dur und Moll. Sie vereint einen cineastischen Charakter mit bittersüßer Stimmung und bietet dank 14 Tönen inklusive kräftiger Bässe einen sehr vollen Klang. Perfekt für komplexe, emotional gefärbte Spielweisen fortgeschrittener Spieler."
            },
            es: {
                name: "E Equinox 14",
                description: "Escala híbrida situada entre el modo mayor y menor. Destaca por su carácter cinematográfico y su encanto agridulce. Sus 14 notas, incluyendo graves potentes, crean un sonido rico y lleno de matices, perfecto para intérpretes avanzados que buscan composiciones complejas y cargadas de emoción."
            },
            ru: {
                name: "E Equinox 14",
                description: "Гибридная гамма на границе между мажором и минором. Отличается кинематографичной атмосферой и приятной «горько-сладкой» окраской. 14 нот с мощными низами создают насыщенное звучание, идеально подходящее для сложной и очень эмоциональной игры продвинутых исполнителей."
            },
            fa: {
                name: "E Equinox 14",
                description: "یک گام هیبریدی در مرز بین ماژور و مینور است. حال‌وهوایی سینمایی و طعم تلخ‌وشیرینِ خاصی دارد و با ۱۴ نت، از جمله بیس‌های پرقدرت، صدایی بسیار پُر و غنی ایجاد می‌کند که برای نوازندگی احساسی و پیچیدهٔ هنرمندان پیشرفته بسیار مناسب است."
            },
            pt: {
                name: "E Equinox 14",
                description: "Escala híbrida situada na fronteira entre maior e menor. Destaca-se pelo caráter cinematográfico e pelo charme agridoce. As 14 notas, incluindo graves encorpados, criam um som rico e cheio de nuances, perfeito para músicos avançados que buscam interpretações complexas e emocionais."
            },
            ae: {
                name: "E Equinox 14",
                description: "سُلَّم هجين يقع على الحدود بين الماجور والمينور. يقدّم إحساسًا سينمائيًا مع نكهة حلوة مرّة، ومع 14 نغمة تشمل بيسات قوية يخلق صوتًا غنيًا ومليئًا بالتفاصيل، مناسبًا لعزف معقد وعاطفي لعازفين متقدّمين."
            },
            it: {
                name: "E Equinox 14",
                description: "Scala ibrida al confine tra maggiore e minore. Ha un carattere cinematografico, con un fascino dolce-amaro. Le 14 note, inclusi bassi corposi, creano un suono molto ricco: perfetta per esecuzioni complesse e fortemente espressive, pensata per musicisti avanzati."
            }
        }
    },

    // 4. F# Low Pygmy 14 (The Global Bestseller) - Mutant
    {
        id: "fs_low_pygmy_14_mutant",
        name: "F# Low Pygmy 14",
        notes: {
            ding: "F#3",
            top: ["G#3", "A3", "C#4", "E4", "F#4", "G#4", "A4", "B4", "C#5", "E5", "F#5"],
            bottom: ["D3", "E3"]
        },
        vector: { minorMajor: -0.6, pureSpicy: 0.25, rarePopular: 0.95 },
        tags: ["Malte Marten Style", "Bestseller", "Deep", "Storytelling"],
        description: "아프리카 피그미 부족의 음악에서 유래한 펜타토닉 기반 스케일로, 깊고 몽환적인 저음이 특징인 전 세계적인 베스트셀러입니다. F#3 딩이 만들어내는 그라운딩 효과와 스토리텔링이 강점이며, Malte Marten과 같은 연주자들이 애용하는 스타일입니다. 14개의 노트가 조화롭게 어우러져 즉흥 연주만으로도 완성도 높은 음악을 선사합니다.",
        videoUrl: "https://youtu.be/SthKlH686Pc?si=_YG050uZwcbIoP0X",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12070387231",
        ownUrl: "https://handpan.co.kr/shop/?idx=97",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=97",
        nameEn: "F# Low Pygmy 14",
        tagsEn: ["Malte Marten Style", "Bestseller", "Deep", "Storytelling"],
        descriptionEn: "Pentatonic-based scale derived from African Pygmy music, a global bestseller with deep, dreamy bass. The grounding effect and storytelling of the F#3 Ding are its strengths, a style favored by players like Malte Marten. Its 14 notes blend harmoniously, creating complete music even with simple improvisation.",
        i18n: {
            fr: {
                name: "F# Low Pygmy 14",
                description: "Gamme pentatonique dérivée de la musique pygmée africaine, un best-seller mondial aux basses profondes et oniriques. L'effet d'ancrage et la narration du Ding F#3 sont ses atouts, un style prisé par des musiciens comme Malte Marten. Les 14 notes s'harmonisent parfaitement pour une musique riche même en improvisation."
            },
            ja: {
                name: "F# Low Pygmy 14",
                description: "アフリカのピグミー族の音楽に由来するペンタトニックベースのスケールで、深く幻想的な低音が特徴の世界的なベストセラーです。F#3 ディングによるグラウンディング効果とストーリーテリングが魅力で、Malte Marten のような奏者に愛用されています。14 音が調和し、即興演奏だけでも完成度の高い音楽を奏でます。"
            },
            zh: {
                name: "F# Low Pygmy 14",
                description: "源自非洲俾格米部落音乐的五声音阶基础音阶，以深沉梦幻的低音为特征的全球畅销款。F#3 Ding 带来的接地感与叙事性是其强项，是 Malte Marten 等演奏家钟爱的风格。14 个音符和谐交融，仅凭即兴演奏也能呈现高完成度的音乐。"
            },
            de: {
                name: "F# Low Pygmy 14",
                description: "Eine auf der Pentatonik basierende Skala, die von der Musik der afrikanischen Pygmäen stammt – ein weltweiter Bestseller mit tiefen, traumhaften Bässen. Die erdende Wirkung und das Storytelling des F#3 Dings sind ihre Stärken, ein Stil, der von Spielern wie Malte Marten bevorzugt wird. 14 Noten harmonieren perfekt und ermöglichen auch bei Improvisationen vollendete Musik."
            },
            es: {
                name: "F# Low Pygmy 14",
                description: "Escala basada en la pentatónica derivada de la música de los pigmeos africanos, un éxito mundial con graves profundos y oníricos. El efecto de arraigo y la narrativa del Ding F#3 son sus puntos fuertes, un estilo favorito de músicos como Malte Marten. Sus 14 notas armonizan maravillosamente, creando música completa incluso con improvisación pura."
            },
            ru: {
                name: "F# Low Pygmy 14",
                description: "Основанная на пентатонике гамма, восходящая к музыке африканских пигмеев, — мировой бестселлер с глубокими, мечтательными басами. Заземляющий эффект и повествовательность F#3 Ding — её сильные стороны, стиль, любимый такими музыкантами, как Мальте Мартен. 14 нот гармонично сочетаются, создавая полноценную музыку даже при импровизации."
            },
            fa: {
                name: "F# Low Pygmy 14",
                description: "گامی مبتنی بر پنتاتونیک که از موسیقی قبیله پیگمی آفریقا ریشه گرفته و با بیس‌های عمیق و رویایی خود یک پرفروش جهانی است. اثر زمین‌گیر کننده (grounding) و داستان‌سرایی نت دینگ F#3 از نقاط قوت آن است، سبکی که نوازندگانی مثل Malte Marten به آن علاقه دارند. ۱۴ نت آن به زیبایی با هم ترکیب می‌شوند و حتی با بداهه‌نوازی ساده، موسیقی کاملی را خلق می‌کنند."
            },
            pt: {
                name: "F# Low Pygmy 14",
                description: "Escala baseada na pentatônica derivada da música pigmeia africana, um best-seller global com graves profundos e oníricos. O efeito de aterramento e a narrativa do Ding F#3 são seus pontos fortes, um estilo apreciado por músicos como Malte Marten. As 14 notas harmonizam-se perfeitamente, criando música completa mesmo na improvisação."
            },
            ae: {
                name: "F# Low Pygmy 14",
                description: "سُلَّم يعتمد على الخماسي (Pentatonic) مستمد من موسيقى قبائل البيغمي الأفريقية، وهو الأكثر مبيعًا عالميًا بفضل نغماته المنخفضة العميقة والحالمة. تأثير التجذير والسرد القصصي لنغمة F#3 Ding هما نقاط قوته، وهو أسلوب يفضله عازفون مثل Malte Marten. تمتزج نغماته الـ 14 بانسجام، لتقدم موسيقى متكاملة حتى مع الارتجال البسيط."
            },
            it: {
                name: "F# Low Pygmy 14",
                description: "Scala basata sulla pentatonica derivata dalla musica dei pigmei africani, un best-seller mondiale caratterizzato da bassi profondi e onirici. L'effetto di radicamento e la narrazione del Ding F#3 sono i suoi punti di forza, uno stile amato da musicisti come Malte Marten. Le 14 note si armonizzano perfettamente, offrendo una musica completa anche nell'improvvisazione."
            }
        }
    },

    // 5. F Aeolian 10 (Domestic Steady Seller)
    {
        id: "f_aeolian_10",
        name: "F Aeolian 10",
        notes: {
            ding: "F3",
            top: ["Ab3", "Bb3", "C4", "Db4", "Eb4", "F4", "G4", "Ab4", "C5"],
            bottom: []
        },
        vector: { minorMajor: -0.8, pureSpicy: 0.15, rarePopular: 0.65 },
        tags: ["국내인기", "안정적", "우울함", "변신가능", "바텀업그레이드", "가성비최고"],
        description: "자연 단음계(Natural Minor)인 에올리안 모드를 기반으로 하여, 한국인이 선호하는 서정적이고 우울한 감성을 가장 잘 표현합니다. 안정적인 음계 구성으로 바텀 업그레이드 시 확장성이 뛰어나며, 호불호 없이 꾸준히 사랑받는 스테디셀러입니다. 차분하고 솔직한 울림으로 깊은 감동을 전달하는 가성비 최고의 모델입니다.",
        videoUrl: "https://youtu.be/BH45TEboAgE?si=SLlNpG-5vTLSWAsx",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/9561986680",
        ownUrl: "https://handpan.co.kr/shop/?idx=71",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=71",
        nameEn: "F Aeolian 10",
        tagsEn: ["Domestic Popular", "Stable", "Melancholy", "Transformable", "Bottom Upgrade", "Best Value"],
        descriptionEn: "A steady seller consistently loved in the domestic market. Characterized by stable and melancholic emotion, it can transform into various atmospheres through bottom upgrades. Recommended as the best value model with calm and honest resonance.",
        i18n: {
            fr: {
                name: "F Aeolian 10",
                description: "Même contenu de notes qu'un F mineur, vu depuis le mode éolien (gamme mineure naturelle). Son caractère stable, légèrement mélancolique, en fait un instrument très musical. Peut être enrichi plus tard par des notes supplémentaires en bas, ce qui en fait un modèle au rapport qualité-prix exceptionnel."
            },
            ja: {
                name: "F Aeolian 10",
                description: "F マイナーと同じ音構成を持ちながら、エオリアンモード（自然短音階）の視点でアプローチするスケールです。安定感のある少し憂いを帯びた雰囲気が特徴で、ボトム側のアップグレードによってさまざまなムードに発展させることができます。コストパフォーマンスに優れたおすすめモデルです。"
            },
            zh: {
                name: "F Aeolian 10",
                description: "与 F 小调相同的音阶结构，从 Aeolian（自然小调）角度切入。音色稳定、略带忧郁，通过后期增加底部音可扩展出更多氛围，是性价比极高的推荐型号。"
            },
            de: {
                name: "F Aeolian 10",
                description: "Hat die gleiche Tonstruktur wie F-Moll, wird aber aus der Perspektive der äolischen Tonleiter (natürliche Mollskala) betrachtet. Sie klingt stabil und leicht melancholisch; durch ein späteres Bottom-Upgrade lässt sich die Klangpalette flexibel erweitern. Ein Modell mit ausgezeichnetem Preis-Leistungs-Verhältnis."
            },
            es: {
                name: "F Aeolian 10",
                description: "Comparte la misma estructura que Fa menor, pero enfocada desde el modo eólico (escala menor natural). Se caracteriza por una sensación estable y ligeramente melancólica. Con una futura ampliación de notas graves (bottom upgrade) puede transformarse en una escala muy versátil. Es uno de los modelos con mejor relación calidad-precio."
            },
            ru: {
                name: "F Aeolian 10",
                description: "По звуковому составу совпадает с гаммой F minor, но рассматривается с позиции эолийского лада (натуральный минор). Отличается стабильным, немного меланхоличным характером. При дальнейшей доработке нижних нот (bottom-upgrade) легко раскрывается в разные настроения. Один из лучших вариантов по соотношению цены и возможностей."
            },
            fa: {
                name: "F Aeolian 10",
                description: "از نظر فواصل با فا مینور (F minor) یکسان است، اما از دیدگاه مُدِ Aeolian (مینور طبیعی) به آن نگاه می‌شود. شخصیتی پایدار و کمی غمگین دارد و با ارتقای بخش پایین (bottom upgrade) می‌تواند طیف‌های متنوع‌تری از فضا و حس را ارائه دهد. از نظر ارزش خرید، یکی از بهترین مدل‌ها برای پیشنهاد است."
            },
            pt: {
                name: "F Aeolian 10",
                description: "Tem o mesmo desenho de F minor (Fá menor), mas é abordada a partir do modo eólio (menor natural). Apresenta um caráter estável e levemente melancólico. Com um futuro upgrade de notas graves (bottom upgrade) pode se transformar numa escala muito versátil. É um dos modelos com melhor custo-benefício."
            },
            ae: {
                name: "F Aeolian 10",
                description: "يطابق في تركيبه سلم فا مينور (F minor) لكنه يُقدَّم من منظور طور Aeolian (المينور الطبيعي). يتميّز بطابع ثابت يميل قليلًا إلى الحزن. ومع ترقية النغمات المنخفضة لاحقًا يمكن أن يتحوّل إلى سُلَّم شديد التنوع. من أفضل النماذج من حيث القيمة مقابل السعر."
            },
            it: {
                name: "F Aeolian 10",
                description: "Ha la stessa struttura di F minor, ma viene interpretata nella modalità eolia (minore naturale). Si distingue per un carattere stabile e leggermente malinconico. Con un futuro upgrade del bottom può trasformarsi in molte atmosfere diverse. È uno dei modelli più consigliati per rapporto qualità-prezzo."
            }
        }
    },

    // 6. E Romanian Hijaz 10 (The Exotic Individualist)
    {
        id: "e_romanian_hijaz_10",
        name: "E Romanian Hijaz 10",
        notes: {
            ding: "E3",
            top: ["A3", "B3", "C4", "D#4", "E4", "F#4", "G4", "A4", "B4"],
            bottom: []
        },
        vector: { minorMajor: -0.5, pureSpicy: 0.75, rarePopular: 0.20 },
        tags: ["이국적", "집시", "독특함", "보헤미안"],
        description: "루마니아 집시 음악에서 영감을 받은 스케일로, 보헤미안 특유의 자유로움과 강렬한 이국적 색채를 띱니다. 하모닉 마이너의 5번째 모드인 프리지안 도미넌트 구성을 통해 신비롭고 스파이시한 긴장감을 자아냅니다. 남들과 다른 독창적인 분위기를 연출하고 싶은 연주자에게 강력히 추천합니다.",
        videoUrl: "https://youtu.be/gTEsQG3dfKQ?si=IJcS8SYJe9468WgP",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8681747137",
        ownUrl: "https://handpan.co.kr/shop/?idx=72",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=72",
        nameEn: "E Romanian Hijaz 10",
        tagsEn: ["Exotic", "Gypsy", "Unique", "Bohemian"],
        descriptionEn: "A scale inspired by Romanian Gypsy music, radiating the free spirit and intense exotic color characteristic of Bohemian style. Using the Phrygian Dominant mode, it creates a mysterious and spicy tension. Highly recommended for those wanting a unique atmosphere.",
        i18n: {
            fr: {
                name: "E Romanian Hijaz 10",
                description: "Une gamme inspirée de la musique tzigane roumaine, dégageant l'esprit libre et la couleur exotique intense propres au style bohème. Utilisant le mode Phrygien Dominant, elle crée une tension mystérieuse et « épicée ». Fortement recommandée pour ceux qui recherchent une atmosphère unique."
            },
            ja: {
                name: "E Romanian Hijaz 10",
                description: "ルーマニアのジプシー音楽にインスパイアされたスケールで、ボヘミアン特有の自由さと強烈なエキゾチックな色彩を帯びています。フリジアン・ドミナント構成を通じて神秘的でスパイシーな緊張感を醸し出します。他とは違う独創的な雰囲気を演出したい奏者に強くおすすめです。"
            },
            zh: {
                name: "E Romanian Hijaz 10",
                description: "受罗马尼亚吉普赛音乐启发的音阶，散发着波希米亚特有的自由与强烈异域色彩。通过弗里吉亚属音阶构成，营造出神秘而辛辣的张力。强烈推荐给想要演绎独特氛围的演奏者。"
            },
            de: {
                name: "E Romanian Hijaz 10",
                description: "Eine von rumänischer Zigeunermusik inspirierte Skala, die den freien Geist und die intensive exotische Farbe des Bohème-Stils ausstrahlt. Durch die phrygisch-dominante Tonart erzeugt sie eine mysteriöse und würzige Spannung. Sehr empfehlenswert für alle, die eine einzigartige Atmosphäre schaffen wollen."
            },
            es: {
                name: "E Romanian Hijaz 10",
                description: "Una escala inspirada en la música gitana rumana, que irradia el espíritu libre y el intenso color exótico característico del estilo bohemio. Utilizando el modo Frigio Dominante, crea una tensión misteriosa y \"picante\". Muy recomendada para quienes desean una atmósfera única."
            },
            ru: {
                name: "E Romanian Hijaz 10",
                description: "Гамма, вдохновленная румынской цыганской музыкой, излучающая свободный дух и насыщенный экзотический колорит, свойственный богемному стилю. Используя фригийский доминантовый лад, она создает таинственное и «пряное» напряжение. Настоятельно рекомендуется для тех, кто хочет создать уникальную атмосферу."
            },
            fa: {
                name: "E Romanian Hijaz 10",
                description: "گامی الهام‌گرفته از موسیقی کولی‌های رومانی که روح آزاد و رنگ و بوی تند و اگزوتیک سبک بوهِمی را بازتاب می‌دهد. با استفاده از مُد فریجیَن دومینانت، تنشی مرموز و «اسپایسی» ایجاد می‌کند. برای نوازندگانی که به دنبال خلق فضایی منحصربه‌فرد هستند، به شدت توصیه می‌شود."
            },
            pt: {
                name: "E Romanian Hijaz 10",
                description: "Uma escala inspirada na música cigana romena, irradiando o espírito livre e a cor exótica intensa característica do estilo boêmio. Usando o modo Frígio Dominante, cria uma tensão misteriosa e \"picante\". Altamente recomendada para quem deseja uma atmosfera única."
            },
            ae: {
                name: "E Romanian Hijaz 10",
                description: "سُلَّم مستوحى من الموسيقى الغجرية الرومانية، يشع بالروح الحرة واللون الأجنبي المكثف المميز للأسلوب البوهيمي. باستخدام الطور الفريجي المهيمن، يخلق توترًا غامضًا و«حارًا». يُنصح به بشدة لمن يرغبون في جو فريد."
            },
            it: {
                name: "E Romanian Hijaz 10",
                description: "Una scala ispirata alla musica gitana rumena, che irradia lo spirito libero e l'intenso colore esotico caratteristico dello stile bohémien. Utilizzando il modo Frigio Dominante, crea una tensione misteriosa e \"speziata\". Altamente raccomandata per chi desidera un'atmosfera unica."
            }
        }
    },

    // 7. D Saladin 9 (The Extreme Niche)
    {
        id: "d_saladin_9",
        name: "D Saladin 9",
        notes: {
            ding: "D3",
            top: ["G3", "A3", "C4", "D4", "Eb4", "F#4", "G4", "A4"],
            bottom: []
        },
        vector: { minorMajor: -0.2, pureSpicy: 0.85, rarePopular: 0.15 },
        tags: ["아라비안", "희귀함", "매운맛", "프리지안"],
        description: "프리지안 도미넌트(Phrygian Dominant) 스케일로, '살라딘'이라는 이름처럼 아라비안 나이트를 연상시키는 강렬함이 특징입니다. 단 2도(b2)와 장 3도(3)가 만들어내는 이국적인 색채와 매운맛(Spicy)으로 독보적인 개성을 드러냅니다. 중동 풍의 신비로운 멜로디와 리듬을 표현하기에 최적화된 유니크한 모델입니다.",
        videoUrl: "https://youtu.be/OJWGyT1OxIg?si=RM_0FkjjEuxaWPJu",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8669289024",
        ownUrl: "https://handpan.co.kr/shop/?idx=85",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=85",
        nameEn: "D Saladin 9",
        tagsEn: ["Arabian", "Rare", "Spicy", "Phrygian"],
        descriptionEn: "A Phrygian Dominant scale, characterized by intensity reminiscent of Arabian Nights, like its name 'Saladin'. The Minor 2nd (b2) and Major 3rd (3) intervals create an exotic color and 'spicy' flavor, revealing unique individuality. An optimal model for expressing mysterious Middle Eastern melodies and rhythms.",
        i18n: {
            fr: {
                name: "D Saladin 9",
                description: "Une gamme Phrygien Dominant, caractérisée par une intensité rappelant les Mille et Une Nuits. Les intervalles de seconde mineure (b2) et de tierce majeure (3) créent une couleur exotique et une saveur « épicée » unique. Un modèle optimal pour exprimer des mélodies et rythmes mystérieux du Moyen-Orient."
            },
            ja: {
                name: "D Saladin 9",
                description: "「サラディン」の名のようにアラビアンナイトを連想させる、強烈なフリジアン・ドミナント（Phrygian Dominant）スケールです。短2度（b2）と長3度（3）が作るエキゾチックな色彩とスパイシーな風味が独自の個性を放ちます。中東風の神秘的なメロディとリズムの表現に最適化されたユニークなモデルです。"
            },
            zh: {
                name: "D Saladin 9",
                description: "弗里吉亚属音阶（Phrygian Dominant），正如“萨拉丁”之名，具有令人联想到《一千零一夜》的强烈特征。小二度（b2）与大三度（3）营造出的异域色彩与“辛辣”风味彰显独特定性。是表现中东风神秘旋律与节奏的绝佳独特型号。"
            },
            de: {
                name: "D Saladin 9",
                description: "Eine phrygisch-dominante Skala, die wie ihr Name \"Saladin\" an die Intensität von Tausendundeiner Nacht erinnert. Die Intervalle kleine Sekunde (b2) und große Terz (3) erzeugen eine exotische Farbe und eine \"würzige\" Note von einzigartiger Individualität. Ein optimales Modell für mysteriöse nahöstliche Melodien und Rhythmen."
            },
            es: {
                name: "D Saladin 9",
                description: "Una escala Frigua Dominante, caracterizada por una intensidad que recuerda a Las mil y una noches. Los intervalos de segunda menor (b2) y tercera mayor (3) crean un color exótico y un sabor \"picante\", revelando una personalidad única. Un modelo óptimo para expresar melodías y ritmos misteriosos de Oriente Medio."
            },
            ru: {
                name: "D Saladin 9",
                description: "Гамма Фригийская Доминанта (Phrygian Dominant), чей интенсивный характер напоминает «Арабские ночи», как и имя «Саладин». Интервалы малой секунды (b2) и большой терции (3) создают экзотический колорит и «пряный» вкус, подчеркивая уникальную индивидуальность. Оптимальная модель для выражения таинственных ближневосточных мелодий и ритмов."
            },
            fa: {
                name: "D Saladin 9",
                description: "یک گام فریجیَنِ دومینانت (Phrygian Dominant) که مانند نامش «صلاح‌الدین»، شدتی یادآور «هزار و یک شب» دارد. فواصل دوم کوچک (b2) و سوم بزرگ (3) رنگی اگزوتیک و طعمی «تند و تیز» (Spicy) ایجاد می‌کنند که شخصیتی منحصربه‌فرد به آن می‌بخشد. مدلی بهینه برای بیان ملودی‌ها و ریتم‌های مرموز خاورمیانه‌ای."
            },
            pt: {
                name: "D Saladin 9",
                description: "Escala Frígia Dominante, caracterizada por uma intensidade que lembra as Mil e Uma Noites. Os intervalos de segunda menor (b2) e terça maior (3) criam uma cor exótica e um sabor \"picante\", revelando uma personalidade única. Modelo ideal para expressar melodias e ritmos misteriosos do Oriente Médio."
            },
            ae: {
                name: "D Saladin 9",
                description: "سُلَّم فريجي مهيمن (Phrygian Dominant)، يتميز بحدة تذكرنا بليالي ألف ليلة وليلة، تمامًا كما يوحي اسمه «صلاح الدين». تخلق فترات الثانية الصغيرة (b2) والثالثة الكبيرة (3) لونًا غريبًا ونكهة «حارة» (Spicy)، كاشفة عن تفرد مميز. نموذج مثالي للتعبير عن الألحان والإيقاعات الشرق أوسطية الغامضة."
            },
            it: {
                name: "D Saladin 9",
                description: "Una scala Frigia Dominante, caratterizzata da un'intensità che ricorda le Mille e una notte. Gli intervalli di seconda minore (b2) e terza maggiore (3) creano un colore esotico e un sapore \"speziato\" unico. Un modello ottimale per esprimere melodie e ritmi misteriosi mediorientali."
            }
        }
    },

    // 8. D Asha 9 (The Gentle Major / Sabye)
    {
        id: "d_asha_9",
        name: "D Asha 9",
        notes: {
            ding: "D3",
            top: ["G3", "A3", "B3", "C#4", "D4", "E4", "F#4", "A4"],
            bottom: []
        },
        vector: { minorMajor: 0.9, pureSpicy: 0.1, rarePopular: 0.85 },
        tags: ["D메이저", "세컨드핸드팬인기", "젠틀소프트", "Sabye", "Ashakiran"],
        description: "산스크리트어로 '희망(Asha)'을 의미하며, Sabye라고도 불리는 가장 대표적이고 온화한 D 메이저 스케일입니다. 맑고 깨끗한 음색이 주는 긍정적인 에너지는 마이너 스케일 핸드팬과 함께 연주할 때 최고의 조화를 이룹니다. 부드럽고 젠틀한 울림으로 치유와 평화를 노래하는 세컨드 핸드팬의 정석입니다.",
        videoUrl: "https://youtu.be/4tgdyOhT-RI?si=9SQ66sdPiwvgxoP7",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8497384066",
        ownUrl: "https://handpan.co.kr/shop/?idx=87",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=87",
        nameEn: "D Asha 9",
        tagsEn: ["D Major", "Popular Second Handpan", "Gentle Soft", "Sabye", "Ashakiran"],
        descriptionEn: "A soft and gentle D Major scale, also known as Sabye or Ashakiran. It embodies pure light and hope with a gentle tone, and is highly popular as a second handpan to play alongside minor scales.",
        i18n: {
            fr: {
                name: "D Asha 9",
                description: "Aussi connue sous les noms Sabye ou Ashakiran, cette gamme de D majeur est douce et lumineuse. Son timbre gentil et apaisant évoque la pureté, la lumière et l'espoir. C'est un deuxième handpan parfait pour accompagner un modèle mineur."
            },
            ja: {
                name: "D Asha 9",
                description: "Sabye や Ashakiran とも呼ばれる、柔らかく穏やかな D メジャースケールです。ジェントルでソフトなトーンに、純粋な光と希望のイメージを込めました。マイナースケールのハンドパンと一緒に演奏するセカンド楽器として非常に人気があります。"
            },
            zh: {
                name: "D Asha 9",
                description: "也被称为 Sabye 或 Ashakiran 的柔和 D 大调音阶。音色温暖、绅士而柔软，承载着纯净的光与希望。作为与小调手碟搭配的第二台手碟非常受欢迎。"
            },
            de: {
                name: "D Asha 9",
                description: "Eine sanfte, warme D-Dur-Skala, auch bekannt als Sabye oder Ashakiran. Der weiche, \"gentle\" Klang trägt Licht und Hoffnung in sich. Besonders beliebt als zweites Handpan, das sich hervorragend mit einer Moll-Skala kombinieren lässt."
            },
            es: {
                name: "D Asha 9",
                description: "Escala de Re mayor suave y cálida, también conocida como Sabye o Ashakiran. Su timbre gentil y blando contiene una sensación de luz y esperanza. Es un segundo handpan muy popular para combinar con escalas menores."
            },
            ru: {
                name: "D Asha 9",
                description: "Мягкая и тёплая гамма D major, также известная как Sabye или Ashakiran. Её нежное звучание несёт в себе чистый свет и надежду. Один из самых популярных вариантов второй Handpan-гаммы для сочетания с минорными инструментами."
            },
            fa: {
                name: "D Asha 9",
                description: "گامِ رِ ماژورِ نرم و ملایمی است که با نام‌های Sabye و Ashakiran نیز شناخته می‌شود. رنگ صدایی لطیف و جنتل دارد و نوری از پاکی و امید را در خود حمل می‌کند. به‌عنوان دومین هنگ‌درام در کنار یک گام مینور، بسیار محبوب و پرطرفدار است."
            },
            pt: {
                name: "D Asha 9",
                description: "Escala suave e acolhedora de Ré maior, também conhecida como Sabye ou Ashakiran. O timbre gentil carrega uma sensação de luz e esperança. É um segundo handpan muito popular para combinar com escalas menores."
            },
            ae: {
                name: "D Asha 9",
                description: "سُلَّم ري ماجور ناعم ودافئ، يُعرَف أيضًا باسم Sabye أو Ashakiran. يحمل طابعًا لطيفًا وصوتًا رقيقًا يعبّر عن النور والأمل، وهو خيار شائع جدًّا كثاني هاندبان إلى جانب سلالم المينور."
            },
            it: {
                name: "D Asha 9",
                description: "Scala D maggiore dolce e delicata, conosciuta anche come Sabye o Ashakiran. Il suo timbro gentile e morbido racchiude luce e speranza. È molto apprezzata come secondo handpan da affiancare a scale minori."
            }
        }
    },

    // 9. E La Sirena 10 (The Siren / Dorian)
    {
        id: "e_la_sirena_10",
        name: "E La Sirena 10",
        notes: {
            ding: "E3",
            top: ["G3", "B3", "C#4", "D4", "E4", "F#4", "G4", "B4", "E5"],
            bottom: []
        },
        vector: { minorMajor: -0.3, pureSpicy: 0.6, rarePopular: 0.4 },
        tags: ["도리안", "중급자용", "세이렌", "C#4활용이포인트"],
        description: "그리스 신화 속 '세이렌'처럼 치명적인 매력을 지닌 도리안 모드 스케일로, 깊은 바닷속을 유영하는 듯한 신비로움을 선사합니다. 메이저와 마이너를 오가는 묘한 분위기 속에 C#4 노트가 독특한 포인트를 더해줍니다. 감성적이고 몽환적인 연주를 즐기는 중급자에게 추천하는 매혹적인 모델입니다.",
        videoUrl: "https://youtu.be/B-7jukbN3hw?si=ci_6mlElCZvu_WGH",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8490886007",
        ownUrl: "https://handpan.co.kr/shop/?idx=73",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=73",
        nameEn: "E La Sirena 10",
        tagsEn: ["Dorian", "Intermediate", "Siren", "C#4 Point"],
        descriptionEn: "A Dorian scale that gives the feeling of swimming in mysterious deep water, like its name 'Siren'. It has a subtle charm shifting between major and minor, with the use of the C#4 note being a key point. Recommended for intermediate players.",
        i18n: {
            fr: {
                name: "E La Sirena 10",
                description: "Gamme en mode dorien, comme une sirène qui vous entraîne dans les profondeurs de l'eau. Elle oscille subtilement entre majeur et mineur, avec un charme mystérieux. La note C#4 y joue un rôle clé. Recommandée aux joueurs de niveau intermédiaire."
            },
            ja: {
                name: "E La Sirena 10",
                description: "名の通り「セイレーン」のように、深い水の中を遊泳している感覚を与えるドリアンスケールです。メジャーとマイナーの間を行き来する不思議な魅力があり、C#4 ノートの使い方がポイントになります。中級者の方におすすめです。"
            },
            zh: {
                name: "E La Sirena 10",
                description: "正如\"塞壬\"之名，这是一种仿佛在深海中游弋的多利亚（Dorian）音阶。徘徊于大调与小调之间的微妙魅力令人着迷，其中 C#4 的运用是关键，推荐给具有一定经验的中级玩家。"
            },
            de: {
                name: "E La Sirena 10",
                description: "Eine dorische Skala, die – wie der Name \"Sirena\" (Meerjungfrau) andeutet – das Gefühl vermittelt, in geheimnisvollen Tiefen unter Wasser zu schweben. Sie bewegt sich zwischen Dur und Moll hin und her; die kreative Nutzung des Tons C#4 ist dabei ein wichtiger Punkt. Empfohlen für Spieler auf mittlerem Niveau."
            },
            es: {
                name: "E La Sirena 10",
                description: "Escala en modo dórico que, como su nombre sugiere, produce la sensación de estar nadando en aguas profundas y misteriosas. Tiene un encanto especial que oscila entre mayor y menor, y el uso creativo de la nota C#4 es la clave. Recomendado para intérpretes de nivel intermedio."
            },
            ru: {
                name: "E La Sirena 10",
                description: "Дорийская гамма, которая, как и имя «Сирена», создаёт ощущение плавания в глубоких таинственных водах. В ней по-особому переплетаются мажорные и минорные оттенки, а ключевую роль играет нота C#4. Рекомендуется исполнителям среднего уровня."
            },
            fa: {
                name: "E La Sirena 10",
                description: "گامی در مُد دوریَن است که همان‌طور که از نام «سیرنا» برمی‌آید، حسی شبیه شناور بودن در آب‌های عمیق و مرموز دریا می‌دهد. جذابیت خاصی میان ماژور و مینور در آن در جریان است و استفادهٔ خلاقانه از نت C#4 نقطهٔ کلیدی این گام است. برای نوازندگان در سطح متوسط توصیه می‌شود."
            },
            pt: {
                name: "E La Sirena 10",
                description: "Escala em modo dórico que, como o nome \"La Sirena\" sugere, transmite a sensação de nadar em águas profundas e misteriosas. Traz um charme especial que oscila entre maior e menor, e o uso criativo da nota C#4 é o ponto-chave. Recomendada para músicos de nível intermediário."
            },
            ae: {
                name: "E La Sirena 10",
                description: "سُلَّم في طور Dorian يعطي، كما يوحي الاسم «La Sirena»، إحساس السباحة في مياه عميقة وغامضة. يجمع بطريقة جذابة بين ألوان الماجور والمينور، والاستخدام الإبداعي للنغمة دو دييز 4 (C#4) هو نقطة الارتكاز في هذا السُلَّم. يُنصَح به للعازفين في المستوى المتوسط."
            },
            it: {
                name: "E La Sirena 10",
                description: "Scala in modalità dorica che, come suggerisce il nome \"La Sirena\", evoca la sensazione di nuotare in acque profonde e misteriose. Il suo fascino sta nel passare tra colore maggiore e minore; l'uso creativo della nota C#4 è il punto chiave. Consigliata per musicisti di livello intermedio."
            }
        }
    },

    // 10. C# Pygmy 9 (The Original Trance Classic)
    {
        id: "cs_pygmy_9",
        name: "C# Pygmy 9",
        notes: {
            ding: "C#3",
            top: ["F#3", "G#3", "A3", "C#4", "E4", "F#4", "G#4", "A4"],
            bottom: []
        },
        vector: { minorMajor: -0.7, pureSpicy: 0.05, rarePopular: 0.95 },
        tags: ["피그미", "트랜스", "깊음", "클래식"],
        description: "핸드팬의 클래식이자 명작으로 꼽히는 피그미 스케일로, 2도와 6도가 생략된 펜타토닉 구성이 공허하면서도 깊은 울림을 만듭니다. 특유의 트랜스(Trance)적인 분위기는 연주자와 청자를 깊은 명상의 상태로 인도합니다. 복잡하지 않은 구성으로도 심오한 내면의 소리를 이끌어내는 힐링 악기입니다.",
        videoUrl: "https://youtu.be/WcREkpJ5I_0?si=YUyV1CEIOLyXWesW",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8521877785",
        ownUrl: "https://handpan.co.kr/shop/?idx=88",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=88",
        nameEn: "C# Pygmy 9",
        tagsEn: ["Pygmy", "Trance", "Deep", "Classic"],
        descriptionEn: "A Pygmy scale considered a classic and masterpiece of Handpans. Its pentatonic structure, omitting the 2nd and 6th notes, creates a hollow yet deep resonance. The unique trance-like atmosphere guides both player and listener into a state of deep meditation. A healing instrument that draws out profound inner sounds even with a simple composition.",
        i18n: {
            fr: {
                name: "C# Pygmy 9",
                description: "Considérée comme un classique et un chef-d'œuvre du handpan, la gamme Pygmy offre une résonance à la fois vide et profonde grâce à sa structure pentatonique (sans 2nde ni 6ème). Son atmosphère de transe unique guide le joueur et l'auditeur vers un état de méditation profonde. Un instrument de guérison qui éveille des sons intérieurs profonds, même avec une composition simple."
            },
            ja: {
                name: "C# Pygmy 9",
                description: "ハンドパンの古典であり傑作とされるピグミースケールです。2度と6度を省略したペンタトニック構成が、空虚でありながらも深い響きを生み出します。特有のトランス（Trance）的な雰囲気は、演奏者と聴衆を深い瞑想の状態へと導きます。複雑でない構成でも深遠な内面の音を引き出すヒーリング楽器です。"
            },
            zh: {
                name: "C# Pygmy 9",
                description: "被誉为 Handpan 经典之作的 Pygmy 音阶。省略了二度和六度的五声音阶结构，营造出空灵而深沉的共鸣。其独特的迷幻（Trance）氛围将演奏者与听众带入深度冥想的状态。是仅凭简单的构成也能引发出深邃内心之声的疗愈乐器。"
            },
            de: {
                name: "C# Pygmy 9",
                description: "Eine Pygmy-Skala, die als Klassiker und Meisterwerk des Handpans gilt. Ihre pentatonische Struktur, bei der die 2. und 6. Note fehlen, erzeugt eine hohle, aber tiefe Resonanz. Die einzigartige Trance-Atmosphäre führt Spieler und Zuhörer in einen Zustand tiefer Meditation. Ein Heilinstrument, das auch mit einfacher Komposition tiefgründige innere Klänge hervorlockt."
            },
            es: {
                name: "C# Pygmy 9",
                description: "Una escala Pygmy considerada un clásico y una obra maestra del Handpan. Su estructura pentatónica, que omite las notas 2.ª y 6.ª, crea una resonancia vacía pero profunda. La atmósfera única de trance guía tanto al intérprete como al oyente hacia un estado de meditación profunda. Un instrumento curativo que extrae sonidos interiores profundos incluso con una composición simple."
            },
            ru: {
                name: "C# Pygmy 9",
                description: "Гамма Pygmy, считающаяся классикой и шедевром хэндпанов. Её пентатоническая структура с пропуском 2-й и 6-й ступеней создает «пустотную», но глубокую резонансу. Уникальная трансовая атмосфера погружает исполнителя и слушателя в состояние глубокой медитации. Исцеляющий инструмент, извлекающий глубокие внутренние звуки даже при простой композиции."
            },
            fa: {
                name: "C# Pygmy 9",
                description: "یک گام Pygmy که کلاسیک و شاهکار هندپن‌ها محسوب می‌شود. ساختار پنتاتونیک آن با حذف نت‌های دوم و ششم، طنینی خالی و در عین حال عمیق ایجاد می‌کند. فضای خلسه‌آور (Trance) منحصربه‌فرد آن، نوازنده و شنونده را به حالت مراقبهٔ عمیق هدایت می‌کند. سازی شفابخش که حتی با ترکیبی ساده، صداهای درونی عمیقی را بیرون می‌کشد."
            },
            pt: {
                name: "C# Pygmy 9",
                description: "Uma escala Pygmy considerada um clássico e uma obra-prima do Handpan. Sua estrutura pentatônica, omitindo as 2ª e 6ª notas, cria uma ressonância vazia, porém profunda. A atmosfera única de transe guia tanto o músico quanto o ouvinte para um estado de meditação profunda. Um instrumento de cura que extrai sons interiores profundos mesmo com uma composição simples."
            },
            ae: {
                name: "C# Pygmy 9",
                description: "سُلَّم Pygmy يُعتبر كلاسيكيًا وتحفة فنية في عالم الهاندبان. هيكله الخماسي (Pentatonic) الذي يحذف الدرجتين الثانية والسادسة يخلق رنينًا أجوفًا ولكنه عميق. يوجه جو النشوة (Trance) الفريد كلًا من العازف والمستمع إلى حالة من التأمل العميق. آلة علاجية تستخرج أصواتًا داخلية عميقة حتى بتركيبة بسيطة."
            },
            it: {
                name: "C# Pygmy 9",
                description: "Una scala Pygmy considerata un classico e un capolavoro degli Handpan. La sua struttura pentatonica, omettendo la 2ª e la 6ª nota, crea una risonanza vuota ma profonda. L'atmosfera unica di trance guida sia il suonatore che l'ascoltatore in uno stato di meditazione profonda. Uno strumento curativo che trae suoni interiori profondi anche con una composizione semplice."
            }
        }
    },

    // 11. D Asha 15 (2-Octave Major) - Mutant
    {
        id: "d_asha_15_mutant",
        name: "D Asha 15",
        notes: {
            ding: "D3",
            top: ["A3", "B3", "C#4", "D4", "E4", "F#4", "G4", "A4", "B4", "C#5", "D5"],
            bottom: ["E3", "F#3", "G3"]
        },
        vector: { minorMajor: 0.9, pureSpicy: 0.1, rarePopular: 0.85 },
        tags: ["D메이저", "2옥타브", "범용성", "협연추천"],
        description: "2옥타브를 완벽하게 커버하는 광범위한 D 메이저 스케일로, 밝고 희망찬 'Asha'의 에너지를 극대화했습니다. 대중음악의 다수 조성을 소화할 수 있는 압도적인 범용성 덕분에 다른 악기와의 협연에서 빛을 발합니다. 풍성한 화음과 멜로디 라인을 자유자재로 구사할 수 있는 전문가용 모델입니다.",
        videoUrl: "https://youtu.be/aGKx4zLFvRo",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12655523545",
        ownUrl: "https://handpan.co.kr/shop/?idx=77",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=77",
        nameEn: "D Asha 15",
        tagsEn: ["D Major", "2-Octave", "Versatile", "Ensemble"],
        descriptionEn: "A wide D Major scale perfectly covering 2 octaves, maximizing the bright and hopeful energy of 'Asha'. It shines in ensemble with other instruments thanks to its overwhelming versatility capable of handling many keys in popular music. A professional model allowing for free expression of rich chords and melodic lines.",
        i18n: {
            fr: {
                name: "D Asha 15",
                description: "Une gamme extrêmement complète couvrant 2 octaves en D majeur. Elle maximise l'énergie lumineuse et pleine d'espoir d'Asha. Grâce à sa polyvalence, elle brille en ensemble et permet une liberté totale d'accords et de mélodies."
            },
            ja: {
                name: "D Asha 15",
                description: "2オクターブを完璧にカバーする広範なDメジャースケールで、明るく希望に満ちた「Asha」のエネルギーを最大化しました。圧倒的な汎用性で他の楽器との協奏で輝きを放ちます。"
            },
            zh: {
                name: "D Asha 15",
                description: "完美覆盖2个八度的广阔 D 大调音阶，极大化了明亮充满希望的“Asha”能量。凭借压倒性的通用性，在与其他乐器的合奏中大放异彩。"
            },
            de: {
                name: "D Asha 15",
                description: "Eine umfangreiche D-Dur-Skala, die 2 Oktaven perfekt abdeckt und die helle, hoffnungsvolle Energie von 'Asha' maximiert. Dank ihrer überwältigenden Vielseitigkeit glänzt sie im Zusammenspiel mit anderen Instrumenten."
            },
            es: {
                name: "D Asha 15",
                description: "Una amplia escala de Re mayor que cubre perfectamente 2 octavas, maximizando la energía brillante y esperanzadora de 'Asha'. Brilla en conjunto con otros instrumentos gracias a su abrumadora versatilidad."
            },
            ru: {
                name: "D Asha 15",
                description: "Широкая гамма D Major, идеально покрывающая 2 октавы, максимизирующая светлую и полную надежд энергию «Asha». Она сияет в ансамбле с другими инструментами благодаря своей потрясающей универсальности."
            },
            fa: {
                name: "D Asha 15",
                description: "یک گام رِ ماژور (D Major) وسیع که ۲ اکتاو را کاملاً پوشش می‌دهد و انرژی روشن و امیدوارکنندهٔ «Asha» را به اوج می‌رساند. به لطف تطبیق‌پذیری فوق‌العاده‌اش، در همنوازی با سازهای دیگر می‌درخشد."
            },
            pt: {
                name: "D Asha 15",
                description: "Uma ampla escala de Ré Maior cobrindo perfeitamente 2 oitavas, maximizando a energia brilhante e esperançosa de 'Asha'. Brilha em conjunto com outros instrumentos graças à sua versatilidade avassaladora."
            },
            ae: {
                name: "D Asha 15",
                description: "سُلَّم ري ماجور (D Major) واسع يغطي 2 أوكتاف بشكل مثالي، مما يعزز الطاقة المشرقة والمليئة بالأمل لـ «Asha». يتألق في العزف الجماعي مع آلات أخرى بفضل تنوعه المذهل."
            },
            it: {
                name: "D Asha 15",
                description: "Una vasta scala D Major che copre perfettamente 2 ottave, massimizzando l'energia luminosa e speranzosa di 'Asha'. Brilla nell'insieme con altri strumenti grazie alla sua travolgente versatilità."
            }
        }
    },

    // 12. E Equinox 12 (Normal, Bass 2 Dings)
    {
        id: "e_equinox_12",
        name: "E Equinox 12",
        notes: {
            ding: "E3",
            top: ["G3", "B3", "C4", "D4", "E4", "F#4", "G4", "B4", "C5"],
            bottom: ["C3", "D3"]
        },
        vector: { minorMajor: -0.3, pureSpicy: 0.3, rarePopular: 0.25 },
        tags: ["하이브리드", "저음보강", "감성적", "밸런스"],
        description: "낮과 밤의 균형을 상징하는 Equinox 스케일에 저음(C3, D3)을 보강하여, 더욱 깊고 웅장한 울림을 완성했습니다. 하이브리드 스케일 특유의 감성적인 선율에 베이스의 무게감이 더해져 완벽한 밸런스를 자랑합니다. 섬세한 감정 표현과 솔로 연주에 최적화된 구성입니다.",
        videoUrl: "https://youtu.be/OcQ64DyA9xM?si=40_8I1KnB_rxCNQO",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12320335441",
        ownUrl: "https://handpan.co.kr/shop/?idx=79",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=79",
        nameEn: "E Equinox 12",
        tagsEn: ["Hybrid", "Bass Boost", "Emotional", "Balanced"],
        descriptionEn: "Reinforced with bass notes (C3, D3) on the Equinox scale symbolizing the balance of day and night, completing a deeper and more majestic resonance. It boasts perfect balance by adding the weight of bass to the emotional melody unique to hybrid scales. Optimized for delicate emotional expression and solo performance.",
        i18n: {
            fr: {
                name: "E Equinox 12",
                description: "Version 12 notes de l'Equinox, enrichie de basses (C3, D3) pour une résonance plus profonde et majestueuse. L'équilibre parfait entre l'émotion de la gamme hybride et le poids des basses. Optimisée pour l'expression émotionnelle délicate et le jeu en solo."
            },
            ja: {
                name: "E Equinox 12",
                description: "Equinox スケールに低音（C3, D3）を補強し、より深く荘厳な響きを完成させました。ハブリッドスケール特有の感性的な旋律にベースの重厚感が加わり、完璧なバランスを誇ります。"
            },
            zh: {
                name: "E Equinox 12",
                description: "在 Equinox 音阶上加强了低音（C3, D3），完成了更加深沉宏伟的共鸣。混合音阶特有的感性旋律加上低音的厚重感，引以为豪的完美平衡。"
            },
            de: {
                name: "E Equinox 12",
                description: "Verstärkt mit Basstönen (C3, D3) auf der Equinox-Skala, was eine tiefere und majestätischere Resonanz vervollständigt. Sie besticht durch perfekte Balance, indem sie der emotionalen Melodie das Gewicht des Basses hinzufügt."
            },
            es: {
                name: "E Equinox 12",
                description: "Reforzada con notas graves (Do3, Re3) en la escala Equinox, completando una resonancia más profunda y majestuosa. Presume de un equilibrio perfecto al añadir el peso del bajo a la melodía emocional."
            },
            ru: {
                name: "E Equinox 12",
                description: "Усиленная басовыми нотами (C3, D3) гамма Equinox, создающая более глубокий и величественный резонанс. Она может похвастаться идеальным балансом, добавляя вес басов к эмоциональной мелодии."
            },
            fa: {
                name: "E Equinox 12",
                description: "با تقویت نت‌های بم (C3, D3) روی گام Equinox، طنینی عمیق‌تر و باشکوه‌تر را کامل می‌کند. با افزودن وزنِ بیس به ملودی احساسی، تعادلی بی‌نظیر را به رخ می‌کشد."
            },
            pt: {
                name: "E Equinox 12",
                description: "Reforçada com notas graves (Dó3, Ré3) na escala Equinox, completando uma ressonância mais profunda e majestosa. Orgulha-se de um equilíbrio perfeito ao adicionar o peso do baixo à melodia emocional."
            },
            ae: {
                name: "E Equinox 12",
                description: "معزز بنغمات البيس (C3, D3) على سُلَّم Equinox، مما يكمل رنينًا أعمق وأكثر فخامة. يفتخر بتوازن مثالي من خلال إضافة ثقل البيس إلى اللحن العاطفي."
            },
            it: {
                name: "E Equinox 12",
                description: "Rinforzata con note basse (C3, D3) sulla scala Equinox, completando una risonanza più profonda e maestosa. Vanta un equilibrio perfetto aggiungendo il peso del basso alla melodia emozionale."
            }
        }
    },

    // 13. E Equinox 10 (Normal)
    {
        id: "e_equinox_10",
        name: "E Equinox 10",
        notes: {
            ding: "E3",
            top: ["G3", "B3", "C4", "D4", "E4", "F#4", "G4", "B4", "C5"],
            bottom: []
        },
        vector: { minorMajor: -0.3, pureSpicy: 0.3, rarePopular: 0.25 },
        tags: ["메이저마이너", "그사이어딘가", "미묘한느낌", "색다른감성추천"],
        description: "메이저와 마이너 그 어디쯤에 위치한 Equinox의 표준 모델로, '춘분/추분'이라는 이름처럼 미묘하고 중의적인 매력을 가집니다. 너무 밝지도 어둡지도 않은 독특한 감성 덕분에 입문자부터 숙련자까지 폭넓게 사랑받습니다. 색다르면서도 감성적인 멜로디를 찾는 분들에게 가장 적합한 선택입니다.",
        videoUrl: "https://youtu.be/8t8MqTelD9k?si=4gbYwCubpVxb_URT",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12320275460",
        ownUrl: "https://handpan.co.kr/shop/?idx=80",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=80",
        nameEn: "E Equinox 10",
        tagsEn: ["Major-Minor", "Somewhere Between", "Subtle Nuance", "Unique Emotion"],
        descriptionEn: "The standard model of Equinox located somewhere between major and minor, possessing a subtle and ambiguous charm like its name. Loved widely from beginners to experts thanks to its unique emotion that is neither too bright nor too dark. The most suitable choice for those seeking unique yet emotional melodies.",
        i18n: {
            fr: {
                name: "E Equinox 10",
                description: "Le modèle standard de l'Equinox, situé quelque part entre majeur et mineur. Aimé de tous, des débutants aux experts, grâce à son émotion unique ni trop joyeuse ni trop sombre. Le choix idéal pour des mélodies singulières et émouvantes."
            },
            ja: {
                name: "E Equinox 10",
                description: "メジャーとマイナーのどこかに位置する Equinox の標準モデルで、微妙で重層的な魅力を持ちます。明るすぎず暗すぎない独特の感性で、入門者から熟練者まで幅広く愛されています。"
            },
            zh: {
                name: "E Equinox 10",
                description: "位于大调与小调之间某处的 Equinox 标准型号，拥有微妙而含蓄的魅力。既不太亮也不太暗的独特情感，使其深受从初学者到专家的广泛喜爱。"
            },
            de: {
                name: "E Equinox 10",
                description: "Das Standardmodell von Equinox, irgendwo zwischen Dur und Moll angesiedelt, mit einem subtilen und mehrdeutigen Charme. Beliebt bei Anfängern und Experten gleichermaßen, dank seiner einzigartigen Emotion, die weder zu hell noch zu dunkel ist."
            },
            es: {
                name: "E Equinox 10",
                description: "El modelo estándar de Equinox ubicado en algún lugar entre mayor y menor, poseyendo un encanto sutil y ambiguo. Amado ampliamente desde principiantes hasta expertos gracias a su emoción única que no es ni demasiado brillante ni demasiado oscura."
            },
            ru: {
                name: "E Equinox 10",
                description: "Стандартная модель Equinox, расположенная где-то между мажором и минором, обладающая тонким и неоднозначным очарованием. Любима многими от новичков до экспертов благодаря своей уникальной эмоции, не слишком светлой и не слишком тёмной."
            },
            fa: {
                name: "E Equinox 10",
                description: "مدل استاندارد Equinox که جایی بین ماژور و مینور واقع شده و جذابیتی ظریف و مبهم دارد. به لطف احساس منحصربه‌فردش که نه خیلی روشن است و نه خیلی تاریک، از مبتدیان تا متخصصان آن را دوست دارند."
            },
            pt: {
                name: "E Equinox 10",
                description: "O modelo padrão de Equinox localizado em algum lugar entre maior e menor, possuindo um charme sutil e ambíguo. Amado amplamente desde iniciantes até especialistas graças à sua emoção única que não é nem muito brilhante nem muito escura."
            },
            ae: {
                name: "E Equinox 10",
                description: "النموذج القياسي لـ Equinox الذي يقع في مكان ما بين الماجور والمينور، ويمتلك سحرًا دقيقًا وغامضًا. محبوب على نطاق واسع من المبتدئين إلى الخبراء بفضل عاطفته الفريدة التي ليست مشرقة جدًا ولا مظلمة جدًا."
            },
            it: {
                name: "E Equinox 10",
                description: "Il modello standard di Equinox situato da qualche parte tra maggiore e minore, che possiede un fascino sottile e ambiguo. Amato ampiamente dai principianti agli esperti grazie alla sua emozione unica che non è né troppo luminosa né troppo scura."
            }
        }
    },

    // 14. F# Low Pygmy 18 (Mutant)
    {
        id: "fs_low_pygmy_18_mutant",
        name: "F# Low Pygmy 18",
        notes: {
            ding: "F#3",
            top: ["G#3", "A3", "D4", "E4", "F#4", "G#4", "A4", "D5", "E5", "F#5", "G#5"],
            bottom: ["D3", "E3", "B3", "C#4", "B4", "C#5"]
        },
        vector: { minorMajor: -0.6, pureSpicy: 0.25, rarePopular: 0.95 },
        tags: ["Malte Marten Style", "뮤턴트", "초고음역", "피그미", "전문가용"],
        description: "Malte Marten 스타일의 뮤턴트 피그미 스케일로, 18개의 노트를 통해 깊은 저음부터 초고음역까지 광활한 음역대를 아우릅니다. 피그미 특유의 몽환적인 분위기에 섬세한 고음과 웅장한 베이스가 더해져 한 편의 서사를 완성합니다. 프로 연주자가 자신의 음악적 세계를 무한히 펼칠 수 있는 최고 사양 모델입니다.",
        videoUrl: "https://youtu.be/UxsvhXeDok0?si=GnSeCzBk0qe8snYr",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12689630331",
        ownUrl: "https://handpan.co.kr/shop/?idx=76",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=76",
        nameEn: "F# Low Pygmy 18",
        tagsEn: ["Malte Marten Style", "Mutant", "Ultra High Range", "Pygmy", "Professional"],
        descriptionEn: "A mutant Pygmy scale in Malte Marten style, covering a vast range from deep bass to ultra-high notes through 18 notes. Delicate highs and majestic bass are added to the unique dreamy atmosphere of Pygmy to complete a narrative. A top-spec model where professional players can unfold their musical world infinitely.",
        i18n: {
            fr: {
                name: "F# Low Pygmy 18",
                description: "Une gamme Pygmy mutante dans le style de Malte Marten, couvrant une vaste étendue des basses profondes aux notes ultra-hautes grâce à 18 notes. Un modèle haut de gamme où les joueurs professionnels peuvent déployer leur univers musical à l'infini."
            },
            ja: {
                name: "F# Low Pygmy 18",
                description: "Malte Marten スタイルのミュータント・ピグミースケールで、18の音符を通じて深い低音から超高音域まで広大な音域をカバーします。プロ奏者が自身の音楽的世界を無限に広げることができる最高仕様のモデルです。"
            },
            zh: {
                name: "F# Low Pygmy 18",
                description: "Malte Marten 风格的变异 Pygmy 音阶，通过 18 个音符涵盖了从深沉低音到超高音域的广阔音域。专业演奏者可以无限展开自己音乐世界的最高配置型号。"
            },
            de: {
                name: "F# Low Pygmy 18",
                description: "Eine mutierte Pygmy-Skala im Stil von Malte Marten, die mit 18 Tönen einen riesigen Bereich von tiefen Bässen bis zu ultrahohen Tönen abdeckt. Ein Spitzenmodell, auf dem professionelle Spieler ihre musikalische Welt unendlich entfalten können."
            },
            es: {
                name: "F# Low Pygmy 18",
                description: "Una escala Pygmy mutante al estilo de Malte Marten, que cubre un vasto rango desde graves profundos hasta notas ultra altas a través de 18 notas. Un modelo de alta gama donde los intérpretes profesionales pueden desplegar su mundo musical infinitamente."
            },
            ru: {
                name: "F# Low Pygmy 18",
                description: "Мутировавшая гамма Pygmy в стиле Мальте Мартена, охватывающая огромный диапазон от глубоких басов до ультра-высоких нот благодаря 18 нотам. Топовая модель, где профессиональные музыканты могут бесконечно раскрывать свой музыкальный мир."
            },
            fa: {
                name: "F# Low Pygmy 18",
                description: "یک گام Pygmy جهش‌یافته به سبک Malte Marten، که با ۱۸ نت دامنه‌ای وسیع از بیس عمیق تا نت‌های فوق‌العاده بالا را پوشش می‌دهد. مدلی با مشخصات عالی که نوازندگان حرفه‌ای می‌توانند دنیای موسیقی خود را در آن بی‌نهایت گسترش دهند."
            },
            pt: {
                name: "F# Low Pygmy 18",
                description: "Uma escala Pygmy mutante no estilo de Malte Marten, cobrindo uma vasta gama de graves profundos a notas ultra-altas através de 18 notas. Um modelo de especificação superior onde músicos profissionais podem desdobrar seu mundo musical infinitamente."
            },
            ae: {
                name: "F# Low Pygmy 18",
                description: "سُلَّم Pygmy متحول بأسلوب Malte Marten، يغطي نطاقًا واسعًا من البيس العميق إلى النغمات العالية جدًا من خلال 18 نغمة. نموذج بمواصفات عليا حيث يمكن للعازفين المحترفين نشر عالمهم الموسيقي بلا حدود."
            },
            it: {
                name: "F# Low Pygmy 18",
                description: "Una scala Pygmy mutante in stile Malte Marten, che copre una vasta gamma dai bassi profondi alle note ultra-alte attraverso 18 note. Un modello di punta dove i musicisti professionisti possono dispiegare il loro mondo musicale all'infinito."
            }
        }
    },

    // 15. C# Pygmy 11 (Normal, Bass 2 Dings)
    {
        id: "cs_pygmy_11",
        name: "C# Pygmy 11",
        notes: {
            ding: "C#3",
            top: ["F#3", "G#3", "A3", "C#4", "E4", "F#4", "G#4", "A4"],
            bottom: ["D3", "E3"]
        },
        vector: { minorMajor: -0.7, pureSpicy: 0.05, rarePopular: 0.95 },
        tags: ["피그미", "저음보강", "트랜스", "깊은울림"],
        description: "클래식 C# Pygmy에 저음(D3, E3)을 더해, 피그미의 고요함에 웅장한 깊이를 더했습니다. 더욱 풍성해진 공명은 트랜스와 명상, 사운드 힐링에 최적화된 환경을 제공합니다. 깊은 내면으로 침잠하는 듯한 몰입감을 원하는 연주자에게 탁월한 선택입니다.",
        videoUrl: "https://youtu.be/QoUbOkhGGR8?si=TIKXYdCKX4RiuaLY",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12276307998",
        ownUrl: "https://handpan.co.kr/shop/?idx=81",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=81",
        nameEn: "C# Pygmy 11",
        tagsEn: ["Pygmy", "Bass Boost", "Trance", "Deep Resonance"],
        descriptionEn: "A classic C# Pygmy with added bass (D3, E3), adding majestic depth to the stillness of Pygmy. More enriched resonance provides an optimized environment for trance, meditation, and sound healing. An excellent choice for players wanting immersion as if sinking into the deep inner self.",
        i18n: {
            fr: {
                name: "C# Pygmy 11",
                description: "Un C# Pygmy classique avec des basses ajoutées (D3, E3), apportant une profondeur majestueuse au calme du Pygmy. Une résonance enrichie qui offre un environnement optimisé pour la transe, la méditation et la guérison par le son."
            },
            ja: {
                name: "C# Pygmy 11",
                description: "クラシック C# Pygmy に低音（D3, E3）を加え、ピグミーの静けさに荘厳な深みを増しました。より豊かになった共鳴は、トランスと瞑想、サウンドヒーリングに最適化された環境を提供します。"
            },
            zh: {
                name: "C# Pygmy 11",
                description: "在经典 C# Pygmy 上增加低音（D3, E3），为 Pygmy 的宁静增添了宏伟的深度。更加丰富的共鸣提供了针对恍惚、冥想和声音疗愈优化的环境。"
            },
            de: {
                name: "C# Pygmy 11",
                description: "Ein klassisches C# Pygmy mit zusätzlichem Bass (D3, E3), das der Stille des Pygmy eine majestätische Tiefe verleiht. Die angereicherte Resonanz bietet eine optimierte Umgebung für Trance, Meditation und Klangheilung."
            },
            es: {
                name: "C# Pygmy 11",
                description: "Un C# Pygmy clásico con bajos añadidos (Do3, Mi3), agregando una profundidad majestuosa a la quietud del Pygmy. La resonancia más enriquecida proporciona un entorno optimizado para el trance, la meditación y la sanación sonora."
            },
            ru: {
                name: "C# Pygmy 11",
                description: "Классическая C# Pygmy с добавленными басами (D3, E3), добавляющими величественную глубину спокойствию Pygmy. Более насыщенный резонанс обеспечивает оптимальную среду для транса, медитации и звуковой терапии."
            },
            fa: {
                name: "C# Pygmy 11",
                description: "یک C# Pygmy کلاسیک با بیس افزوده (D3, E3)، که عمقی باشکوه به سکون Pygmy می‌افزاید. رزونانس غنی‌تر محیطی بهینه برای ترنس، مدیتیشن و درمان صوتی فراهم می‌کند."
            },
            pt: {
                name: "C# Pygmy 11",
                description: "Uma C# Pygmy clássica com graves adicionados (Ré3, Mi3), adicionando profundidade majestosa à quietude da Pygmy. Uma ressonância mais enriquecida proporciona um ambiente otimizado para transe, meditação e cura sonora."
            },
            ae: {
                name: "C# Pygmy 11",
                description: "كلاسيك C# Pygmy مع بيس مضاف (D3, E3)، مما يضيف عمقًا فخمًا إلى هدوء Pygmy. الرنين الأكثر ثراءً يوفر بيئة مثالية للترانس، والتأمل، والعلاج الصوتي."
            },
            it: {
                name: "C# Pygmy 11",
                description: "Una classica C# Pygmy con bassi aggiunti (D3, E3), che aggiunge una profondità maestosa alla quiete della Pygmy. Una risonanza più arricchita fornisce un ambiente ottimizzato per la trance, la meditazione e la guarigione sonora."
            }
        }
    },

    // 16. F Low Pygmy 12 (Normal, Bass 2 Dings)
    {
        id: "f_low_pygmy_12",
        name: "F Low Pygmy 12",
        notes: {
            ding: "F3",
            top: ["G3", "Ab3", "C4", "Eb4", "F4", "G4", "Ab4", "C5", "Eb5"],
            bottom: ["Db3", "Eb3"]
        },
        vector: { minorMajor: -0.6, pureSpicy: 0.1, rarePopular: 0.95 },
        tags: ["피그미", "저음보강", "따뜻함", "몽환적"],
        description: "부드럽고 따뜻한 F Pygmy 스케일에 저음을 보강하여, 몽환적인 분위기를 더욱 짙게 만들었습니다. 안정적인 저음이 받쳐주는 포근한 선율은 듣는 이의 마음을 편안하게 감싸줍니다. 힐링과 휴식을 위한 연주에 더할 나위 없이 좋은 구성을 가졌습니다.",
        videoUrl: "https://youtu.be/_3jpTdVfOBc?si=W9bAL_AqZ5e25Rj8",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8611436986",
        ownUrl: "https://handpan.co.kr/shop/?idx=82",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=82",
        nameEn: "F Low Pygmy 12",
        tagsEn: ["Pygmy", "Bass Boost", "Warm", "Dreamy"],
        descriptionEn: "Reinforced with bass on the soft and warm F Pygmy scale, deepening the dreamy atmosphere. Cozy melodies supported by stable bass comfortably embrace the listener's heart. It has an impeccable composition for healing and relaxation performances.",
        i18n: {
            fr: {
                name: "F Low Pygmy 12",
                description: "Renforcée par des basses sur la gamme douce et chaude F Pygmy, approfondissant l'atmosphère onirique. Des mélodies douillettes soutenues par des basses stables enveloppent confortablement le cœur de l'auditeur."
            },
            ja: {
                name: "F Low Pygmy 12",
                description: "柔らかく暖かい F Pygmy スケールに低音を補強し、夢幻的な雰囲気をさらに濃くしました。安定した低音が支える心地よい旋律は、聴く人の心を安らかに包み込みます。"
            },
            zh: {
                name: "F Low Pygmy 12",
                description: "在柔和温暖的 F Pygmy 音阶上加强低音，加深了梦幻般的氛围。由稳定的低音支撑的舒适旋律，舒适地拥抱听众的心灵。"
            },
            de: {
                name: "F Low Pygmy 12",
                description: "Verstärkt mit Bass auf der weichen und warmen F Pygmy-Skala, was die traumartige Atmosphäre vertieft. Gemütliche Melodien, unterstützt von stabilem Bass, umarmen das Herz des Zuhörers wohlig."
            },
            es: {
                name: "F Low Pygmy 12",
                description: "Reforzada con bajos en la suave y cálida escala F Pygmy, profundizando la atmósfera onírica. Melodías acogedoras apoyadas por bajos estables abrazan cómodamente el corazón del oyente."
            },
            ru: {
                name: "F Low Pygmy 12",
                description: "Усиленная басами мягкая и тёплая гамма F Pygmy, углубляющая мечтательную атмосферу. Уютные мелодии, поддерживаемые стабильным басом, комфортно обнимают сердце слушателя."
            },
            fa: {
                name: "F Low Pygmy 12",
                description: "با تقویت بیس روی گام نرم و گرم F Pygmy، فضای رؤیایی را عمیق‌تر کرده است. ملودی‌های دنج که توسط بیس پایدار پشتیبانی می‌شوند، قلب شنونده را به آرامی در آغوش می‌گیرند."
            },
            pt: {
                name: "F Low Pygmy 12",
                description: "Reforçada com graves na escala suave e quente F Pygmy, aprofundando a atmosfera onírica. Melodias aconchegantes apoiadas por graves estáveis abraçam confortavelmente o coração do ouvinte."
            },
            ae: {
                name: "F Low Pygmy 12",
                description: "معزز بالبيس على سُلَّم F Pygmy الناعم والدافئ، مما يعمق الجو الحالم. الألحان المريحة المدعومة ببيس ثابت تحتضن قلب المستمع براحة."
            },
            it: {
                name: "F Low Pygmy 12",
                description: "Rinforzata con il basso sulla scala dolce e calda F Pygmy, approfondendo l'atmosfera onirica. Melodie accoglienti supportate da un basso stabile abbracciano comodamente il cuore dell'ascoltatore."
            }
        }
    },

    // 17. D Kurd 12 (Normal, Bass 2 Dings)
    {
        id: "d_kurd_12",
        name: "D Kurd 12",
        notes: {
            ding: "D3",
            top: ["A3", "Bb3", "C4", "D4", "E4", "F4", "G4", "A4", "C5"],
            bottom: ["F3", "G3"]
        },
        vector: { minorMajor: -0.8, pureSpicy: 0.1, rarePopular: 0.90 },
        tags: ["마이너", "저음보강", "표준확장", "딩베이스", "화성연주"],
        description: "대중적인 D Kurd 스케일에 하단 딩 베이스를 추가하여 화성적인 풍부함을 더한 표준 확장형 모델입니다. 저음의 보강으로 더욱 입체적인 연주가 가능하며, 마이너 스케일의 감성을 묵직하게 전달합니다. 솔로 연주와 반주 모두에 적합한 다재다능한 구성을 자랑합니다.",
        videoUrl: "https://youtu.be/KXDSbCdPjTM?si=3GD2eOil-5WsmVHa",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12070396728",
        ownUrl: "https://handpan.co.kr/shop/?idx=83",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=83",
        nameEn: "D Kurd 12",
        tagsEn: ["Minor", "Bass Boost", "Standard Extension", "Ding Bass", "Harmonic Play"],
        descriptionEn: "A standard extended model adding bottom Ding bass to the popular D Kurd scale for harmonic richness. Bass reinforcement allows for more three-dimensional performance and delivers the emotion of minor scale with weight. Boasts a versatile composition suitable for both solo playing and accompaniment.",
        i18n: {
            fr: {
                name: "D Kurd 12",
                description: "Un modèle étendu standard ajoutant une basse Ding inférieure à la gamme populaire D Kurd pour une richesse harmonique. Le renforcement des basses permet un jeu plus tridimensionnel et délivre l'émotion de la gamme mineure avec poids."
            },
            ja: {
                name: "D Kurd 12",
                description: "大衆的な D Kurd スケールに下段ディングベースを追加して和声的な豊かさを加えた標準拡張型モデルです。低音の補強によりさらに立体的な演奏が可能になり、マイナースケールの感性を重厚に伝えます。"
            },
            zh: {
                name: "D Kurd 12",
                description: "在流行的 D Kurd 音阶上增加底部 Ding 低音，以增加和声丰富度的标准扩展型号。低音增强允许更立体的演奏，并带有分量地传递小调音阶的情感。"
            },
            de: {
                name: "D Kurd 12",
                description: "Ein standardmäßiges erweitertes Modell, das der beliebten D Kurd-Skala einen unteren Ding-Bass für harmonische Fülle hinzufügt. Die Bassverstärkung ermöglicht ein dreidimensionaleres Spiel und vermittelt die Emotion der Moll-Skala mit Gewicht."
            },
            es: {
                name: "D Kurd 12",
                description: "Un modelo extendido estándar que añade bajo Ding inferior a la popular escala D Kurd para riqueza armónica. El refuerzo de graves permite una interpretación más tridimensional y entrega la emoción de la escala menor con peso."
            },
            ru: {
                name: "D Kurd 12",
                description: "Стандартная расширенная модель, добавляющая нижний Ding-бас к популярной гамме D Kurd для гармонического богатства. Усиление басов позволяет более объёмное исполнение и передает эмоцию минорной гаммы с весом."
            },
            fa: {
                name: "D Kurd 12",
                description: "یک مدل گسترش‌یافتهٔ استاندارد که بیس Ding پایین را برای غنای هارمونیک به گام محبوب D Kurd اضافه می‌کند. تقویت بیس امکان اجرایی سه‌بعدی‌تر را فراهم می‌کند و احساس گام مینور را با وزن منتقل می‌کند."
            },
            pt: {
                name: "D Kurd 12",
                description: "Um modelo estendido padrão adicionando baixo Ding inferior à popular escala D Kurd para riqueza harmônica. O reforço de graves permite uma performance mais tridimensional e entrega a emoção da escala menor com peso."
            },
            ae: {
                name: "D Kurd 12",
                description: "نموذج موسع قياسي يضيف بيس Ding السفلي إلى سُلَّم D Kurd الشهير للثراء التوافقي. يسمح تعزيز البيس بأداء أكثر ثلاثية الأبعاد ويوصل عاطفة سُلَّم المينور بوزن."
            },
            it: {
                name: "D Kurd 12",
                description: "Un modello esteso standard che aggiunge il basso Ding inferiore alla popolare scala D Kurd per ricchezza armonica. Il rinforzo dei bassi consente un'esecuzione più tridimensionale e trasmette l'emozione della scala minore con peso."
            }
        }
    },

    // 18. F Low Pygmy 9 (Normal)
    {
        id: "f_low_pygmy_9",
        name: "F Low Pygmy 9",
        notes: {
            ding: "F3",
            top: ["G3", "G#3", "C4", "D#4", "F4", "G4", "G#4", "C5"],
            bottom: []
        },
        vector: { minorMajor: -0.6, pureSpicy: 0.1, rarePopular: 0.95 },
        tags: ["피그미", "기본", "차분함", "명상"],
        description: "도리안 모드에서 2음과 6음을 생략한 펜타토닉(Dorian Pentatonic) 구성으로, 숲속의 고요함을 닮은 평화로운 소리를 냅니다. 자극적이지 않고 부드러운 음색은 명상과 힐링을 위한 첫 악기로 완벽합니다. 단순함 속에 깊은 울림을 담아내어 연주자에게 안식을 줍니다.",
        videoUrl: "https://youtu.be/61g8qreUeJk?si=NgBTdfaU51SV__5O",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12085324936",
        ownUrl: "https://handpan.co.kr/shop/?idx=86",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=86",
        nameEn: "F Low Pygmy 9",
        tagsEn: ["Pygmy", "Basic", "Calm", "Meditation"],
        descriptionEn: "A Pentatonic (Dorian Pentatonic) composition omitting the 2nd and 6th notes from the Dorian mode, creating a peaceful sound resembling the silence of a forest. Non-stimulating and soft tone is perfect as a first instrument for meditation and healing. It captures deep resonance within simplicity, giving rest to the player.",
        i18n: {
            fr: {
                name: "F Low Pygmy 9",
                description: "Une composition pentatonique (Pentatonique Dorien) omettant les 2ème et 6ème notes du mode Dorien, créant un son paisible ressemblant au silence d'une forêt. Le ton non stimulant et doux est parfait comme premier instrument pour la méditation et la guérison."
            },
            ja: {
                name: "F Low Pygmy 9",
                description: "ドリアンモードで2音と6音を省略したペンタトニック（Dorian Pentatonic）構成で、森の中の静けさに似た平和な音を出します。刺激的でなく柔らかい音色は、瞑想とヒーリングのための最初の楽器として完璧です。"
            },
            zh: {
                name: "F Low Pygmy 9",
                description: "省略了多利亚模式中的第2和第6个音符的五声音阶（Dorian Pentatonic）构成，发出类似于森林寂静的平和声音。不刺激且柔和的音色作为冥想和疗愈的第一件乐器非常完美。"
            },
            de: {
                name: "F Low Pygmy 9",
                description: "Eine pentatonische (Dorisch Pentatonisch) Komposition, bei der die 2. und 6. Note des dorischen Modus weggelassen werden, was einen friedlichen Klang erzeugt, der der Stille eines Waldes ähnelt. Der nicht stimulierende und weiche Ton ist perfekt als erstes Instrument für Meditation und Heilung."
            },
            es: {
                name: "F Low Pygmy 9",
                description: "Una composición pentatónica (Pentatónica Dórica) que omite las notas 2.ª y 6.ª del modo dórico, creando un sonido pacífico que se asemeja al silencio de un bosque. El tono no estimulante y suave es perfecto como primer instrumento para la meditación y la sanación."
            },
            ru: {
                name: "F Low Pygmy 9",
                description: "Пентатоническая (Дорийская пентатоника) композиция, пропускающая 2-ю и 6-ю ноты дорийского лада, создающая мирный звук, напоминающий тишину леса. Нераздражающий и мягкий тон идеален в качестве первого инструмента для медитации и исцеления."
            },
            fa: {
                name: "F Low Pygmy 9",
                description: "یک ترکیب پنتاتونیک (پنتاتونیک دوریَن) با حذف نت‌های دوم و ششم از مُد دوریَن، که صدایی صلح‌آمیز شبیه سکوت جنگل ایجاد می‌کند. تن غیرمحرک و نرم آن به عنوان اولین ساز برای مدیتیشن و هیلینگ عالی است."
            },
            pt: {
                name: "F Low Pygmy 9",
                description: "Uma composição Pentatônica (Pentatônica Dórica) omitindo as 2ª e 6ª notas do modo Dórico, criando um som pacífico semelhante ao silêncio de uma floresta. O tom não estimulante e suave é perfeito como primeiro instrumento para meditação e cura."
            },
            ae: {
                name: "F Low Pygmy 9",
                description: "تركيبة خماسية (Dorian Pentatonic) تحذف النغمتين الثانية والسادسة من طور Dorian، مما يخلق صوتًا هادئًا يشبه صمت الغابة. النغمة غير المحفزة والناعمة مثالية كأول آلة للتأمل والعلاج."
            },
            it: {
                name: "F Low Pygmy 9",
                description: "Una composizione pentatonica (Pentatonica Dorica) che omette la 2ª e la 6ª nota della modalità dorica, creando un suono pacifico che ricorda il silenzio di una foresta. Il tono non stimolante e morbido è perfetto come primo strumento per la meditazione e la guarigione."
            }
        }
    },

    // 19. C# Annapurna 9 (Normal)
    {
        id: "cs_annapurna_9",
        name: "C# Annapurna 9",
        notes: {
            ding: "C#3",
            top: ["G#3", "C4", "C#4", "D#4", "F4", "F#4", "G#4", "C#5"],
            bottom: []
        },
        vector: { minorMajor: 0.8, pureSpicy: 0.35, rarePopular: 0.55 },
        tags: ["메이저", "안나푸르나", "상쾌함", "에너지"],
        description: "C# 메이저(Ionian) 스케일로, 히말라야의 안나푸르나 봉우리처럼 웅장하고 상쾌한 에너지를 담고 있습니다. Yisha Savita와 동일한 구성으로, 밝고 긍정적인 기운이 넘치는 멜로디를 연주하기 좋습니다. 높은 산의 맑은 공기처럼 청량감을 주는 모델입니다.",
        videoUrl: "https://youtu.be/HSHDfm9PEM4?si=930q4Eu3DT2URi50",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8513450652",
        ownUrl: "https://handpan.co.kr/shop/?idx=89",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=89",
        nameEn: "C# Annapurna 9",
        tagsEn: ["Major", "Annapurna", "Refreshing", "Energy"],
        descriptionEn: "A C# Major (Ionian) scale containing majestic and refreshing energy like the Annapurna peak of the Himalayas. Identical composition to Yisha Savita, great for playing melodies full of bright and positive vibes. A model giving a refreshing feeling like the clear air of a high mountain.",
        i18n: {
            fr: {
                name: "C# Annapurna 9",
                description: "Une gamme C# Majeur (Ionien) contenant une énergie majestueuse et rafraîchissante comme le pic Annapurna de l'Himalaya. Composition identique à Yisha Savita, idéale pour jouer des mélodies pleines de vibrations lumineuses et positives."
            },
            ja: {
                name: "C# Annapurna 9",
                description: "C# メジャー（イオニアン）スケールで、ヒマラヤのアンナプルナ峰のように雄大で爽快なエネルギーを込めています。Yisha Savita と同じ構成で、明るくポジティブな気運に満ちたメロディを演奏するのに適しています。"
            },
            zh: {
                name: "C# Annapurna 9",
                description: "C# 大调（Ionian）音阶，蕴含着像喜马拉雅安纳普尔纳峰一样宏伟清爽的能量。与 Yisha Savita 相同的构成，非常适合演奏充满明亮积极气息的旋律。"
            },
            de: {
                name: "C# Annapurna 9",
                description: "Eine C#-Dur (Ionisch) Skala, die majestätische und erfrischende Energie wie der Annapurna-Gipfel des Himalaya enthält. Identische Zusammensetzung wie Yisha Savita, großartig zum Spielen von Melodien voller heller und positiver Schwingungen."
            },
            es: {
                name: "C# Annapurna 9",
                description: "Una escala de Do# mayor (Jónica) que contiene una energía majestuosa y refrescante como el pico Annapurna del Himalaya. Composición idéntica a Yisha Savita, genial para tocar melodías llenas de vibraciones brillantes y positivas."
            },
            ru: {
                name: "C# Annapurna 9",
                description: "Гамма C# Major (Ionian), содержащая величественную и освежающую энергию, подобную пику Аннапурна в Гималаях. Идентичная композиция с Yisha Savita, отлично подходит для исполнения мелодий, полных светлых и позитивных вибраций."
            },
            fa: {
                name: "C# Annapurna 9",
                description: "یک گام دو دیز ماژور (یونین) که حاوی انرژی باشکوه و باطراوتی مانند قلهٔ آناپورنا در هیمالیا است. ترکیب یکسان با Yisha Savita، عالی برای نواختن ملودی‌های پر از ارتعاشات روشن و مثبت."
            },
            pt: {
                name: "C# Annapurna 9",
                description: "Uma escala Dó# Maior (Jônio) contendo energia majestosa e refrescante como o pico Annapurna do Himalaia. Composição idêntica à Yisha Savita, ótima para tocar melodias cheias de vibrações brilhantes e positivas."
            },
            ae: {
                name: "C# Annapurna 9",
                description: "سُلَّم سي دييز ماجور (Ionian) يحتوي على طاقة مهيبة ومنعشة مثل قمة أنابورنا في جبال الهيمالايا. تركيبة مطابقة لـ Yisha Savita، رائعة لعزف الألحان المليئة بالمشاعر المشرقة والإيجابية."
            },
            it: {
                name: "C# Annapurna 9",
                description: "Una scala C# Major (Ionica) che contiene un'energia maestosa e rinfrescante come la vetta dell'Annapurna dell'Himalaya. Composizione identica a Yisha Savita, ottima per suonare melodie piene di vibrazioni luminose e positive."
            }
        }
    },

    // 20. C Major 10
    {
        id: "c_major_10",
        name: "C Major 10",
        notes: {
            ding: "C3",
            top: ["G3", "A3", "B3", "C4", "D4", "E4", "F4", "G4", "A4"],
            bottom: []
        },
        vector: { minorMajor: 1.0, pureSpicy: 0.0, rarePopular: 0.80 },
        tags: ["메이저", "기본", "밝음", "동요"],
        description: "음악의 가장 기본이 되는 순수한 '도레미' 메이저 스케일로, 밝고 명랑한 동요나 팝을 연주하기에 최적입니다. 복잡함 없이 직관적인 음계 구성 덕분에 누구나 쉽게 멜로디를 익히고 즐길 수 있습니다. 맑고 깨끗한 장조의 울림이 동심과 즐거움을 불러일으킵니다.",
        videoUrl: "https://youtu.be/2peCXnJP2U0?si=bVePs8DvAlPEwI7v",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12751985321",
        ownUrl: "https://handpan.co.kr/shop/?idx=91",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=91",
        nameEn: "C Major 10",
        tagsEn: ["Major", "Basic", "Bright", "Nursery Rhyme"],
        descriptionEn: "The pure 'Do-Re-Mi' major scale that is the most basic of music, optimal for playing bright and cheerful children's songs or pop. Thanks to the intuitive scale composition without complexity, anyone can easily learn and enjoy melodies. The clear and clean major resonance evokes childhood innocence and joy.",
        i18n: {
            fr: {
                name: "C Major 10",
                description: "La pure gamme majeure 'Do-Ré-Mi' qui est la base de la musique, optimale pour jouer des chansons pour enfants ou de la pop joyeuse. Grâce à la composition intuitive de la gamme sans complexité, tout le monde peut facilement apprendre et apprécier les mélodies."
            },
            ja: {
                name: "C Major 10",
                description: "音楽の最も基本となる純粋な「ドレミ」メジャースケールで、明るく朗らかな童謡やポップスを演奏するのに最適です。複雑さのない直感的な音階構成のおかげで、誰でも簡単にメロディを覚えて楽しむことができます。"
            },
            zh: {
                name: "C Major 10",
                description: "作为音乐最基础的纯净‘Do-Re-Mi’大调音阶，最适合演奏明亮欢快的童谣或流行音乐。由于直观的音阶构成没有复杂性，任何人都可以轻松学习并享受旋律。"
            },
            de: {
                name: "C Major 10",
                description: "Die reine 'Do-Re-Mi'-Dur-Skala, die die grundlegendste der Musik ist, optimal zum Spielen von hellen und fröhlichen Kinderliedern oder Pop. Dank der intuitiven Skalenkomposition ohne Komplexität kann jeder Melodien leicht lernen und genießen."
            },
            es: {
                name: "C Major 10",
                description: "La pura escala mayor 'Do-Re-Mi' que es la más básica de la música, óptima para tocar canciones infantiles brillantes y alegres o pop. Gracias a la composición intuitiva de la escala sin complejidad, cualquiera puede aprender y disfrutar fácilmente de las melodías."
            },
            ru: {
                name: "C Major 10",
                description: "Чистая мажорная гамма «До-Ре-Ми», являющаяся основой музыки, оптимальна для исполнения ярких и весёлых детских песен или поп-музыки. Благодаря интуитивной композиции гаммы без сложностей, любой может легко выучить и наслаждаться мелодиями."
            },
            fa: {
                name: "C Major 10",
                description: "گام ماجور خالص «دو-ر-می» که پایه‌ای‌ترین گام موسیقی است و برای نواختن آهنگ‌های شاد و روشن کودکانه یا پاپ بهینه است. به لطف ترکیب بصری گام بدون پیچیدگی، هر کسی می‌تواند به راحتی ملودی‌ها را یاد بگیرد و لذت ببرد."
            },
            pt: {
                name: "C Major 10",
                description: "A pura escala maior 'Dó-Ré-Mi' que é a mais básica da música, ideal para tocar canções infantis brilhantes e alegres ou pop. Graças à composição intuitiva da escala sem complexidade, qualquer um pode facilmente aprender e desfrutar de melodias."
            },
            ae: {
                name: "C Major 10",
                description: "سُلَّم الماجور النقي «دو-ري-مي» الذي هو أساس الموسيقى، مثالي لعزف أغاني الأطفال المشرقة والمبهجة أو البوب. بفضل تركيبة السُلَّم البديهية دون تعقيد، يمكن لأي شخص تعلم الألحان والاستمتاع بها بسهولة."
            },
            it: {
                name: "C Major 10",
                description: "La pura scala maggiore 'Do-Re-Mi' che è la più basilare della musica, ottimale per suonare canzoni per bambini luminose e allegre o pop. Grazie alla composizione intuitiva della scala senza complessità, chiunque può imparare e godere facilmente delle melodie."
            }
        }
    },

    // 21. C Rasavali 10
    {
        id: "c_rasavali_10",
        name: "C Rasavali 10",
        notes: {
            ding: "C3",
            top: ["G3", "Ab3", "C4", "D4", "E4", "F4", "G4", "Ab4", "C5"],
            bottom: []
        },
        vector: { minorMajor: -0.2, pureSpicy: 0.6, rarePopular: 0.20 },
        tags: ["라사발리", "인도풍", "신비로움", "독특함"],
        description: "인도 라가(Raga)에서 영감을 받은 라사발리 스케일로, 동양적이고 신비로운 색채가 짙게 묻어납니다. 독특한 음계 진행이 만들어내는 묘한 분위기는 명상적이면서도 이국적인 매력을 발산합니다. 흔하지 않은 개성 있는 소리를 찾는 분들에게 매력적인 선택지입니다.",
        videoUrl: "https://youtu.be/u9dsmUSd_SY?si=rMBMQOFvj5Yec7vs",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12751991029",
        ownUrl: "https://handpan.co.kr/shop/?idx=92",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=92",
        nameEn: "C Rasavali 10",
        tagsEn: ["Rasavali", "Indian Style", "Mysterious", "Unique"],
        descriptionEn: "A Rasavali scale inspired by Indian Raga, imbued with deep oriental and mysterious colors. The strange atmosphere created by the unique scale progression radiates meditative yet exotic charm. An attractive choice for those looking for uncommon unique sounds.",
        i18n: {
            fr: {
                name: "C Rasavali 10",
                description: "Une gamme Rasavali inspirée du Raga indien, imprégnée de couleurs orientales profondes et mystérieuses. L'atmosphère étrange créée par la progression unique de la gamme dégage un charme méditatif et exotique."
            },
            ja: {
                name: "C Rasavali 10",
                description: "インドのラーガにインスパイアされたラサヴァリ（Rasavali）スケールで、東洋的で神秘的な色彩が色濃く表れています。独特な音階進行が作り出す不思議な雰囲気は、瞑想的でありながらエキゾチックな魅力を放ちます。"
            },
            zh: {
                name: "C Rasavali 10",
                description: "受印度拉格（Raga）启发的 Rasavali 音阶，蕴含着浓厚的东方与神秘色彩。独特音阶进行所营造的奇妙氛围，散发出既冥想又充满异域风情的魅力。"
            },
            de: {
                name: "C Rasavali 10",
                description: "Eine Rasavali-Skala, inspiriert vom indischen Raga, durchdrungen von tiefen orientalischen und geheimnisvollen Farben. Die seltsame Atmosphäre, die durch die einzigartige Skalenprogression entsteht, strahlt einen meditativen, aber exotischen Charme aus."
            },
            es: {
                name: "C Rasavali 10",
                description: "Una escala Rasavali inspirada en el Raga indio, imbuida de profundos colores orientales y misteriosos. La extraña atmósfera creada por la progresión única de la escala irradia un encanto meditativo pero exótico."
            },
            ru: {
                name: "C Rasavali 10",
                description: "Гамма Rasavali, вдохновленная индийской рагой, пропитанная глубокими восточными и таинственными красками. Необычная атмосфера, создаваемая уникальной прогрессией гаммы, излучает медитативный, но экзотический шарм."
            },
            fa: {
                name: "C Rasavali 10",
                description: "یک گام Rasavali الهام‌گرفته از راگای هندی، آغشته به رنگ‌های عمیق شرقی و مرموز. فضای عجیبی که توسط پیشرفت منحصربه‌فرد گام ایجاد می‌شود، جذابیت مراقبه‌ای و در عین حال اگزوتیک را ساطع می‌کند."
            },
            pt: {
                name: "C Rasavali 10",
                description: "Uma escala Rasavali inspirada no Raga indiano, imbuída de cores orientais profundas e misteriosas. A atmosfera estranha criada pela progressão única da escala irradia um charme meditativo, mas exótico."
            },
            ae: {
                name: "C Rasavali 10",
                description: "سُلَّم Rasavali مستوحى من الراغا الهندية، مشبع بألوان شرقية وغامضة عميقة. الجو الغريب الذي يخلقه تتابع السُلَّم الفريد يشع بسحر تأملي وغريب."
            },
            it: {
                name: "C Rasavali 10",
                description: "Una scala Rasavali ispirata al Raga indiano, intrisa di profondi colori orientali e misteriosi. La strana atmosfera creata dalla progressione unica della scala irradia un fascino meditativo ma esotico."
            }
        }
    },

    // 22. C# Deepasia 14 (Normal)
    {
        id: "cs_deepasia_14",
        name: "C# Deepasia 14",
        notes: {
            ding: "C#3",
            top: ["G#3", "A#3", "C#4", "D#4", "F4", "F4", "F#4", "G#4", "C#5", "D#5", "F5"],
            bottom: ["D#3", "F3"]
        },
        vector: { minorMajor: -0.5, pureSpicy: 0.5, rarePopular: 0.20 },
        tags: ["딥아시아", "동양적", "확장형", "깊음"],
        description: "'깊은 아시아(Deep Asia)'라는 이름처럼 동양적인 선율과 여백의 미를 담은 확장형 스케일입니다. 14개의 노트가 만들어내는 그윽하고 깊은 울림은 정적인 명상과 내면의 탐구에 적합합니다. 서구적인 스케일과는 다른, 차분하고 고스넉한 분위기를 자아냅니다.",
        videoUrl: "https://youtu.be/pMKoFUicrFw?si=5HPgyOp8NM0qXMNU",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12689651421",
        ownUrl: "https://handpan.co.kr/shop/?idx=84",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=84",
        nameEn: "C# Deepasia 14",
        tagsEn: ["Deep Asia", "Oriental", "Extended", "Deep"],
        descriptionEn: "An extended scale named 'Deep Asia' containing oriental melody and the beauty of emptiness. The deep and profound resonance created by 14 notes is suitable for static meditation and inner exploration. Creates a calm and quiet atmosphere different from Western scales.",
        i18n: {
            fr: {
                name: "C# Deepasia 14",
                description: "Une gamme étendue nommée 'Deep Asia' contenant une mélodie orientale et la beauté du vide. La résonance profonde créée par 14 notes convient à la méditation statique et à l'exploration intérieure."
            },
            ja: {
                name: "C# Deepasia 14",
                description: "「Deep Asia」という名の通り、東洋的な旋律と余白の美を込めた拡張型スケールです。14の音が作り出す奥深く深い響きは、静的な瞑想と内面の探求に適しています。"
            },
            zh: {
                name: "C# Deepasia 14",
                description: "正如其名“Deep Asia”，这是一种包含东方旋律与留白之美的扩展音阶。14个音符营造出的幽深共鸣，适合静态冥想与内在探索。"
            },
            de: {
                name: "C# Deepasia 14",
                description: "Eine erweiterte Skala namens 'Deep Asia', die orientalische Melodien und die Schönheit der Leere enthält. Die tiefe Resonanz, die von 14 Tönen erzeugt wird, eignet sich für statische Meditation und innere Erkundung."
            },
            es: {
                name: "C# Deepasia 14",
                description: "Una escala extendida llamada 'Deep Asia' que contiene melodía oriental y la belleza del vacío. La resonancia profunda y honda creada por 14 notas es adecuada para la meditación estática y la exploración interior."
            },
            ru: {
                name: "C# Deepasia 14",
                description: "Расширенная гамма под названием «Deep Asia», содержащая восточную мелодию и красоту пустоты. Глубокий резонанс, создаваемый 14 нотами, подходит для статичной медитации и внутреннего исследования."
            },
            fa: {
                name: "C# Deepasia 14",
                description: "یک گام گسترش‌یافته به نام «Deep Asia» که حاوی ملودی شرقی و زیباییِ فضای خالی است. رزونانس عمیق و ژرفی که توسط ۱۴ نت ایجاد می‌شود، برای مدیتیشن ساکن و کاوش درونی مناسب است."
            },
            pt: {
                name: "C# Deepasia 14",
                description: "Uma escala estendida chamada 'Deep Asia' contendo melodia oriental e a beleza do vazio. A ressonância profunda criada por 14 notas é adequada para meditação estática e exploração interior."
            },
            ae: {
                name: "C# Deepasia 14",
                description: "سُلَّم موسع يسمى «Deep Asia» يحتوي على لحن شرقي وجمال الفراغ. الرنين العميق والواسع الذي تخلقه 14 نغمة مناسب للتأمل الساكن والاستكشاف الداخلي."
            },
            it: {
                name: "C# Deepasia 14",
                description: "Una scala estesa chiamata 'Deep Asia' contenente melodia orientale e la bellezza del vuoto. La risonanza profonda e profonda creata da 14 note è adatta alla meditazione statica e all'esplorazione interiore."
            }
        }
    },

    // 23. C# Blues 9 (Normal)
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
        description: "미국 흑인 음악에서 유래한 헥사토닉 블루스(Hexatonic Blues) 스케일로, 감 5도(블루 노트)가 추가되어 특유의 끈적한 감성을 자아냅니다. 재즈나 소울풀한 연주에 최적화되어 있으며, 즉흥적으로 연주해도 멋스러운 '블루지(Bluesy)'한 느낌을 냅니다. 깊이 있는 감정 표현을 원하는 연주자에게 추천합니다.",
        videoUrl: "https://youtu.be/mY-Uvw-VKO4?si=Ail972LckjNWKp8S",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12689712335",
        ownUrl: "https://handpan.co.kr/shop/?idx=90",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=90",
        nameEn: "C# Blues 9",
        tagsEn: ["Blues", "Jazz", "Emotional", "Groove"],
        descriptionEn: "A Hexatonic Blues scale derived from African-American music, adding a diminished 5th (Blue Note) to create a unique sticky emotion. Optimized for jazz or soulful playing, it gives a cool 'Bluesy' feel even when improvised. Recommended for players wanting deep emotional expression.",
        i18n: {
            fr: {
                name: "C# Blues 9",
                description: "Une gamme Blues hexatonique dérivée de la musique afro-américaine, ajoutant une quinte diminuée (Blue Note) pour créer une émotion unique. Optimisée pour le jazz ou le jeu soul, elle donne une sensation 'Bluesy' cool même en improvisation."
            },
            ja: {
                name: "C# Blues 9",
                description: "米国黒人音楽に由来するヘキサトニック・ブルース（Hexatonic Blues）スケールで、減5度（ブルーノート）が追加され、特有の粘りのある感性を醸し出します。ジャズやソウルフルな演奏に最適化されており、即興でも素敵な「ブルージー（Bluesy）」な雰囲気を出せます。"
            },
            zh: {
                name: "C# Blues 9",
                description: "源自美国黑人音乐的六声布鲁斯（Hexatonic Blues）音阶，增加了减五度（Blue Note），营造出独特的粘稠情感。专为爵士或灵魂乐演奏优化，即兴演奏也能展现出帅气的“Bluesy”感觉。"
            },
            de: {
                name: "C# Blues 9",
                description: "Eine hexatonische Blues-Skala, die von afroamerikanischer Musik abgeleitet ist und eine verminderte Quinte (Blue Note) hinzufügt, um eine einzigartige Emotion zu erzeugen. Optimiert für Jazz oder soulvolles Spiel, vermittelt sie auch bei Improvisation ein cooles 'Bluesy'-Gefühl."
            },
            es: {
                name: "C# Blues 9",
                description: "Una escala de Blues hexatónica derivada de la música afroamericana, que añade una quinta disminuida (Blue Note) para crear una emoción única. Optimizada para jazz o interpretación conmovedora, da una sensación 'Bluesy' genial incluso cuando se improvisa."
            },
            ru: {
                name: "C# Blues 9",
                description: "Гексатоническая блюзовая гамма, происходящая из афроамериканской музыки, с добавлением уменьшенной квинты (Blue Note) для создания уникальной эмоции. Оптимизирована для джаза или душевного исполнения, дает классное ощущение «блюза» даже при импровизации."
            },
            fa: {
                name: "C# Blues 9",
                description: "یک گام بلوز هگزاتونیک برگرفته از موسیقی آفریقایی-آمریکایی، با افزودن پنجم کاسته (نت آبی) برای ایجاد احساسی منحصربه‌فرد. بهینه شده برای جاز یا نوازندگی پرشور، حتی در بداهه‌نوازی حسی عالی و 'بلوزی' می‌دهد."
            },
            pt: {
                name: "C# Blues 9",
                description: "Uma escala Blues hexatônica derivada da música afro-americana, adicionando uma quinta diminuta (Blue Note) para criar uma emoção única. Otimizada para jazz ou tocar com alma, dá uma sensação 'Bluesy' legal mesmo quando improvisada."
            },
            ae: {
                name: "C# Blues 9",
                description: "سُلَّم بلوز سداسي مستمد من الموسيقى الأفريقية الأمريكية، يضيف خامسة ناقصة (Blue Note) لخلق عاطفة فريدة. مجهز للجاز أو العزف الروحي، يعطي شعورًا رائعًا بـ «البلوز» حتى عند الارتجال."
            },
            it: {
                name: "C# Blues 9",
                description: "Una scala Blues esatonica derivata dalla musica afroamericana, che aggiunge una quinta diminuita (Blue Note) per creare un'emozione unica. Ottimizzata per il jazz o per suonare con anima, dà una sensazione 'Bluesy' fresca anche quando improvvisata."
            }
        }
    },

    // 24. Eb MUJU 10 (Normal)
    {
        id: "eb_muju_10",
        name: "Eb MUJU 10",
        notes: {
            ding: "Eb3",
            top: ["G3", "Ab3", "Bb3", "C4", "Eb4", "F4", "G4", "Ab4", "C5"],
            bottom: []
        },
        vector: { minorMajor: 0.5, pureSpicy: 0.2, rarePopular: 0.55 },
        tags: ["Eb메이저", "국악평조", "아리랑음계", "무주자연"],
        description: "한국 전통 국악의 평조와 아리랑 음계를 품은 Eb 메이저(Ionian) 스케일로, 무주(Muju)의 깨끗한 자연을 닮았습니다. 우리 민족의 정서에 닿아있는 따뜻하고 부드러운 선율이 마음을 편안하게 치유해 줍니다. 한국적인 아름다움과 평화를 연주하고 싶은 분들을 위한 특별한 모델입니다.",
        videoUrl: "https://youtu.be/0IGtmQlb1X4?si=y9oZiE4w-_Zkyih6",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/8513504905",
        ownUrl: "https://handpan.co.kr/shop/?idx=96",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=96",
        nameEn: "Eb MUJU 10",
        tagsEn: ["Eb Major", "Korean Traditional", "Arirang Scale", "Muju Nature"],
        descriptionEn: "Eb Major scale containing Korean traditional Pyeongjo and Arirang scales. A peaceful scale resembling the nature of Muju, it has the power to heal the mind with its soft and warm tone. A special model for those who want to play Korean beauty and peace.",
        i18n: {
            fr: {
                name: "Eb MUJU 10",
                description: "Gamme en Eb majeur intégrant les couleurs du pyeongjo et de l'air traditionnel « Arirang ». Elle s'inspire des paysages paisibles de Muju et propose un son doux, chaleureux, capable d'apaiser et de réconforter l'auditeur. Un modèle spécial pour ceux qui souhaitent jouer la beauté et la paix coréennes."
            },
            ja: {
                name: "Eb MUJU 10",
                description: "Eb メジャースケールで、韓国伝統音楽の平調と「アリラン」の音階を取り入れています。ムジュ（茂朱）の自然を思わせる穏やかなスケールで、柔らかくあたたかな音色が心を癒してくれます。韓国的な美しさと平和を奏でたい方のための特別なモデルです。"
            },
            zh: {
                name: "Eb MUJU 10",
                description: "Eb 大调音阶，融合了韩国传统音阶\"平调\"和《阿里郎》的旋律色彩。仿佛描绘出茂朱自然风光般的宁静，是以柔和、温暖音色抚慰人心的疗愈型音阶。专为想要演奏韩国之美与和平的人士打造的特别型号。"
            },
            de: {
                name: "Eb MUJU 10",
                description: "Eine Eb-Dur-Skala, die Elemente der koreanischen Pyeongjo-Tonleiter und der \"Arirang\"-Melodie aufgreift. Sie erinnert an die friedliche Natur von Muju und entfaltet mit ihrem weichen, warmen Klang eine starke, heilsame Wirkung. Ein besonderes Modell für diejenigen, die koreanische Schönheit und Frieden spielen möchten."
            },
            es: {
                name: "Eb MUJU 10",
                description: "Escala de Mi♭ mayor que incorpora elementos del modo coreano Pyeongjo y de la melodía de \"Arirang\". Evoca la naturaleza pacífica de Muju, con un sonido suave y cálido que tiene un fuerte efecto sanador sobre el oyente. Un modelo especial para aquellos que quieren tocar la belleza y la paz coreanas."
            },
            ru: {
                name: "Eb MUJU 10",
                description: "Мажорная гамма в тональности E♭, сочетающая элементы корейского традиционного лада пхёнโจ и мелодии «Ариран». Напоминает мирную природу Муджу: мягкий, тёплый звук обладает сильным успокаивающим и целительным эффектом. Особая модель для тех, кто хочет исполнять корейскую красоту и мир."
            },
            fa: {
                name: "Eb MUJU 10",
                description: "گام می بمل ماژور (Eb major) که عناصری از مُد سنتی کره‌ای «پینگجو» و ملودی «آریرانگ» را در خود دارد. طبیعت آرام منطقهٔ Muju را به خاطر می‌آورد؛ با صدایی نرم و گرم که تأثیر آرام‌بخش و شفابخش قدرتمندی بر شنونده دارد. مدلی خاص برای کسانی که می‌خواهند زیبایی و صلح کره‌ای را بنوازند."
            },
            pt: {
                name: "Eb MUJU 10",
                description: "Escala de Mi♭ maior que incorpora elementos do modo tradicional coreano Pyeongjo e da melodia \"Arirang\". Evoca a natureza pacífica de Muju, com som suave e quente que exerce forte efeito relaxante e restaurador sobre o ouvinte. Um modelo especial para quem quer tocar a beleza e a paz coreanas."
            },
            ae: {
                name: "Eb MUJU 10",
                description: "سُلَّم مي بيمول ماجور (Eb major) يدمج عناصر من الطور الكوري التقليدي Pyeongjo ولحن «آريرانغ». يستحضر طبيعة منطقة Muju الهادئة؛ صوته الناعم والدافئ له تأثير مهدّئ وشفائي قوي على المستمع. نموذج خاص لأولئك الذين يريدون عزف الجمال والسلام الكوري."
            },
            it: {
                name: "Eb MUJU 10",
                description: "Scala Eb maggiore che integra elementi del modo coreano tradizionale Pyeongjo e della melodia di \"Arirang\". Richiama la natura pacifica di Muju; il suo suono morbido e caldo ha un forte effetto calmante e terapeutico sull'ascoltatore. Un modello speciale per chi vuole suonare la bellezza e la pace coreana."
            }
        }
    },

    // 25. C Yunsl 9 (Normal)
    {
        id: "c_yunsl_9",
        name: "C Yunsl 9",
        notes: {
            ding: "C3",
            top: ["C4", "D4", "E4", "F4", "G4", "B4", "C5", "D5"],
            bottom: []
        },
        vector: { minorMajor: 0.8, pureSpicy: 0.1, rarePopular: 0.55 },
        tags: ["윤슬", "반짝임", "맑음", "서정적"],
        description: "6음(A)을 생략한 C 메이저 스케일로, 햇빛이나 달빛에 비치어 반짝이는 잔물결인 '윤슬'과 같은 맑고 영롱한 소리를 냅니다. 서정적이고 아름다운 멜로디를 연주할 때 물 위를 걷는 듯한 투명한 감성을 더해줍니다. 자극적이지 않고 은은하게 빛나는 울림이 매력적입니다.",
        videoUrl: "https://youtu.be/_fB5VHpE1f0?si=v6RDSBTJJUsiAZXK",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12752009418",
        ownUrl: "https://handpan.co.kr/shop/?idx=102",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=102",
        nameEn: "C Yunsl 9",
        tagsEn: ["Yunsl", "Sparkling", "Clear", "Lyrical"],
        descriptionEn: "Yunsl scale, possessing a clear and sparkling sound like sunlight reflecting on ripples. Good for play lyrical and beautiful melodies.",
        i18n: {
            fr: {
                name: "C Yunsl 9",
                description: "Gamme Yunsl, dont le nom évoque les reflets de la lumière sur les vagues. Elle offre un son clair, scintillant et poétique, idéal pour des mélodies lyriques et émouvantes."
            },
            ja: {
                name: "C Yunsl 9",
                description: "ユンスル（Yunsl）スケールで、水面にきらめく陽光のように澄んで輝くサウンドが特徴です。抒情的で美しいメロディを奏でるのに最適です。"
            },
            zh: {
                name: "C Yunsl 9",
                description: "Yunsl（\"윤슬\"）音阶，声音如同阳光洒在水面上闪耀般清澈明亮。非常适合演奏抒情而唯美的旋律线条。"
            },
            de: {
                name: "C Yunsl 9",
                description: "Die Yunsl-Skala, deren Klang wie Sonnenlicht wirkt, das auf den Wellen glitzert: klar, hell und funkelnd. Besonders geeignet für lyrische, poetische Melodien."
            },
            es: {
                name: "C Yunsl 9",
                description: "Escala Yunsl, cuyo sonido recuerda al reflejo del sol sobre las olas: claro, brillante y chispeante. Ideal para melodías líricas y hermosas, llenas de sensibilidad."
            },
            ru: {
                name: "C Yunsl 9",
                description: "Гамма Yunsl, чей звук напоминает солнечные блики на водной глади: чистый, яркий и мерцающий. Отлично подходит для лиричных, красивых мелодий, наполненных чувствами."
            },
            fa: {
                name: "C Yunsl 9",
                description: "گام Yunsl که صدای آن مانند بازتاب نور خورشید بر سطح موج‌های آب، شفاف، درخشان و چشمک‌زن است. برای ملودی‌های شاعرانه و زیبا که سرشار از احساس هستند، بسیار مناسب است."
            },
            pt: {
                name: "C Yunsl 9",
                description: "Escala Yunsl, cujo som lembra o brilho do sol refletido nas ondas do mar: claro, cintilante e reluzente. Excelente para melodias líricas e belas, cheias de sensibilidade."
            },
            ae: {
                name: "C Yunsl 9",
                description: "سُلَّم Yunsl الذي يشبه صوته انعكاس ضوء الشمس على سطح الماء: صافٍ، لامع ومتألّق. مناسب جدًّا للألحان الشاعرية والجميلة المليئة بالإحساس."
            },
            it: {
                name: "C Yunsl 9",
                description: "Scala Yunsl dal suono limpido e scintillante, come i riflessi del sole sulle onde. Molto adatta a melodie liriche e poetiche, piene di sensibilità."
            }
        }
    },

    // 26. C# Sapphire 9 (Normal)
    {
        id: "cs_sapphire_9",
        name: "C# Sapphire 9",
        notes: {
            ding: "C#3",
            top: ["G#3", "B3", "C#4", "F4", "F#4", "G#4", "B4", "C#5"],
            bottom: []
        },
        vector: { minorMajor: -0.2, pureSpicy: 0.4, rarePopular: 0.55 },
        tags: ["사파이어", "청량함", "보석", "세련됨"],
        description: "단 7도(b7)를 포함한 믹솔리디안(Mixolydian) 모드의 색채를 띠며, 푸른 보석 사파이어처럼 세련되고 청량한 울림을 가집니다. 맑고 투명한 음색이 깔끔하고 모던한 연주 스타일에 완벽하게 부합합니다. 군더더기 없는 세련미와 시원한 타격감을 선호하는 분들에게 추천합니다.",
        videoUrl: "https://youtu.be/V1bfHlVl9VY?si=yREB5-6dey1kvC_4",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12752029521",
        ownUrl: "https://handpan.co.kr/shop/?idx=93",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=93",
        nameEn: "C# Sapphire 9",
        tagsEn: ["Sapphire", "Refreshing", "Gemstone", "Sophisticated"],
        descriptionEn: "Sapphire scale, giving a refreshing and sophisticated resonance like a sapphire gem. Recommended for those who prefer clean and modern performances.",
        i18n: {
            fr: {
                name: "C# Sapphire 9",
                description: "Gamme Sapphire, aussi raffinée et brillante que la pierre précieuse du même nom. Elle se distingue par une résonance fraîche, propre et moderne, recommandée à ceux qui aiment les sonorités élégantes et épurées."
            },
            ja: {
                name: "C# Sapphire 9",
                description: "サファイアスケールで、その名の通りサファイアのように清涼感があり、洗練された響きを持ちます。すっきりとモダンなサウンドを好む方におすすめです。"
            },
            zh: {
                name: "C# Sapphire 9",
                description: "Sapphire 音阶，犹如蓝宝石般清凉而洗练的共鸣。推荐给喜欢干净、现代感音色的玩家。"
            },
            de: {
                name: "C# Sapphire 9",
                description: "Die Sapphire-Skala mit einem kühlen, eleganten Klang – wie ein Saphir in Klangform. Sie eignet sich ideal für Spieler, die einen klaren, modernen und aufgeräumten Sound bevorzugen."
            },
            es: {
                name: "C# Sapphire 9",
                description: "Escala Sapphire, con una resonancia fresca y refinada, como un zafiro sonoro. Recomendable para quienes prefieren un sonido limpio, moderno y elegante."
            },
            ru: {
                name: "C# Sapphire 9",
                description: "Гамма Sapphire с чистой и изысканной резонансой, подобной звучанию сапфира. Рекомендуется тем, кто предпочитает современное, аккуратное и «минималистичное» звучание."
            },
            fa: {
                name: "C# Sapphire 9",
                description: "گام Sapphire با رزونانسی خنک و شیک، همچون صدای یک یاقوت کبود. برای نوازندگانی که صدایی تمیز، مدرن و مینیمال را ترجیح می‌دهند انتخابی عالی است."
            },
            pt: {
                name: "C# Sapphire 9",
                description: "Escala Sapphire, com ressonância fresca e sofisticada, como um \"safira sonora\". Recomendada para quem prefere um som limpo, moderno e elegante."
            },
            ae: {
                name: "C# Sapphire 9",
                description: "سُلَّم Sapphire برنين بارد وأنيق، مثل «ياقوتة زرقاء صوتية». يُوصى به لمن يفضّلون صوتًا نظيفًا، حديثًا وبسيطًا في الوقت نفسه."
            },
            it: {
                name: "C# Sapphire 9",
                description: "Scala Sapphire dal timbro fresco ed elegante, come un \"zaffiro sonoro\". Consigliata a chi preferisce un suono pulito, moderno e lineare."
            }
        }
    },

    // 27. C# Annaziska 9 (Normal)
    {
        id: "cs_annaziska_9",
        name: "C# Annaziska 9",
        notes: {
            ding: "C#3",
            top: ["G#3", "A3", "B3", "C#4", "D#4", "E4", "F#4", "G#4"],
            bottom: []
        },
        vector: { minorMajor: -0.4, pureSpicy: 0.5, rarePopular: 0.80 },
        tags: ["이국적", "긴장감", "신비", "매니아"],
        description: "신비롭고 약간의 긴장감을 머금은 이국적인 스케일로, 독특한 이름만큼이나 개성 강한 분위기를 연출합니다. 평범함을 거부하는 매니아들을 위해 고안되었으며, 묘한 매력으로 청자를 빨아들이는 힘이 있습니다. 드라마틱하고 주술적인 느낌의 연주에 적합합니다.",
        videoUrl: "https://youtu.be/Z3bVZYykphA?si=zJAD4lmQPxMQ0xq8",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12085316070",
        ownUrl: "https://handpan.co.kr/shop/?idx=94",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=94",
        nameEn: "C# Annaziska 9",
        tagsEn: ["Exotic", "Tension", "Mysterious", "Mania"],
        descriptionEn: "An exotic scale that is mysterious and gives a slight sense of tension. Suitable for mania players who want to create a unique atmosphere.",
        i18n: {
            fr: {
                name: "C# Annaziska 9",
                description: "Gamme mystérieuse et légèrement tendue, avec une forte couleur exotique. Elle convient parfaitement aux joueurs en quête de sonorités rares et de climats dramatiques ou cinématiques."
            },
            ja: {
                name: "C# Annaziska 9",
                description: "ミステリアスで、わずかな緊張感を含んだエキゾチックスケールです。独特の雰囲気を演出したいマニアックなプレイヤーに適しています。"
            },
            zh: {
                name: "C# Annaziska 9",
                description: "带有神秘感与轻微紧张感的异域音阶。非常适合想要塑造独特氛围、偏爱个性化声音的玩家。"
            },
            de: {
                name: "C# Annaziska 9",
                description: "Eine exotische Skala mit geheimnisvollem Charakter und leichter Spannung. Perfekt für Spieler, die eine besondere, dramatische Atmosphäre und einen individuellen Klang suchen."
            },
            es: {
                name: "C# Annaziska 9",
                description: "Escala exótica, misteriosa y con un ligero toque de tensión. Es perfecta para intérpretes que desean crear atmósferas únicas y dramáticas, con un carácter muy especial."
            },
            ru: {
                name: "C# Annaziska 9",
                description: "Экзотическая гамма с таинственным характером и лёгким напряжением. Подходит для музыкантов, которые хотят создавать необычные, драматичные и атмосферные звуковые миры."
            },
            fa: {
                name: "C# Annaziska 9",
                description: "گامی اگزوتیک با شخصیتی رازآلود و کمی پُرتنش. برای نوازندگانی که می‌خواهند فضاهایی خاص، دراماتیک و متمایز خلق کنند، گزینه‌ای بسیار جذاب است."
            },
            pt: {
                name: "C# Annaziska 9",
                description: "Escala exótica, misteriosa e com um leve toque de tensão. Perfeita para músicos que desejam criar atmosferas únicas e dramáticas, com um caráter muito especial."
            },
            ae: {
                name: "C# Annaziska 9",
                description: "سُلَّم أجنبي ذو شخصية غامضة ولمسة خفيفة من التوتر. مثالي للعازفين الذين يريدون خلق أجواء خاصة ودرامية بصوت مختلف وواضح."
            },
            it: {
                name: "C# Annaziska 9",
                description: "Scala esotica dal carattere misterioso e con una leggera tensione. Ideale per musicisti appassionati che vogliono creare atmosfere particolari e drammatiche con un suono unico."
            }
        }
    },

    // 28. E Hijaz 9 (Normal)
    {
        id: "e_hijaz_9",
        name: "E Hijaz 9",
        notes: {
            ding: "E3",
            top: ["A3", "B3", "C4", "D#4", "E4", "F#4", "G4", "B4"],
            bottom: []
        },
        vector: { minorMajor: -0.3, pureSpicy: 0.7, rarePopular: 0.80 },
        tags: ["이국적", "중동풍", "정열적", "스파이시"],
        description: "E 하모닉 마이너(Harmonic Minor) 스케일로, 중동 음악의 정열을 담은 뜨거운 사막의 바람처럼 강렬하고 스파이시한 느낌을 전달합니다. 히자즈(Hijaz) 특유의 이국적인 음계는 즉흥 연주에 역동적인 에너지를 불어넣습니다. 뚜렷한 색채와 강한 임팩트를 원하는 연주자에게 훌륭한 파트너가 됩니다.",
        videoUrl: "https://youtu.be/MRyGVe5k4Y8?si=VEoopVqXSO9gJ6Rd",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12085332035",
        ownUrl: "https://handpan.co.kr/shop/?idx=95",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=95",
        nameEn: "E Hijaz 9",
        tagsEn: ["Exotic", "Middle Eastern", "Passionate", "Spicy"],
        descriptionEn: "E key Hijaz scale, strongly conveying an exotic, Middle Eastern, passionate, and spicy feeling.",
        i18n: {
            fr: {
                name: "E Hijaz 9",
                description: "Gamme Hijaz en E, immédiatement reconnaissable par sa couleur orientale et enflammée. Sa dynamique intense, épicée et passionnée est idéale pour les improvisations expressives et les paysages sonores moyen-orientaux."
            },
            ja: {
                name: "E Hijaz 9",
                description: "E キーのヒジャーズスケールで、中東風のエキゾチックさと情熱的でスパイシーな雰囲気を強く伝えます。ドラマチックな即興演奏にぴったりです。"
            },
            zh: {
                name: "E Hijaz 9",
                description: "E 调 Hijaz 音阶，充满异国情调与中东风格的热情与辛香气息。非常适合需要强烈情绪与戏剧张力的即兴演奏。"
            },
            de: {
                name: "E Hijaz 9",
                description: "Eine Hijaz-Skala in E mit stark orientalischem, nahöstlichem Flair. Sie vermittelt eine leidenschaftliche, \"würzige\" Stimmung und eignet sich hervorragend für dramatische, ausdrucksstarke Improvisationen."
            },
            es: {
                name: "E Hijaz 9",
                description: "Escala Hijaz en Mi, de fuerte carácter exótico y sabor mediooriental. Transmite una sensación intensa, apasionada y \"picante\", ideal para improvisaciones dramáticas y muy expresivas."
            },
            ru: {
                name: "E Hijaz 9",
                description: "Гамма Hijaz в тональности E с ярко выраженным восточным и ближневосточным оттенком. Передаёт страстное, «пряное» настроение и идеально подходит для драматичных и очень выразительных импровизаций."
            },
            fa: {
                name: "E Hijaz 9",
                description: "گام Hijaz در تونالیتهٔ می (E) با رنگ‌وبوی قوی خاورمیانه‌ای و شرقی. حسی پرشور و «تند و ادویه‌دار» منتقل می‌کند و برای بداهه‌نوازی‌های دراماتیک و بسیار احساسی فوق‌العاده است."
            },
            pt: {
                name: "E Hijaz 9",
                description: "Escala Hijaz em Mi, de forte caráter exótico e sabor médio-oriental. Transmite uma sensação intensa, apaixonada e \"picante\", ideal para improvisações dramáticas e altamente expressivas."
            },
            ae: {
                name: "E Hijaz 9",
                description: "سُلَّم Hijaz في مي (E) بطابع شرقي وشرق أوسطي قوي. ينقل إحساسًا حادًا، عاطفيًا و«متبَّلًا»، وهو رائع للارتجالات الدرامية شديدة التعبير."
            },
            it: {
                name: "E Hijaz 9",
                description: "Scala Hijaz in tonalità di E, dal forte sapore mediorientale. Trasmette un sentimento intenso, passionale e speziato: perfetta per improvvisazioni drammatiche e molto espressive."
            }
        }
    },

    // 29. C# Amara 9 (Celitic Minor)
    {
        id: "cs_amara_9",
        name: "C# Amara 9",
        notes: {
            ding: "C#3",
            top: ["G#3", "B3", "C#4", "D#4", "E4", "F#4", "G#4", "B4"],
            bottom: []
        },
        vector: { minorMajor: -0.6, pureSpicy: 0.2, rarePopular: 0.95 },
        tags: ["마이너", "켈틱", "신비로움", "Amara"],
        description: "'켈틱 마이너(Celtic Minor)'로도 불리는 Amara 스케일로, 슬픔보다는 신비롭고 몽환적인 켈틱 감성이 돋보입니다. 6번째 음을 생략한 헥사토닉 구성으로 긴 여운과 공명을 극대화하여 초보자도 쉽게 아름다운 소리를 낼 수 있습니다. 평온함과 신비로움이 공존하는 치유의 울림을 가졌습니다.",

        videoUrl: "https://youtu.be/W9QAtyTDrTM?si=Yypn8wZrnRQCltmm",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12800221630",
        ownUrl: "https://handpan.co.kr/shop/?idx=103",
        ownUrlEn: "https://handpanen.imweb.me/shop/?idx=103",
        nameEn: "C# Amara 9",
        tagsEn: ["Wellness", "Yoga", "Meditation", "Healing", "Celtic Minor", "Malte Marten"],
        descriptionEn: "C# Amara 9, also known as 'Celtic Minor' and a member of the Wellness Trio (Pygmy, Aegean, Amara), holds a unique position in the global yoga, meditation, and healing communities, made famous by Malte Marten's renowned performances. Also an introductory version of the beloved E Amara 18, this scale is deeply loved by those seeking inner peace in both East and West, thanks to its unique mysterious and spiritual resonance.",
        i18n: {
            fr: {
                name: "C# Amara 9",
                description: "Le C# Amara 9, également connu sous le nom de « Celtic Minor » et membre du trio Wellness (Pygmy, Aegean, Amara), occupe une place unique dans les communautés mondiales de yoga, de méditation et de guérison, rendu célèbre par les performances renommées de Malte Marten. Également version d'introduction du bien-aimé E Amara 18, cette gamme est profondément appréciée par ceux qui recherchent la paix intérieure en Orient et en Occident, grâce à sa résonance mystérieuse et spirituelle unique."
            },
            ja: {
                name: "C# Amara 9",
                description: "ウェルネス三大スケール（Pygmy・Aegean・Amara）の一つで、「Celtic Minor」としても知られる C# Amara 9 は、Malte Marten の名演によって世界的に注目され、ヨガ・瞑想・ヒーリングコミュニティで独自の地位を確立しています。人気モデル E Amara 18 の入門版でもあり、特有の神秘的でスピリチュアルな響きによって、東西を問わず内なる平和を求める多くの人々に愛されています。"
            },
            zh: {
                name: "C# Amara 9",
                description: "作为\"身心疗愈三巨头\"（Pygmy、Aegean、Amara）之一，同时也被称为\"Celtic Minor\"的 C# Amara 9，因 Malte Marten 的精彩演奏而享誉全球，在瑜伽、冥想与疗愈社区中占据独特地位。它也是广受欢迎的 E Amara 18 的入门版本，凭借独特而灵性的共鸣，深受东西方所有追求内在平静之人的喜爱。"
            },
            de: {
                name: "C# Amara 9",
                description: "Mitglied der \"Wellness-Top-3\" (Pygmy, Aegean, Amara) und auch als \"Celtic Minor\" bekannt. Die C# Amara 9 wurde durch die virtuosen Interpretationen von Malte Marten berühmt und nimmt weltweit in Yoga-, Meditations- und Healing-Communities eine herausragende Stellung ein. Als Einsteigerversion der beliebten E Amara 18 ist sie dank ihres mystischen, spirituellen Klanges bei Menschen in Ost und West gleichermaßen geschätzt, die auf der Suche nach innerem Frieden sind."
            },
            es: {
                name: "C# Amara 9",
                description: "Miembro del \"trío del bienestar\" (Pygmy, Aegean, Amara) y también conocida como \"Celtic Minor\". La C# Amara 9 se hizo famosa gracias a las interpretaciones de Malte Marten y hoy ocupa una posición destacada en comunidades de yoga, meditación y sanación en todo el mundo. Es la versión de iniciación de la muy apreciada E Amara 18 y, gracias a su resonancia misteriosa y espiritual, es muy querida por quienes buscan la paz interior, tanto en Oriente como en Occidente."
            },
            ru: {
                name: "C# Amara 9",
                description: "Представитель «великий троицы wellness-гамм» (Pygmy, Aegean, Amara), также известна как Celtic Minor. C# Amara 9 стала популярной благодаря выдающимся выступлениям Мальте Мартена и сегодня занимает особое место в сообществах йоги, медитации и звукового исцеления по всему миру. Это также «входная» версия любимой многими гаммы E Amara 18. За счёт своего мистического и духовного звучания она особенно любима теми, кто ищет внутренний покой — как на Востоке, так и на Западе."
            },
            fa: {
                name: "C# Amara 9",
                description: "عضوی از «سه‌گانهٔ بزرگ Wellness» (Pygmy, Aegean, Amara) و همچنین با نام Celtic Minor شناخته می‌شود. C# Amara 9 با اجراهای درخشان Malte Marten به شهرت جهانی رسیده و در جوامع یوگا، مدیتیشن و هیلینگ جایگاهی ویژه دارد. این گام، نسخهٔ ورودی محبوبِ E Amara 18 نیز به‌شمار می‌آید و به لطف رزونانس اسرارآمیز و معنوی خود، در شرق و غرب جهان نزد همهٔ کسانی که در جستجوی صلح درونی هستند، بسیار محبوب است."
            },
            pt: {
                name: "C# Amara 9",
                description: "Membro da \"trindade do bem-estar\" (Pygmy, Aegean, Amara) e também conhecida como Celtic Minor. A C# Amara 9 tornou-se famosa graças às performances de Malte Marten e hoje ocupa uma posição de destaque em comunidades de yoga, meditação e healing em todo o mundo. É também a versão de entrada da muito apreciada E Amara 18 e, graças à sua ressonância misteriosa e espiritual, é extremamente querida por todos que buscam paz interior, tanto no Oriente quanto no Ocidente."
            },
            ae: {
                name: "C# Amara 9",
                description: "عضو في «ثالوث العافية» (Pygmy, Aegean, Amara) ويُعرَف أيضًا باسم Celtic Minor. أصبحت C# Amara 9 مشهورة بفضل عروض Malte Marten، وتشغل اليوم مكانة خاصة في مجتمعات اليوغا، والتأمل، والعلاج بالصوت حول العالم. كما تُعتبَر النسخة المدخلية المحبوبة لسُلَّم E Amara 18، وبفضل رنينها الروحاني والغامض تحظى بمحبة كبيرة لدى كل من يبحث عن السلام الداخلي في الشرق والغرب على حد سواء."
            },
            it: {
                name: "C# Amara 9",
                description: "Fa parte del \"triangolo del benessere\" (Pygmy, Aegean, Amara) ed è conosciuta anche come Celtic Minor. È diventata famosa grazie alle interpretazioni di Malte Marten e oggi occupa una posizione speciale nelle comunità di yoga, meditazione e healing in tutto il mondo. È anche la versione introduttiva molto amata della scala E Amara 18. Grazie alla sua risonanza misteriosa e spirituale, è profondamente apprezzata da chi cerca pace interiore, sia in Oriente che in Occidente."
            }
        }
    },

    // 30. E Amara 18 (Mutant)
    {
        id: "e_amara_18_mutant",
        name: "E Amara 18",
        notes: {
            ding: "E3",
            top: ["B3", "C4", "E4", "F#4", "G4", "A4", "B4", "C5", "E5", "F#5", "G5", "A5"],
            bottom: ["C3", "D3", "G3", "A3", "D5"]
        },
        vector: { minorMajor: -0.5, pureSpicy: 0.5, rarePopular: 0.95 },
        tags: ["Mutant", "Amara", "Extended", "Professional"],
        description: "켈틱 마이너(Amara)의 확장형 뮤턴트 모델로, 18개의 노트를 통해 광활한 우주와 같은 음역대를 구현합니다. 풍부한 저음과 섬세한 고음이 어우러져 전문적인 연주와 작곡에 무한한 가능성을 열어줍니다. 단순한 악기를 넘어 독창적인 예술 세계를 표현할 수 있는 마스터피스입니다.",
        videoUrl: "https://youtu.be/o42OZ6uhqDU?si=2QnyvwhFr0ETWlSc",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12070371584",
        ownUrl: "https://handpan.co.kr/shop/?idx=105",
        ownUrlEn: "https://handpanen.imweb.me/21/?idx=105",
        nameEn: "E Amara 18",
        tagsEn: ["Mutant", "Amara", "Extended", "Professional"],
        descriptionEn: "An extended mutant model of the E Amara (Celtic Minor) scale, covering a vast range with a total of 18 notes. Featuring versatile expressiveness from rich lows to delicate highs, it is a professional-grade instrument that unlocks infinite possibilities for composition and performance.",
        i18n: {
            fr: {
                name: "E Amara 18",
                description: "Un modèle mutant étendu de la gamme E Amara (Celtic Minor), couvrant une vaste gamme avec un total de 18 notes. Doté d'une expressivité polyvalente allant des graves riches aux aigus délicats, c'est un instrument de qualité professionnelle qui ouvre des possibilités infinies pour la composition et l'interprétation."
            },
            ja: {
                name: "E Amara 18",
                description: "E Amara（Celtic Minor）スケールの拡張ミュータントモデルで、合計18音で広大な音域をカバーします。豊かな低音から繊細な高音まで多彩な表現力を持ち、作曲や演奏に無限の可能性を切り開くプロ仕様の楽器です。"
            },
            zh: {
                name: "E Amara 18",
                description: "E Amara（Celtic Minor）音阶的扩展变异型号，共有18个音符，覆盖了广阔的音域。拥有从丰富低音到细腻高音的多样表现力，是开启无限创作与演奏可能的专业级乐器。"
            },
            de: {
                name: "E Amara 18",
                description: "Ein erweitertes Mutant-Modell der E-Amara-Skala (Celtic Minor), das mit insgesamt 18 Tönen einen riesigen Bereich abdeckt. Mit vielseitiger Ausdruckskraft von satten Bässen bis zu zarten Höhen ist es ein Instrument in Profiqualität, das unendliche Möglichkeiten für Komposition und Spiel eröffnet."
            },
            es: {
                name: "E Amara 18",
                description: "Un modelo mutante extendido de la escala E Amara (Celtic Minor), que cubre un vasto rango con un total de 18 notas. Con una expresividad versátil desde graves ricos hasta agudos delicados, es un instrumento de grado profesional que desbloquea infinitas posibilidades para la composición y la interpretación."
            },
            ru: {
                name: "E Amara 18",
                description: "Расширенная мутировавшая модель гаммы E Amara (Celtic Minor), покрывающая огромный диапазон из 18 нот. Обладая универсальной выразительностью от богатых низов до деликатных верхов, это инструмент профессионального уровня, открывающий бесконечные возможности для композиции и исполнения."
            },
            fa: {
                name: "E Amara 18",
                description: "یک مدل جهش‌یافتهٔ گسترش‌یافته از گام E Amara (Celtic Minor) که با مجموع ۱۸ نت دامنه‌ای وسیع را پوشش می‌دهد. با بیانگریِ تطبیق‌پذیر از بم‌های غنی تا زیرهای ظریف، سازی در سطح حرفه‌ای است که امکانات بی‌پایانی برای آهنگسازی و اجرا می‌گشاید."
            },
            pt: {
                name: "E Amara 18",
                description: "Um modelo mutante estendido da escala E Amara (Celtic Minor), cobrindo uma vasta gama com um total de 18 notas. Apresentando expressividade versátil de graves ricos a agudos delicados, é um instrumento de nível profissional que desbloqueia infinitas possibilidades para composição e performance."
            },
            ae: {
                name: "E Amara 18",
                description: "نموذج متحول موسع لسُلَّم E Amara (Celtic Minor)، يغطي نطاقًا واسعًا بإجمالي 18 نغمة. يتميز بتعبيرية متعددة الاستخدامات من النغمات المنخفضة الغنية إلى النغمات العالية الدقيقة، وهو آلة بمستوى احترافي تفتح احتمالات لا حصر لها للتأليف والأداء."
            },
            it: {
                name: "E Amara 18",
                description: "Un modello mutante esteso della scala E Amara (Celtic Minor), che copre una vasta gamma con un totale di 18 note. Caratterizzato da un'espressività versatile dai bassi ricchi agli alti delicati, è uno strumento di livello professionale che sblocca infinite possibilità per la composizione e l'esecuzione."
            }
        }
    },

    // 31. F# Low Pygmy 12 (Restored)
    {
        id: "fs_low_pygmy_12",
        name: "F# Low Pygmy 12",
        notes: {
            ding: "F#3",
            top: ["G#3", "A3", "C#4", "E4", "F#4", "G#4", "A4", "C#5", "E5"],
            bottom: ["D3", "E3"]
        },
        vector: { minorMajor: -0.6, pureSpicy: 0.1, rarePopular: 0.95 },
        tags: ["Pygmy", "Low Bass", "Healing"],
        description: "몽환적인 F# Pygmy 스케일에 저음(D3, E3)을 더해, 더욱 깊고 입체적인 공간감을 형성했습니다. 5음계(Pentatonic) 기반의 부드러움에 베이스의 웅장함이 더해져 명상과 치유를 위한 완벽한 사운드를 제공합니다. 마음을 차분하게 가라앉히는 신비로움이 특징인 모델입니다.",
        videoUrl: "https://youtu.be/pRuQQDSMUY0?si=9TJIit8W9P9VZnqi",
        productUrl: "https://smartstore.naver.com/sndhandpan/products/12705260873",
        ownUrl: "https://handpan.co.kr/shop/?idx=104",
        ownUrlEn: "https://handpanen.imweb.me/21/?idx=104",
        nameEn: "F# Low Pygmy 12",
        tagsEn: ["Pygmy", "Deep Bass", "Dreamy", "Healing", "12 Notes"],
        descriptionEn: "A 12-note model for beginners and intermediates, derived from Central African tribal melodies. It perfectly compensates for the lack of bass in existing Pygmy 9 and 10 models by adding two bottom notes. The unique dreamy resonance of the pentatonic scale (omitting the 2nd and 6th) combined with deep bass allows players to fully realize the 'trendy wellness vibes' seen on YouTube even on a standard instrument.",
        i18n: {
            fr: {
                name: "F# Low Pygmy 12",
                description: "Un modèle 12 notes pour débutants et intermédiaires, dérivé des mélodies tribales d'Afrique centrale. Il compense parfaitement le manque de basses des modèles Pygmy 9 et 10 existants en ajoutant deux notes graves. La résonance onirique unique de l'échelle pentatonique combinée aux basses profondes permet de réaliser pleinement les 'vibes bien-être tendance'."
            },
            ja: {
                name: "F# Low Pygmy 12",
                description: "中央アフリカの部族の旋律に由来する、初心者から中級者向けの12音モデルです。既存の Pygmy 9 や 10 モデルの低音不足を2つのボトムノートを追加することで完璧に補います。ペンタトニックスケールの独特な夢幻的な響きと深い低音が組み合わさり、YouTubeで見られる「トレンディなウェルネスの雰囲気」を標準的な楽器でも完全に再現できます。"
            },
            zh: {
                name: "F# Low Pygmy 12",
                description: "源自中非部落旋律，适合初学者和中级者的 12 音符型号。通过增加两个底部音符，完美弥补了现有 Pygmy 9 和 10 型号低音的不足。五声音阶独特的梦幻共鸣与深沉低音相结合，即使在标准乐器上也能充分实现 YouTube 上常见的“时尚身心疗愈氛围”。"
            },
            de: {
                name: "F# Low Pygmy 12",
                description: "Ein 12-Noten-Modell für Anfänger und Fortgeschrittene, abgeleitet von zentralafrikanischen Stammesmelodien. Es gleicht den Bassmangel bestehender Pygmy 9 und 10 Modelle durch Hinzufügen von zwei tiefen Tönen perfekt aus. Die einzigartige traumhafte Resonanz der pentatonischen Skala kombiniert mit tiefem Bass ermöglicht es Spielern, die 'trendigen Wellness-Vibes' von YouTube auch auf einem Standardinstrument voll zu realisieren."
            },
            es: {
                name: "F# Low Pygmy 12",
                description: "Un modelo de 12 notas para principiantes e intermedios, derivado de melodías tribales de África Central. Compensa perfectamente la falta de bajos en los modelos Pygmy 9 y 10 existentes añadiendo dos notas graves. La resonancia onírica única de la escala pentatónica combinada con bajos profundos permite a los intérpretes realizar plenamente las 'vibraciones de bienestar de moda' vistas en YouTube incluso en un instrumento estándar."
            },
            ru: {
                name: "F# Low Pygmy 12",
                description: "Модель с 12 нотами для начинающих и продолжающих, происходящая от мелодий племен Центральной Африки. Она идеально компенсирует нехватку басов в существующих моделях Pygmy 9 и 10, добавляя две нижние ноты. Уникальный мечтательный резонанс пентатонической гаммы в сочетании с глубоким басом позволяет музыкантам полностью реализовать «трендовые велнес-вибрации», которые можно увидеть на YouTube, даже на стандартном инструменте."
            },
            fa: {
                name: "F# Low Pygmy 12",
                description: "یک مدل ۱۲ نتی برای مبتدیان و متوسط‌ها، برگرفته از ملودی‌های قبیله‌ای آفریقای مرکزی. با افزودن دو نت بم، کمبود بیس در مدل‌های موجود Pygmy 9 و ۱۰ را کاملاً جبران می‌کند. رزونانس رؤیایی منحصربه‌فرد گام پنتاتونیک همراه با بیس عمیق به نوازندگان اجازه می‌دهد تا 'حال و هوای سلامتیِ مُد روز' که در یوتیوب دیده می‌شود را حتی روی یک ساز استاندارد کاملاً محقق کنند."
            },
            pt: {
                name: "F# Low Pygmy 12",
                description: "Um modelo de 12 notas para iniciantes e intermediários, derivado de melodias tribais da África Central. Compensa perfeitamente a falta de graves nos modelos Pygmy 9 e 10 existentes adicionando duas notas inferiores. A ressonância onírica única da escala pentatônica combinada com graves profundos permite que os músicos realizem plenamente as 'vibes de bem-estar da moda' vistas no YouTube mesmo em um instrumento padrão."
            },
            ae: {
                name: "F# Low Pygmy 12",
                description: "نموذج بـ 12 نغمة للمبتدئين والمتوسطين، مشتق من ألحان القبائل في وسط أفريقيا. يعوض تمامًا نقص البيس في نماذج Pygmy 9 و 10 الحالية بإضافة نغمتين سفليتين. الرنين الحالم الفريد للسُلَّم الخماسي مع البيس العميق يسمح للعازفين بتحقيق «مشاعر العافية الرائجة» التي تظهر على يوتيوب بالكامل حتى على آلة قياسية."
            },
            it: {
                name: "F# Low Pygmy 12",
                description: "Un modello a 12 note per principianti e intermedi, derivato dalle melodie tribali dell'Africa centrale. Compensa perfettamente la mancanza di bassi nei modelli Pygmy 9 e 10 esistenti aggiungendo due note basse. La risonanza onirica unica della scala pentatonica combinata con bassi profondi consente ai musicisti di realizzare appieno le 'vibrazioni wellness di tendenza' viste su YouTube anche su uno strumento standard."
            }
        }
    }
];
