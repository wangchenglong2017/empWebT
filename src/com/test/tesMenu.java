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
		// ��ȡ��ǰʱ��
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//�������ڸ�ʽ
		System.out.println(df.format(new Date()));// new Date()Ϊ��ȡ��ǰϵͳʱ��
		Menu m=new Menu();
		//����mysql��uuid
		UUID uuid=UUID.randomUUID();
		//ת���ɴ�д
        String u = uuid.toString().toUpperCase();
        m.setGuid(u);
        m.setMenuCode("1");
        m.setMenuName("��ɫ�˵�����");
        m.setOrder(1);
        m.setState(0);
        m.setParentCode("0");
        m.setUrl("www.baidu.com");
        m.setRemark("��ע");
        m.setIsFastMenu("0");
        m.setIsShowCut("0");
		m.setAppCode("��Աģ��");
		m.setModify("sa");
		m.setModifyName("��������Ա");
		m.setModifyDate(new Date());
		m.setCreator("sa");
		m.setCreatorName("��������Ա");
		m.setCreatorDate(new Date());
		m.setImage("333");
		
		//��ȡhibernate�����ļ���Ĭ��Ϊsrc�µ�hiernate.cfg.xml
		Configuration cfg=new AnnotationConfiguration().configure();
		

			
//			ServiceRegistry service=new StandardServiceRegistryBuilder().applySettings(cfg.getProperties()).build();
			SessionFactory  sf = cfg.buildSessionFactory();
			Session session = sf.openSession();

		
//		//����sessionFactory
//		SessionFactory sf=cfg.configure().buildSessionFactory();
//		//����session
//		Session session=sf.openSession();
//		Session session=HibernateUtil.currentSession();
		//��ʼ����
		session.beginTransaction();
		session.save(m);
		session.getTransaction().commit();
		session.close();
		sf.close();

	}

}
















