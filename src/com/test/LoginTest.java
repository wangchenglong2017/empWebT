package com.test;

import com.wcl.entity.Util;
import com.wcl.service.UserService;

public class LoginTest {

	public static void main(String[] args) {
		// TODO Auto-generated method stub
		Util u=new  Util();
		UserService user=new  UserService();
		u=user.loginChack("zs", "123");
		System.out.print(u.getCode());
	}

}
