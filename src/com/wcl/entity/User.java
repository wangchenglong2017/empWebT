package com.wcl.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name="tn_sys_user")
public class User {
	private String guid;
	private String userLogin;
	private String userName;
	private String headImg;
	private String passWord;
	private int  isSuperuser;
	private int disable;
	private int  entype;
	private int isLocal;
	private int level;
	private String note;
	private Date createdate;
	private Date lastLogin;
	private int isDelete;
	private int isSystem;
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
	@Column(name="CN_S_LOGIN")
	public String getUserLogin() {
		return userLogin;
	}
	public void setUserLogin(String userLogin) {
		this.userLogin = userLogin;
	}
	@Column(name="CN_S_NAME")
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	@Column(name="CN_S_HEADIMG")
	public String getHeadImg() {
		return headImg;
	}
	public void setHeadImg(String headImg) {
		this.headImg = headImg;
	}
	@Column(name="CN_S_PASSWORD")
	public String getPassWord() {
		return passWord;
	}
	public void setPassWord(String passWord) {
		this.passWord = passWord;
	}
	@Column(name="CN_N_ISSUPERUSER")
	public int getIsSuperuser() {
		return isSuperuser;
	}
	public void setIsSuperuser(int isSuperuser) {
		this.isSuperuser = isSuperuser;
	}
	@Column(name="CN_N_DISABLED")
	public int getDisable() {
		return disable;
	}
	public void setDisable(int disable) {
		this.disable = disable;
	}
	@Column(name="CN_N_ENTYPE")
	public int getEntype() {
		return entype;
	}
	public void setEntype(int entype) {
		this.entype = entype;
	}
	@Column(name="CN_N_ISLOCAL")
	public int getIsLocal() {
		return isLocal;
	}
	public void setIsLocal(int isLocal) {
		this.isLocal = isLocal;
	}
	@Column(name="CN_N_LEVEL")
	public int getLevel() {
		return level;
	}
	public void setLevel(int level) {
		this.level = level;
	}
	@Column(name="CN_S_NOTE")
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	@Column(name="CN_T_CREATEDATE")
	public Date getCreatedate() {
		return createdate;
	}
	public void setCreatedate(Date createdate) {
		this.createdate = createdate;
	}
	@Column(name="CN_T_LASTLOGIN")
	public Date getLastLogin() {
		return lastLogin;
	}
	public void setLastLogin(Date lastLogin) {
		this.lastLogin = lastLogin;
	}
	@Column(name="CN_N_ISDELETE")
	public int getIsDelete() {
		return isDelete;
	}
	public void setIsDelete(int isDelete) {
		this.isDelete = isDelete;
	}
	@Column(name="CN_N_ISSYSTEM")
	public int getIsSystem() {
		return isSystem;
	}
	public void setIsSystem(int isSystem) {
		this.isSystem = isSystem;
	}
	
	

}
