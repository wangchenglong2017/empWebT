package com.test;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import org.hibernate.Session;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.wcl.entity.Application;
import com.wcl.entity.Menu;
import com.wcl.entity.User;
import com.wcl.imp.UserDaoImp;
import com.wcl.service.ApplicationService;
import com.wcl.service.UserService;
import com.wcl.util.HibernateUtil;

public class UserTest {

	public static void main(String[] args) {
		// 获取当前时间
				SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
				System.out.println(df.format(new Date()));// new Date()为获取当前系统时间
				User m=new User();
				//生成mysql的uuid
				UUID uuid=UUID.randomUUID();
				//转换成大写
		        String u = uuid.toString().toUpperCase();
		        m.setGuid(u);
		        m.setUserLogin("zs");
		        m.setUserName("张三");
		        m.setHeadImg("ccc");
		        m.setPassWord("123");
		        m.setIsSuperuser(1);
		        m.setDisable(1);
		        m.setEntype(1);
		        m.setIsLocal(1);
		        m.setLevel(1);
		        m.setNote("ccccc");
		        m.setCreatedate(new Date());
		        m.setIsDelete(0);
		        m.setIsSystem(1);
		        m.setLastLogin(new Date());
		        
				ClassPathXmlApplicationContext ctx=new ClassPathXmlApplicationContext("applicationContext.xml");
				UserService aps=(UserService)ctx.getBean("userService");
				aps.save(m);
				ctx.destroy();
				

	}

}
