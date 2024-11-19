package com.example.schoolMeal.dto.mealcounsel;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealCounselRequestDTO {

    @NotEmpty(message = "제목은 필수 입력 값입니다.")
    @Size(max = 100, message = "제목은 최대 100자까지 입력 가능합니다.")
    private String title; // 게시글 제목

    @NotEmpty(message = "내용은 필수 입력 값입니다.")
    @Size(max = 2000, message = "내용은 최대 2000자까지 입력 가능합니다.")
    private String content; // 게시글 내용

    @Pattern(regexp = "^(<iframe.*?>.*?</iframe>)?$", message = "유효한 YouTube 임베드 코드가 아닙니다.")
    private String youtubeHtml; // YouTube 동영상 소스 코드

    // 파일 첨부를 위한 필드 추가
    @Size(max = 5, message = "최대 5개의 파일을 업로드할 수 있습니다.")
    private List<MultipartFile> files; // 첨부 파일 리스트

    @NotEmpty(message = "게시판 이름은 필수 입력 값입니다.")
    private String boardName; // 게시판 이름

    // 작성자 정보는 서버에서 인증된 사용자 정보로 설정하므로, 클라이언트에서 받지 않는다.
}


