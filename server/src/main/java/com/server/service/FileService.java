package com.server.service;

import com.server.exception.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileService {
    @Value("${file.upload.dir}")
    private String uploadDir;

    private String getExtension(String fileName){
        if (fileName == null || !fileName.contains(".")){
            throw new BadRequestException("Invalid file type!");
        }
        return fileName.substring(fileName.lastIndexOf(".")+1);
    }
    public String saveFile(MultipartFile file){
        if (file == null || file.isEmpty()){
            throw new BadRequestException("File is empty!");
        }
        try {
            Path uploadPath = Paths.get(uploadDir);
            Files.createDirectories(uploadPath);

            String originalName = file.getOriginalFilename();
            String extension = getExtension(originalName);

            String fileName = UUID.randomUUID() + "." + extension;
            Path filePath = uploadPath.resolve(fileName);

            Files.copy(file.getInputStream(),filePath,StandardCopyOption.REPLACE_EXISTING);

            return fileName;
        } catch (Exception e) {
            throw new BadRequestException(e.getMessage());
        }
    }
}
