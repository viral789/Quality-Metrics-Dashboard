package com.cnerge.dashboard.pojo;

public class GraphSprint {
	private int g_id;
	private int p_id;
	private int s_id;
	private String g_name;
	private boolean gchecked;
	private String color;
	private String action_plan;
	private String inputvalue;
	private String validRange;
	private boolean na;
	
	
	
	public boolean isNa() {
		return na;
	}
	public void setNa(boolean na) {
		this.na = na;
	}
	public int getG_id() {
		return g_id;
	}
	public void setG_id(int g_id) {
		this.g_id = g_id;
	}
	public int getP_id() {
		return p_id;
	}
	public void setP_id(int p_id) {
		this.p_id = p_id;
	}
	public int getS_id() {
		return s_id;
	}
	public void setS_id(int s_id) {
		this.s_id = s_id;
	}
	public String getG_name() {
		return g_name;
	}
	public void setG_name(String g_name) {
		this.g_name = g_name;
	}
	public boolean isGchecked() {
		return gchecked;
	}
	public void setGchecked(boolean gchecked) {
		this.gchecked = gchecked;
	}
	public String getColor() {
		return color;
	}
	public void setColor(String color) {
		this.color = color;
	}
	public String getAction_plan() {
		return action_plan;
	}
	public void setAction_plan(String action_plan) {
		this.action_plan = action_plan;
	}
	
	public String getInputvalue() {
		return inputvalue;
	}
	public void setInputvalue(String inputvalue) {
		this.inputvalue = inputvalue;
	}
	public String getValidRange() {
		return validRange;
	}
	public void setValidRange(String validRange) {
		this.validRange = validRange;
	}
	public String toString(){
		return "Graph [ g_id " + g_id + "p_id" + p_id + "s_id" + s_id + "g_name" + g_name + "gchecked" + gchecked + 
				"color" + color + "action_plan" + action_plan + "inputvalue" + inputvalue + "validRange" + validRange+ 
				"na" + na + "]";
	}

}
