package com.example.model;

import com.alibaba.excel.annotation.ExcelProperty;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author bodyzxy
 * @github https://github.com/bodyzxy
 * @date 2024/7/20 11:11
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @ExcelProperty("ID")
    private Long id;

    @ExcelProperty("name")
    private String name;

    @ExcelProperty("password")
    private String password;

    @ExcelProperty("email")
    private String email;
}
