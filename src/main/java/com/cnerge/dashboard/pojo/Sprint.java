package com.cnerge.dashboard.pojo;

import java.sql.Date;

public class Sprint {
	private int s_id;
	private String s_name;
	private Date meeting_date;
	
	public int getS_id() {
		return s_id;
	}
	public void setS_id(int s_id) {
		this.s_id = s_id;
	}
	public String getS_name() {
		return s_name;
	}
	public void setS_name(String s_name) {
		this.s_name = s_name;
	}
	public Date getMeeting_date() {
		return meeting_date;
	}
	public void setMeeting_date(Date meeting_date) {
		this.meeting_date = meeting_date;
	}

	@Override
	public String toString(){
		return "String [ s_id" + s_id + "s_name" + s_name + "meeting_date" + meeting_date  + "]";
	}
}
