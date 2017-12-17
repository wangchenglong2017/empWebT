package com.wcl.service;

import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.wcl.dao.UserDao;
import com.wcl.entity.RoleUser;
import com.wcl.entity.User;
import com.wcl.entity.Util;
@Component
public class UserService {
	@Resource
	private UserDao userDao;
   
   @Transactional
   public void save(User user){
	   this.userDao.save(user);
   }
   
   
   @Transactional
   public Util loginChack(String username, String password){
	   Util util=new Util();
	   User user=this.userDao.LoginCheck(username);
       if(user==null){
    	   //���û�в鵽�û�
    	   util.setCode(1);
    	   util.setMsg("�û�������");
    	   util.setData(user);
    	   return util;
       }
	   
       if(user.getPassWord()==password){
    	   //����û�������붼��ȷ
    	   //����ʹ��MD5���ܵĻ���������ٱȽ�
    	   util.setCode(0);
    	   util.setMsg("��¼�ɹ�");
    	   util.setData(user);
    	   return util;
    	   
       }else{
    	   //�������
    	   util.setCode(1);
    	   util.setMsg("�û�����������");
    	   util.setData(user);
    	   return util;
       }
       
   }
   
   //检查用户是否存在角色和部门

@Transactional
public Util CheckLogin(String username) {
	Util util=new Util();
	RoleUser u=this.userDao.CheckLogin(username);
	//当用户没有分配部门和角色的时候
//	if(u.isEmpty()){
//		util.setCode(1);
//		util.setMsg("没有分配部门或角色");
//	}else{
		util.setCode(0);
		util.setData(u);
//	}
	//返回值
	return util;
}
   
	

}
