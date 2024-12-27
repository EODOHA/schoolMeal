package com.example.schoolMeal.service.community;

import com.example.schoolMeal.domain.entity.community.RegionalCommunity;
import com.example.schoolMeal.domain.entity.community.RegionCategory;
import com.example.schoolMeal.domain.repository.community.RegionalCommunityRepository;
import com.example.schoolMeal.dto.community.RegionalCommunityRequestDTO;
import com.example.schoolMeal.dto.community.RegionalCommunityResponseDTO;
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
		RegionalCommunity post = new RegionalCommunity(dto.getTitle(), dto.getContent(), dto.getAuthor(),
				dto.getRegion());
		RegionalCommunity savedPost = regionalCommunityRepository.save(post);
		return new RegionalCommunityResponseDTO(savedPost.getId(), savedPost.getTitle(), savedPost.getContent(),
				savedPost.getAuthor(), savedPost.getCreatedDate(), savedPost.getUpdatedDate(), savedPost.getRegion(),
				savedPost.getViewCount()); // 조회수 추가
	}

	// 특정 게시글 조회 메서드
	public RegionalCommunityResponseDTO getPost(Long id) {
		RegionalCommunity post = regionalCommunityRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Post not found"));

		// 조회수 증가
		post.incrementViewCount();

		// 조회수 증가 후 저장
		regionalCommunityRepository.save(post);

		// DTO 반환 (조회수도 포함)
		return new RegionalCommunityResponseDTO(post.getId(), post.getTitle(), post.getContent(), post.getAuthor(),
				post.getCreatedDate(), post.getUpdatedDate(), post.getRegion(), post.getViewCount()); // 조회수 추가
	}

	// 모든 게시글 조회 메서드
	public List<RegionalCommunityResponseDTO> getAllPosts() {
		return regionalCommunityRepository.findAll().stream()
				.map(post -> new RegionalCommunityResponseDTO(post.getId(), post.getTitle(), post.getContent(),
						post.getAuthor(), post.getCreatedDate(), post.getUpdatedDate(), post.getRegion(), post.getViewCount()))
				.collect(Collectors.toList());
	}

	// 특정 지역의 게시글 조회 메서드 (추가된 메서드)
	public List<RegionalCommunityResponseDTO> getPostsByRegion(RegionCategory region) {
		return regionalCommunityRepository.findByRegion(region).stream()
				.map(post -> new RegionalCommunityResponseDTO(post.getId(), post.getTitle(), post.getContent(),
						post.getAuthor(), post.getCreatedDate(), post.getUpdatedDate(), post.getRegion(), post.getViewCount()))
				.collect(Collectors.toList());
	}

	// 게시글 수정 메서드
	public void updatePost(Long id, RegionalCommunityRequestDTO dto) {
		RegionalCommunity post = regionalCommunityRepository.findById(id)
				.orElseThrow(() -> new EntityNotFoundException("Post not found"));
		post.setTitle(dto.getTitle());
		post.setContent(dto.getContent());
		post.setAuthor(dto.getAuthor());
		post.setRegion(dto.getRegion()); // 지역 카테고리 업데이트
		post.setUpdatedDate(LocalDateTime.now());
		regionalCommunityRepository.save(post);
	}

	// 게시글 삭제 메서드
	public void deletePost(Long id) {
		regionalCommunityRepository.deleteById(id);
	}
}
