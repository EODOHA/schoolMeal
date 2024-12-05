package com.example.schoolMeal.controller.community;

import com.example.schoolMeal.dto.community.RegionalCommunityRequestDTO;
import com.example.schoolMeal.dto.community.RegionalCommunityResponseDTO;
import com.example.schoolMeal.service.community.RegionalCommunityService;
import com.example.schoolMeal.domain.entity.community.RegionCategory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/regions")
public class RegionalCommunityController {
    @Autowired
    private RegionalCommunityService regionalCommunityService;

    // 게시글 생성 요청 처리 메서드
    @PostMapping("/create")
    public ResponseEntity<RegionalCommunityResponseDTO> createPost(@RequestBody RegionalCommunityRequestDTO dto) {
        return ResponseEntity.ok(regionalCommunityService.createPost(dto));
    }

    // 특정 게시글 조회 요청 처리 메서드
    @GetMapping("/list/{id}")
    public ResponseEntity<RegionalCommunityResponseDTO> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(regionalCommunityService.getPost(id));
    }

    // 모든 게시글 조회 요청 처리 메서드
    @GetMapping("/list")
    public ResponseEntity<List<RegionalCommunityResponseDTO>> getAllPosts() {
        return ResponseEntity.ok(regionalCommunityService.getAllPosts());
    }

    // 특정 지역 게시글 조회 요청 처리 메서드 (추가된 메서드)
    @GetMapping("/list/category/{region}")
    public ResponseEntity<List<RegionalCommunityResponseDTO>> getPostsByRegion(@PathVariable RegionCategory region) {
        List<RegionalCommunityResponseDTO> posts = regionalCommunityService.getPostsByRegion(region);
        return ResponseEntity.ok(posts);
    }

    // 게시글 수정 요청 처리 메서드
    @PutMapping("/update/{id}")
    public ResponseEntity<Void> updatePost(@PathVariable Long id, @RequestBody RegionalCommunityRequestDTO dto) {
        regionalCommunityService.updatePost(id, dto);
        return ResponseEntity.ok().build();
    }

    // 게시글 삭제 요청 처리 메서드
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        regionalCommunityService.deletePost(id);
        return ResponseEntity.ok().build();
    }
}
