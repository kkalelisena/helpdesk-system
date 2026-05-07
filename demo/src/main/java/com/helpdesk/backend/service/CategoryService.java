package com.helpdesk.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.helpdesk.backend.entity.Category;
import com.helpdesk.backend.repository.CategoryRepository;

@Service
public class CategoryService {
    
    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    // Veritabanındaki tüm kategorileri listeleyen metod
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    // Veritabanına yeni kategori ekleyen metod
    public Category addCategory(Category category) {
        return categoryRepository.save(category);
    }
}
