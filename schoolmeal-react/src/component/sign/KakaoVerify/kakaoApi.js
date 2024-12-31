import axios from "axios";

const REST_API_KEY = `47a53c69cf19c7a731778c88db139375`;
const REDIRECT_URI = `http://localhost:3000/verify/kakao`;
const AUTH_CODE_PATH = `https://kauth.kakao.com/oauth/authorize`;
const ACCESS_TOKEN_URL = `https://kauth.kakao.com/oauth/token`

export const getKakaoLoginLink = () => {
    //카카오 인가 코드 발급 요청
      // prompt=login : 기존 사용자 인증 여부와 관계없이 사용자에게 로그인 화면을 출력하여 다시 인증을 수행하도록 함
    const kakaoURL =
        `${AUTH_CODE_PATH}?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code&prompt=login`;
    return kakaoURL;
}

export const getAccessToken = async (authCode) => {
    const header = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        }
    };
    const params = {
        grant_type: "authorization_code",
        client_id: REST_API_KEY,
        redirect_uri: REDIRECT_URI,
        code: authCode
    };
    try {
        const res = await axios.post(ACCESS_TOKEN_URL, params, header);
        const accessToken = res.data.access_token;

        // 로컬 스토리지에 액세스 토큰 저장
        localStorage.setItem("accessToken", accessToken);

        return accessToken;
    } catch (error) {
        // console.error("카카오 액세스 토큰 요청 실패", error);
        throw new Error("카카오 액세스 토큰 요청 중 오류 발생");
    }

}