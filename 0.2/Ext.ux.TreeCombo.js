
Ext.ns('Ext.ux','Ext.ux.form');

Ext.ux.form.TreeCombo = Ext.extend(Ext.form.TriggerField, {
	id:Ext.id(),

    triggerClass: 'x-form-tree-trigger',

    initComponent : function(){
        this.readOnly = false;
		this.isExpanded = false;
		
		if (!this.sepperator) {
                this.sepperator=','
        }
		
		if (!Ext.isDefined(this.singleCheck)) {
            this.singleCheck=false;
        } 
        
        Ext.ux.form.TreeCombo.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTriggerClick();
            }
        }, this);
        this.on('show',function() {
			this.setRawValue('');
			this.getTree();
			
			if (this.treePanel.loader.isLoading()) {
				this.treePanel.loader.on('load',function(c,n) {
					n.expandChildNodes(true);
					if (this.setValueToTree()) this.getValueFromTree();
				},this);
			} else {
				if (this.setValueToTree()) this.getValueFromTree();
			}
		});
    },
	
	onTriggerClick: function() {
		if (this.isExpanded) {
			this.collapse();
		} else {
			this.expand();
		}
    } ,
	
	// was called combobox was collapse
    collapse: function() {
		this.isExpanded=false;
		this.getTree().hide();
        if (this.resizer)this.resizer.resizeTo(this.treeWidth, this.treeHeight);
		this.getValueFromTree();
    },
	
	// was called combobox was expand
	expand: function () {
        this.isExpanded=true;
		this.getTree().show();
        this.getTree().getEl().alignTo(this.wrap, 'tl-bl?');

		this.setValueToTree();
	},
	setValue: function (v) {
		this.value=v;
		this.setValueToTree();
	},
	
    getValue: function() {
        if (!this.value) { 
			return '';
		} else {
			return this.value;
		}
    },
	setValueToTree: function () {
		// check for tree ist exist
		if (!this.treePanel) return false;

		// split this.value to array with sepperate value-elements
		var arrVal=new Array();
		try {
			arrVal = this.value.split(this.sepperator);
		} catch (e) {};
		
		// find root-element of treepanel, and expand all childs
		var node=this.treePanel.getRootNode();
		node.expandChildNodes(true);
		
		// search all tree-children and check it, when value in this.value
		node.cascade(function (n) {
			var nodeCompareVal='';
			var nodeCheckState=false;  // default the note will be unchecked
			
			if (Ext.isDefined(n.attributes.value)) {
				// in node-element a value-property was used
				nodeCompareVal=String.trim(n.attributes.value);
			} else {
				// in node-element can't find a value-property, for compare with this.value will be use node-element.text
				nodeCompareVal=String.trim(n.attributes.text);
			}
			
			Ext.each(arrVal,function(arrVal_Item) {
				if (String.trim(arrVal_Item) == nodeCompareVal) {
					// set variable "nodeCheckState" to check node
					nodeCheckState=true;
				}
			},this);
			
			// when state (of node) is other as variable "nodeCheckState", then set new value to node!
			if (n.getUI().isChecked()!=nodeCheckState) n.getUI().toggleCheck(nodeCheckState);
			
		},this);
		
		return true;
	},
	
	
	
	getValueFromTree: function () {
		this.ArrVal= new Array();
		this.ArrDesc= new Array();

		Ext.each(this.treePanel.getChecked(),function(item) {
			if (!item.attributes.value) {
				this.ArrVal.push(item.attributes.text);
			} else {
				this.ArrVal.push(item.attributes.value);
			}
			this.ArrDesc.push(item.attributes.text);
		},this);


		this.value=this.ArrVal.join(this.sepperator);
		this.valueText=this.ArrDesc.join(this.sepperator);
		this.setRawValue(this.valueText);
	},
	
	validateBlur : function(){
        return !this.treePanel || !this.treePanel.isVisible();
    },

	/*
	 * following functions are using by treePanel
	 */
	
    getTree: function() {
        if (!this.treePanel) {
            if (!this.treeWidth) {
                this.treeWidth = Math.max(200, this.width || 200);
            }
            if (!this.treeHeight) {
                this.treeHeight = 200;
            }
            this.treePanel = new Ext.tree.TreePanel({
                renderTo: Ext.getBody(),
                loader: this.loader ,
                root: this.root,
                rootVisible: false,
                floating: true,
                autoScroll: true,
                minWidth: 200,
                minHeight: 200,
                width: this.treeWidth,
                height: this.treeHeight,
                listeners: {
                    hide: this.onTreeHide,
                    show: this.onTreeShow,
                    click: this.onTreeNodeClick,
					checkchange: this.onTreeCheckChange,
                    expandnode: this.onExpandOrCollapseNode,
                    collapsenode: this.onExpandOrCollapseNode,
                    resize: this.onTreeResize,
                    scope: this
                }
            });
            this.treePanel.show();
            this.treePanel.hide();
            this.relayEvents(this.treePanel.loader, ['beforeload', 'load', 'loadexception']);
            if(this.resizable){
                this.resizer = new Ext.Resizable(this.treePanel.getEl(),  {
                   pinned:true, handles:'se'
                });
                this.mon(this.resizer, 'resize', function(r, w, h){
                    this.treePanel.setSize(w, h);
                }, this);
            }
        }
        return this.treePanel;
    },

    onExpandOrCollapseNode: function() {
        if (!this.maxHeight || this.resizable)
            return;  // -----------------------------> RETURN
        var treeEl = this.treePanel.getTreeEl();
        var heightPadding = treeEl.getHeight() - treeEl.dom.clientHeight;
        var ulEl = treeEl.child('ul');  // Get the underlying tree element
        var heightRequired = ulEl.getHeight() + heightPadding;
        if (heightRequired > this.maxHeight)
            heightRequired = this.maxHeight;
        this.treePanel.setHeight(heightRequired);
    },

    onTreeResize: function() {
        if (this.treePanel)
            this.treePanel.getEl().alignTo(this.wrap, 'tl-bl?');
    },

    onTreeShow: function() {
        Ext.getDoc().on('mousewheel', this.collapseIf, this);
        Ext.getDoc().on('mousedown', this.collapseIf, this);
    },

    onTreeHide: function() {
        Ext.getDoc().un('mousewheel', this.collapseIf, this);
        Ext.getDoc().un('mousedown', this.collapseIf, this);
    },

    collapseIf : function(e){
        if(!e.within(this.wrap) && !e.within(this.getTree().getEl())){
            this.collapse();
        }
    },

    onTreeNodeClick: function(node, e) {
/*
 		console.debug(this.singleSelect);
        this.setRawValue(node.text);
        this.value = node.id;
		//console.debug(node);
        this.fireEvent('select', this, node);
        this.collapse();
*/
    },
	
	onTreeCheckChange:function (node,value) {
		if (this.singleCheck) {
			// temporary disable event-listeners on treePanel-object 
			this.treePanel.suspendEvents(false);

			// disable all tree-checkboxes, there checked at the moment			
			Ext.each(this.treePanel.getChecked(),function(arrVal) { 
				arrVal.getUI().toggleCheck(false);
			} );
			
			// re-check the selected node on treePanel-object
			node.getUI().toggleCheck(true);
			
			// activate event-listeners on treePanel-object
			this.treePanel.resumeEvents();
		}
	},
	
	getRendererFunction: function (value) {
		var out=new Array();
		
		//console.info(value);
		//console.debug(this.getEditor().field.loader);
		if (String.trim(value)!="") {
			var TreePanel = this.getEditor().field.getTree();
			var Sepperator = this.getEditor().field.sepperator;
			
				
			// split this.value to array with sepperate value-elements
			var arrVal=new Array();
			try {
				arrVal = value.split(Sepperator);
			} catch (e) {};
				
			TreePanel.expandAll();			
			TreePanel.getRootNode().cascade(function (n) {
				Ext.each(arrVal,function(arrVal_Item) {
					if (String.trim(arrVal_Item) == n.attributes.value) {
						out.push(n.attributes.text);
					}
				},this);
			});
					
			//console.debug("OUT",out);		
			//console.debug("TreePanel",TreePanel);
		}
		
		if (out.length!=0) {
			return out.join(Sepperator + ' ');	
		} else {
			return value;
		}
		
	}
	
});