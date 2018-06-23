package com.cnerge.dashboard.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.cnerge.dashboard.model.DBUtility;
import com.cnerge.dashboard.pojo.Graph;
import com.cnerge.dashboard.pojo.GraphProjectData;


public class DashboardServiceGraph {
	private Connection connection;
	
	public DashboardServiceGraph(){
		connection = DBUtility.getConnection();
	}
	
	//add new Graph
	public void addGraph(Graph graph){
		try{
			PreparedStatement preparedStatement = connection.prepareStatement("insert into graph(graph_name, "
					+ "graphDescription) values (?, ?)");
			preparedStatement.setString(1, graph.getGraph_name());
			/*preparedStatement.setBoolean(2, graph.isGraph_checked());*/
			preparedStatement.setString(2, graph.getGraphDescription());
			
			preparedStatement.executeUpdate();
		}catch(SQLException e){
			e.printStackTrace();
		}
	}
	
	//update graph details   // need to change the set method according to pojo
	 
	public void updateGraph(int g_id, Graph graph){
		try{
			PreparedStatement preparedStatement = connection.prepareStatement("update graph set graph_name=?,"
					+ "graphDescription=? where graph_id=" + g_id);
			preparedStatement.setString(1, graph.getGraph_name());
			preparedStatement.setString(2, graph.getGraphDescription());
			preparedStatement.executeUpdate();
		}catch(SQLException e){
			e.printStackTrace();
		}
	}
	
	//get all graph
	public List<Graph> getAllGraph(){
		List<Graph> graphs = new ArrayList<Graph>();
		try{
			Statement statement = connection.createStatement();
			ResultSet rs = statement.executeQuery("select * from graph");
			while(rs.next()){
				Graph graph = new Graph();
				graph.setGraph_id(rs.getInt("graph_id"));
				graph.setGraph_name(rs.getString("graph_name"));
				graph.setGraph_checked(rs.getBoolean("graph_checked"));
				graph.setGraphDescription(rs.getString("graphDescription"));
				graphs.add(graph);
			}
		}catch(SQLException e){
			e.printStackTrace();
		}
		return graphs;
	}
	
	//get all graph from graph_project and graph table
	public List<GraphProjectData> getAllGraphForEachProject(int p_id){
		
		List<GraphProjectData> graphs = new ArrayList<GraphProjectData>();
		try{
			Statement statement = connection.createStatement();
			ResultSet rs = statement.executeQuery("select g.graph_name, gp.validRange from graph g inner join graph_project gp on g.graph_id=gp.graph_id where gp.p_id = " + p_id );
			while(rs.next()){
				GraphProjectData graph = new GraphProjectData();
				graph.setGraph_name(rs.getString("graph_name"));
				graph.setValidRange(rs.getString("validRange"));
				graphs.add(graph);
			}
		}catch(SQLException e){
			e.printStackTrace();
		}
		return graphs;
	}
	
	
	public List<GraphProjectData> getGraphForProject(){
		
		List<GraphProjectData> graphProjectDatas = new ArrayList<GraphProjectData>();
		try{
			Statement statement = connection.createStatement();
			ResultSet rs = statement.executeQuery(
					"select g.graph_name, p.p_id, gp.validRange, gp.options, gp.validinput from project p inner join graph_project gp on p.p_id = gp.p_id"+
			" inner join graph g on g.graph_id = gp.graph_id");
			while(rs.next()){
				/*Graph graph = new Graph();
				Project project = new Project();*/
				GraphProjectData graphProjectData = new GraphProjectData();
				graphProjectData.setGraph_name(rs.getString("graph_name"));
				graphProjectData.setP_id(rs.getInt("p_id"));
				graphProjectData.setValidRange(rs.getString("validRange"));
				graphProjectData.setOptions(rs.getString("options"));
				graphProjectData.setValidinput(rs.getInt("validinput"));
				graphProjectDatas.add(graphProjectData);
			}
			//return graphProjectData;
		}catch(SQLException e){
			e.printStackTrace();
		}
		return graphProjectDatas;
	}
	
	//delete particular graph
	
	public void deleteGraph(int g_id){
		try{
			PreparedStatement preparedStatement = connection.prepareStatement("Delete from graph where graph_id= "+g_id);
			preparedStatement.executeUpdate();
		}catch(SQLException e){
			e.printStackTrace();
		}
	}
}
