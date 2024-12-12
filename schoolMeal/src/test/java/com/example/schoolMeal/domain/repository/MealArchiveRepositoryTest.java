package com.example.schoolMeal.domain.repository;

import java.util.ArrayList;
import java.util.stream.IntStream;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

import com.example.schoolMeal.domain.entity.mealInfo.MealArchive;
import com.example.schoolMeal.domain.entity.mealInfo.MealArchiveFile;
import com.example.schoolMeal.domain.repository.mealInfo.MealArchiveFileRepository;
import com.example.schoolMeal.domain.repository.mealInfo.MealArchiveRepository;

@SpringBootTest
@Transactional
public class MealArchiveRepositoryTest {
	
	@Autowired
	MealArchiveRepository archiveRepository;
	
	@Autowired
	MealArchiveFileRepository fileRepository;
	
	@Test
	void archiveTest() {
		for(int i=1; i<=10; i++) {
			MealArchive archive = MealArchive.builder()
					.arc_title("제목" + i)
					.arc_content("내용"+i)
					.arc_author("작성자" + i)
					.arc_files(new ArrayList<>()) //파일 없음
					.build();
			archiveRepository.save(archive);
		};
		
		for(int i =10; i<= 20; i++) {
			// 연관관계 매핑 고려하여 MealArchive 먼저 저장 후 파일정보를 추가로 저장
			MealArchive archive = MealArchive.builder()
					.arc_title("제목" + i)
					.arc_content("내용"+i)
					.arc_author("작성자" + i)
					.build();
			MealArchive savedArchive = archiveRepository.save(archive);	
			
			//파일 객체 생성 후 MealArchive 와 연결
			MealArchiveFile file = MealArchiveFile.builder()
					.arc_originalFilename("original_file"+i+".jpg")
					.arc_storedFilename("stored_file"+i+".jpg")
					.arc_file_url("/uploads/file"+i+".jpg")
					.mealArchive(savedArchive)
					.build();
			//파일 저장
			fileRepository.save(file);
			
		};
		
		System.out.println("게시글 생성 완료");
	}

}
