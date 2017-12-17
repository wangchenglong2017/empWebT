package com.test;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import org.hibernate.Session;

import com.wcl.entity.Application;
import com.wcl.entity.Button;
import com.wcl.util.HibernateUtil;

public class ButtonTest {

	public static void main(String[] args) {
		// 获取当前时间
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
		System.out.println(df.format(new Date()));// new Date()为获取当前系统时间
		Button m=new Button();
		//生成mysql的uuid
		UUID uuid=UUID.randomUUID();
		//转换成大写
        String u = uuid.toString().toUpperCase();
        m.setGuid(u);
        m.setCode("2");
        m.setName("ww");
		m.setAppcode("人员模型");
		m.setType("1");
		m.setStatus(1);
		m.setNote("ccccc");
		m.setModify("sa");
		m.setModifyName("超级管理员");
		m.setModifyDate(new Date());
		m.setCreator("sa");
		m.setCreatorName("超级管理员");
		m.setCreatorDate(new Date());
		
		Session session=HibernateUtil.currentSession();
		session.beginTransaction();
		session.save(m);
		session.getTransaction().commit();
		HibernateUtil.closeSession();

	}

}
