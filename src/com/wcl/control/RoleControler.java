package com.wcl.control;

import java.util.List;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.wcl.entity.Role;
import com.wcl.entity.Util;
import com.wcl.ser.RoleServices;
import com.wcl.service.RoleServiceImp;

@Controller
@RequestMapping("/Role")
public class RoleControler {
	@Resource
	private RoleServices roleServices;
	
	@RequestMapping("/add.do")
	@ResponseBody
	public Util addRole(String parentCode,String menuCode,String menuName,String order,
			String url, String remark,String state){
		
		return null;
	}
	
	@RequestMapping("/update.do")
	@ResponseBody
	public Util updateRole(String parentCode,String menuCode,String menuName,String order,
			String url, String remark,String state){
		
		return null;
	}
	
	@RequestMapping("/delete.do")
	@ResponseBody
	public Util deleteRole(){
		
		return null;
	}
	
	@RequestMapping("/show.do")
	@ResponseBody
	public Util showRole(String rolecode,String roleName,String appCodeSelect){
//		System.out.print(rolecode+"---"+roleName+"---"+appCodeSelect);
		List<Role> roles=this.roleServices.findRole(rolecode,roleName, appCodeSelect);
		Util util=new Util();
		return util;
	}
	
	
	
	

}
