package com.example.schoolMeal.service.mealResource;

import java.io.File;
import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.schoolMeal.domain.entity.FileUrl;
import com.example.schoolMeal.domain.entity.mealResource.MealPolicy;
import com.example.schoolMeal.domain.repository.FileUrlRepository;
import com.example.schoolMeal.domain.repository.mealResource.MealPolicyRepository;

@Service
public class MealPolicyService {
    
    @Autowired
    private MealPolicyRepository mealPolicyRepository;
    
    @Autowired
    private FileUrlRepository fileUrlRepository;

    // 글 작성
    public void write(MealPolicy mealPolicy, MultipartFile file) {
        try {
            if (file != null && !file.isEmpty()) {
                // 파일이 있을 경우 파일 업로드 처리
                FileUrl fileUrl = saveFile(file);
                mealPolicy.setFileId(fileUrl.getId());  // 파일 ID 설정
            } else {
                mealPolicy.setFileId(null);  // 파일이 없으면 null 설정
            }
            
            // 게시글 저장
            mealPolicyRepository.save(mealPolicy);
        } catch (IOException e) {
            e.printStackTrace();
            // 파일 처리 오류 발생 시 적절한 처리가 필요
        }
    }

    // 파일 정보를 DB에 저장하는 메서드
    public FileUrl saveFile(MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            return null;  // 파일이 없으면 null 반환
        }

        // 원본 파일 이름 가져오기
        String origFilename = file.getOriginalFilename();

        // 파일 이름을 고유하게 설정 (현재 시간 + 원본 파일명)
        String filename = System.currentTimeMillis() + "_" + origFilename;

        // 파일이 저장될 경로 설정
        String savePath = System.getProperty("user.dir") + "/src/main/resources/static/files";

        // 파일이 저장될 폴더가 없으면 생성
        java.io.File saveDir = new java.io.File(savePath);
        if (!saveDir.exists()) {
            saveDir.mkdir();
        }

        // 파일 경로 설정
        String filePath = savePath + File.separator + filename;

        // 파일을 지정한 경로에 저장
        file.transferTo(new java.io.File(filePath));

        // FileUrl 엔티티에 파일 정보 설정
        FileUrl fileUrl = FileUrl.builder()
                .origFileName(origFilename)
                .fileName(filename)
                .filePath(filePath)
                .build();

        // FileUrl 엔티티를 DB에 저장하고 ID 반환
        return fileUrlRepository.save(fileUrl);
    }

    // 게시글 리스트 처리
    public List<MealPolicy> mealPolicyList() {
        return mealPolicyRepository.findAll();
    }

    // 특정 게시글을 조회하면서 첨부 파일 정보도 함께 반환하는 메서드
    public MealPolicy getPostWithFileDetails(Long id) {
        // 특정 ID로 게시글을 조회
        MealPolicy mealPolicy = mealPolicyRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 ID의 게시글이 존재하지 않습니다: " + id));

        // 파일 ID가 존재하는 경우, 연관된 파일 정보를 조회
        if (mealPolicy.getFileId() != null) {
            FileUrl fileUrl = fileUrlRepository.findById(mealPolicy.getFileId())
                    .orElse(null); // 파일이 없을 경우 null 처리
            mealPolicy.setFileUrl(fileUrl); // MealPolicy에 FileUrl 설정
        }

        return mealPolicy;
    }

    // 특정 게시글 삭제
    public void mealPolicyDelete(Long id) {
        mealPolicyRepository.deleteById(id);
    }

    // 게시글 수정
    public void mealPolicyUpdate(MealPolicy mealPolicy) {
        mealPolicyRepository.save(mealPolicy);
    }
}
