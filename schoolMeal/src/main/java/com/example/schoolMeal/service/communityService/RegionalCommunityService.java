package com.example.schoolMeal.service.communityService;

import com.example.schoolMeal.domain.entity.communityEntity.RegionalCommunity;
import com.example.schoolMeal.domain.repository.communityRepository.RegionalCommunityRepository;
import com.example.schoolMeal.dto.communityInfo.RegionalCommunityRequestDTO;
import com.example.schoolMeal.dto.communityInfo.RegionalCommunityResponseDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RegionalCommunityService {
    @Autowired
    private RegionalCommunityRepository regionalCommunityRepository;

    // 게시글 생성 메서드
    public RegionalCommunityResponseDTO createPost(RegionalCommunityRequestDTO dto) {
        RegionalCommunity post = new RegionalCommunity(dto.getTitle(), dto.getContent(), dto.getAuthor());
        RegionalCommunity savedPost = regionalCommunityRepository.save(post);
        return new RegionalCommunityResponseDTO(savedPost.getId(), savedPost.getTitle(), savedPost.getContent(), savedPost.getAuthor(), savedPost.getCreatedDate(), savedPost.getUpdatedDate());
    }

    // 특정 게시글 조회 메서드
    public RegionalCommunityResponseDTO getPost(Long id) {
        RegionalCommunity post = regionalCommunityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
        return new RegionalCommunityResponseDTO(post.getId(), post.getTitle(), post.getContent(), post.getAuthor(), post.getCreatedDate(), post.getUpdatedDate());
    }

    // 모든 게시글 조회 메서드
    public List<RegionalCommunityResponseDTO> getAllPosts() {
        return regionalCommunityRepository.findAll().stream()
                .map(post -> new RegionalCommunityResponseDTO(post.getId(), post.getTitle(), post.getContent(), post.getAuthor(), post.getCreatedDate(), post.getUpdatedDate()))
                .collect(Collectors.toList());
    }

    // 게시글 수정 메서드
    public void updatePost(Long id, RegionalCommunityRequestDTO dto) {
        RegionalCommunity post = regionalCommunityRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found"));
        post.setTitle(dto.getTitle());
        post.setContent(dto.getContent());
        post.setAuthor(dto.getAuthor());
        post.setUpdatedDate(LocalDateTime.now());
        regionalCommunityRepository.save(post);
    }

    // 게시글 삭제 메서드
    public void deletePost(Long id) {
        regionalCommunityRepository.deleteById(id);
    }
}
