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
		// ��ȡ��ǰʱ��
		SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");//�������ڸ�ʽ
		System.out.println(df.format(new Date()));// new Date()Ϊ��ȡ��ǰϵͳʱ��
		Button m=new Button();
		//����mysql��uuid
		UUID uuid=UUID.randomUUID();
		//ת���ɴ�д
        String u = uuid.toString().toUpperCase();
        m.setGuid(u);
        m.setCode("2");
        m.setName("ww");
		m.setAppcode("��Աģ��");
		m.setType("1");
		m.setStatus(1);
		m.setNote("ccccc");
		m.setModify("sa");
		m.setModifyName("��������Ա");
		m.setModifyDate(new Date());
		m.setCreator("sa");
		m.setCreatorName("��������Ա");
		m.setCreatorDate(new Date());
		
		Session session=HibernateUtil.currentSession();
		session.beginTransaction();
		session.save(m);
		session.getTransaction().commit();
		HibernateUtil.closeSession();

	}

}
