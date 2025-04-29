package com.example.productListingAPI;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ProductControllerTest {

    @Autowired
    private MockMvc mockMvc;



    @Test
    void shouldReturnPaginatedProducts() throws Exception {
        mockMvc.perform(get("/products")
                .param("page", "0")
                .param("size", "5")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content", hasSize(lessThanOrEqualTo(5))))
            .andExpect(jsonPath("$.content[0].name", notNullValue()));
    }

    @Test
    void shouldFilterProductsByCategory() throws Exception {
        mockMvc.perform(get("/products")
                .param("category", "Books")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content[*].category", everyItem(equalTo("Books"))));
    }

    @Test
    void shouldSortProductsByPrice() throws Exception {
        mockMvc.perform(get("/products")
                .param("sort", "price")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content", not(empty())))
            .andExpect(jsonPath("$.content[0].price", notNullValue()))
            .andExpect(jsonPath("$.content[1].price", notNullValue()));
    }

    @Test
    void shouldHandleInvalidCategoryGracefully() throws Exception {
        mockMvc.perform(get("/products")
                .param("category", "NonExistingCategory")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content", hasSize(0)));
    }

    @Test
    void shouldHandlePageOutOfRangeGracefully() throws Exception {
        mockMvc.perform(get("/products")
                .param("page", "999")
                .param("size", "10")
                .contentType(MediaType.APPLICATION_JSON))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.content", hasSize(0)));
    }
    
}