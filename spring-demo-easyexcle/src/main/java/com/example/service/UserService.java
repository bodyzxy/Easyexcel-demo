package com.example.service;

import com.example.component.BaseResponse;
import jakarta.servlet.ServletOutputStream;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;

/**
 * @author bodyzxy
 * @github https://github.com/bodyzxy
 * @date 2024/7/20 11:53
 */
public interface UserService {
    void download(ServletOutputStream outputStream);

    void uploadExcel(InputStream inputStream);

    void fillExcelTemplate(ServletOutputStream outputStream, MultipartFile file);

    BaseResponse getTitle();
}
