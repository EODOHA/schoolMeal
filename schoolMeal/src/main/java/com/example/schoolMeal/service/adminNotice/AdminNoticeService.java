package com.example.schoolMeal.service.adminNotice;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.schoolMeal.domain.entity.adminNotice.AdminNotice;
import com.example.schoolMeal.domain.repository.adminNotice.AdminNoticeRepository;

@Service
public class AdminNoticeService {
	
	@Autowired
	private AdminNoticeRepository adminNoticeRepository;
	
	public List<AdminNotice> getAllNotices() {
		return adminNoticeRepository.findAll();
	}
	
	public AdminNotice getNoticeById(Long id) {
		return adminNoticeRepository.findById(id).orElse(null);
	}
	
	public AdminNotice createAdminNotice(AdminNotice adminNotice) {
		return adminNoticeRepository.save(adminNotice);
	}
	
	public AdminNotice updateAdminNotice(Long id, AdminNotice updateAdminNotice) {
		Optional<AdminNotice> adminNoticeOpt = adminNoticeRepository.findById(id);
		
		if (adminNoticeOpt.isPresent()) {
			AdminNotice adminNotice = adminNoticeOpt.get();
			adminNotice.setTitle(updateAdminNotice.getTitle());
			adminNotice.setContent(updateAdminNotice.getContent());
			
			return adminNoticeRepository.save(adminNotice);
		}
		throw new RuntimeException("공지사항을 찾을 수 없습니다.");
	}
	
	public void deleteAdminNotice(Long id) {
		if(adminNoticeRepository.existsById(id)) {
			adminNoticeRepository.deleteById(id);
		} else {
			throw new RuntimeException("공지사항을 찾을 수 없습니다.");
		}
	}
	
	public String getFileNameById(Long id) {
		return adminNoticeRepository.findFileNameById(id);
	}
	
	@Transactional
	public void removeFile(Long id) {
		adminNoticeRepository.removeFileById(id);
	}
}
