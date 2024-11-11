package com.example.schoolMeal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.schoolMeal.domain.entity.FileUrl;
import com.example.schoolMeal.domain.repository.FileUrlRepository;

import jakarta.transaction.Transactional;

@Service
public class FileUrlService {
	
	@Autowired
	private FileUrlRepository fileUrlRepository;
	
	public FileUrlService(FileUrlRepository fileUrlRepository) {
		this.fileUrlRepository = fileUrlRepository;
	}
	
	@Transactional
	public Long saveFile(FileUrl fileUrl) {
	    return fileUrlRepository.save(fileUrl).getId();
	}

	@Transactional
	public FileUrl getFile(Long id) {
	    return fileUrlRepository.findById(id).get();
	}

}
