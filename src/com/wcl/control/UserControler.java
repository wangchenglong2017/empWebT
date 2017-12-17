package com.wcl.control;

import java.lang.annotation.Annotation;
import java.util.List;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.springframework.http.HttpRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import com.wcl.entity.User;
import com.wcl.entity.Util;
import com.wcl.service.UserService;
@Controller
@RequestMapping("/user")
public class UserControler  {
	
	@Resource
	private UserService userService;
	
	@RequestMapping(value="/login.do",method=RequestMethod.GET)
	@ResponseBody
	public Util loginUser(HttpServletRequest request){ 
		String username=request.getParameter("username");
		String password=request.getParameter("password");
//		 System.out.println(a+"-----"+b);
		  Util  util= this.userService.loginChack(username,password);
//		  request.getSession().setAttribute("username", username);
//		  System.out.println("验证结束");
//		  return "forward:/Checklogin.do";
		  return util;
	}
	
	//检查用户的角色和部门
	@RequestMapping(value="/Checklogin.do",method=RequestMethod.GET)
	@ResponseBody
//	public Util CheckLogin(String username){
	public Util CheckLogin(HttpServletRequest request){
		System.out.println("获取角色和部门");
		String username=(String)request.getParameter("username");
		System.out.println(username);
		Util  util= this.userService.CheckLogin(username);
		return util;
		
	}
	

	

}
