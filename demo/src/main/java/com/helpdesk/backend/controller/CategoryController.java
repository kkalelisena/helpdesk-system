package com.helpdesk.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.helpdesk.backend.entity.Category;
import com.helpdesk.backend.service.CategoryService;

@RestController
@CrossOrigin
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    // Frontend GET isteği attığında burası çalışacak
    @GetMapping
    public List<Category> getAll() {
        return categoryService.getAllCategories();
    }

    // Frontend POST isteği (yeni veri) attığında burası çalışacak
    @PostMapping
    public Category add(@RequestBody Category category) {
        return categoryService.addCategory(category);
    }
}
