package com.cnerge.dashboard.pojo;

public class Project {
	private int p_id;
	private String p_name;
	private String TL;
	private String qms_name;
	
	
	public String getQms_name() {
		return qms_name;
	}
	public void setQms_name(String qms_name) {
		this.qms_name = qms_name;
	}
	public int getP_id() {
		return p_id;
	}
	public void setP_id(int p_id) {
		this.p_id = p_id;
	}
	
	public String getP_name() {
		return p_name;
	}
	public void setP_name(String p_name) {
		this.p_name = p_name;
	}
	public String getTL() {
		return TL;
	}
	public void setTL(String tL) {
		TL = tL;
	}
	
	public String toString(){
		return "Project [ p_id " + p_id + "p_name" + p_name + "TL" + TL + "qms_name" + qms_name +"]";
	}
}

