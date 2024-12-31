import React, { useEffect, useState } from "react";
import axios from "axios";
import { SERVER_URL } from "../../Constants";
import { useAuth } from "../sign/AuthContext";
import { CircularProgress } from "@mui/material";
import '../../css/stats/Stats.css';

// 통계 시각화를 위한 라이브러리 임포트
import { Pie, Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';

// Chart.js 설정(차트에 대해 필요한 모듈 등록)
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function MemberStats() {
    const [members, setMembers] = useState([]);
    const [groupData, setGroupData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState('pie'); // 'pie' 또는 'bar'로 차트 타입을 저장
    const { token } = useAuth();

    useEffect(() => {
        // 멤버 리스트 불러오기
        const fetchMembers = async () => {
            try {
                const response = await axios.get(`${SERVER_URL}members`, {
                    headers: {
                        "Authorization": token,
                    }
                });
                const data = response.data._embedded.members;

                // ADMIN은 통계에서 제외
                const membersData = data.filter((member) => member.role !== "ADMIN");
                // console.log(membersData);

                // 데이터 그룹화(권한별 사용자 수)
                const group = membersData.reduce((acc, member) => {
                    const role = member.role;
                    // console.log(role);
                    acc[role] = acc[role] ? acc[role] + 1 : 1;
                    return acc;
                }, {});

                setMembers(membersData);
                setGroupData(group);
                setLoading(false);
            } catch (error) {
                console.error("API 호출 오류: ", error);
                setLoading(false);
            }
        };

        fetchMembers();
    }, [token]);

    // 파이차트와 막대그래프에서 사용할 데이터 구조
    const chartData = {
        labels: Object.keys(groupData), // 회원 등급
        datasets: [
            {
                label: '가입자 수', // 레이블 추가
                data: Object.values(groupData), // 회원 수
                backgroundColor: ['#007bff', '#ff7f0e', '#2ca02c', '#d62728'],
            }
        ]
    };

    // 파이차트와 막대그래프 옵션
    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // 비율 유지 여부
        plugins: {
            legend: {
                position: 'top',
            },
            tooltip: {
                callbacks: {
                    label: function (tooltipItem) {
                        return `${tooltipItem.label}: ${tooltipItem.raw}명`; // 툴팁 내용 수정
                    }
                }
            }
        },
    };

    // const chartData = {
    //     labels: Object.keys(groupData),   // 라벨 : 회원 권한
    //     datasets: [
    //         {
    //             data: Object.values(groupData),
    //             backgroundColor: [
    //                 '#007bff',
    //                 '#ff7f0e',
    //                 '#2ca02c',
    //                 '#d62728'
    //             ],
    //         }
    //     ]
    // };

    if (loading)
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center', // 수평 가운데 정렬
                alignItems: 'center', // 수직 가운데 정렬
                height: '30vh' // 전체 화면 높이
            }}>
                <CircularProgress />
                <br />
                <p> 데이터를 불러오는 중입니다....⏰</p>
            </div>
        );

    return (
        <div className="stats-member-container">
            <h1 className="stats-member-title">가입자 수 통계</h1>

            {/* 통계 표 */}
            <div className="stats-container">
                <table className="stats-member-table">
                    <thead className="stats-member-thead">
                        <tr>
                            <th>회원등급</th>
                            <th>가입자 수</th>
                            <th>비고</th>
                        </tr>
                    </thead>
                    <tbody className="stats-member-tbody">
                        {Object.entries(groupData).map(([role, count]) => (
                            <tr key={role}>
                                <td>{role}</td>
                                <td>{count}</td>
                                <td>
                                    {role === "BOARDADMIN" && "게시판 담당관리자"}
                                    {role === "LINKAGE" && "기관 연계회원"}
                                    {role === "MEMBER" && "일반회원"}
                                    {role === "GUEST" && "강등회원"}
                                </td>
                            </tr>
                        ))}
                        {/* 멤버 수 총계 */}
                        <tr>
                            <td><strong>총 계</strong></td>
                            <td colSpan={2} style={{ textAlign: "center" }}><strong>{members.length}</strong></td>
                        </tr>
                        <tr>
                            <td colSpan={3} style={{ textAlign: "center" }}>
                                {/* 차트 전환을 위한 라디오 버튼 */}
                                <div className="chart-toggle">
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
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                {/* 차트 렌더링 */}
                <div className="stats-chart-container">
                    {chartType === 'pie' ? (
                        <Pie data={chartData} options={chartOptions} />
                    ) : (
                        <Bar data={chartData} options={chartOptions} />
                    )}
                </div>
            </div>
        </div>
    );
}
export default MemberStats;