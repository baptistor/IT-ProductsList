package com.example.productListingAPI.controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.productListingAPI.model.Product;
import com.example.productListingAPI.repository.ProductRepository;

@RestController
public class ProductController {

    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/products")
    public Page<Product> getProducts(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "id") String sort,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "2") int size
    ) {
        Sort sortBy = Sort.by(sort);
        Pageable pageable = PageRequest.of(page, size, sortBy);
        // System.out.println(pageable);

        if (category != null) {
            List<Product> filtered = productRepository.findAll().stream()
                .filter(p -> p.getCategory().equalsIgnoreCase(category))
                .toList();
            return new PageImpl<>(filtered, pageable, filtered.size());
        }

        // System.out.println(productRepository.findById((long) 5));
        return productRepository.findAll(pageable);
    }


    @GetMapping("/products/{id}")
    public Page<Product> getProductsById(
        @PathVariable int id
        ) 
    {
        return new PageImpl<>(productRepository.findById((long) id).stream().toList());
 
    }
}