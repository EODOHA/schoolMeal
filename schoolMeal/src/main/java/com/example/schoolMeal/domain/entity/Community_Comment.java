package com.example.schoolMeal.domain.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Community_Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //다대일 관계 , 댓글이 특정 게시물에 소속
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false) //외래키 post_id null값 허용하지않음
    private Community post; // 댓글이 속한 게시물 필드

    //다대일 관계 , 대댓글을위한
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_comment_id")
    private Community_Comment parentComment; // 부모 댓글을 참조하는 필드

    @Column(nullable = false)
    private String content;     //댓글내용

    @Column(nullable = false)
    private int likes = 0;      //댓글좋아요수

    @Column(nullable = false)
    private int dislikes = 0;   //댓글싫어요수

    @Column(nullable = false)
    private LocalDateTime createdAt = LocalDateTime.now();  //댓글작성시간
}
