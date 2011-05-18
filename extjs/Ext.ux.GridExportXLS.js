/**
 * 
 * var grid = new Ext.grid.GridPanel({
 *   colModel: //some column model,
 *   store   : //some store
 * });
 * 
 * Ext.ux.GridExportXLS.exportxls(grid);
 * 
 */
Ext.ux.GridExportXLS = {
  /**
   * Prints the passed grid. Reflects on the grid's column model to build a table, and fills it using the store
   * @param {Ext.grid.GridPanel} grid The grid to print
   */
   
   /**
    * Return an array with grid's headers
    */
  headers:function(grid){
  	var headers=grid.getColumnModel().config;
  	var h=[];
  	x=0;
  	
   Ext.each(headers,function(column){
   	h[x]=column.header;
   	x++;
   });
 
  	return h;
  	
  }, 
  data:function(grid){
  	
  	var h=[];
  	x=0;
 
  	 //read columns and save the current position of each column in array h
  	 
  	var headers=grid.getColumnModel().config;
   Ext.each(headers,function(column){
   	h[column.dataIndex]=x;
   	x++;
   });
  	
  	
  var columns = grid.getColumnModel().config;
    
    //build a useable array of store data for the XTemplate
    var data = [];
    i=0;
    grid.store.data.each(function(item) {
      var convertedData = [];
		x=1;
      //apply renderers from column model
      for (var key in item.data) {
        var value = item.data[key];
        
        convertedData[h[key]]=value; // use array h to put the data in the right column
        x++;
      }
      //console.log(data)
      data[i]=convertedData;
     i++;
  	 

  })
   
   return data;
  }, 
   
  exportxls: function(grid) {
   
    var columns = grid.getColumnModel().config;
    
    //build a useable array of store data for the XTemplate
    var data = [];
    grid.store.data.each(function(item) {
      var convertedData = [];

      //apply renderers from column model
      for (var key in item.data) {
        var value = item.data[key];
        
        Ext.each(columns, function(column) {
          if (column.dataIndex == key) {
            convertedData[key] = column.renderer ? column.renderer(value) : value;
          }
        }, this);
      }
      
      data.push(convertedData);
    });
    
    //use the headerTpl and bodyTpl XTemplates to create the main XTemplate below
    var headings = Ext.ux.GridExportXLS.headerTpl.apply(columns);
    var body     = Ext.ux.GridExportXLS.bodyTpl.apply(columns);
    
    var html = new Ext.XTemplate(
			
                 headings,
				 
            '<tpl for=".">',
              body,
			  '</tpl>'
			  
			
     
    ).apply(data);
    
   // save file in server and open file when it's done
   
			
		
		
		Ext.Ajax.request({	
			url: '/system/media/php/exportxls.php',
			params :{task:'xls', data:Ext.util.JSON.encode(html)},
			method:'post',
			success: function(a,b){
			//alert(a.responseText);
			stringData=a.responseText;
			console.log(stringData);
			try {
				var jsonData = Ext.util.JSON.decode(stringData);
				
				//Ext.MessageBox.alert('Success', jsonData.result);
			
				window.open(jsonData.result,"preview");
			}
			catch (err) {
				Ext.MessageBox.alert('ERROR', 'Could not decode ' + stringData);
			}
		
		
		}
						 });
   
   
  },
  
  /**
   * @property stylesheetPath
   * @type String
   * The path at which the print stylesheet can be found (defaults to '/stylesheets/print.css')
   */
  stylesheetPath: '/stylesheets/print.css',
  
  /**
   * @property headerTpl
   * @type Ext.XTemplate
   * The XTemplate used to create the headings row. By default this just uses <th> elements, override to provide your own
   */
 headerTpl:  new Ext.XTemplate(
   
      '<tpl for=".">',
        '{header}',
		'\t',
      '</tpl>',
	  '\r\n'
    
  ),
   
   /**
    * @property bodyTpl
    * @type Ext.XTemplate
    * The XTemplate used to create each row. This is used inside the 'print' function to build another XTemplate, to which the data
    * are then applied (see the escaped dataIndex attribute here - this ends up as "{dataIndex}")
    */
  bodyTpl:  new Ext.XTemplate(
    
      '<tpl for=".">',
        '\{{dataIndex}\}',
		'\t',
      '</tpl>',
    '\r\n'
  )
};