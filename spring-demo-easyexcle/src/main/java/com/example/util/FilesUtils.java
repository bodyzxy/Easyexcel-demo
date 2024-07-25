package com.example.util;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

/**
 * @author bodyzxy
 * @github https://github.com/bodyzxy
 * @date 2024/7/20 14:18
 */
public class FilesUtils {
    public static List<String> getAllFiles(Class<?> clazz) {
        List<String> lsit = new ArrayList<>();
        Field[] fileds = clazz.getDeclaredFields();
        for (Field f : fileds) {
            lsit.add(f.getName());
        }
        return lsit;
    }
}
