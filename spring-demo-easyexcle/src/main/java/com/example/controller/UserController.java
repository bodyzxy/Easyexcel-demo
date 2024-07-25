package com.example.controller;

import com.example.component.BaseResponse;
import com.example.component.ErrorCode;
import com.example.service.UserService;
import com.example.util.ResultUtils;
import com.github.xiaoymin.knife4j.annotations.ApiSupport;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author bodyzxy
 * @github https://github.com/bodyzxy
 * @date 2024/7/20 11:28
 */

@RestController
@RequestMapping("/user")
@Slf4j
@Tag(name = "UserController", description = "用户作业")
@ApiSupport(author = "bodyzxy")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping("/excel/download")
    @Operation(description = "下载表格")
    public void download(HttpServletResponse response) {
        try{
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition",
                    "attachment;filename=user_excel_" + System.currentTimeMillis() + ".xlsx"
                    );
            userService.download(response.getOutputStream());
        } catch (Exception e)
        {
            e.printStackTrace();
        }
    }

    @PostMapping("/excel/upload")
    @Operation(description = "导入Excel")
    public BaseResponse uploadExcel(@RequestParam(value = "file" , required = true) MultipartFile file) {
        try {
            userService.uploadExcel(file.getInputStream());
        } catch (Exception e){
            return ResultUtils.error(ErrorCode.ERROR);
        }
        return ResultUtils.success("success");
    }

    /**
     * 横向填充
     * @param file
     * @param response
     * @return
     */
    @PostMapping("/excel/file")
    @Operation(description = "填充Excel表格")
    public void fillTemplate(@RequestParam(value = "file" , required = true) MultipartFile file, HttpServletResponse response) {
        try {
            response.reset();
            response.setContentType("application/vnd.ms-excel");
            response.setHeader("Content-Disposition",
                    "attachment;filename=user_excel_" + System.currentTimeMillis() + ".xls");
            userService.fillExcelTemplate(response.getOutputStream(),file);
        } catch (Exception e){
            e.printStackTrace();
        }
    }

    @GetMapping("/excel/title")
    @Operation(description = "获取字段")
    public BaseResponse getTitle(){
        return userService.getTitle();
    }
}
