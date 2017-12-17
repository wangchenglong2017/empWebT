package com.wcl.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name="tn_sys_menu")
public class Menu {
	//唯一的uuID
	private String guid;
	//菜单编码
	private String menuCode;
	//菜单名称
	private String menuName;
	//排序
	private int order;
	//状态
	private int state;
	//父项编码
	private String parentCode;

	//url
	private String url;
	//备注ע
	private String remark;
	//是否快捷菜单
	private String isFastMenu;
	
	private String isShowCut;
	//所属应用
	private String appCode;
	private String  modify;
	private String  modifyName;
	private Date modifyDate;
	private String  creator;
	private String  creatorName;
	private Date creatorDate;
	private String image;
	@Id
//	@GeneratedValue(generator="uuid")
//	@GenericGenerator(name="uuid",strategy="uuid")
	@Column(name="CN_GUID")
	public String getGuid() {
		return guid;
	}
	public void setGuid(String guid) {
		this.guid = guid;
	}
	@Column(name="cn_s_menucode")
	public String getMenuCode() {
		return menuCode;
	}
	public void setMenuCode(String menuCode) {
		this.menuCode = menuCode;
	}
	@Column(name="cn_s_meunname")
	public String getMenuName() {
		return menuName;
	}
	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}
	@Column(name="cn_n_order")
	public int getOrder() {
		return order;
	}
	public void setOrder(int order) {
		this.order = order;
	}
	@Column(name="cn_n_state")
	public int getState() {
		return state;
	}
	public void setState(int state) {
		this.state = state;
	}
	@Column(name="cn_s_parent_code")
	public String getParentCode() {
		return parentCode;
	}
	public void setParentCode(String parentCode) {
		this.parentCode = parentCode;
	}
	@Column(name="cn_s_url")
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	@Column(name="cn_s_remark")
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	@Column(name="isfast")
	public String getIsFastMenu() {
		return isFastMenu;
	}
	public void setIsFastMenu(String isFastMenu) {
		this.isFastMenu = isFastMenu;
	}
	@Column(name="isshortcut")
	public String getIsShowCut() {
		return isShowCut;
	}
	public void setIsShowCut(String isShowCut) {
		this.isShowCut = isShowCut;
	}
	@Column(name="cn_s_appcode")
	public String getAppCode() {
		return appCode;
	}
	public void setAppCode(String appCode) {
		this.appCode = appCode;
	}
	@Column(name="cn_s_modify")
	public String getModify() {
		return modify;
	}
	public void setModify(String modify) {
		this.modify = modify;
	}
	@Column(name="cn_s_modify_by")
	public String getModifyName() {
		return modifyName;
	}
	public void setModifyName(String modifyName) {
		this.modifyName = modifyName;
	}
	@Column(name="cn_t_modify")
	public Date getModifyDate() {
		return modifyDate;
	}
	public void setModifyDate(Date modifyDate) {
		this.modifyDate = modifyDate;
	}
	@Column(name="cn_s_creator")
	public String getCreator() {
		return creator;
	}
	public void setCreator(String creator) {
		this.creator = creator;
	}
	@Column(name="cn_s_creator_by")
	public String getCreatorName() {
		return creatorName;
	}
	public void setCreatorName(String creatorName) {
		this.creatorName = creatorName;
	}
	@Column(name="cn_t_creator")
	public Date getCreatorDate() {
		return creatorDate;
	}
	public void setCreatorDate(Date creatorDate) {
		this.creatorDate = creatorDate;
	}
	@Column(name="cn_s_image")
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}

	
}
