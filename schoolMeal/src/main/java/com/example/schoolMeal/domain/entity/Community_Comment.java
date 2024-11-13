package com.example.schoolMeal.domain.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "community_comment")
public class Community_Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Community와 다대일 관계: 댓글이 특정 게시물에 소속됨
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "community_id", nullable = false)
    private Community community;  // 댓글이 속한 게시물

    // 대댓글을 위한 부모 댓글 필드
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Community_Comment parentComment;  // 부모 댓글

    // 자식 댓글 리스트 (양방향 관계 설정)
    @OneToMany(mappedBy = "parentComment", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Community_Comment> childComments = new ArrayList<>();

    @Column(nullable = false)
    private String content;  // 댓글 내용

    @Column(nullable = false)
    private int likes = 0;  // 댓글 좋아요 수

    @Column(nullable = false)
    private int dislikes = 0;  // 댓글 싫어요 수

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();  // 댓글 작성 시간

    @Builder
    public Community_Comment(Community community, Community_Comment parentComment, String content) {
        this.community = community;
        this.parentComment = parentComment;
        this.content = content;
    }

    // 대댓글 추가 편의 메서드
    public void addChildComment(Community_Comment child) {
        childComments.add(child);
        child.setParentComment(this);
    }
}
