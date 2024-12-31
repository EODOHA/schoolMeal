import React, { useEffect, useState } from "react";
import '../../css/stats/Stats.css';

// 차트 라이브러리 임포트
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Chart.js 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const PageStatsBoard = () => {
    const [clickStats, setClickStats] = useState({});
    const [labels, setLabels] = useState([]);
    const [dataValues, setDataValues] = useState([]);
    const [chartType, setChartType] = useState("pie"); // 차트 타입을 파이 차트와 막대 차트로 전환

    useEffect(() => {
        // 로컬스토리지에서 클릭 데이터 가져오기
        const storedData = JSON.parse(localStorage.getItem("clickCounts")) || {};
        setClickStats(storedData);

        // 그래프 데이터 세팅
        const pages = Object.keys(storedData);
        const values = Object.values(storedData);

        setLabels(pages);
        setDataValues(values);
    }, []);

    // 통계 데이터 초기화
    const resetClickStats = () => {
        const isConfirmed = window.confirm("[경고] 초기화된 데이터는 복구할 수 없습니다! \n정말로 초기화를 진행하시겠습니까?");

        if (isConfirmed) {
            localStorage.removeItem("clickCounts");
            // console.log(localStorage.getItem("clickCounts"));
            setClickStats({});
            setLabels([]);
            setDataValues([]);
            alert("방문 데이터가 초기화 되었습니다.")
        } else {
            alert("초기화를 취소했습니다.");
        }
    };

    // 상위 N개의 항목만 표시하고 나머지는 "기타"항목으로 합침
    const getTopNData = (n) => {
        const sortedData = [...dataValues]
            .map((value, index) => ({
                label: labels[index],
                value,
            }))
            .sort((a, b) => b.value - a.value); // 내림차순 정렬

        const topData = sortedData.slice(0, n); // 상위 n개
        const otherData = sortedData.slice(n); // 기타 항목

        const otherSum = otherData.reduce((acc, item) => acc + item.value, 0); // 기타 항목 합

        // 상위 n개 + 기타 항목을 최종 데이터로 취합
        const finalData = otherData.length > 0 ? topData.concat([{ label: "기타", value: otherSum }]) : topData;
        // 최종 데이터가 5개 이하라면 기타항목 제외
        return finalData.length > 5 ? finalData : topData;
    };

    const topN = 5; // 상위 항목 표시할 개수

    const topNData = getTopNData(topN);
    // console.log(topNData);
    const topLabels = topNData.map(item => item.label);
    const topValues = topNData.map(item => item.value);

    // 막대 차트 데이터
    const barData = {
        labels: topLabels,
        datasets: [
            {
                label: "선호 페이지",
                data: topValues,
                backgroundColor: "rgba(54, 162, 235, 0.6)",
                borderColor: "rgba(54, 162, 235, 1)",
                borderWidth: 1,
            },
        ],
    };

    // 파이 차트 데이터
    const pieData = {
        labels: topLabels,
        datasets: [
            {
                data: topValues,
                backgroundColor: [
                    "rgba(255, 99, 132, 0.6)",
                    "rgba(54, 162, 235, 0.6)",
                    "rgba(255, 206, 86, 0.6)",
                    "rgba(75, 192, 192, 0.6)",
                    "rgba(153, 102, 255, 0.6)",
                    "rgba(255, 159, 64, 0.6)",
                ],
                borderColor: [
                    "rgba(255, 99, 132, 1)",
                    "rgba(54, 162, 235, 1)",
                    "rgba(255, 206, 86, 1)",
                    "rgba(75, 192, 192, 1)",
                    "rgba(153, 102, 255, 1)",
                    "rgba(255, 159, 64, 1)",
                ],
                borderWidth: 1,
            },
        ],
    };
    // 차트 옵션(퍼센트 범례)
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                position: "top",
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem) => {
                        const value = tooltipItem.raw;
                        const total = tooltipItem.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                        const percent = ((value / total) * 100).toFixed(0);
                        return `${tooltipItem.label}: ${percent}%`; // 툴팁에 퍼센트 표시,
                    },
                },
            },
        },
    };

    // 표 데이터 준비 (상위 5개와 기타를 표시)
    const totalPages = [
        ...topLabels.map((label, index) => ({ label, count: topValues[index] })),
    ];
    // console.log(totalPages);

    return (
        <div className="stats-member-container">
            <h1 className="stats-member-title">게시판별 방문 통계</h1>
            <div className="stats-text">
                본 통계자료는 홈페이지를 이용하는 모든 사용자의 게시판 방문 횟수를 기반으로 합니다.<br />
                사용자의 회원 권한별로 구분되지 않기 때문에 <br />
                특정 사용자 그룹에 대한 이용 추이를 분석하는 데에는 한계가 있습니다.<br />
                이에 해당 자료는 참고용으로만 이용하여 주시기 바랍니다.
            </div>
            {/* 통계 표 */}
            <div className="stats-page-container">
                <div className="stats-container">
                    <table className="stats-member-table">
                        <thead className="stats-member-thead">
                            <tr>
                                <th>게시판</th>
                                <th>방문 수</th>
                            </tr>
                        </thead>
                        <tbody className="stats-member-tbody">
                            {totalPages.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.label}</td>
                                    <td>{data.count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div>
                        <button className="stats-clear-button" onClick={resetClickStats}>
                            통계 초기화
                        </button>
                    </div>
                </div>
                {/* 차트 전환을 위한 라디오 버튼 */}
                <div className="page-stats-chart-container">
                    <label>
                        <input
                            type="radio"
                            name="chartType"
                            value="pie"
                            checked={chartType === 'pie'}
                            onChange={() => setChartType('pie')}
                        />
                        파이차트
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="chartType"
                            value="bar"
                            checked={chartType === 'bar'}
                            onChange={() => setChartType('bar')}
                        />
                        막대차트
                    </label>
                    {/* 차트 렌더링 */}
                    {chartType === 'pie' ? (
                        <Pie data={pieData} options={chartOptions} />
                    ) : (
                        <Bar data={barData} options={chartOptions} />
                    )}
                </div>
            </div>
        </div>
    );
};
export default PageStatsBoard;
