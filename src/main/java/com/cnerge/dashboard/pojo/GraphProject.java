package com.cnerge.dashboard.pojo;

public class GraphProject {
	private int gp_id;
	private int p_id;
	private int graph_id;
	private String validRange;
	private String options;
	private int validinput;
	
	
	public String getValidRange() {
		return validRange;
	}
	public void setValidRange(String validRange) {
		this.validRange = validRange;
	}
	public int getGraph_id() {
		return graph_id;
	}
	public void setGraph_id(int graph_id) {
		this.graph_id = graph_id;
	}

	public int getGp_id() {
		return gp_id;
	}
	public void setGp_id(int gp_id) {
		this.gp_id = gp_id;
	}
	public int getP_id() {
		return p_id;
	}
	public void setP_id(int p_id) {
		this.p_id = p_id;
	}
	
	public String getOptions() {
		return options;
	}
	public void setOptions(String options) {
		this.options = options;
	}
	public int getValidinput() {
		return validinput;
	}
	public void setValidinput(int validinput) {
		this.validinput = validinput;
	}
	public String toString(){
		return "Graph [ gp_id " + gp_id  + "graph_id" + graph_id + "p_id" + p_id + "validRange" + validRange + "options" + options + 
				"validinput" + validinput + "]";
	}
	
}
