package com.wcl.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name="tn_sys_application")
public class Application {
	//唯一的guid
	private String guid;
	private String appcode;
	private String appNanme;
	private String desc;
	private String  modify;
	private String  modifyName;
	private Date modifyDate;
	private String  creator;
	private String  creatorName;
	private Date creatorDate;
	private String image;
	private String url;
	
	@Id
	//配置自动生成主键
//	@GeneratedValue(generator="uuid")
//	@GenericGenerator(name="uuid", strategy="uuid")
	@Column(name="cn_guid")
	public String getGuid() {
		return guid;
	}
	public void setGuid(String guid) {
		this.guid = guid;
	}
	@Column(name="cn_s_appcode")
	public String getAppcode() {
		return appcode;
	}
	public void setAppcode(String appcode) {
		this.appcode = appcode;
	}
	@Column(name="cn_s_appname")
	public String getAppNanme() {
		return appNanme;
	}
	public void setAppNanme(String appNanme) {
		this.appNanme = appNanme;
	}
	@Column(name="CN_S_DESC")
	public String getDesc() {
		return desc;
	}
	public void setDesc(String desc) {
		this.desc = desc;
	}
	@Column(name="CN_S_MODIFY")
	public String getModify() {
		return modify;
	}
	public void setModify(String modify) {
		this.modify = modify;
	}
	@Column(name="CN_S_MODIFY_BY")
	public String getModifyName() {
		return modifyName;
	}
	public void setModifyName(String modifyName) {
		this.modifyName = modifyName;
	}
	@Column(name="CN_T_MODIFY")
	public Date getModifyDate() {
		return modifyDate;
	}
	public void setModifyDate(Date modifyDate) {
		this.modifyDate = modifyDate;
	}
	@Column(name="CN_S_CREATOR")
	public String getCreator() {
		return creator;
	}
	public void setCreator(String creator) {
		this.creator = creator;
	}
	@Column(name="CN_S_CREATOR_BY")
	public String getCreatorName() {
		return creatorName;
	}
	public void setCreatorName(String creatorName) {
		this.creatorName = creatorName;
	}
	@Column(name="CN_T_CREATE")
	public Date getCreatorDate() {
		return creatorDate;
	}
	public void setCreatorDate(Date creatorDate) {
		this.creatorDate = creatorDate;
	}
	@Column(name="CN_S_IMAGE")
	public String getImage() {
		return image;
	}
	public void setImage(String image) {
		this.image = image;
	}
	@Column(name="CN_S_URL")
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	

}
