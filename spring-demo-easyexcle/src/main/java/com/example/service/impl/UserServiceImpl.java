package com.example.service.impl;

import com.alibaba.excel.EasyExcelFactory;
import com.alibaba.excel.ExcelWriter;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.enums.WriteDirectionEnum;
import com.alibaba.excel.read.listener.ReadListener;
import com.alibaba.excel.write.metadata.WriteSheet;
import com.alibaba.excel.write.metadata.fill.FillConfig;
import com.alibaba.excel.write.metadata.fill.FillWrapper;
import com.example.component.BaseResponse;
import com.example.model.User;
import com.example.repository.UserRepository;
import com.example.service.UserService;
import com.example.util.FilesUtils;
import com.example.util.ResultUtils;
import jakarta.servlet.ServletOutputStream;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

/**
 * @author bodyzxy
 * @github https://github.com/bodyzxy
 * @date 2024/7/20 11:54
 */
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    private List<User> list = new ArrayList<>();

    @Override
    public void download(ServletOutputStream outputStream) {
        EasyExcelFactory.write(outputStream, User.class).sheet("User").doWrite(this::getUserList);
    }

    private List<User> getUserList() {
        List<User> userList = userRepository.findAll();
        return userList;
    }

    @Override
    public void uploadExcel(InputStream inputStream) {
        EasyExcelFactory.read(inputStream, User.class, new ReadListener<User>() {
            @Override
            public void invoke(User user, AnalysisContext analysisContext) {
                list.add(user);
            }

            @Override
            public void doAfterAllAnalysed(AnalysisContext analysisContext) {
                userRepository.saveAll(list);
            }
        }).sheet().doRead();
    }

    @Override
    public void fillExcelTemplate(ServletOutputStream outputStream, MultipartFile file) {
        try {
            InputStream inputStream = file.getInputStream();
            ExcelWriter excelWriter = EasyExcelFactory.write(outputStream).withTemplate(inputStream).build();
            WriteSheet writeSheet = EasyExcelFactory.writerSheet().build();
            FillConfig fillConfig = FillConfig.builder().direction(WriteDirectionEnum.HORIZONTAL).build();

            // 如果有多个list 模板上必须有{前缀.} 这里的前缀就是 userList，然后多个list必须用 FillWrapper包裹
            excelWriter.fill(new FillWrapper("userList",getUserList()),fillConfig,writeSheet);
            excelWriter.finish();
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    @Override
    public BaseResponse getTitle() {
        List<String> fileName = FilesUtils.getAllFiles(User.class);
        fileName.remove("password");
        fileName.remove("id");
        return ResultUtils.success(fileName);
    }
}
