package com.cnerge.dashboard.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.cnerge.dashboard.model.DBUtility;
import com.cnerge.dashboard.pojo.GraphSprint;

public class DashboardServiceGraphSprint {

	private Connection connection;

	public DashboardServiceGraphSprint() {
		connection = DBUtility.getConnection();
	}

	// add new Graph
	public void addGraphInSprint(GraphSprint graphsprint) {
		try {
			PreparedStatement preparedStatement = connection
					.prepareStatement("insert into graph_sprint(s_id, p_id, g_name, "
							+ "color, action_plan, inputvalue, validRange, NA) values (?,?,?,?,?,?,?,?)");
			preparedStatement.setInt(1, graphsprint.getS_id());
			preparedStatement.setInt(2, graphsprint.getP_id());
			preparedStatement.setString(3, graphsprint.getG_name());
			preparedStatement.setString(4, graphsprint.getColor());
			preparedStatement.setString(5, graphsprint.getAction_plan());
			preparedStatement.setString(6, graphsprint.getInputvalue());
			preparedStatement.setString(7, graphsprint.getValidRange());
			preparedStatement.setBoolean(8, graphsprint.isNa());
			
			preparedStatement.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}

	// update graph
	public void updateGraphInSprint(int s_id, int p_id, String name,
			GraphSprint graphSprint) {
		try {

		PreparedStatement preparedStatement = connection.prepareStatement("update graph_sprint set inputvalue=?, color=?, action_plan=?, NA=?"
			+ " where s_id ="+ s_id+ "  and p_id ="+ p_id+ " and g_name='" + name + "'");
		
			preparedStatement.setString(1, graphSprint.getInputvalue());
			preparedStatement.setString(2, graphSprint.getColor());
			preparedStatement.setString(3, graphSprint.getAction_plan());
			preparedStatement.setBoolean(4, graphSprint.isNa());
			preparedStatement.executeUpdate();
			
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
	
	
	
	/*SQLServerPreparedStatement s = new */
	// get all graph
	public List<GraphSprint> getAllGraphInSprint() {
		List<GraphSprint> graphSprints = new ArrayList<GraphSprint>();
		try {
			Statement statement = connection.createStatement();
			ResultSet rs = statement.executeQuery("select * from graph_sprint");
			while (rs.next()) {
				GraphSprint graphSprint = new GraphSprint();
				graphSprint.setG_id(rs.getInt("g_id"));
				graphSprint.setS_id(rs.getInt("s_id"));
				graphSprint.setP_id(rs.getInt("p_id"));
				graphSprint.setG_name(rs.getString("g_name"));
				graphSprint.setColor(rs.getString("color"));
				graphSprint.setAction_plan(rs.getString("action_plan"));
				graphSprint.setInputvalue(rs.getString("inputvalue"));
				graphSprint.setValidRange(rs.getString("validRange"));
				graphSprint.setNa(rs.getBoolean("na"));
				graphSprints.add(graphSprint);
			}
		} catch (SQLException e) {
			e.printStackTrace();
		}
		return graphSprints;
	}
	
	//get data to display trend for particular project
	public List<GraphSprint> getAllDataToDisplayTrendForParticularProject(int p_id) {
		List<GraphSprint> graphSprints = new ArrayList<GraphSprint>();
		try {
			Statement statement = connection.createStatement();
			ResultSet rs = statement.executeQuery("select * from graph_sprint where p_id = " + p_id + "order by s_id");
			while (rs.next()) {
				GraphSprint graphSprint = new GraphSprint();
				graphSprint.setG_id(rs.getInt("g_id"));
				graphSprint.setS_id(rs.getInt("s_id"));
				graphSprint.setP_id(rs.getInt("p_id"));
				graphSprint.setG_name(rs.getString("g_name"));
				graphSprint.setColor(rs.getString("color"));
				graphSprint.setAction_plan(rs.getString("action_plan"));
				graphSprint.setInputvalue(rs.getString("inputvalue"));
				graphSprint.setValidRange(rs.getString("validRange"));
				graphSprint.setNa(rs.getBoolean("na"));
				graphSprints.add(graphSprint);
			}
		}catch (SQLException e) {
			e.printStackTrace();
		}
		return graphSprints;
	}
	
	// adding null value in the start while creating fiscal week
	public void assignNullValue(int s_id, int p_id, String name, String validrange) {
		try {
			PreparedStatement preparedStatement = connection
					.prepareStatement("insert into graph_sprint(s_id, p_id, g_name, validRange) values (?,?,?,?)");
		
			preparedStatement.setInt(1, s_id);
			preparedStatement.setInt(2, p_id);
			preparedStatement.setString(3, name);
			preparedStatement.setString(4, validrange);
			
			/*preparedStatement.setString(4, graphsprint.getColor());
			preparedStatement.setString(5, graphsprint.getAction_plan());
			preparedStatement.setString(6, graphsprint.getInputvalue());
			preparedStatement.setString(7, graphsprint.getValidRange());
			preparedStatement.setBoolean(8, graphsprint.isNa());*/
			
			preparedStatement.executeUpdate();
		} catch (SQLException e) {
			e.printStackTrace();
		}
	}
	
}
