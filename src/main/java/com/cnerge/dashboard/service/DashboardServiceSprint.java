package com.cnerge.dashboard.service;

import java.sql.Connection;
import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.cnerge.dashboard.model.DBUtility;
import com.cnerge.dashboard.pojo.Sprint;

public class DashboardServiceSprint {
	private Connection connection;
	
	public DashboardServiceSprint (){
		connection = DBUtility.getConnection();
	}
	
	//add new sprint details
	public void addSprint(Sprint sprint){
		try{
			PreparedStatement preparedStatement = connection.prepareStatement("insert into cnergeSprint (s_name, meeting_date)"
					+ "values (?, ?)");
			preparedStatement.setString(1, sprint.getS_name());
			preparedStatement.setDate(2, (Date) sprint.getMeeting_date());
			preparedStatement.executeUpdate();
		}catch(SQLException e){
			e.printStackTrace();
		}
	}
	
	//update sprint details
	public void updateSprint(int s_id, Sprint sprint){
		try{
			PreparedStatement preparedStatement = connection.prepareStatement("update cnergeSprint set s_name=?, meeting_date=? where s_id="+s_id);
			
			preparedStatement.setString(1, sprint.getS_name());
			preparedStatement.setDate(2, (Date) sprint.getMeeting_date());
			preparedStatement.executeUpdate();
			
		}catch(SQLException e){
			e.printStackTrace();
		}
	}
	
	//get all sprint 
	public List<Sprint> getAllSprint(){
		List<Sprint> sprints = new ArrayList<Sprint>();
		try{
			Statement statement = connection.createStatement();
			ResultSet rs = statement.executeQuery("Select * from cnergeSprint order by s_id desc");
			while(rs.next()){
				Sprint sprint = new Sprint();
				sprint.setS_id(rs.getInt("s_id"));
				sprint.setS_name(rs.getString("s_name"));
				sprint.setMeeting_date(rs.getDate("meeting_date"));
				sprints.add(sprint);
			}
		}catch(SQLException e){
			e.printStackTrace();
		}
		return sprints;
	}
	
	//delete particular sprint
	public void deleteSprint (int s_id){
		try{
			PreparedStatement preparedStatement = connection.prepareStatement("Delete from cnergeSprint where s_id= "+s_id);
			
			preparedStatement.executeUpdate();
		}catch(SQLException e){
			e.printStackTrace();
		}
		
	}
	
}

