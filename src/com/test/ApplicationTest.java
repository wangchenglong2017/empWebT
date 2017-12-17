package com.test;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.UUID;

import org.hibernate.Session;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.wcl.entity.Application;
import com.wcl.entity.Menu;
import com.wcl.service.ApplicationService;

public class ApplicationTest {

	public static void main(String[] args) {
		// ��ȡ��ǰʱ��
				SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//�������ڸ�ʽ
				System.out.println(df.format(new Date()));// new Date()Ϊ��ȡ��ǰϵͳʱ��
				Application m=new Application();
				//���mysql��uuid
				UUID uuid=UUID.randomUUID();
				//ת���ɴ�д
		        String u = uuid.toString().toUpperCase();
		        m.setGuid(u);
		        m.setAppcode("1");
		        m.setAppNanme("lisi");
		        m.setDesc("dicrice");
		        
//		        m.setMenuCode("1");
//		        m.setMenuName("��ɫ�˵�����");
//		        m.setOrder(1);
//		        m.setState(0);
//		        m.setParentCode("0");
		        m.setUrl("www.baidu.com");
//		        m.setRemark("��ע");
//		        m.setIsFastMenu("0");
//		        m.setIsShowCut("0");
//				m.setAppCode("��Աģ��");
				m.setModify("sa");
				m.setModifyName("��������Ա");
				m.setModifyDate(new Date());
				m.setCreator("sa");
				m.setCreatorName("��������Ա");
				m.setCreatorDate(new Date());
				m.setImage("333");
//				Session session=HibernateUtil.currentSession();
//				session.beginTransaction();
//				session.save(m);
//				session.getTransaction().commit();
//				HibernateUtil.closeSession();
				ClassPathXmlApplicationContext ctx=new ClassPathXmlApplicationContext("applicationContext.xml");
				ApplicationService aps=(ApplicationService)ctx.getBean("u");
				aps.save(m);
				ctx.destroy();
				

	}

}
