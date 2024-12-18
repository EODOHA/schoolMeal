export const eduOfficeTypeEnglish = (eduOffice) => {
    const eduOfficeMap = {
        '서울특별시': 'seoul',
        '부산광역시': 'busan',
        '대구광역시': 'daegu',
        '인천광역시': 'incheon',
        '광주광역시': 'gwangju',
        '대전광역시': 'daejeon',
        '울산광역시': 'ulsan',
        '세종특별자치시': 'sejong',
        '경기도': 'gyeonggi',
        '강원특별자치도': 'gangwon',
        '충청북도': 'chungbuk',
        '충청남도': 'chungnam',
        '전북특별자치도': 'jeonbuk',
        '전라남도': 'jeollanam',
        '경상북도': 'gyeongbuk',
        '경상남도': 'gyeongnam',
        '제주특별자치도': 'jeju',
    };
    return eduOfficeMap[eduOffice] || eduOffice;
};
