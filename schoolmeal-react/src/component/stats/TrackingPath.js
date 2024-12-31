// 방문페이지 트래킹을 위한 기본 경로
export const TrackingPath = {
    // 급식정보
    "/mealInfo": [
        { name: "학교별 급식 식단 정보", paths: ["/mealInfo/meal-menu",] },
        {
            name: "학교급식 과거와 현재",
            paths: ["/mealInfo/meal-archive", "/mealInfo/meal-archive/:id",]
        },
        {
            name: "학교급식 전문가 인력관리",
            paths: ["/mealInfo/meal-expert", "/mealInfo/meal-expert/:exp_id",]
        },
    ],
    // 식재료 정보
    "/ingredientInfo": [
        {
            name: "식재료 가격 정보",
            paths: ["/ingredientInfo/ingredient-price",
                "/ingredientInfo/ingredient-price/write",
                "/ingredientInfo/ingredient-price/edit/:priceId",
            ]
        },
        {
            name: "식품 안전성 조사결과 정보",
            paths: [
                "/ingredientInfo/product-safety",
                "/ingredientInfo/product-safety/write",
                "/ingredientInfo/product-safety/edit/:safetyId",
            ]
        },
        {
            name: "식재료 안전성 인증 정보",
            paths: [
                "/ingredientInfo/haccp-info",
                "/ingredientInfo/haccp-info/write",
                "/ingredientInfo/haccp-info/edit/:haccpId",
            ]
        },
    ],
    // 급식자료실
    "/mealResource": [
        {
            name: "급식 정책 및 운영",
            paths: [
                "/mealResource/meal-policy-operation",
                "/mealResource/meal-policy-operation/write",
                "/mealResource/meal-policy-operation/:id",
                "/mealResource/meal-policy-operation/update/:id",

            ]
        },
        {
            name: "식단 및 레시피",
            paths: [
                "/mealResource/menu-recipe",
                "/mealResource/menu-recipe/write",
                "/mealResource/menu-recipe/:id",
                "/mealResource/menu-recipe/update/:id",

            ]
        },
        {
            name: "영양 관리",
            paths: [
                "/mealResource/nutrition-manage",
                "/mealResource/nutrition-manage/write",
                "/mealResource/nutrition-manage/:id",
                "/mealResource/nutrition-manage/update/:id",
            ]
        },
        {
            name: "급식 위생",
            paths: [
                "/mealResource/meal-hygiene",
                "/mealResource/meal-hygiene/write",
                "/mealResource/meal-hygiene/:id",
                "/mealResource/meal-hygiene/update/:id",
            ]
        },
        {
            name: "급식 시설 및 설비",
            paths: [
                "/mealResource/meal-facility-equipment",
                "/mealResource/meal-facility-equipment/:id",
                "/mealResource/meal-facility-equipment/write",
                "/mealResource/meal-facility-equipment/update/:id",
            ]
        },
        {
            name: "학교급식 우수사례",
            paths: [
                "/mealResource/school-meal-case",
                "/mealResource/school-meal-case/:id",
                "/mealResource/school-meal-case/write",
                "/mealResource/school-meal-case/update/:id",
            ]
        },
    ],

    // 교육자료
    "/eduData": [
        {
            name: "영양 및 식생활 교육자료",
            paths: [
                "/eduData/nutrition-diet-education",
                "/eduData/nutrition-diet-education/write",
                "/eduData/nutrition-diet-education/:id",
                "/eduData/nutrition-diet-education/update/:id",
            ]
        },
        {
            name: "영상 교육자료",
            paths: [
                "/eduData/video-education",
                "/eduData/video-education/write",
                "/eduData/video-education/:id",
                "/eduData/video-education/udpate/:id",
            ]
        },
        {
            name: "수업/시연 영상",
            paths: [
                "/eduData/lesson-demo-video",
                "/eduData/lesson-demo-video/write",
                "/eduData/lesson-demo-video/:id",
                "/eduData/lesson-demo-video/udpate/:id",
            ]
        },
        {
            name: "교육자료 나눔",
            paths: [
                "/eduData/edu-material-sharing",
                "/eduData/edu-material-sharing/write",
                "/eduData/edu-material-sharing/:id",
                "/eduData/edu-material-sharing/udpate/:id",
            ]
        },
    ],

    // 영양상담
    "/mealCounsel": [
        {
            name: "매뉴얼 및 상담 관련 자료",
            paths: [
                "/mealCounsel/meal-counsel",
                "/mealCounsel/meal-counsel/write",
                "/mealCounsel/meal-counsel/:id",
            ]
        },
        {
            name: "식생활 습관 진단 프로그램",
            paths: [
                "/mealCounsel/foodLife",
            ]
        },
    ],

    // 커뮤니티
    "/community": [
        {
            name: "공지사항",
            paths: [
                "/community/notices",
                "/community/notices/write",
                "/community/notices/:id",
            ]
        },
        {
            name: "가공식품",
            paths: [
                "/community/processedFood",
                "/community/processedFood/write",
                "/community/processedFood/edit/:processedFoodId",
                "/community/processedFood/write-file-upload"
            ]
        },
        {
            name: "지역별 커뮤니티",
            paths: [
                "/community/regions",
                "/community/regions/create",
                "/community/regions/:id",
                "/community/regions/edit/:id"
            ]
        },
        {
            name: "급식뉴스",
            paths: ["/community/crawling/school-news"]
        },
        {
            name: "학술정보",
            paths: ["/ccommunity/crawling/materials"]
        },
    ]
};