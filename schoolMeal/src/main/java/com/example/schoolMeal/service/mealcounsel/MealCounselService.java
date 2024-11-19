package com.example.schoolMeal.service.mealcounsel;


import com.example.schoolMeal.domain.entity.mealcounsel.MealCounsel;
import com.example.schoolMeal.domain.entity.mealcounsel.MealCounselFile;
import com.example.schoolMeal.domain.repository.mealcounsel.MealCounselFileRepository;
import com.example.schoolMeal.domain.repository.mealcounsel.MealCounselRepository;
import com.example.schoolMeal.dto.mealcounsel.MealCounselRequestDTO;
import com.example.schoolMeal.dto.mealcounsel.MealCounselResponseDTO;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;


import java.util.List;

import java.util.stream.Collectors;
import java.nio.file.Paths;

@Service
public class MealCounselService {

    private final MealCounselRepository mealCounselRepository;
    private final FileStorageService fileStorageService;
    private final MealCounselFileRepository mealCounselFileRepository;

    @Autowired
    public MealCounselService(MealCounselRepository mealCounselRepository,
                              FileStorageService fileStorageService,
                              MealCounselFileRepository mealCounselFileRepository) {
        this.mealCounselRepository = mealCounselRepository;
        this.fileStorageService = fileStorageService;
        this.mealCounselFileRepository = mealCounselFileRepository;
    }

    // 모든 게시글 조회
    public List<MealCounselResponseDTO> getAllCounselPosts() {
        return mealCounselRepository.findAll().stream()
                .map(MealCounselResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    // 게시글 ID로 조회
    @Transactional
    public MealCounselResponseDTO getCounselPostById(Long id) {
        MealCounsel mealCounsel = mealCounselRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. 게시글번호: " + id));
        mealCounsel.incrementViewCount();
        return MealCounselResponseDTO.fromEntity(mealCounsel);
    }

    // 게시글 저장 (ADMIN 권한만 가능)
    public MealCounselResponseDTO saveCounselPost(MealCounselRequestDTO requestDTO, String currentUsername) {
        MealCounsel mealCounsel = convertToEntity(requestDTO, currentUsername);
        handleFileUploads(requestDTO.getFiles(), mealCounsel);
        mealCounsel = mealCounselRepository.save(mealCounsel);
        return MealCounselResponseDTO.fromEntity(mealCounsel);
    }

    // 게시글 수정 (ADMIN 권한만 가능)
    @Transactional
    public MealCounselResponseDTO updateCounselPost(Long id, MealCounselRequestDTO requestDTO, String currentUsername) {
        MealCounsel mealCounsel = mealCounselRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. 게시글 번호 : " + id));

        if (!mealCounsel.getAuthor().equals(currentUsername)) {
            throw new AccessDeniedException("게시글 수정 권한이 없습니다.");
        }
        mealCounsel.update(requestDTO.getTitle(), requestDTO.getContent(), requestDTO.getYoutubeHtml());
        handleFileUploads(requestDTO.getFiles(), mealCounsel);
        return MealCounselResponseDTO.fromEntity(mealCounsel);
    }

    // 게시글 삭제 (ADMIN 권한만 가능)
    @Transactional
    public void deleteCounselPost(Long id, String currentUsername) {
        MealCounsel mealCounsel = mealCounselRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 게시글이 없습니다. ID: " + id));
        if (!mealCounsel.getAuthor().equals(currentUsername)) {
            throw new AccessDeniedException("게시글 삭제 권한이 없습니다.");
        }
        mealCounselRepository.delete(mealCounsel);
    }

    // 파일 로드
    public Resource loadFileAsResource(String fileUrl) {
        return fileStorageService.loadFileAsResource(fileUrl);
    }

    // 파일 ID로 조회
    public MealCounselFile getFileById(Long fileId) {
        return mealCounselFileRepository.findById(fileId)
                .orElseThrow(() -> new IllegalArgumentException("해당 파일을 찾을 수 없습니다. ID: " + fileId));
    }

    // 엔티티 변환 메서드
    private MealCounsel convertToEntity(MealCounselRequestDTO requestDTO, String author) {
        return MealCounsel.builder()
                .title(requestDTO.getTitle())
                .content(requestDTO.getContent())
                .author(author)
                .youtubeHtml(requestDTO.getYoutubeHtml())
                .build();
    }

    // 파일 업로드 처리 메서드
    private void handleFileUploads(List<MultipartFile> files, MealCounsel mealCounsel) {
        if (files != null && !files.isEmpty()) {
            for (MultipartFile file : files) {
                if (file.getSize() > 10 * 1024 * 1024) {
                    throw new RuntimeException("유효하지 않은 파일입니다: " + file.getOriginalFilename());
                }
                String fileUrl = fileStorageService.storeFile(file);
                MealCounselFile mealCounselFile = MealCounselFile.builder()
                        .originalFileName(file.getOriginalFilename())
                        .storedFileName(Paths.get(fileUrl).getFileName().toString())
                        .fileType(file.getContentType())
                        .fileUrl(fileUrl)
                        .build();
                mealCounsel.addFile(mealCounselFile);
            }
        }
    }
}
