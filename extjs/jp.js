/*--
  ext-base,ext-all,Mootools.mootools-124-core,Mootools.mootools-1242-more,Mootools.clientcide,Mootools.xml,Mootools.contextmenu,Mootools.datepicker,Roar.roar,Upload.Source.SwiffUploader,Upload.Source.FxProgressBar,Upload.Source.FancyUpload2,Fusioncharts.FusionCharts,JP.Framework,JP.Grid,JP.List,JP.Upload,JP.Popup,JP.Autocompleter,JP.Request,JP.Model,JP.View.Base,JP.View.Window_Header,JP.Chart,JP.Group
--*/

//initialize the JP object
(function(){
 Class.Mutators.Models = function(items){
 		var models = {model:{}};
 		for(var i =0;i<items.length;i++){
			var klass = Hash.get(JP.Model,items[i]);
			models['model'][items[i].toLowerCase()] = new klass; 
		}

		this.implement(models);
 }
 })();


(function(){
var orig_measure = Element.prototype.measure;
var orig_inject = Element.prototype.inject;
Element.implement({
	replace_generic_name_with_value:function(param_name){
		this.set('name',this.get('name').replace(':param_name',param_name));	

		return this;
	},
	get_id:function(){
		return this.get('id').match(/[0-9]+$/)[0];
	},
	toggle_show:function(){
		if(!this.retrieve('show:start')) this.store('show:start',this.getStyle('height').toInt());
		if(!this.retrieve('show:shown')){
			this.setStyle('height','auto');
			this.store('show:shown',1);
		}
		else{
			this.setStyle('height',this.retrieve('show:start'));
			this.store('show:shown',0);

		}
		return this;

	},
	get_contextmenu:function(options){
	  var menu = this.retrieve('context-menu:menu')?this.retrieve('context-menu:menu'): 
				this.getElements('div.operations').length? this.getElements('div.operations')[0]: new Element('div',{'class':'operations'});

		if(!this.retrieve('context-menu:menu')){
			if(menu.getParent() != null){
				if(menu.getParent().hasClass('mini-operations')){
					var width =0;	
					menu.getChildren().measure(function(){
						width += this.getSize().x;			
					});
					
					menu.setStyles({'left':-width+21,'overflow':'hidden'});
				}
			}
			this.store('context-menu:menu',menu);
		}
		
		return menu;

	},
	get_class:function(index){
		var classes = this.get('class').split(' ');	
		return (index == 'first')?
			 				classes[0]:
							(index == 'last')?
								classes[classes.length-1]:
			 					classes[index];

	},	
	//Generic element loading and unloading gif injection
	show_loading:function(options){
		//if mask is set then apply a mask(this.set('mask',true))
		if($defined(options) && $defined(options.mask) && options.mask){
			this.set('mask',true);	
			//remove mask from options so it doesn't get applied to the image
			Hash.erase(options,'mask');
		}

		if(this.getChildren('.loading-gif').length) this.getChildren('.loading-gif').destroy();

		//construct the loading gif
		var loading_gif = new Element('img',$merge(options,{'src':'/images/icons/loading.gif','class':'loading-gif'}))
		
		//if a mask exists then center it with-in the element(note the width centered is taken care of through the css)
		if(mask = this.get('mask')) loading_gif.setStyle('margin-top',mask.getSize().y/4); 

		//inject the loading gif into the mask if it exists or into the current element
		loading_gif.inject(mask || this);
	},
	hide_loading:function(){
		//destroy the loading gif and the mask if it exists
		if($defined(this.loading_gif)) this.loading_gif.destroy();
		if(mask = this.retrieve('mask')) mask.destroy();

	},
	add_operation:function(op,attributes){
		//retrieve the operations div reference
		var operations = this.get_contextmenu(); 
		if($type(op) == 'element'){
			// now that we have obtained the operations div, make a new operation
			var operation_container = new Element('div',{'class':'operation'}).adopt(op);

		}
		else{
			var new_attributes = $merge(attributes,{'class':'media '+ op,'alt':op, 'rel':op});
			new_attributes['class'] += ' ' + attributes['class']; 

			//if no parent it's not in the DOM so inject it
			if(operations.getParent() == null) operations.inject(this,'top');

			// now that we have obtained the operations div, make a new operation
			var operation_container = new Element('div',{'class':'operation'}).adopt(new Element('a',new_attributes));

		}

		// adopt the new operation into the operations div
		operations.adopt(operation_container);

		return this;
	},
	//Generic Element setting and getting Fx
	setFx:function(fx){
		this.store('fx',fx);
		return this;
	},
	getFx: function(){
 		return this.retrieve('fx');

	},
	inject:function(el,where){
		orig_inject.bind(this)(el,$defined(where)? where:'bottom');
		
		this.run_fx(this.getFx());
		if(this.hasClass('hide')) this.removeClass('hide');
		return this;

	},
	soft_empty: function(){
		this.getChildren().each(function(node){
			if(!node.hasClass('persist')) Element.destroy(node);
		});
		return this;
	},
	measure:function(callback){
		this.removeClass('hide');
		orig_measure.call(this,callback);
		
	},
	toJSON: function(){
		var json = {};
		var to_json = function(name,val,json){
			    //determine if the name of the element has array notation
					var array_notation = name.match(/\[.*\]/); 
					//if the name is in array_notation, determine the indexes, build a json string and $merge the decoded json string into the current json object	
					//if the name is not in array notation the json is trivial, the index of the json is the name and the value is the value
					if($type(array_notation) == 'array' && array_notation.length){
						//calc indexes by replacing all '][' with ., and all '[' or ']' with empty string, then spliting on '.'
						//this contains the 2nd through nth index, i.e. param[foo][bar], indexes = ['foo','bar']
						var indexes = array_notation[0].replace(/(\]\[)/g,'.').replace(/(\])|(\[)/g,'').split('.');
						//get the first index, i.e. param[foo][bar], first = 'param';
						var first = name.match(/[a-zA-Z]+/)[0];
						//initialize a param stack, for each index a '}' will be pushed onto this, after all the indexes have been created in the string all the '}' 
						//in this stack will be joined together to complete the json string
						var paren_stack = [];
						//initilize the local json string, this is what will be decoded and merged into json
						var local_json = '{'+first+':';
						//foreach index generate the json, with a blank value
						for(var i = 0;i<indexes.length;i++){
							local_json += (function(index){
										return '{\''+index+'\':';
								})(indexes[i]);
							  //push a '}' onto the param stack
							  paren_stack.push('}');
						}	
						val = (val != '')?(!val.match(/^[0-9]+$/))?val = JSON.encode(val): val:'\'\'';
						//complete the json string with '}'
						local_json += val+paren_stack.join('')+'}';
						//decode into an object
						local_json = JSON.decode(local_json);	
						//finally merge it into the global json 
						return $merge(json,local_json);
				}
				else{
						json[name] = val;
						return json;

				}
		};
		this.getElements('input, select, textarea', true).each(function(el,j){
			if (!el.name || el.disabled || el.type == 'submit' || el.type == 'reset' || el.type == 'file') return;
			var value = (el.tagName.toLowerCase() == 'select') ? Element.getSelected(el).map(function(opt){
				return opt.value;
			}) : ((el.type == 'radio' || el.type == 'checkbox') && !el.checked) ? null : el.value;
			$splat(value).each(function(val,index){//val is the value of the input box
				//if the value is defined, prepare the value to be in json, replace all special chars in the name and call the to_json helper
				if (typeof val != 'undefined') {
					json = to_json($(el).get('name').replace(/\:/g,''),val,json);
				}
			});
		});
		return json;
	},
	run_fx:function(fx){
		if (Hash.has(JP.Fx,fx)){
		 	if(this.hasClass('hide')) this.removeClass('hide');
			Hash.get(JP.Fx,fx).run(this);
		}

		return this;
	},
	adopt: function(){
	 Array.flatten(arguments).each(function(element){
		 //if the element is an instance of a view, get the embedded element of that view, and set the element to that embedded element
		 if(element instanceof JP.View.Base) element = element.element; 

		 element = document.id(element, true);
	   if (element){ 
		 	this.appendChild(element);
		 	element.run_fx(element.getFx());
		}
	 }, this);
	 return this;
	},
	getComputedStyle: function(property){
		if (this.currentStyle) return this.currentStyle[property.camelCase()];

		if(!Browser.Engine.trident || (Browser.Engine.trident && this.currentStyle != null && this.currentStyle.hasLayout)){
			var defaultView = this.getDocument().defaultView;
			var computed = defaultView && defaultView.getComputedStyle(this, null);
			return (computed) ? computed.getPropertyValue([property.hyphenate()]) : null;
		}

		return null;
	}
});
})();

Element.Properties.multiple = {
	set:function(func){
		var multiple_div = new Element('div',{'class':'multiple-div'});
		var a = new Element('a',{'class':'multiple media insert small-media-square even-media-to-big'});
		if(!a.retrieve('multiple:element')){
			a.addEvent('click',function(e){
				e.stop();
				var new_el = this.clone();
				multiple_div.adopt(new_el);
				if($type(func) == 'function') func.apply(a,[new_el]);

			}.bind(this));
			multiple_div.adopt(a);
			multiple_div.replaces(this);
			this.inject(multiple_div);
		}

		a.store('multiple:element',this);

	}

}

Element.Properties.autocomplete = {
	set:function(ops){
		  if(!this.retrieve('autocomplete:autocompleter')) this.store('autocomplete:autocompleter', new JP.Autocompleter(this,ops));//.addEvent('submit',function(e){context.autocomplete_submit(this.element,this.selected,context); });

	},
	get:function(){
		return this.retrieve('autocomplete:autocompleter');


  }

}

Element.Properties.other = {
 set:function(replace_with){
		var replace_with_el = new Element(replace_with,this.getProperties('id','class','value','name'));

		if(replace_with == 'textarea') replace_with_el.set('expandable',true); 
		var context = this;
		var other = new Element('option',{'value':'other','html':'Other','events':{'click':function(){
				replace_with_el.replaces(context);		
			}	
		}});

		var back = new Element('a',{'class':'media update big-media-rect','styles':{ 
			'position': 'relative',
			'right': '-370px',
			'top': '-24px'
			},'events':{'click':function(){
						context.replaces(replace_with_el);		
					}	
		}});
		this.getParent().adopt(back);

		replace_with_el.addEvents({
			'mouseover':function(){
					

			},
			'mouseout':function(){

			}
		});
		
		
		this.adopt(other);

	}

};

Element.Properties.expandable = {
	set:function(ops){
		this.setStyle('overflow','hidden');
		var grow_factor = 15;
		this.store('expandable:last-scrollsize',this.getScrollSize());
		this.addEvent('keydown',function(e,recurse){
			//if content is cut or deleted shrink the textarea till the scrollTop is non 0(scroll bar exists)
			if((e.control && e.key == 'x') || e.key =='backspace'){
				if(this.getStyle('height').toInt() >= 50){
					this.setStyle('height',this.getStyle('height').toInt() - grow_factor);
					//recursivly run the above line until the scrollTop is non 0
					if(this.getScroll().y == 0 ) this.fireEvent('keypress',[e,true]);	
					//set the height to the scroll size(this should be the current height + line height or there abouts
					this.setStyle('height',this.getScrollSize().y);		
					//save the current scroll size
					this.store('expandable:last-scrollsize',this.getScrollSize());
				}
			}
			//if enter is pressed enter a new line
			else if(e.key == 'enter'){
				this.setStyle('height',this.getScrollSize().y + grow_factor);
				this.store('expandable:last-scrollsize',this.getScrollSize());

			}
			//if some other key other than enter, cntl-x or backspace is pressed conditionally add lines as needed(if the scroll size changes)
			else{
				//if the current scroll size does not equal the last scroll size add a line
				if(this.retrieve('expandable:last-scrollsize').y != this.getScrollSize().y){
		 			this.setStyle('height',this.getScrollSize().y + grow_factor);
					this.store('expandable:last-scrollsize',this.getScrollSize());
				}
				
			}
		});

	}

}


Element.Properties.editable = {
	set:function(options){
		this.store('editable:el',new Element('input',{'type':options.type}));
		this.addClass('editable');
		this.store('editable:edited',false);

		this.retrieve('editable:el').addEvent('keyup',function(e){
				if(e.code == 13){
					this.retrieve('editable:el').fireEvent('blur');	
				}
		}.bind(this));

		this.retrieve('editable:el').addEvent('blur',function(){
			this.replaces(this.retrieve('editable:el'));

			if(this.retrieve('editable:el').get('value') != this.get('html')){
				if(!this.retrieve('editable:edited') ){ 
						this.addClass('edited');	
						this.store('editable:edited',true);
					}

					this.set('html',this.retrieve('editable:el').get('value'));
					//fire the editted event on the element, passing the element, the current value(value of the input), and the previous value(html of the element being edited)
				this.fireEvent('edited',[this,this.retrieve('editable:el').get('value'),this.get('html')]);

			}
			
		}.bind(this));

		this.addEvent('dblclick',function(){
			this.retrieve('editable:el').replaces(this).focus();
			this.retrieve('editable:el').set('value',this.get('html'));	
		});	
		
		
	},
	get:function(){
		return {'el':this.retrieve('editable:el'),'edited':this.retrieve('editable:edited')};

	}
	


}

Element.Properties.mask = {
	set:function(){
		var size = null;
		this.measure(function(){
			size = this.getSize(); 
		});

		this.store('mask',new Element('div',{'class':'mask'}).setStyles({'width':size.x,'height':size.y }).inject(this,'top'));
	},
	get:function(){
		return this.retrieve('mask');

	}

}

Element.Properties.datepicker = {
 	set:function(){
		new DatePicker(this,{'timePicker':true,'pickerClass':'datepicker_vista','format':'Y-m-d H:i'});

	}

}

//setup crud property
Element.Properties.crud = {
		set:function(ops){
			//if bind is given, && this.loading_gif == nullthen set the context to bind, else set the context to this
			var context =$defined(ops.bind)? ops.bind:this;

			//if insert is given in ops then adopt the insert image and anchor into the crud container
			if($defined(ops.insert)){
				this.add_operation(
						new Element('a',{'class':'insert-button', 'events':{
							'click':function(e){
								e.stop();
								if($type(ops.insert) == 'function' )ops.insert.bind(context).run();
								context.fireEvent('insert');
							}
						}}).adopt(
							new Element('img',{'src':'/images/icons/insert.png' })),
							new Element('span',{'html':'insert'}));

			}

			//if update is given in ops then adopt the update image and anchor into the crud container
			if($defined(ops.update)){
				this.add_operation(
						new Element('a',{'class':'update-button','events':{
							'click':function(e){
									e.stop();
									if($type(ops.update) == 'function') ops.update.bind(context).run();
									context.fireEvent('update');
							}
				}}).adopt(new Element('img',{'src':'/images/icons/update.png' } ) ),
						new Element('span',{'html':'update'}));

			}     

			//if delete is given in ops then adopt the delete image and anchor into the crud container
			if($defined(ops["delete"])){
				this.add_operation(
						new Element('a',{'class':'delete-button','events':{
							'click':function(e){
									e.stop();
									if($type(ops['delete']) == 'function') ops["delete"].bind(context).run();
									context.fireEvent('delete');
							}
				}}).adopt(new Element('img',{'src':'/images/icons/delete.png'} ) ),
									new Element('span',{'html':'delete'}));

			}
		}

};

Element.Properties.closeable = {
	set:function(ops){
		var context= this;
		if(ops == true){
			new Element('a',{'class':'close','events':{
					'click':function(e){e.stop();context.dispose();context.fireEvent('close');}
			}}).inject(this,'top');

		}
	}
}


Element.Properties.maximizable = {
	set:function(start_height){
		if(!this.retrieve('maximizable:setup')){
			start_height =start_height.toString().match(/px$/)?start_height:start_height+'px';
			this.addClass('');
			this.setStyle('height',start_height);
			//initialize Fx's
			var maximize_fx = new Fx.Morph(this);
			var minimize_fx = new Fx.Morph(this);
			//initilize the maximize and minimize links and images
			var minimize = new Element('a',{'href':'#','class':'media even-media-to-big big-media-rect minimize'});
			var maximize = new Element('a',{'href':'#','class':'media even-media-to-big big-media-rect maximize'});

			//setup the events
			/* when minimize is clicked, replace the minimize icon with the maximize icon
		 	 * start the minimize Fx, and fire the minimized event on this
		 	 */
			minimize.addEvent('click',function(e){
					minimize.getParent().dispose();
					this.add_operation(maximize);//.inject(this.getChildren('.top-right-container')[0],'top');
					e.stop();
					this.erase('style');
					minimize_fx.start({'height':start_height});
					this.fireEvent('minimized');

			}.bind(this));

			/* when maximized is clicked, replace the maximized icon with the minimized one,
			 * calculate the height of the content(this is the height the maximize_fx goes to to show all content)
		 	 * start the maximize Fx,
		 	 * fire the maximized event on this
		   */
			maximize.addEvent('click',
				function(e){
					maximize.getParent().dispose();
					this.add_operation(minimize);//.inject(this.getChildren('.top-right-container')[0],'top');
					e.stop();
					var content = this.getChildren('.content');

					//make sure we have a <div  class='content'> in your maximizable container, if not throw an exception
					if(content.length == 0) throw 'Maximize specified but now content given, you must have a div inside your maximizable container'; 
					else content = content[0];

					var height = content.getDimensions().height;
					var maximize_fx_complete = function(){ this.setStyles({'height':null,'min-height':height}); maximize_fx.removeEvent('onComplete',maximize_fx_complete); }.bind(this)
					maximize_fx.addEvent('onComplete',maximize_fx_complete); 
					//start the fx, increasing the height to the size of the content
					maximize_fx.start({'height':height} );
					

					//fire the maximized event on the element
					this.fireEvent('maximized');
					
			}.bind(this));				

			//add class for css purposes and identification
			this.addClass('maximizable');	

			//add a top right container, this contains the clickable minimize and maximized image
			//new Element('div',{'class':'top-right-container'}).adopt(maximize).inject(this,'top');
			this.add_operation(maximize);
			//flag this element as already setup
			this.store('maximizable:setup',true)

		}
	}
}



Element.Events.cntlClick = {
	base:'click',
	condition:function(e){
		return e.control

	}

};
Element.Events.rightClick = {
	base:'click',
	condition:function(e){
			return e.rightClick;


	}



};
Element.Events.leftClick = {
	base:'click',
	condition:function(e){
		return !e.rightClick;

	}

};


Element.Properties.popup = {
	set:function(size){
		this.addClass('popup');
		this.setFx('popup');
		var width = $type(size) == 'string' && size.match(/[0-9]+\x[0-9]+/)? size.match(/^[0-9]+/)[0]:400;
		var height = $type(size) == 'string' && size.match(/[0-9]+\x[0-9]+/)? size.match(/[0-9]+$/)[0]:400;
		width = width == 0? 'auto':width;
		height = height == 0? 'auto':height;	
		this.setStyles({
				'position':'fixed',
				'top':0,
				'min-width':width+'px',
				//'min-height':height+'px',
				'left':JP.Framework.content.getSize().x/2 - 140
		});	
		

		Element.Properties.closeable.set.bind(this)(true);

		
	}
}

window.addEvent('load',function(){
		//bootstrap the framework, this is the 'entry' point of all javascript	
		JP.Framework.instance();

		});

window.addEvent('domready',function(){
	//before we boot strap the framework instance, if a hash is given goto the hash
	//i.e. jportal.localhost/#/qlss this will redirect to jportal.localhost/qlss
	new JP.StateMachine().goto_first();

});

