import React, { useState } from "react";
import axios from "axios";
import * as tf from "@tensorflow/tfjs";
import { Bar } from "react-chartjs-2";
import { SERVER_URL } from "../../Constants";
import { Button, CircularProgress, Typography } from "@mui/material";
// import "../../css/SchoolMealNewsAnalyzer.css";

// Chart.js 관련 모듈 임포트
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Chart.js의 스케일, 요소, 툴팁 등 등록
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SchoolMealNewsAnalyzer = () => {
    const [news, setNews] = useState([]);
    const [sentimentData, setSentimentData] = useState([]);
    const [accuracy, setAccuracy] = useState(null);  // 정확도 상태 추가
    const [loading, setLoading] = useState(false); // 로딩 상태 초기화
    const [error, setError] = useState(null); // 오류 상태
    const [retryMessage, setRetryMessage] = useState("");  // 정확도 미달 시 메시지 상태 추가

    // 뉴스 데이터를 가져오고 분석을 실행하는 함수
    const fetchAndAnalyzeNews = async () => {
        setLoading(true); // 로딩 시작
        setError(null); // 오류 초기화
        setRetryMessage(""); // 재시도 메시지 초기화
        try {
            const response = await axios.get(`${SERVER_URL}crawling/school-news`);
            const newItems = response.data.items || [];
            setNews(newItems);

            // AI 분석 실행
            const analysisResults = await analyzeAndTrainModel(newItems);
            setSentimentData(analysisResults.sentiment);
            setAccuracy(analysisResults.accuracy);  // 정확도 상태 업데이트
            setRetryMessage(analysisResults.accuracy < 80 ? `정확도: ${analysisResults.accuracy.toFixed(3)}%.\n80% 이상이 될 때까지 분석을 시도해 주세요.` : "감정 분석이 완료되었습니다.");
        } catch (error) {
            console.error("뉴스 데이터 가져오기 실패:", error);
            setError("뉴스 데이터를 가져오는데 실패했습니다.");
        } finally {
            setLoading(false); // 로딩 종료
        }
    };

    // 모델을 한번 훈련하고 그 모델을 계속해서 사용하는 방식으로 개선
    let trainedModel = null;

    // 뉴스 데이터를 바탕으로 모델을 학습하고 예측을 실행하는 함수.
    const analyzeAndTrainModel = async (newsItems) => {
        let accuracy = 0;
        let sentiment = [0, 0];

        // 훈련 반복 횟수를 설정하여 빠르게 테스트
        for (let epoch = 0; epoch < 50 && accuracy < 80; epoch++) {
            if (!trainedModel) {
                // 모델이 없다면 훈련 후 저장
                trainedModel = await trainModel(newsItems);
            }

            // 예측 실행
            const predictionResults = await predictSentiment(newsItems, trainedModel);
            const positiveCount = predictionResults.filter(val => val > 0.5).length;
            const negativeCount = predictionResults.length - positiveCount;

            // 정확도 계산
            accuracy = calculateAccuracy(newsItems, predictionResults);

            sentiment = [positiveCount, negativeCount]; // 긍정, 부정 데이터

            // 정확도가 80% 미만일 경우 훈련을 더 반복
            if (accuracy < 80) {
                setRetryMessage(`정확도: ${accuracy.toFixed(3)}%.\n80% 이상이 될 때까지 분석을 시도해 주세요.`);
            }
        }

        return { sentiment, accuracy };
    };

    const trainModel = async (newsItems) => {
        const inputs = newsItems.map(item => encodeText(item.title));
        const labels = newsItems.map(item => {
            // 부정적인 단어가 포함된 경우 "부정"으로 라벨링
            if (
                item.title.includes("나쁜") ||
                item.title.includes("실망") ||
                item.title.includes("불만") ||
                item.title.includes("부정") ||
                item.title.includes("부패") ||
                item.title.includes("사망") ||
                item.title.includes("불행") ||
                item.title.includes("실패") ||
                item.title.includes("사고")
            ) {
                return 0; // 부정
            }
            // 부정적인 단어가 포함되지 않으면 "긍정"으로 라벨링
            else {
                return 1; // 긍정
            }
        });

        const xs = tf.tensor2d(inputs, [inputs.length, inputs[0].length]);
        const ys = tf.tensor2d(labels, [labels.length, 1]);

        const model = tf.sequential();
        model.add(tf.layers.dense({ units: 50, activation: "relu", inputShape: [inputs[0].length] }));
        model.add(tf.layers.dense({ units: 1, activation: "sigmoid" }));

        model.compile({ optimizer: "adam", loss: "binaryCrossentropy", metrics: ["accuracy"] });

        // 모델 훈련 및 정확도 추적
        const history = await model.fit(xs, ys, { epochs: 5 });

        return model;
    };

    // 뉴스 제목을 숫자 배열로 변환하는 함수
    const encodeText = (text) => {
        const maxLength = 100;
        const encoded = Array.from(text)
            .map((char) => char.charCodeAt(0))
            .slice(0, maxLength);
        while (encoded.length < maxLength) {
            encoded.push(0); // 패딩
        }
        return encoded;
    };

    // 예측 실행하는 함수
    const predictSentiment = async (newsItems, model) => {
        const encodedTexts = newsItems.map(item => encodeText(item.title));
        const tensor = tf.tensor2d(encodedTexts);

        // 예측 결과 반환
        const predictions = await model.predict(tensor);
        return predictions.dataSync(); // 예측 결과 반환
    };

    // 정확도 계산 함수 (예측 결과와 실제 레이블 비교)
    const calculateAccuracy = (newsItems, predictions) => {
        const labels = newsItems.map(item => {
            // 부정적인 단어가 포함된 경우 "부정"으로 라벨링
            if (
                item.title.includes("나쁜") ||
                item.title.includes("실망") ||
                item.title.includes("불만") ||
                item.title.includes("부정") ||
                item.title.includes("부패") ||
                item.title.includes("사망") ||
                item.title.includes("불행") ||
                item.title.includes("실패") ||
                item.title.includes("사고")
            ) {
                return 0; // 부정
            }
            // 부정적인 단어가 포함되지 않으면 "긍정"으로 라벨링
            else {
                return 1; // 긍정
            }
        });

        // 예측 값과 실제 값 비교하여 정확도 계산
        const correctPredictions = predictions.filter((prediction, index) => {
            return (prediction > 0.5 && labels[index] === 1) || (prediction <= 0.5 && labels[index] === 0);
        }).length;

        return (correctPredictions / predictions.length) * 100; // 정확도 (%)
    };

    return (
        <div className="analyzer-container">
            <div style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}>
                <Button
                    onClick={fetchAndAnalyzeNews}
                    disabled={loading}
                    variant="contained" // 버튼을 'contained' 스타일로 설정
                    color="primary"     // primary 색상 적용
                >
                    {loading ? "분석 중..." : "뉴스 분석하기"}
                </Button>
            </div>

            {/* 로딩 중 표시 */}
            {loading && (
                <div className="ai-loading-container">
                    <CircularProgress />
                </div>
            )}

            {/* 오류 표시 */}
            {error && <div className="error-message">{error}</div>}

            {/* 정확도 메시지 표시 */}
            {retryMessage && (
                <Typography variant="h6" color="textSecondary" style={{ marginTop: '20px', whiteSpace: 'pre-line' }} >
                    {retryMessage}
                </Typography>
            )}

            {/* 긍정/부정 감정 분석 차트 */}
            {!loading && !error && sentimentData.length > 0 && (
                <div className="chart-container" style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <Bar
                        data={{
                            labels: ["긍정", "부정"],
                            datasets: [
                                {
                                    label: "뉴스 감정 분석 결과",
                                    data: sentimentData,
                                    backgroundColor: ["#4caf50", "#f44336"],
                                },
                            ],
                        }}
                    />
                </div>
            )}

            {/* 정확도 차트 */}
            {!loading && !error && accuracy !== null && (
                <div className="chart-container" style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                    <Bar
                        data={{
                            labels: ["정확도"],
                            datasets: [
                                {
                                    label: "정확도 (%)",
                                    data: [accuracy],
                                    backgroundColor: accuracy >= 80 ? "#4caf50" : "#f44336",
                                },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    display: false, // 범례 숨기기
                                },
                            },
                            layout: {
                                padding: 3,
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        beginAtZero: true, // x축 값 0부터 시작
                                    },
                                },
                                y: {
                                    display: false, // y축 숨기기
                                },
                            },
                            indexAxis: "y", // 가로바로 설정
                        }}
                        style={{ height: "50px", width: "100%" }} // 차트 크기 설정
                    />
                </div>
            )}
        </div>
    );
};

export default SchoolMealNewsAnalyzer;
