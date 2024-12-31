import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { TrackingPath } from "./TrackingPath"; // 경로 관리 파일

const PageTracker = ({ onTrack }) => {
    const location = useLocation();

    useEffect(() => {
        //    console.log("현재 경로: ", location.pathname);
        const normalizedPath = normalizePath(location.pathname);
        if (normalizedPath) {
            onTrack(normalizedPath);  // 매칭된 경로 이름을 트래킹
        }
        // 클릭 수를 증가
        incrementClickCount(normalizedPath); //매칭된 이름만 저장
    }, [location, onTrack]);

    // 경로 그룹화(CRUD 세부URL도 포함시킴)
    const normalizePath = (path) => {

        // TrackingPath에 정의된 경로로 변환
        for (const parentPath in TrackingPath) {

            // 부모 경로와 경로가 일치하는지 체크
            if (path.startsWith(parentPath)) {

                // 부모 경로 다음에 오는 첫 번째 자식 경로를 추출
                const relativePath = path.replace(parentPath, "").split("/")[1];
                // console.log("매칭된 자식경로: ", relativePath);

                if (relativePath) {
                    // TrackingPath에서 해당 경로의 이름을 찾아서 반환
                    const matchedPath = TrackingPath[parentPath].find(item => item.paths && item.paths.some(p => p.includes(relativePath)));
                    // console.log("매칭된 경로 ", matchedPath);

                    if (matchedPath) {
                        return matchedPath.name;  // 자식 경로 게시판 이름 반환
                    }
                }
            }
        }
        return;
    };

    // 경로별 클릭 수 증가 함수
    const incrementClickCount = (path) => {
        const storedData = JSON.parse(localStorage.getItem("clickCounts")) || {};

        // 매칭된 경로 이름만 저장후 클릭 수 증가
        if (path) {
            storedData[path] = (storedData[path] || 0) + 1;
        }

        // 업데이트된 클릭 데이터 로컬스토리지에 저장
        localStorage.setItem("clickCounts", JSON.stringify(storedData));
    };
    return null;
};

export default PageTracker;
