package com.wcl.entity;

public class Util {
	//0失败，没有查到数据     1、成功
	private int code;
	//获取信息
	private String msg;
	//数据存储
	private Object data;
	public int getCode() {
		return code;
	}
	public void setCode(int code) {
		this.code = code;
	}
	public String getMsg() {
		return msg;
	}
	public void setMsg(String msg) {
		this.msg = msg;
	}
	public Object getData() {
		return data;
	}
	public void setData(Object data) {
		this.data = data;
	}
	

   
	

}
