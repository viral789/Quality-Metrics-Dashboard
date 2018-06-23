package com.cnerge.dashboard.pojo;

public class Graph {
	private int graph_id;
	private String graph_name;
	private boolean graph_checked;
	private String graphDescription;
	
	public int getGraph_id() {
		return graph_id;
	}
	public void setGraph_id(int graph_id) {
		this.graph_id = graph_id;
	}
	public String getGraph_name() {
		return graph_name;
	}
	public void setGraph_name(String graph_name) {
		this.graph_name = graph_name;
	}
	public boolean isGraph_checked() {
		return graph_checked;
	}
	public void setGraph_checked(boolean graph_checked) {
		this.graph_checked = graph_checked;
	}
	
	public String getGraphDescription() {
		return graphDescription;
	}
	public void setGraphDescription(String graphDescription) {
		this.graphDescription = graphDescription;
	}
	public String toString(){
		return "Graph [ graph_id " + graph_id  + "graph_name" + graph_name + "graph_checked" + graph_checked
				+ "graphDescription" + graphDescription +"]";
	}
	

}

