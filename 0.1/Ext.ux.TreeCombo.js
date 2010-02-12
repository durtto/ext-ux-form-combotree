Ext.ns('Ext.ux','Ext.ux.form');

Ext.ux.form.TreeCombo = new Ext.extend(Ext.form.TriggerField, {
	id:Ext.id(),

    triggerClass: 'x-form-tree-trigger',

    initComponent : function(){
        this.readOnly = false;
		this.isExpanded = false;
		
		if (!this.sepperator) {
                this.sepperator=','
        }
		
        Ext.ux.form.TreeCombo.superclass.initComponent.call(this);
        this.on('specialkey', function(f, e){
            if(e.getKey() == e.ENTER){
                this.onTriggerClick();
            }
        }, this);
        this.on('afterrender',function() {
            this.getTree();
        })
        
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

		/*
        if(this.value) {
            this.getValue();
        }
		*/
	},
	setValue: function (v) {
		console.debug('SETVALUE was CALLED!   V: '+v   +'   ID: ' + this.id  + ' - Tree: ' + this.getTree().id);

		var a=new Array();
		a=v.split(this.seperator);
		console.debug(a);
		
		// Kinder absuchen und ggf. checken
		// this.treePanel.getRootNode().eachChild( Function fn, [Object scope], [Array args] ) 
	},
	
    getValue: function() {
		console.debug('GETVALUE was CALLED!   ID: ' + this.id + ' - Tree: ' + this.getTree().id);
		//if (this.treePanel) this.getValueFromTree();
		
        if (!this.value) { 
			return '';
		} else {
			return this.value;
		}
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
		
		console.info(this.value);
		console.info(this.valueText);
		this.setRawValue(this.valueText);
		
		//Ext.ux.form.TreeCombo.superclass.setValue(this.value);
		//Ext.ux.form.TreeCombo.superclass.value=this.value;
		//Ext.ux.form.TreeCombo.superclass.hiddenValue=this.value;
	
		/*
		var node = this.treePanel.getNodeById(this.value);
        var path = node.getPath();
        this.treePanel.expandPath(path);
        this.treePanel.selectPath(path);
		*/
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
        this.setRawValue(node.text);
        this.value = node.id;
		//console.debug(node);
        this.fireEvent('select', this, node);
        this.collapse();
*/
    }
});