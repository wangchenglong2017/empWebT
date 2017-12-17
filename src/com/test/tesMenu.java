package com.test;



import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.AnnotationConfiguration;
import org.hibernate.cfg.Configuration;

import com.wcl.entity.Menu;


public class tesMenu {

	public static void main(String[] args) {
		// 获取当前时间
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//设置日期格式
		System.out.println(df.format(new Date()));// new Date()为获取当前系统时间
		Menu m=new Menu();
		//生成mysql的uuid
		UUID uuid=UUID.randomUUID();
		//转换成大写
        String u = uuid.toString().toUpperCase();
        m.setGuid(u);
        m.setMenuCode("1");
        m.setMenuName("角色菜单分配");
        m.setOrder(1);
        m.setState(0);
        m.setParentCode("0");
        m.setUrl("www.baidu.com");
        m.setRemark("备注");
        m.setIsFastMenu("0");
        m.setIsShowCut("0");
		m.setAppCode("人员模型");
		m.setModify("sa");
		m.setModifyName("超级管理员");
		m.setModifyDate(new Date());
		m.setCreator("sa");
		m.setCreatorName("超级管理员");
		m.setCreatorDate(new Date());
		m.setImage("333");
		
		//读取hibernate配置文件，默认为src下的hiernate.cfg.xml
		Configuration cfg=new AnnotationConfiguration().configure();
		

			
//			ServiceRegistry service=new StandardServiceRegistryBuilder().applySettings(cfg.getProperties()).build();
			SessionFactory  sf = cfg.buildSessionFactory();
			Session session = sf.openSession();

		
//		//创建sessionFactory
//		SessionFactory sf=cfg.configure().buildSessionFactory();
//		//创建session
//		Session session=sf.openSession();
//		Session session=HibernateUtil.currentSession();
		//开始事务
		session.beginTransaction();
		session.save(m);
		session.getTransaction().commit();
		session.close();
		sf.close();

	}

}
















