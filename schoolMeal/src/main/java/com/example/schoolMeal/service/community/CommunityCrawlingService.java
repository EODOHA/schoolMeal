package com.example.schoolMeal.service.community;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.HashMap;
import java.util.Map;

@Service // 이 클래스가 Spring의 Service 컴포넌트로 관리되도록 지정
public class CommunityCrawlingService {

    // 네이버 OpenAPI에서 발급받은 Client ID와 Secret코드
    private final String clientId = "LOQrR5P2eJCYkXCUYDnB";
    private final String clientSecret = "FvxJhO8w_4";


    // 특정 키워드를 이용해 네이버 뉴스 API 에서 데이터를 가져오는 메서드
    // @PARAM 키워드 > 검색할 내용
    public Map<String, Object> getNewsWithFixedKeyword(String keyword) {
        String encodedKeyword;
        try {
            // UTF-8로 키워드를 URL 인코딩
            encodedKeyword = URLEncoder.encode(keyword, "UTF-8");
        } catch (Exception e) {
            throw new RuntimeException("검색어 인코딩 실패", e);
        }

        // API 요청 URL 설정
        String apiURL = "https://openapi.naver.com/v1/search/news?query=" + encodedKeyword + "&display=30";

        // 요청 헤더에 Client ID와 Secret 추가
        Map<String, String> requestHeaders = new HashMap<>();
        requestHeaders.put("X-Naver-Client-Id", clientId);
        requestHeaders.put("X-Naver-Client-Secret", clientSecret);

        // API 호출 및 응답 데이터 가져오기
        String responseBody = get(apiURL, requestHeaders);

        // JSON 응답 데이터를 Map으로 변환
        ObjectMapper objectMapper = new ObjectMapper();
        Map<String, Object> jsonResponse;
        try {
            jsonResponse = objectMapper.readValue(responseBody, Map.class);
        } catch (JsonMappingException e) {
            throw new RuntimeException("JSON 매핑 오류", e);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("JSON 처리 오류", e);
        }

        return jsonResponse; // 변환된 데이터 반환
    }


    // API 요청을 보내고 응답 데이터를 문자열로 반환하는 메서드
    // @param apiUrl 호출할 API의 URL
    private String get(String apiUrl, Map<String, String> requestHeaders) {
        HttpURLConnection con = connect(apiUrl);
        try {
            // HTTP GET 메서드 설정
            con.setRequestMethod("GET");
            for (Map.Entry<String, String> header : requestHeaders.entrySet()) {
                con.setRequestProperty(header.getKey(), header.getValue());
            }

            // 응답 코드 확인
            int responseCode = con.getResponseCode();
            if (responseCode == HttpURLConnection.HTTP_OK) {
                // 응답이 성공일 경우 본문 읽기
                return readBody(con.getInputStream());
            } else {
                // 응답이 실패일 경우 에러 스트림 읽기
                return readBody(con.getErrorStream());
            }
        } catch (IOException e) {
            throw new RuntimeException("API 요청과 응답 실패", e);
        } finally {
            con.disconnect(); // 연결 해제
        }
    }


    // 주어진 URL로 HTTP연결을 설정하는 메서드
    private HttpURLConnection connect(String apiUrl) {
        try {
            URL url = new URL(apiUrl);
            return (HttpURLConnection) url.openConnection();
        } catch (Exception e) {
            throw new RuntimeException("API URL 오류: " + apiUrl, e);
        }
    }


    //API 응답 본문 데이터를 읽어 문자열로 반환하는 메서드
    private String readBody(InputStream body) {
        InputStreamReader streamReader = new InputStreamReader(body);
        try (BufferedReader lineReader = new BufferedReader(streamReader)) {
            StringBuilder responseBody = new StringBuilder();
            String line;
            while ((line = lineReader.readLine()) != null) {
                responseBody.append(line);
            }
            return responseBody.toString();
        } catch (IOException e) {
            throw new RuntimeException("API 응답 읽기 실패", e);
        }
    }
}
