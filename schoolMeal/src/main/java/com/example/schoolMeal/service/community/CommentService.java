package com.example.schoolMeal.service.community;

import com.example.schoolMeal.domain.entity.community.Comment;
import com.example.schoolMeal.domain.entity.community.Notice;
import com.example.schoolMeal.domain.entity.community.RegionalCommunity;
import com.example.schoolMeal.domain.entity.community.ProcessedFood;
import com.example.schoolMeal.domain.repository.community.CommentRepository;
import com.example.schoolMeal.domain.repository.community.NoticeRepository;
import com.example.schoolMeal.domain.repository.community.RegionalCommunityRepository;
import com.example.schoolMeal.domain.repository.community.ProcessedFoodRepository;
import com.example.schoolMeal.dto.community.CommentDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentService {

	@Autowired
	private CommentRepository commentRepository;

	@Autowired
	private NoticeRepository noticeRepository;

	@Autowired
	private RegionalCommunityRepository regionalCommunityRepository;

	@Autowired
	private ProcessedFoodRepository processedFoodRepository;

	// 댓글 생성 메서드
	public CommentDTO addComment(CommentDTO dto) {
		Comment savedComment;
		if (dto.getNoticeId() != null) {
			Notice notice = noticeRepository.findById(dto.getNoticeId())
					.orElseThrow(() -> new EntityNotFoundException("Notice not found"));
			Comment comment = new Comment(dto.getContent(), dto.getAuthor(), notice);
			savedComment = commentRepository.save(comment);
		} else if (dto.getRegionalCommunityId() != null) {
			RegionalCommunity regionalCommunity = regionalCommunityRepository.findById(dto.getRegionalCommunityId())
					.orElseThrow(() -> new EntityNotFoundException("Regional Community not found"));
			Comment comment = new Comment(dto.getContent(), dto.getAuthor(), regionalCommunity);
			savedComment = commentRepository.save(comment);
		} else if (dto.getProcessedFoodId() != null) {
			ProcessedFood processedFood = processedFoodRepository.findById(dto.getProcessedFoodId())
					.orElseThrow(() -> new EntityNotFoundException("Processed Food not found"));
			Comment comment = new Comment(dto.getContent(), dto.getAuthor(), processedFood);
			savedComment = commentRepository.save(comment);
		} else {
			throw new IllegalArgumentException(
					"One of the IDs (noticeId, regionalCommunityId, processedFoodId, cateringFacilityId) must be provided");
		}

		return mapToDTO(savedComment);
	}

	// 특정 지역별 커뮤니티의 모든 댓글 조회 메서드
	public List<CommentDTO> getCommentsByRegionalCommunity(Long regionalCommunityId) {
		RegionalCommunity regionalCommunity = regionalCommunityRepository.findById(regionalCommunityId)
				.orElseThrow(() -> new EntityNotFoundException("Regional Community not found"));
		return regionalCommunity.getComments().stream().map(this::mapToDTO).collect(Collectors.toList());
	}

	// 특정 지역 커뮤니티의 댓글 개수 조회
	public int getCommentCountByRegionalCommunity(Long regionalCommunityId) {
		// 해당 커뮤니티 게시글에 대한 댓글 개수를 반환
		return commentRepository.countByRegionalCommunityId(regionalCommunityId);
	}

	// 댓글 삭제 메서드
	public void deleteComment(Long id) {
		if (!commentRepository.existsById(id)) {
			throw new EntityNotFoundException("Comment not found");
		}
		commentRepository.deleteById(id);
	}

	// DTO로 매핑하는 헬퍼 메서드
	private CommentDTO mapToDTO(Comment comment) {
		return new CommentDTO(comment.getId(), comment.getContent(), comment.getAuthor(),
				comment.getNotice() != null ? comment.getNotice().getId() : null,
				comment.getRegionalCommunity() != null ? comment.getRegionalCommunity().getId() : null,
				comment.getCreatedDate());
	}

}
