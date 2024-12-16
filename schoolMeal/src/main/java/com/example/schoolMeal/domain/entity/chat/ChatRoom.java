package com.example.schoolMeal.domain.entity.chat;

import java.util.ArrayList;
import java.util.List;

import com.example.schoolMeal.domain.entity.member.Member;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class ChatRoom {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Long id;
	
	private String title;
	
	private String memberId;
	
	@ManyToMany
	@JoinTable(
			name="chat_room_members",
			joinColumns = @JoinColumn(name="chat_room_id"),
			inverseJoinColumns = @JoinColumn(name="member_id")
	)
	private List<Member> members = new ArrayList<>();
	
	@OneToMany(mappedBy = "chatRoom", cascade = CascadeType.ALL)
	@JsonManagedReference // 순환 참조 방지 위함.
	private List<Message> messages = new ArrayList<>();
}
