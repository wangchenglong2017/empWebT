package com.wcl.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="tn_sys_roleuser")
public class RoleUser {
	
	private String guid;
	private String username;
	private String roleguid;
	private String  modify;
	private String  modifyName;
	private Date modifyDate;
	private String  creator;
	private String  creatorName;
	private Date creatorDate;
	private String appcode;
	
	@Id
	@Column(name="CN_GUID")
	public String getGuid() {
		return guid;
	}

	public void setGuid(String guid) {
		this.guid = guid;
	}
	@Column(name="CN_S_LOGIN")
	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}
	@Column(name="CN_S_ROLEGUID")
	public String getRoleguid() {
		return roleguid;
	}

	public void setRoleguid(String roleguid) {
		this.roleguid = roleguid;
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
	@Column(name="CN_S_APPCODE")
	public String getAppcode() {
		return appcode;
	}

	public void setAppcode(String appcode) {
		this.appcode = appcode;
	}
	

	
	
	
}
	
