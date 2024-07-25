package com.example.component;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.poi.ss.formula.functions.T;

import java.io.Serializable;

/**
 * @author bodyzxy
 * @github https://github.com/bodyzxy
 * @date 2024/7/20 12:30
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BaseResponse<T> implements Serializable {

    private Integer code;

    private String msg;

    private T Data;

    public BaseResponse(int code,T data){
        this(code,null,data);
    }

    public BaseResponse(ErrorCode errorCode){this(errorCode.getCode(),errorCode.getMsg(),null);}
}
