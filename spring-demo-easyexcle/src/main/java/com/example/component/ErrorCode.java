package com.example.component;

/**
 * @author bodyzxy
 * @github https://github.com/bodyzxy
 * @date 2024/7/20 12:33
 */
public enum ErrorCode {
    SUCCESS(0, "ok"),
    PARAMS_ERROR(40000, "请求参数错误"),
    NOT_LOGIN_ERROR(40100, "未登录"),
    USERNAME_IS_ALREADY(400020,"用户以存在"),
    ERROR(40000,"请求失败"),
    NO_AUTH_ERROR(40101, "无权限");

    private int code;

    private String msg;

    ErrorCode(int code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    public int getCode(){return code;}
    public String getMsg(){return msg;}
}
