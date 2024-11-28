package com.example.schoolMeal.controller.communityController;

import com.example.schoolMeal.dto.communityInfo.RegionalCommunityRequestDTO;
import com.example.schoolMeal.dto.communityInfo.RegionalCommunityResponseDTO;
import com.example.schoolMeal.service.communityService.RegionalCommunityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/community/regions")
public class RegionalCommunityController {
    @Autowired
    private RegionalCommunityService regionalCommunityService;

    // 게시글 생성 요청 처리 메서드
    @PostMapping
    public ResponseEntity<RegionalCommunityResponseDTO> createPost(@RequestBody RegionalCommunityRequestDTO dto) {
        return ResponseEntity.ok(regionalCommunityService.createPost(dto));
    }

    // 특정 게시글 조회 요청 처리 메서드
    @GetMapping("/{id}")
    public ResponseEntity<RegionalCommunityResponseDTO> getPost(@PathVariable Long id) {
        return ResponseEntity.ok(regionalCommunityService.getPost(id));
    }

    // 모든 게시글 조회 요청 처리 메서드
    @GetMapping
    public ResponseEntity<List<RegionalCommunityResponseDTO>> getAllPosts() {
        return ResponseEntity.ok(regionalCommunityService.getAllPosts());
    }

    // 게시글 수정 요청 처리 메서드
    @PutMapping("/{id}")
    public ResponseEntity<Void> updatePost(@PathVariable Long id, @RequestBody RegionalCommunityRequestDTO dto) {
        regionalCommunityService.updatePost(id, dto);
        return ResponseEntity.ok().build();
    }

    // 게시글 삭제 요청 처리 메서드
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        regionalCommunityService.deletePost(id);
        return ResponseEntity.ok().build();
    }
}
