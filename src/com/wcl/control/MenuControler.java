package com.wcl.control;

import javax.annotation.Resource;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.wcl.entity.Menu;
import com.wcl.entity.Util;
import com.wcl.ser.MenuService;

@Controller
@RequestMapping("/menu")
public class MenuControler {
	@Resource
	private MenuService menuService;
	
	
	/*
	 * 通过应用编码String  appcode 父项编码int parentCode显示整个树
	 * 
	 */
	@RequestMapping(value="/showall.do",method=RequestMethod.GET)
	@ResponseBody
	public Util showMenu(String appcode){
		Util util=this.menuService.showMenu(appcode);
//		if(util.getCode()==1){
//			System.out.println(util.getData());
//			return util;
//		}
		System.out.println(util.getData());
		return util;
	}
	
	
	@RequestMapping(value="/addMune.do",method=RequestMethod.POST)
	@ResponseBody
	public Util addMenu(String parentCode,String menuCode,String menuName,String order,
			String url, String remark,String state){
		Util util=this.menuService.addMune(parentCode,menuCode,menuName,order,
				url, remark,state);
		return util;
		
	}

}
