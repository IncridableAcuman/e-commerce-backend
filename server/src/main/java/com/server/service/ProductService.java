package com.server.service;

import com.server.dto.ProductRequest;
import com.server.dto.ProductResponse;
import com.server.entity.Product;
import com.server.exception.NotFoundException;
import com.server.repository.ProductRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheConfig;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@CacheConfig(cacheNames = "products")
public class ProductService {
    private final ProductRepository productRepository;
    private final FileService fileService;

    @Transactional
    @CacheEvict(key = "'allProducts'")
    public ProductResponse create(ProductRequest request){
        Product product = new Product();
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        if (request.getImage()!=null && !request.getImage().isEmpty()){
            product.setImage(fileService.saveFile(request.getImage()));
        }
        product.setCategory(request.getCategory());
        product.setSize(request.getSize());
        product = saveProduct(product);
        return ProductResponse.from(product);
    }
    public List<ProductResponse> getList(){
        List<Product> products = productRepository.findAll();
        return products.stream().map(ProductResponse::from).toList();
    }
    @Cacheable(key = "#id")
    public ProductResponse getProduct(long id){
        Product product = findProduct(id);
        return ProductResponse.from(product);
    }
    @Transactional
    @CachePut(key = "#id")
    @CacheEvict(value = "products",key = "'allProducts'")
    public ProductResponse edit(Long id,ProductRequest request){
        Product product = findProduct(id);
        product.setTitle(request.getTitle());
        product.setDescription(request.getDescription());
        if (request.getImage()!=null && !request.getImage().isEmpty()){
            product.setImage(fileService.saveFile(request.getImage()));
        }
        product.setPrice(request.getPrice());
        product.setCategory(request.getCategory());
        product.setSize(request.getSize());
        product = saveProduct(product);
        return ProductResponse.from(product);
    }
    public Product findProduct(long id){
        return productRepository.findById(id).orElseThrow(() ->new NotFoundException("Product not found!"));
    }
    public Product saveProduct(Product product){
        return productRepository.save(product);
    }
}
