package com.example.productListingAPI.repository;

import com.example.productListingAPI.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<Product, Long> {
}
