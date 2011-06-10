var keyStr = "ABCDEFGHIJKLMNOP" +
                "QRSTUVWXYZabcdef" +
                "ghijklmnopqrstuv" +
                "wxyz0123456789+/" +
                "=";
function decode64(input) {
      var output = "";
      var chr1, chr2, chr3 = "";
      var enc1, enc2, enc3, enc4 = "";
      var i = 0;

      // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
      var base64test = /[^A-Za-z0-9\+\/\=]/g;
      if (base64test.exec(input)) {
         alert("There were invalid base64 characters in the input text.\n" +
               "Valid base64 characters are A-Z, a-z, 0-9, �+�, �/�, and �=�\n" +
               "Expect errors in decoding.");
      }
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      do {
         enc1 = keyStr.indexOf(input.charAt(i++));
         enc2 = keyStr.indexOf(input.charAt(i++));
         enc3 = keyStr.indexOf(input.charAt(i++));
         enc4 = keyStr.indexOf(input.charAt(i++));

         chr1 = (enc1 << 2) | (enc2 >> 4);
         chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
         chr3 = ((enc3 & 3) << 6) | enc4;

         output = output + String.fromCharCode(chr1);

         if (enc3 != 64) {
            output = output + String.fromCharCode(chr2);
         }
         if (enc4 != 64) {
            output = output + String.fromCharCode(chr3);
         }

         chr1 = chr2 = chr3 = "";
         enc1 = enc2 = enc3 = enc4 = "";

      } while (i < input.length);

      return output;
   }

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
	tLink.setValue(r.data.linkedin);
	tYouTube.setValue(r.data.youtube);
	tTweeter.setValue(r.data.tweeter);
	tRss.setValue(r.data.rss);
	Ext.getDom("colorPicker").value=r.data.bgcolor;
	hId.setValue(grid.getSelectionModel().getSelected().data.id);
	
 					
}
},
{"header": " ",  menuDisabled:true,fixed:true,sortable: false,width:50,align:'center', "dataIndex": "title",xtype:'actioncolumn', iconCls:'gen-report', tooltip:'Code Generator', 
			handler: function(grid, rowIndex, colIdex, item, e) {
				    grid.getSelectionModel().selectRow(rowIndex);
				    r=store.getById(grid.getSelectionModel().getSelected().data.id);
				    key=r.data.company;
					Ext.Ajax.request({
         url : 'sites_c.php?action=generate_code',
                  method: 'POST',
                  params :{id:key},
                  success: function ( result, request ) {
                      var jsonData = Ext.util.JSON.decode(result.responseText);
                      var resultMessage = decode64(jsonData.data);
                      //console.log(resultMessage);
                      Ext.MessageBox.prompt(
                      	"Code To insert in Client Page",
						"Copy and Paste this code in client's web page",
						function(){},
						this,
						true,
						resultMessage
							                      	
                      );
                      
               }
       });
 					
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
           {name:'linkedin'},
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
    																	tCompany.setValue("");
	tWebSite.setValue("");
	tDesc.setValue("");
	tFace.setValue("");
	tLink.setValue("");
	tYouTube.setValue("");
	tTweeter.setValue("");
	tRss.setValue("");
	Ext.getDom("colorPicker").value="";
	hId.setValue(0);
	
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
	

