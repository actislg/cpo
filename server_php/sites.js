

Ext.onReady(function(){





var colModel = new Ext.grid.ColumnModel(
			[
			 {header:"#",width:70,sortable:true,dataIndex:"id"},
			 {header:"Company",width:255,sortable:true,dataIndex:"company"},
			 {header:"Web",width:165,sortable:true,dataIndex:"website"},
			 {header:"Description",width:165,sortable:true,dataIndex:"desc"},
			  {"header": " ",  menuDisabled:true,sortable: false,width:50,align:'center'
		, "dataIndex": "id",xtype:'actioncolumn', iconCls:'delete-report'
		,menuDisabled:true,tooltip:'Delete site', fixed:true
		,handler: function(grid, rowIndex, colIdex, item, e) {
						Ext.Msg.confirm('Delete Site', 'Are you sure you want to delete this site ?'
						, function(btn, text){
							if (btn == 'yes'){
 								grid.getSelectionModel().selectRow(rowIndex);	
								Ext.Ajax.request({
								url:'sites_c.php?action=delete',
								method:'post',
								params:{
											id:grid.getSelectionModel().getSelected().data.id	
										}
							,
							success: function(resp,opt){
								store.removeAt(rowIndex);
								}
											 }
							);
							} 
						}
						);

}}, 
{"header": " ",  menuDisabled:true,fixed:true,sortable: false,width:50,align:'center', "dataIndex": "title",xtype:'actioncolumn', iconCls:'edit-report', tooltip:'Edit Report', 
			handler: function(grid, rowIndex, colIdex, item, e) {
				    grid.getSelectionModel().selectRow(rowIndex);
				    r=store.getById(grid.getSelectionModel().getSelected().data.id);
				    winSite.show();
	tCompany.setValue(r.data.company);
	tWebSite.setValue(r.data.website);
	tDesc.setValue(r.data.decr);
	tFace.setValue(r.data.facebook);
	tYouTube.setValue(r.data.youtube);
	tTweeter.setValue(r.data.tweeter);
	tRss.setValue(r.data.rss);
	Ext.getDom("colorPicker").value=r.data.bgcolor;
	hId.setValue(grid.getSelectionModel().getSelected().data.id);
	
 					
}
}
 			
			 
			 ]
										);	
										
var store= new Ext.data.Store({
	autoLoad: true,
	proxy: new Ext.data.HttpProxy({
	url: 'sites_c.php?action=list',
	method: 'POST'
 	
	}),
	timeout:20000000,
	reader: new Ext.data.JsonReader({
	root:'results',
	totalProperty:'total'},
	
	[
			{name: 'id'},
			{name:'company'},
			{name:'website'},
           {name:'descr'},
           {name:'facebook'},
			{name:'youtube'},
           {name:'tweeter'},
           {name:'rss'},
			{name:'bgcolor'}
	])
	});										
																			




    var grid2 = new Ext.grid.GridPanel({
		id:'grid2',
		cm: colModel,
    	ds: store,
		columns: colModel,
    	store: store,
		layout:'form',
		mode:'remote',
		renderTo: document.body,
    	tbar:[{text:'Add New Site',iconCls:'icon-add-table',handler:function(){
    																	winSite.show();
    	}
																		}
																	
																	] ,
		loadMask: true,
		width:'100%',
		height:450,
   
    iconCls: 'icon-grid'
		  
    });
    
    
    winSite.on("hide",function(){
    	
    	store.load();
    })
    
    });
	

