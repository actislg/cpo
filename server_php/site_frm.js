Ext.form.colorPicker = Ext.extend(Ext.form.TextField,{
		fieldLabel:"Background Color",
		value:"#000",
		id:"colorPicker",
		listeners:{
			"focus":function(){
				var w = new Ext.Window({
					x:this.getPosition()[0]+120,
					y:this.getPosition()[1],
					title:"test",
					items:[
					{xtype:"colorpalette",id:"innerColorPicker",listeners:{"select":function(palette, selColor){Ext.getDom("colorPicker").value = "#"+selColor;w.hide();}}}
							]
				});
				w.show();
			}
		}
	});
	
	Ext.reg('colorPicker', Ext.form.colorPicker);
	
var tCompany=new Ext.form.TextField({
						
                    fieldLabel: 'Company',
                    name: 'company',
                    anchor:'95%'
                });

var tWebSite=new Ext.form.TextField({
						
                    fieldLabel: 'WebSite',
                    name: 'website',
                    anchor:'95%'
                });

var tDesc=new Ext.form.TextArea({
						
                    fieldLabel: 'Description',
                    name: 'descr',
                    anchor:'95%'
                });

var tFace=new Ext.form.TextField({
						
                    fieldLabel: 'Facebook',
                    name: 'facebook',
                    anchor:'95%'
                });

var tYouTube=new Ext.form.TextField({
						
                    fieldLabel: 'YouTube',
                    name: 'youtube',
                    anchor:'95%'
                                    });

var tTweeter=new Ext.form.TextField({
						
                    fieldLabel: 'Tweeter',
                    name: 'tweeter',
                    anchor:'95%'
                });
                
var tRss=new Ext.form.TextField({
						
                    fieldLabel: 'RSS',
                    name: 'rss',
                    anchor:'95%'
                });
                
                                


var hId=new Ext.form.Hidden({
	name:"id",
	value:0
});

var hData=new Ext.form.Hidden({
	name:"data",
	value:""
});

function createData(){
	arr=new Array();
	arr["company"]=tCompany.getValue();
	arr["website"]=tWebSite.getValue();
	arr["desc"]=tDesc.getValue();
	arr["facebook"]=tFace.getValue();
	arr["youtube"]=tYouTube.getValue();
	arr["tweeter"]=tTweeter.getValue();
	arr["rss"]=tRss.getValue();
	arr["bgcolor"]=Ext.getDom("colorPicker").value;
	jsn='{"company":"'+tCompany.getValue()+'","website":"'+tWebSite.getValue()+'","descr":"'+tDesc.getValue()+'","facebook":"'+tFace.getValue()+'","youtube":"'+tYouTube.getValue()+'","tweeter":"'+tTweeter.getValue()+'","rss":"'+tRss.getValue()+'","bgcolor":"'+Ext.getDom("colorPicker").value+'" }';
	hData.setValue(jsn);
	console.log(jsn);
	
}

var formSite = new Ext.FormPanel({	
								 
				 
           baseCls: 'x-plain',
           bodyStyle: 'padding: 5px; position: relative',
		   url:'sites_c.php?action=save',
           autoScroll: true,
           labelAlign: 'left',
           id:'top3',
           layout: 'form',
           items:[hData,hId,tCompany,tWebSite,tDesc,tFace,tYouTube,tTweeter,tRss,{
xtype:"colorPicker",
name:'bgcolor'
}],
		   buttons: [{
            text: 'Ok',
					handler: function(){
					
				createData();	
				formSite.form.submit({
                waitMsg:'Updating sites...',
                success: function (form, action) {
                   
				   winSite.hide();
                },
                failure:function(form, action) {
                    Ext.MessageBox.alert('Message', 'Save failed');
					winSite.hide();
                }})
					
        								}
        			}, 
					{text:'Cancel', 	
								handler: function(){
											winSite.hide();
								}
								}]
		           });


	
	
	var winSite = new Ext.Window({
								layout:'fit',
                width:500,
                height:350,
				margin:5,
                closeAction:'hide',
                plain: true,
				 title:'Add/Edit Site' ,
                layout:'form',
                defaultType: 'textfield',
				items: [formSite]
								});	
