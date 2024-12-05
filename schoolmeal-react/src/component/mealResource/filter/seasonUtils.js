export const seasonTypeEnglish = (season) => {
    const seasonMap = {
        '봄': 'spring',
        '여름': 'summer',
        '가을': 'autumn',
        '겨울': 'winter',
        '기타(사계절)': 'four_seasons'
    };
    return seasonMap[season] || season;
};
