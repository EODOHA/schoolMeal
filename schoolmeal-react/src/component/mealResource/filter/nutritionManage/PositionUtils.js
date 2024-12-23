export const positionTypeEnglish = (position) => {
    const positionMap = {
        '영양사': 'dietitian',
        '영양교사': 'teacher'
    };
    return positionMap[position] || position;
};
