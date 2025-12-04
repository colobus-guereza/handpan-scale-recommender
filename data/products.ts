export interface Product {
    id: string;
    name: string;
    nameEn?: string;
    category: string; // 'Hard Case', 'Stand', 'Accessory', etc.
    price?: number;
    manufacturer?: string;
    options?: string[];
    description?: string;
    naverUrl?: string;
    ownUrl?: string;
}

export const PRODUCTS: Product[] = [
    // 1. Evatek Hardcase
    {
        id: "evatek_hardcase",
        name: "HTC Evatek 하드케이스",
        nameEn: "HTC Evatek Hardcase",
        category: "Case",
        price: 484000,
        manufacturer: "Hardcase Technologies",
        options: ["M", "Black"],
        naverUrl: "https://smartstore.naver.com/sndhandpan/products/9455037225",
        ownUrl: "https://handpan.co.kr/shop_view/?idx=99"
    },

    // 2. Avaja Premium Softcase
    {
        id: "avaja_softcase",
        name: "Avaja 고급 소프트케이스",
        nameEn: "Avaja Premium Softcase",
        category: "Case",
        price: 484000,
        manufacturer: "Avaja case",
        options: ["Titan Mid", "Black & Light Grey"],
        description: "Made in Iran",
        naverUrl: "https://smartstore.naver.com/sndhandpan/products/12070010394",
        ownUrl: "https://handpan.co.kr/shop_view/?idx=98"
    },

    // 3. Wood Handpan Stand S
    {
        id: "wood_stand_s",
        name: "원목 핸드팬스탠드 S",
        nameEn: "Wood Handpan Stand S",
        category: "Stand",
        naverUrl: "https://smartstore.naver.com/sndhandpan/products/7352234142",
        ownUrl: "https://handpan.co.kr/shop_view/?idx=100"
    },

    // 4. Wood Handpan Stand M
    {
        id: "wood_stand_m",
        name: "원목 핸드팬스탠드 M",
        nameEn: "Wood Handpan Stand M",
        category: "Stand",
        naverUrl: "https://smartstore.naver.com/sndhandpan/products/7371144021",
        ownUrl: "https://handpan.co.kr/shop_view/?idx=101"
    }
];
