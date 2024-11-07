package com.example.schoolMeal.service.edudata;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.domain.entity.edudata.EduVideo;
import com.example.schoolMeal.domain.repository.edudata.EduVideoRepository;

@Service
public class EduVideoService {

	@Autowired
	private EduVideoRepository eduVideoRepository;
	
	// 글 작성
	public void write(EduVideo eduVideo) {
		eduVideoRepository.save(eduVideo);
	}
	
	// 영상 파일을 서버에 저장
	public String saveVideo(MultipartFile file) throws IOException {
		// 파일 이름 중복 방지
		String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
		Path uploadPath = Paths.get("src/main/resources/static/videos/eduVideo"
										+ fileName);
		if (!Files.exists(uploadPath)) {
			Files.createDirectories(uploadPath);  // 디렉토리가 없으면 생성
		}
		
		// 파일 저장 경로
		Path filePath = uploadPath.resolve(fileName);
		
		try {
			// 영상 파일 저장
			Files.copy(file.getInputStream(), filePath);
		} catch (IOException e) {
			e.printStackTrace();
			// 예외를 던져서 호출자에게 처리
			throw new IOException("영상 파일 저장 실패", e);  // 
		}

		return "/videos/eduVideo/" + fileName;  // URL 경로 반환
	}
	
	// 게시글 리스트 처리
	public List<EduVideo> eduVideoList() {
		return eduVideoRepository.findAll();
	}
	
	// 특정 게시글 불러오기
	public EduVideo eduVideoView(Integer id) {
		return eduVideoRepository.findById(id).get();
	}
	
	// 특정 게시글 삭제
	public void eduVideoDelete(Integer id) {
		eduVideoRepository.deleteById(id);
	}
	
	// 게시글 수정
	public void eduVideoUpdate(EduVideo eduVideo) {
		eduVideoRepository.save(eduVideo);
	}
	 
}
