package com.cnerge.dashboard.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.cnerge.dashboard.model.DBUtility;
import com.cnerge.dashboard.pojo.Project;

public class DashboardServiceProject {
	private Connection connection;

	public DashboardServiceProject() {
		connection = DBUtility.getConnection();
	}

	// add new project
	public void addProject(Project project) {
		try {
			PreparedStatement preparedStatement = connection
					.prepareStatement("insert into project (p_name, TL, QMSname)"
							+ "values (?,?,?)");
			preparedStatement.setString(1, project.getP_name());
			preparedStatement.setString(2, project.getTL());
			preparedStatement.setString(3, project.getQms_name());
			
			preparedStatement.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	// update project details
	public void updateProject(int p_id, Project project) {
		try {
			/*PreparedStatement preparedStatement = connection
					.prepareStatement("update project set p_name='"+p_name+"', TL='"+tl+ "'where p_id="+p_id);*/
			PreparedStatement preparedStatement = connection
					.prepareStatement("update project set p_name=?, TL=?, QMSname=? where p_id="+p_id);
			
			preparedStatement.setString(1, project.getP_name());
			preparedStatement.setString(2, project.getTL());
			preparedStatement.setString(3, project.getQms_name());
			preparedStatement.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	// get all project
	public List<Project> getAllProject() {
		List<Project> projects = new ArrayList<Project>();
		try {
			Statement statement = connection.createStatement();
			ResultSet rs = statement.executeQuery("select * from project");
			while (rs.next()) {
				Project project = new Project();
				project.setP_id(rs.getInt("p_id"));
				project.setP_name(rs.getString("p_name"));
				project.setTL(rs.getString("TL"));
				project.setQms_name(rs.getString("QMSname"));
				
				projects.add(project);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return projects;
	}

	public List<Project> getLatestProject() {
		List<Project> projects = new ArrayList<Project>();
		try {
			Project project = new Project();
			Statement statement = connection.createStatement();
			ResultSet rs = statement
					.executeQuery("Select * from project where p_id=@@identity");
			while (rs.next()) {
				project.setP_id(rs.getInt("p_id"));
				project.setP_name(rs.getString("p_name"));
				project.setTL(rs.getString("TL"));
				project.setQms_name(rs.getString("QMSname"));
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return projects;
	}
	
	//delete particular project
	public void deleteProject(int p_id){
		try{
			PreparedStatement preparedStatement = connection.prepareStatement("Delete from project where p_id= "+p_id);
			preparedStatement.executeUpdate();
		}catch(SQLException e){
			e.printStackTrace();
		}
	}
	
	

}
