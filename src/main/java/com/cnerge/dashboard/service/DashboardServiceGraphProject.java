package com.cnerge.dashboard.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.cnerge.dashboard.model.DBUtility;
import com.cnerge.dashboard.pojo.GraphProject;

public class DashboardServiceGraphProject {
	private Connection connection;
	
	public DashboardServiceGraphProject(){
		connection = DBUtility.getConnection();
	}
	
	//add new Graph
	public void addGraphInProject(GraphProject graphProject){
		try{

			PreparedStatement preparedStatement = connection.prepareStatement("insert into graph_project(p_id, graph_id, validRange, options, validinput)"
					+ "values (?,?,?,?,?)");
			preparedStatement.setInt(1, graphProject.getP_id());
			preparedStatement.setInt(2, graphProject.getGraph_id());
			preparedStatement.setString(3, graphProject.getValidRange());
			preparedStatement.setString(4, graphProject.getOptions());
			preparedStatement.setInt(5, graphProject.getValidinput());
			
			
			preparedStatement.executeUpdate();
		}catch(SQLException e){
			e.printStackTrace();
		}
	}
	
	//get all graph
	public List<GraphProject> getAllGraphInProject(){
		List<GraphProject> graphProjects = new ArrayList<GraphProject>();
		try{
			Statement statement = connection.createStatement();
			ResultSet rs = statement.executeQuery("select * from graph_project");
			while(rs.next()){
				GraphProject graphProject = new GraphProject();
				graphProject.setGp_id(rs.getInt("gp_id"));
				graphProject.setP_id(rs.getInt("p_id"));
				graphProject.setGraph_id(rs.getInt("graph_id"));
				graphProject.setValidRange(rs.getString("validRange"));
				graphProject.setOptions(rs.getString("options"));
				graphProject.setValidinput(rs.getInt("validinput"));
				
				graphProjects.add(graphProject);
			}
		}catch(SQLException e){
			e.printStackTrace();
		}
		return graphProjects;
	}
	
	//update GraphProject
	public void updateGraphInProject(int p_id, int graph_id, GraphProject graphProject){
		try{
			PreparedStatement preparedStatement = connection.
					prepareStatement("update graph_project set validRange=?, options=?, "
							+ "validinput=?"
					+ " where p_id ="+ p_id+" and graph_id ="+ graph_id);
			
			preparedStatement.setString(1, graphProject.getValidRange());
			preparedStatement.setString(2, graphProject.getOptions());
			preparedStatement.setInt(3, graphProject.getValidinput());
			
			preparedStatement.executeUpdate();
		}catch(SQLException e){
			e.printStackTrace();
		}
	}
	//delete particular graphProject
		public void deleteGraphProject (int p_id, int graph_id){
			try{
				PreparedStatement preparedStatement = connection.prepareStatement("Delete from graph_project where p_id= "+p_id+" and graph_id="+graph_id);
				
				preparedStatement.executeUpdate();
			}catch(SQLException e){
				e.printStackTrace();
			}
			
		}
}
