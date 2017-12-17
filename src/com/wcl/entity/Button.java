package com.wcl.entity;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.GenericGenerator;

@Entity
@Table(name="tn_sys_button")
public class Button {
	private static final String generator = null;
	private String guid;
	private String code;
	private String name;
	private String type;
	private int status;
	private  String note;
	private String appcode;
	private String  modify;
	private String  modifyName;
	private Date modifyDate;
	private String  creator;
	private String  creatorName;
	private Date creatorDate;
	@Id
	@GeneratedValue(generator="uuid")
	@GenericGenerator(name="uuid", strategy = "uuid" )
	@Column(name="CN_GUID")
	public String getGuid() {
		return guid;
	}
	public void setGuid(String guid) {
		this.guid = guid;
	}
	@Column(name="CN_S_CODE")
	public String getCode() {
		return code;
	}
	public void setCode(String code) {
		this.code = code;
	}
	@Column(name="CN_S_NAME")
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	@Column(name="CN_S_TYPE")
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	@Column(name="CN_N_STATUS")
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	@Column(name="CN_S_NOTE")
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
	@Column(name="CN_S_APPCODE")
	public String getAppcode() {
		return appcode;
	}
	public void setAppcode(String appcode) {
		this.appcode = appcode;
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
	
	

}
