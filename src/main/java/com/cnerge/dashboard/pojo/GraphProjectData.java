package com.cnerge.dashboard.pojo;


public class GraphProjectData
{
	/*public List<Graph> graphs = new ArrayList<Graph>();
	public List<Project> projects = new ArrayList<Project>();*/
	
	private int p_id;
	private String graph_name;
	private String validRange;
	private String options;
	private int validinput;

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
	public String getValidRange() {
		return validRange;
	}
	public void setValidRange(String validRange) {
		this.validRange = validRange;
	}
	public int getP_id() {
		return p_id;
	}
	public void setP_id(int p_id) {
		this.p_id = p_id;
	}
	public String getGraph_name() {
		return graph_name;
	}
	public void setGraph_name(String graph_name) {
		this.graph_name = graph_name;
	}
	
	public String toString(){
		return "GraphProjectData [ p_id " + p_id  + "graph_name" + graph_name + "validRange" + validRange + "options" + options + "validinput" + validinput +"]";
	}
}
